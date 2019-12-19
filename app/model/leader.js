"use strict"

module.exports = app => {
	const {STRING, INTEGER} = app.Sequelize;
	const Leader = app.model.define('teacher_table', {
		id:{type: INTEGER, primaryKey: true, autoIncrement: true},
		name: STRING(32),
		age: INTEGER,
		sex: INTEGER,
		login_id: INTEGER,
		group_id: INTEGER
	});
	
	Leader.associate = function(){
		Leader.hasOne(app.model.Purview, {foreignKey: 'teacher_id'});
		Leader.hasMany(app.model.Laboratory, {foreignKey: 'leader_id'});
		Leader.hasMany(app.model.LabLeader, {foreignKey: 'leader_id'});
	}
	
	return Leader;
}
