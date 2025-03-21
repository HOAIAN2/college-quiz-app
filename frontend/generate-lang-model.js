import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'assets/langs/en/');
const targetModelFile = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/models/language.ts');

const fileList = fs.readdirSync(dir);
const langModels = [];

fileList.forEach(file => {
    const fileName = path.parse(file).name;
    langModels.push(
        `'${fileName}': typeof import('../../assets/langs/en/${file}').default;`
    );
});

const result = [
    'export type Language = {',
    '    @data',
    '};'
].join('\n');

fs.writeFileSync(targetModelFile, result.replace('@data', langModels.join('\n    ')) + '\n');

console.log('Generate language models successfully!');
