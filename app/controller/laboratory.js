"use strict"

const Controller = require('egg').Controller;

class LaboratoryController extends Controller {
	// 添加实验室
	async addLab(){
		this.ctx.body = await this.service.laboratory.addLab();
	}
	// 获取某个实验室信息
	async getLab(){
		const id = this.ctx.request.body.id;
		const rule = { id: { type: 'number'} };
		try{
		  this.ctx.validate(rule);
		}catch(e){
		  this.ctx.body = {status: 422, statusText: 'ERROR', msg: 'Could not know which laboratory you want', data: ''};
		  return;
		}
		this.ctx.body = await this.service.laboratory.getLab(id);
	}
	// 修改实验室
	async updateLab(){
		const rule = { id: { type: 'number'} };
		try{
		  this.ctx.validate(rule);
		}catch(e){
		  this.ctx.body = {status: 422, statusText: 'ERROR', msg: 'Could not know which laboratory you want', data: ''};
		  return;
		}
		this.ctx.body = await this.service.laboratory.updateLab(this.ctx.request.body.id);
	}
	// 删除实验室
	async delLab(){
		const id = this.ctx.request.body.id;
		const rule = { id: { type: 'number'} };
		try{
		  this.ctx.validate(rule);
		}catch(e){
		  this.ctx.body = {status: 422, statusText: 'ERROR', msg: 'Could not know which laboratory you want', data: ''};
		  return;
		}
		this.ctx.body = await this.service.laboratory.delLab(id);
	}
	// 模糊收搜实验室
	async searchLabs(){
		const {page, size} = this.ctx.request.body;
		const rule = {
			page: {type: 'number', min: 1},
			size: {type: 'number', min: 1}
		}
		try{
			this.ctx.validate(rule);
		}catch(e){
			this.ctx.body = {status: 422, statusText: 'ERROR', msg: 'the field of page or size is unqualified', data: ''};
			return;
		}
		this.ctx.body = await this.service.laboratory.searchLabs();
	}
	// 实验室分页查询
	async loadLabPage(){
		const {page, size} = this.ctx.request.body;
		const rule = {
			page: {type: 'number', min: 1},
			size: {type: 'number', min: 1}
		}
		try{
			this.ctx.validate(rule);
		}catch(e){
			this.ctx.body = {status: 422, statusText: 'ERROR', msg: 'the field of page or size is unqualified', data: ''};
			return;
		}
		this.ctx.body = await this.service.laboratory.loadLabPage();
	}
	
}

module.exports = LaboratoryController;
