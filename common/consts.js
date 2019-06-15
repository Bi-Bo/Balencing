module.exports = {
    Channel_GetList: 'serialPort_getList',
    Channel_GetList_Reply: 'serialPort_getList_reply',
    Channel_ConnectPort: 'Channel_ConnectPort',
    Channel_ConnectPort_Reply: 'Channel_ConnectPort_Reply',
    Connect_Status: {
        Off: 'Off',
        Pending: 'Pending',
        On: 'On'
    },
    Default_Baud_Rate: 115200,
    Baud_Rate_List: [110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200],
    Source_List: ['X', 'Y', 'Z'],
    Channel_UpdateBaud: 'Channel_UpdateBaud',
    Channel_Data: 'Channel_Data',
    Channel_reData: 'Channel_reData',
    Ready_Data: 'Ready\r',
    Data_Start_With: 'Data',
    Rotate_Start_With: 'Rotate',
    Acc_Count: 10,
    Default_Refresh_Rate: 500
}