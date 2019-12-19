"use strict"

const Service = require('egg').Service;
const Sequelize = require('sequelize');
const Utils = require('./utils');
const path = require('path');
const fs = require('mz/fs');
const Op = Sequelize.Op;

class LaboratoryService extends Service {
	async addLab(){
		const {ctx, config} = this;
		const file = ctx.request.files[0];
		const {name, addr, introduction, admin_id} = ctx.request.body;
		const bgPath = path.join(config.static.dir, config.staticPath.labBgs);
		Utils.createDirs(bgPath);
		let bg = null;
		if(file){
			bg = path.basename(file.filepath);
			const format = bg.split('.')[bg.split('.').length -1].toLowerCase();	// 文件格式
			if(format !== 'jpg' && format !== 'jpeg' && format !== 'gif' && format !== 'png'){
				fs.unlink(file.filepath);
				return {status: 400, statusText: 'ERROR', msg: 'The format is error', data: ''};
			}
		}else if(fs.existsSync(path.join(config.static.dir, config.staticPath.labBgs, config.staticPath.defaultLabBg))){
			bg = config.staticPath.defaultLabBg;
		}
		try{
			if(file){
				let newbg = fs.readFileSync(file.filepath);
				fs.writeFileSync(path.join(config.static.dir, config.staticPath.labBgs, bg), newbg);
			}
			const leader_id = ctx.session.userInfo.id;
			if(bg){
				const image = config.staticPath.labBgs + '/' + bg;
				await this.ctx.model.Laboratory.create({name, addr, introduction, admin_id, leader_id, image});
			}else{
				await this.ctx.model.Laboratory.create({name, addr, introduction, admin_id, leader_id});
			}
		}catch(e){
			return {status: 500, statusText: 'ERROR', msg: e, data: ''};
		}finally{
			if(file) fs.unlink(file.filepath);
		}
		return {status: 200, statusText: 'OK', msg: '', data: ''};
	}
	async getLab(id){
		const {ctx} = this;
		let laboratory = null;
		if(ctx.session.userInfo.level === 2){
			laboratory = await ctx.model.Laboratory.findByPk(id, {
				attributes: ['name', 'addr', 'scale', 'seats', 'image', 'introduction', 'created_at'],
				include: {
					model: ctx.model.Teacher,
					attributes: ['name']
				}
			});
		}else if(ctx.session.userInfo.level === 1){
			laboratory = await ctx.model.LabLeader.findByPk(id, {
				attributes: ['name', 'addr', 'scale', 'seats', 'image', 'introduction', 'created_at'],
				include: {
					model: ctx.model.Teacher,
					attributes: ['name']
				}
			});
		}
		if(!laboratory){
			return {status: 500, statusText: 'ERROR', msg: 'Could not found the laboratory you wanted', data: ''};
		}
		return {status: 200, statusText: 'OK', msg: '', data: laboratory};
	}
	async updateLab(id){
		const {ctx, config} = this;
		const file = ctx.request.files[0];
		const {name, addr, admin_id, introduction} = ctx.request.body;
		let bg = null;
		if(file){
			bg = path.basename(file.filepath);
			const format = bg.split('.')[bg.split('.').length -1].toLowerCase();
			if(format !== 'jpg' && format !== 'jpeg' && format !== 'gif' && format !== 'png'){
				fs.unlink(file.filepath);
				return {status: 400, statusText: 'ERROR', msg: 'The format is error', data: ''};
			}
		}
		try{
			if(file){
				let newbg = fs.readFileSync(file.filepath);
				fs.writeFileSync(path.join(config.static.dir, config.staticPath.labBgs, bg), newbg);
			}
			let lab = await this.ctx.model.Laboratory.findByPk(id);
			if(lab && bg){
				const oldImg = lab.image;
				const image = config.staticPath.labBgs + '/' + bg;
				await lab.update({name, addr, admin_id, introduction, image});
				if(oldImg.split('/')[oldImg.split('/').length - 1] !== config.staticPath.defaultLabBg){
					Utils.delFile(path.join(config.static.dir, oldImg));
				}
			}else if(lab){
				await lab.update({name, addr, admin_id, introduction});
			}else{
				return {status: 400, statusText: 'ERROR', msg: 'The laboratory no found', data: ''};
			}
		}catch(e){
			return {status: 500, statusText: 'ERROR', msg: '' + e, data: ''};
		}finally{
			if(file) fs.unlink(file.filepath);
		}
		let result = {};
		if(bg)	result.image = config.staticPath.labBgs + '/' + bg;
		else	result = '';
		return {status: 200, statusText: 'OK', msg: '', data: result};
	}
	async delLab(id){
		const {ctx, config} = this;
		const lab = await ctx.model.Laboratory.findByPk(id);
		if(!lab){
			return {status: 400, statusText: 'ERROR', msg: 'The laboratory no found', data: ''};
		}
		const image = lab.image;
		await lab.destroy();
		if(image.split('/')[image.split('/').length - 1] !== config.staticPath.defaultLabBg){
			Utils.delFile(path.join(config.static.dir, image));
		}
		return {status: 200, statusText: 'OK', msg: '', data: ''};
	}
	async searchLabs(){
		const {ctx} = this;
		const {name, admin, leader, time, page, size} = ctx.request.body;
		const offset = (page - 1) * size;
		
		let timeEnd = null;
		if(time){
			let dates = time.split('/');
			dates[2] = parseInt(dates[2]) + 1;
			timeEnd = dates.join('/');
		}
		let filter = {};
		let purviewFilter = {};
		let laboratories = [];
		if(name)	filter.name = {[Op.like]: '%' + name + '%'};
		if(time)	filter.created_at = {[Op.between]: [time, timeEnd]};
		if(ctx.session.userInfo.level === 2){
			purviewFilter = admin ? {name: {[Op.like]: '%' + admin + '%'}} : {};
			laboratories = await ctx.model.Laboratory.findAll({
				where: filter,
				attributes: ['id', 'name', 'addr', 'scale', 'seats', 'introduction', 'image', 'created_at'],
				order: [['created_at', 'DESC']],
				include: {
					model: ctx.model.Teacher,
					where: purviewFilter,
					attributes: ['id', 'name']
				}
			});
		}else if(ctx.session.userInfo.level === 1){
			purviewFilter = leader ? {name: {[Op.like]: '%' + leader + '%'}} : {};
			laboratories = await ctx.model.LabLeader.findAll({
				where: filter,
				attributes: ['id', 'name', 'addr', 'scale', 'seats', 'introduction', 'image', 'created_at'],
				order: [['created_at', 'DESC']],
				include: {
					model: ctx.model.Teacher,
					where: purviewFilter,
					attributes: ['id', 'name']
				}
			});
		}else{
			return {status: 400, statusText: 'OK', msg: 'who you are ?', data: ''};
		}
		const len = laboratories.length;
		const pagesize = len > (offset+size) ? size : len - offset;
		const result = {
			num: len,
			laboratories: laboratories.slice(offset, offset + pagesize)
		};
		return {status: 200, statusText: 'OK', msg: '', data: result};
	}
	async loadLabPage(){
		const {ctx} = this;
		const {page, size} = ctx.request.body;
		const offset = (page - 1) * size;
		let laboratories = [];
		if(ctx.session.userInfo.level === 1){
			laboratories = await ctx.model.LabLeader.findAll({
				where: {experimenter_id: ctx.session.userInfo.id},
				attributes: ['id', 'name', 'addr', 'scale', 'seats', 'introduction', 'image', 'created_at'],
				order: [['created_at', 'DESC']],
				// limit: size,
				// offset: offset,
				include: {
					model: ctx.model.Teacher,
					attributes: ['id', 'name']
				}
			});
		}else if(ctx.session.userInfo.level === 2){
			laboratories = await ctx.model.Laboratory.findAll({
				where: {leader_id: ctx.session.userInfo.id},
				attributes: ['id', 'name', 'addr', 'scale', 'seats', 'introduction', 'image', 'created_at'],
				order: [['created_at', 'DESC']],
				// limit: size,
				// offset: offset,
				include: {
					model: ctx.model.Teacher,
					attributes: ['id', 'name']
				}
			});
		}else{
			return {status: 400, statusText: 'OK', msg: 'who you are ?', data: ''};
		}
		const len = laboratories.length;
		const pagesize = len > (offset+size) ? size : len - offset;
		const result = {
			num: len,
			laboratories: laboratories.slice(offset, offset + pagesize)
		};
		return {status: 200, statusText: 'OK', msg: '', data: result};
	}
}

module.exports = LaboratoryService;
