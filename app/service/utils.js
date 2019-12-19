"use strict"

const fs = require('mz/fs');
const path = require('path');

class Utils {
	// 递归创建文件夹
	static createDirs(dirPath){
		if(fs.existsSync(dirPath))	return 1;
		if(!fs.existsSync(path.dirname(dirPath))){
			Utils.createDirs(path.dirname(dirPath));
		}
		fs.mkdirSync(dirPath);
		return 1;
	}
	// 删除文件
	static delFile(filePath){
		if(!fs.existsSync(filePath))	return 1;
		try{
			fs.unlink(filePath);		// 删除
			return 1;
		}catch(e){
			return e;
		}
	}
}

module.exports = Utils;
