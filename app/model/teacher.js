"use strict"

module.exports = app => {
	const {STRING, INTEGER, BOOLEAN} = app.Sequelize;
	const Teacher = app.model.define('teacher_table', {
		id:{type: INTEGER, primaryKey: true, autoIncrement: true},
		name: STRING(32),
		age: INTEGER,
		sex: INTEGER,
		login_id: INTEGER,
		group_id: INTEGER
	});
	
	Teacher.associate = function(){
		Teacher.hasOne(app.model.Purview, {foreignKey: 'teacher_id'});
		Teacher.belongsTo(app.model.Login, {foreignKey: 'login_id'});
	}
	
	return Teacher;
}
