"use strict"

const Controller = require('egg').Controller;

class CommonController extends Controller {
	async getAdmins(){
		this.ctx.body = await this.service.common.getAdmins();
	}
}

module.exports = CommonController;
