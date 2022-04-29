/* eslint-disable no-undef */
import fs from 'fs';
import { markdownTable } from 'markdown-table';
import path from 'path';

const imageShield = (pkg) => `https://img.shields.io/npm/v/${pkg}?style=for-the-badge`;
const npmLink = (pkg) => `https://npmjs.com/package/${pkg}`;
const getTableRow = (pkg) => [`[${pkg.name}](./packages/${pkg.folder})`, `[![Chainify](${imageShield(pkg.name)})](${npmLink(pkg.name)})`];

const projectFolder = path.resolve(process.cwd());
const packagesFolder = `${projectFolder}/packages`;

const allPackages = fs.readdirSync(packagesFolder);

const packages = [];
for (const pkg of allPackages) {
    const packageJson = fs.readFileSync(`${packagesFolder}/${pkg}/package.json`);
    const parsed = JSON.parse(packageJson);
    if (parsed?.name) {
        packages.push({ name: parsed.name, folder: pkg });
    }
}

const allRows = [];
for (const pkg of packages) {
    const row = getTableRow(pkg);
    allRows.push(row);
}

const table = markdownTable([['Package', 'Version'], ...allRows], { align: ['l', 'c', 'r'] });

console.log(table);
