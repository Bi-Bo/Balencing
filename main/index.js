const { app } = require('electron');
const Window = require('./window');
const SerialAgent = require('./serialAgent');
const { indexHtml } = require('./paths');

app.on('ready', () => {
    const window = new Window(indexHtml);
    const serialAgent = new SerialAgent(window.win);
});