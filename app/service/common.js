"use strict"

const Service = require('egg').Service;

class CommmonService extends Service {
	async getAdmins(){
		const {ctx} = this;
		const users = await ctx.model.Teacher.findAll({
			include: {
			    model: ctx.model.Purview,
				where: {level: 3}
			}
		});
		let result = [];
		for(let i = 0; i < users.length; i++){
			result.push({id: users[i].id, name: users[i].name});
		}
		return {status: 200, statusText: 'OK', msg: '', data: result};
	}
}

module.exports = CommmonService;
