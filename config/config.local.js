"use strict"

const path = require('path');
module.exports = appInfo => {
	const config = exports = {};
	
	// 静态文件路径
	config.static = {
	  prefix: '/',
	  dir: path.join(appInfo.baseDir, 'app/public/resources')
	};
	
	// 日志输出目录
	config.logger = {
	  dir: path.join(appInfo.baseDir, 'logs')
	};
	
	// 跨域配置
	config.security = {
		csrf: { enable: false },
		domainWhiteList: [ 'http://localhost:8081' ]	// vue项目的域名
	};
	config.cors = {
		origin: 'http://localhost:8081',				// vue项目的域名
		credentials: true,
		allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'  
	};
	
	config.sequelize = {
	  dialect: 'mysql',			// 数据库类型
	  database: 'graduation', 	// 数据库名
	  host: '127.0.0.1',		// IP地址
	  port: 3306,				// 端口
	  username: 'root',			// 用户名
	  password: 'mysql*123',	// 密码
	  // 连接池配置
	  pool: {
		  max: 5,
		  min: 0,
		  acquire: 30000,
		  idle: 10000
	  },
	  // 数据表全局配置
	  define:{
		  freezeTableName: true,	// 禁止model定义表名时在末尾添加's'
		  timestamps: false,		// 禁止自动添加时间戳  
		  paranoid: false,			// 硬删除
		  underscored: true,		// 允许字段的驼峰式命名转成下划线然后再跟数据库对应
		  operatorsAliases: false,	// 
	  },
	  timezone: '+08:00'			// 时区-东八区，不能写成 '+8:00'，在mysql2新版本会报错
	};
	
	return config;
}
