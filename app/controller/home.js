'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
	async index(){this.ctx.body = {status: 200, statusText: 'OK', msg: '', data: ''};}
	// 登出
	async logout(){
		this.ctx.session = null;
		this.ctx.body = {status: 200, statusText: 'OK', msg: '', data: ''};
	}
	// 从session中获取头像和登录用户名
	async init(){
		this.ctx.body = await this.ctx.service.home.init();
	}
	// 修改头像
	async updateAvatar(){
		if(this.ctx.request.files[0]){
			this.ctx.body = await this.ctx.service.home.updateAvatar(this.ctx.request.files[0]);
		}else{
			this.ctx.body = {status: 400, statusText: 'ERROR', msg: 'no avatar', data: ''};
		}
	}
}

module.exports = HomeController;
