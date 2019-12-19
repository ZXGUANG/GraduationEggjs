"use strict"

module.exports = app => {
	const {STRING, INTEGER, DATE} = app.Sequelize;
	const LabExperimenter = app.model.define('laboratory_table', {
		id:{type: INTEGER, primaryKey: true, autoIncrement: true},
		name: STRING(64),
		addr: STRING(255),
		scale: {type:INTEGER, allowNull: false, defaultValue: 0},
		seats: {type:INTEGER, allowNull: false, defaultValue: 0},
		image: STRING(500),
		introduction: STRING(500),
		admin_id: INTEGER,
		leader_id: INTEGER,
		experimenter_id: INTEGER,
		created_at: DATE
	},{
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: false,
		deletedAt: false,
		paranoid: false
	});
	LabExperimenter.associate = function(){
		LabExperimenter.belongsTo(app.model.Teacher, {foreignKey: 'experimenter_id', targerKey: 'id'});
	}	
	return LabExperimenter;
}
