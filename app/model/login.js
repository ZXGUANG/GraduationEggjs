"use strict"

module.exports = app => {
	const { STRING, INTEGER } = app.Sequelize;
	const Login = app.model.define('login_table', {
	  id: {type: INTEGER, primaryKey: true, autoIncrement: true},
	  name: STRING(32),
	  password: STRING(32),
	  image: STRING(500)
	});
	
	Login.associate = function(){
		Login.hasOne(app.model.Teacher, { foreignKey: 'login_id'});		//, sourceKey: 'id'
	};
	
	return Login;
}
