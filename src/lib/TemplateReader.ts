import fs from 'fs';
export class TemplateReader {
	fs = require('fs');
	path = require('path');

	test() {
		const jsonsInDir = fs
			.readdirSync('../../templates/response')
			.filter((file) => this.path.extname(file) === '.json');
		//	const result: [];
		jsonsInDir.forEach((file) => {
			const fileData = fs.readFileSync(path.join('../../templates/response', file));
			//		result = JSON.parse(fileData.toString());
		});
	}
}
