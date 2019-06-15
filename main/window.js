const { BrowserWindow } = require('electron');

module.exports = class Window {
    constructor(url) {
        this.win = null;
        this.indexUrl = url;

        this.create();
        this.loadURL(this.indexUrl);
    }
    create() {
        this.win = new BrowserWindow({
            width: 1125,
            height: 640,
            webPreferences: {
                nodeIntegration: true
            }
        });
    }
    loadURL(url) {
        this.win.loadURL(url);
    }
};