"use strict"

const Service = require('egg').Service;

class LoginService extends Service {
	async login(loginInfo){
	  const { name, password } = loginInfo;
	  let result = await this.ctx.model.Login.findAll({
		where: {name: name, password: password},
		// attributes: ['id'],
		limit: 1,
		offset: 0,
		include: {
		    model: this.ctx.model.Teacher,
			include:{model: this.ctx.model.Purview}
		}
	  });
	  if(!result[0]){ return ''; }
	  // 存储session
	  let info = {
		  id: result[0].teacher_table.id,
		  name: result[0].name,
		  image: result[0].image,
		  level: result[0].teacher_table.purview_table.level
	  };
	  this.ctx.session.userInfo = info;		// JSON.stringify(info);
	  return {level: info.level, image: info.image};
	}
}

module.exports = LoginService;
