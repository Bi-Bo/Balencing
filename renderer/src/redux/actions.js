import { ipcRenderer } from 'electron';
import { 
    Channel_GetList, 
    Channel_GetList_Reply,
    Channel_ConnectPort,
    Channel_ConnectPort_Reply,
    Connect_Status,
    Channel_UpdateBaud,
    Channel_Data,
    Channel_reData,
    Ready_Data
} from '../../../common/consts';
import { 
    Port_List,
    Set_Port,
    Connect_Port, 
    Set_Baud_Rate,
    Set_Zero_Angle,
    Set_Source,
    Set_Direction_Change,
    Set_Refresh_Rate,
    Arrive_Data,
    Reset_XYZ
} from './actionTypes';
import doAlert from '../components/Alert/Alert';
// import LSE from '../math/lse';

let on_Channel_GetList_Reply = false;
let on_Channel_ConnectPort_Reply = false;

export const getPortList = () => {
    return dispatch => {
        if (!on_Channel_GetList_Reply) {
            on_Channel_GetList_Reply = true;
            ipcRenderer.on(Channel_GetList_Reply, (event, arg) => {
                if (arg.ok) {
                    dispatch({
                        type: Port_List,
                        content: arg.data.map(i => i.comName)
                    });
                }
            });
        }

        ipcRenderer.send(Channel_GetList, '');
    };
};

export const setPort = port => {
    return (dispatch, getState) => {
        if (getState().ifConnect !== Connect_Status.Off) {
            doAlert('请在未连接时选择端口');
            return;
        }
        dispatch({
            type: Set_Port,
            content: port
        });
    };
};

export const connectPort = () => {
    return (dispatch, getState) => {
        const prev = getState().ifConnect;

        if (prev === Connect_Status.Pending) {
            return;
        }

        if (!on_Channel_ConnectPort_Reply) {
            on_Channel_ConnectPort_Reply = true;
            ipcRenderer.on(Channel_ConnectPort_Reply, (event, arg) => {
                if (arg.ok) {
                    dispatch({
                        type: Connect_Port,
                        content: arg.data.status
                    });
                } else {
                    doAlert(arg.data.info);
                    if (getState().ifConnect === Connect_Status.Pending) {
                        dispatch({
                            type: Connect_Port,
                            content: arg.data.status
                        });
                    }
                }
            });
            ipcRenderer.on(Channel_Data, (event, arg) => {
                dispatch({
                    type: Arrive_Data,
                    content: arg.data
                });

                if (arg.data === Ready_Data) {
                    ipcRenderer.send(
                        Channel_reData,
                        {
                            content: ' '
                        }
                    );
                }
            });
        }

        dispatch({
            type: Connect_Port,
            content: Connect_Status.Pending
        });

        ipcRenderer.send(
            Channel_ConnectPort,
            {
                status: prev === Connect_Status.On 
                    ? Connect_Status.Off 
                    : Connect_Status.On,
                path: getState().port,
                baudRate: getState().baudRate
            }
        );
    };
};

export const setBaudRate = value => {
    value = parseInt(value);
    ipcRenderer.send(
        Channel_UpdateBaud,
        {
            baudRate: value
        }
    );
    return {
        type: Set_Baud_Rate,
        content: value
    };
};

export const setZeroAngle = value => ({
    type: Set_Zero_Angle,
    content: value
});

export const setSource = value => ({
    type: Set_Source,
    content: value
});

export const setDirectionChange = value => ({
    type: Set_Direction_Change,
    content: value
});

export const setRefreshRate = value => ({
    type: Set_Refresh_Rate,
    content: value
});

export const resetXYZ = () => ({
    type: Reset_XYZ
});

// let r = LSE([
//     {x: 1, y: -1, z: 0},
//     {x: 1, y: 0, z: -1},
//     {x: 2, y: -2, z: 0},
//     {x: 1, y: -0.5, z: -0.5},
//     {x: 0, y: -1, z: 1},
//     {x: 0, y: -2, z: 2},
//     {x: 1, y: -0.5, z: 0.5},
//     {x: 1.5, y: 0, z: -1.5}
// ]);

// console.log(r);