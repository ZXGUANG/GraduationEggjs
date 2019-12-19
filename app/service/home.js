"use strict"

const Service = require('egg').Service;
const fs = require('mz/fs');
const path = require('path');
const Utils = require('./utils')

class HomeService extends Service {
	async init(){
		const {config, ctx} = this;
		let returnData = null;
		let avatar = null;
		const avatarPath = path.join(config.static.dir, config.staticPath.avatars);
		Utils.createDirs(avatarPath);
		if(!ctx.session.userInfo.image){
			if(fs.existsSync(path.join(config.static.dir, config.staticPath.avatars, config.staticPath.defaultAvatar))){
				avatar = config.staticPath.avatars + '/' + config.staticPath.defaultAvatar;
			}
		}else{
			avatar = ctx.session.userInfo.image;
		}
		returnData = {
			account: ctx.session.userInfo.name,
			avatar: avatar,
			level: ctx.session.userInfo.level
		};
		return {status: 200, statusText: 'OK', msg: '', data: returnData};
	}
	
	async updateAvatar(avatar){
		const {config, ctx} = this;
		this.logger.info('avatar fieldname -> ' + avatar.fieldname);
		const basename = path.basename(avatar.filepath);		// 获取缓存文件名+后缀，这样不用自己自定义生成了
		const avatarPath = path.join(config.static.dir, config.staticPath.avatars);
		Utils.createDirs(avatarPath);
		const format = basename.split('.')[basename.split('.').length -1].toLowerCase();	// 头像格式
		if(format !== 'jpg' && format !== 'jpeg' && format !== 'gif' && format !== 'png'){
			fs.unlink(avatar.filepath);
			return {status: 400, statusText: 'ERROR', msg: 'The format is error', data: ''};
		}
		try{
			const file = fs.readFileSync(avatar.filepath);				// 读文件
			fs.writeFileSync(path.join(avatarPath, basename), file);	// 将文件存到指定位置
			let user = await ctx.model.Teacher.findByPk(ctx.session.userInfo.id, {
				include: { model: ctx.model.Login }
			});
			if(user){
				const image = config.staticPath.avatars + '/' + basename;
				const res = await user.login_table.update({image});
				let oldImg = ctx.session.userInfo.image;
				if(oldImg.split('/')[oldImg.split('/').length - 1] !== config.staticPath.defaultAvatar){
					Utils.delFile(path.join(config.static.dir, ctx.session.userInfo.image));
				}
				ctx.session.userInfo.image = image;
			}else{
				throw new Error('server error');
			}
		}catch(e){
			return {status: 500, statusText: 'ERROR', msg: e, data: ''};
		}finally{
			fs.unlink(avatar.filepath);	// 需要删除缓存的临时文件
		}
		return {status: 200, statusText: 'OK', msg: '', data: {avatar: config.staticPath.avatars + '/' + basename}};
	}
}

module.exports = HomeService;
