"use strict"

/**
 * 全局中间件: 判断用户是否已经登录
 */
module.exports = (options, app) => {
	return async (ctx, next) => {
		if(ctx.url === '/login'){
			await next();
		}else{
			const userInfo = ctx.session.userInfo || '';
			if(userInfo === ''){
				ctx.body = {status: 400, statusText: 'bad request', msg: 'Please to login', data: {islogin: 0}};
				return;
			}
			await next();
		}
	};
};
