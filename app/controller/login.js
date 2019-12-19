"use strict"

const Controller = require('egg').Controller;

class LoginController extends Controller {
	async login(){
		const { name, password } = this.ctx.request.body;
		const rule = {
		  name: { type: 'string', rangelength:[3,32] },
		  password: { type: 'string', rangelength:[3,32] },
		};
		// 校验参数，先安装配置插件validate
		try{
		  this.ctx.validate(rule);
		}catch(e){
	      this.ctx.body = {status: 422, statusText: 'ERROR', msg: 'Field should not be empty', data: ''};
		  return;
		}
		let result = await this.ctx.service.login.login(this.ctx.request.body);
		if(result === ''){
		  this.ctx.body = {status: 400, statusText: 'ERROR', msg: 'NO FOUND', data: ''};
		  return;
		}
		this.ctx.body = {status: 200, statusText: 'OK', msg: '', data: result};
	}
}

module.exports = LoginController;
