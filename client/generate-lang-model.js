import fs from 'fs';
import path from 'path';

const dir = './assets/langs/en/';
const targetModelFile = './src/models/language.ts';

const fileList = fs.readdirSync(dir);
const langModels = [];

fileList.forEach(file => {
	const fileName = path.parse(file).name;
	langModels.push(
		`'${fileName}': typeof import('../../assets/langs/en/${fileName}').default;`
	);
});

const result = [
	'export type Language = {',
	'\t@data',
	'}'
].join('\n');

fs.writeFileSync(targetModelFile, result.replace('@data', langModels.join('\n\t')) + '\n');

console.log('Generate language models successfully!');
