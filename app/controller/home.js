'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
	// this.ctx.session.user = 'admin';
	// this.ctx.session.maxAge = 3600 * 500;		// 半小时
	// this.ctx.body = this.ctx.session;			// this.ctx.session是一个JSON对象
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async postIndex(){
	this.ctx.body = this.ctx.request.body;
  }
}

module.exports = HomeController;
