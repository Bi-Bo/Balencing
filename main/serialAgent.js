const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const { ipcMain } = require('electron');
const path = require('path');
const { rootDir } = require('./paths');
const { 
    Channel_GetList, 
    Channel_GetList_Reply,
    Channel_ConnectPort,
    Channel_ConnectPort_Reply,
    Connect_Status,
    Channel_UpdateBaud,
    Channel_Data,
    Channel_reData
} = require(path.join(rootDir, './common/consts'));

module.exports = class SerialAgent {
    constructor(win) {
        this.content = win.webContents;
        this.port = undefined;
        this.parser = undefined;
        ipcMain.on(Channel_GetList, this.handleGetList);
        ipcMain.on(Channel_ConnectPort, this.handleConnectPort);
        ipcMain.on(Channel_UpdateBaud, this.handleUpdateBaud);
        ipcMain.on(Channel_reData, this.sendToPort);
        this.content.on('crashed', this.handleWindowCrash);
    }
    handleGetList = (event, arg) => {
        const reply = data => event.reply(
            Channel_GetList_Reply, 
            {ok: true, data: data}
        );
        SerialPort.list()
        .then(
            reply, 
            reply
        );
    }
    handleConnectPort = (event, arg) => {
        if (arg.status === Connect_Status.On) {
            this.port = new SerialPort(arg.path, {
                baudRate: arg.baudRate
            });
            this.prepare();
        } else if (arg.status === Connect_Status.Off && this.port) {
            this.port.close();
        }
    }
    handleUpdateBaud = (event, arg) => {
        if (!this.port) {
            return;
        }
        this.port.update({
            baudRate: arg.baudRate
        });
    }
    handleWindowCrash = () => {
        if (this.port) {
            this.port.close();
        }

        this.clean();
    }
    clean = () => {
        this.port = undefined;
        this.parser = undefined;
    }
    prepare = () => {
        this.port.on('open', this.whenOpen);
        this.port.on('error', this.whenWrong);
        this.port.on('close', this.whenWrong);

        this.parser = this.port.pipe(new Readline());
        
        this.parser.on('data', this.whenData);
    }
    whenOpen = () => {
        this.content.send(
            Channel_ConnectPort_Reply,
            {
                ok: true, 
                data: {
                    status: Connect_Status.On
                }
            }
        );
    }
    whenWrong = e => {
        if (Object.prototype.toString.call(e) === '[object Error]') {
            this.content.send(
                Channel_ConnectPort_Reply,
                {
                    ok: false,
                    data: {
                        status: Connect_Status.Off,
                        info: e && e.message
                    }
                }
            );
            this.clean();
        } else {
            this.content.send(
                Channel_ConnectPort_Reply, 
                {
                    ok: true,
                    data: {
                        status: Connect_Status.Off
                    }
                }
            );
        }
    }
    whenData = data => {
        this.content.send(
            Channel_Data,
            {
                data: data
            }
        );
    }
    sendToPort = (event, arg) => {
        if (this.port) {
            this.port.write(arg.content);
        }
    }
};