"use strict"

module.exports = app => {
	const {STRING, INTEGER, BOOLEAN} = app.Sequelize;
	const Experimenter = app.model.define('teacher_table', {
		id:{type: INTEGER, primaryKey: true, autoIncrement: true},
		name: STRING(32),
		age: INTEGER,
		sex: INTEGER,
		login_id: INTEGER,
		group_id: INTEGER
	});
	
	Experimenter.associate = function(){
		Experimenter.hasOne(app.model.Purview, {foreignKey: 'teacher_id'});
		Experimenter.hasMany(app.model.Laboratory, {foreignKey: 'experimenter_id'});
		Experimenter.hasMany(app.model.LabLeader, {foreignKey: 'experimenter_id'});
	}
	
	return Experimenter;
}
