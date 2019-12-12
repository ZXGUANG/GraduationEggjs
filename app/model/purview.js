"use strict"

module.exports = app => {
	const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
	const Purview = app.model.define('purview_table', {
		id:{type: INTEGER, primaryKey: true, autoIncrement: true},
		level: INTEGER,
		content: STRING(500),
		teacher_id: INTEGER,
		created_at: DATE
	},{
		timestamps: true,			// 开启自动添加时间戳
		createdAt: 'created_at',	// createdAt对应字段created_at
		updatedAt: false,			// updatedAt对应字段updated_at
		deletedAt: false,			// 关闭deleteAt时间戳
		paranoid: false				// deletedAt为false时必须关闭软删除
	});
	
	return Purview;
}