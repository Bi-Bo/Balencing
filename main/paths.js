const path = require('path');

const rootDir = path.join(__dirname, './');
const packDir = path.join('file://', rootDir, 'renderer');

const indexHtml = path.join(packDir, './index.html');

module.exports = {
    rootDir,
    packDir,
    indexHtml
};