"use strict"

const Service = require('egg').Service;

class LoginService extends Service {
	async login(loginInfo){
	  const { name, password } = loginInfo;
	  let result = await this.ctx.model.Login.findAll({
		where: {name: name, password: password},
		// columns: 'id',
		limit: 1,
		offset: 0,
		include: {
		    model: this.ctx.model.Teacher,
			include:{model: this.ctx.model.Purview}
		}
	  });
	  this.logger.info(result);
	  if(result[0] === undefined){
		  return '';
	  }
	  // 存储session
	  let info = {
		  id: result[0].id,
		  name: result[0].name,
		  password: result[0].password,
		  image: result[0].image,
		  level: result[0].teacher_table.purview_table.level
	  };
	  this.ctx.session.userInfo = JSON.stringify(info);
	  return result[0];
	  // return {level: result[0].teacher_table.purview_table.level, image: result[0].image};
	}
}

module.exports = LoginService;
