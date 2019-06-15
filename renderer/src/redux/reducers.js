import { 
    Port_List,
    Set_Port,
    Connect_Port, 
    Set_Source, 
    Set_Direction_Change,
    Set_Baud_Rate,
    Set_Zero_Angle,
    Set_Refresh_Rate,
    Arrive_Data,
    Reset_XYZ
} from './actionTypes';
import { 
    Connect_Status, 
    Default_Baud_Rate, 
    Baud_Rate_List,
    Source_List,
    Data_Start_With,
    Rotate_Start_With,
    Acc_Count,
    Default_Refresh_Rate
} from '../../../common/consts';
import * as d3 from 'd3';
import Loess from '../math/loess';

let TempMonitor = undefined;
let TempMax = 0, TempMin = 0;

const initialXYZ = {
    latestX: undefined,
    latestY: undefined,
    latestZ: undefined,
    maxX: undefined,
    maxZ: undefined,
    maxY: undefined,
    minX: undefined,
    minY: undefined,
    minZ: undefined,
    stackX: [],
    stackY: [],
    stackZ: [],
    avgX: undefined,
    avgY: undefined,
    avgZ: undefined,
    stackRotate: [],
    avgRotate: undefined
};

const initialState = {
    portList: [],
    port: undefined,
    baudRateList: Baud_Rate_List,
    baudRate: Default_Baud_Rate,
    ifConnect: Connect_Status.Off,
    zeroAngle: 0,
    sourceList: Source_List,
    source: Source_List[0],
    directionChange: false,
    refreshRate: Default_Refresh_Rate,
    monitorData: [],
    latestMonitorData: [],
    minValue: 0,
    maxValue: 0,
    offset: {},
    ...initialXYZ
};

const Reducers = {
    [Port_List]: (state, action) => ({
        ...state,
        portList: action.content,
        port: state.port ? state.port : action.content[action.content.length - 1]
    }),
    [Set_Port]: (state, action) => ({
        ...state,
        port: action.content
    }),
    [Connect_Port]: (state, action) => ({
        ...state,
        ifConnect: action.content
    }),
    [Set_Baud_Rate]: (state, action) => {
        return {
            ...state,
            baudRate: action.content
        };
    },
    [Set_Zero_Angle]: (state, action) => {
        return {
            ...state,
            zeroAngle: action.content
        };
    },
    [Set_Source]: (state, action) => {
        return {
            ...state,
            source: action.content
        };
    },
    [Set_Direction_Change]: (state, action) => {
        return {
            ...state,
            directionChange: action.content
        };
    },
    [Set_Refresh_Rate]: (state, action) => ({
        ...state,
        refreshRate: action.content
    }),
    [Arrive_Data]: processData,
    [Reset_XYZ]: (state, action) => ({
        ...state,
        ...initialXYZ
    })
};

export default function(state = initialState, action) {
    let reducer = Reducers[action.type];
    let result = reducer ? reducer(state, action) : state;

    return result;
};

function processData(state, action) {
    let xyz = [];
    let latest = {X: 0, Y: 0, Z: 0};
    let stackX, stackY, stackZ;
    let avgX, avgY, avgZ;
    let stackRotate, latestRotate, avgRotate;
    let monitorData, latestMonitorData;
    let selectValue;
    let offset = {};
    if (action.content.startsWith(Data_Start_With)) {
        xyz = action.content.split('\t');
        latest.X = parseInt(xyz[1]);
        latest.Y = parseInt(xyz[2]);
        latest.Z = parseInt(xyz[3]);
        stackX = arrayPipe(state.stackX, Acc_Count, latest.X);
        stackY = arrayPipe(state.stackY, Acc_Count, latest.Y);
        stackZ = arrayPipe(state.stackZ, Acc_Count, latest.Z);
        avgX = avg(stackX);
        avgY = avg(stackY);
        avgZ = avg(stackZ);
        selectValue = latest[state.source];
        saveInTemp(selectValue, getTime(xyz[0]));
        TempMax = state.maxValue > selectValue ? state.maxValue : selectValue;
        TempMin = state.minValue < selectValue ? state.minValue : selectValue;
        return {
            ...state,
            latestX: latest.X,
            latestY: latest.Y,
            latestZ: latest.Z,
            maxX: state.maxX > latest.X ? state.maxX : latest.X,
            maxY: state.maxY > latest.Y ? state.maxY : latest.Y,
            maxZ: state.maxZ > latest.Z ? state.maxZ : latest.Z,
            minX: state.minX < latest.X ? state.minX : latest.X,
            minY: state.minY < latest.Y ? state.minY : latest.Y,
            minZ: state.minZ < latest.Z ? state.minZ : latest.Z,
            stackX,
            stackY,
            stackZ,
            avgX,
            avgY,
            avgZ,
            maxValue: TempMax,
            minValue: TempMin
        };
    } else if (action.content.startsWith(Rotate_Start_With)) {
        latestRotate = getTime(action.content);
        latestMonitorData = getMonitorData({
            start: state.stackRotate[0], 
            end: latestRotate,
            zeroAngle: state.zeroAngle,
            direction: state.directionChange
        });
        if (latestMonitorData.length) {
            monitorData = arrayPipe(state.monitorData, Acc_Count, latestMonitorData);
        } else {
            monitorData = state.monitorData;
        }
        stackRotate = arrayPipe(state.stackRotate, Acc_Count, latestRotate);
        avgRotate = parseInt(getRPM(stackRotate) * 0.9);
        if (monitorData.length) {
            offset = getOffset(monitorData);
        }
        return {
            ...state,
            stackRotate,
            avgRotate,
            monitorData,
            maxValue: 0,
            minValue: 0,
            latestMonitorData,
            offset
        };
    } else {
        return {
            ...state
        };
    }
}

function getOffset(data) {
    let loess = Loess().bandwidth(.1);
    let allData = data.reduce(
        (acc, one) => acc = acc.concat(one), 
        []
    ).sort((a, b) => a.rawAngle - b.rawAngle);

    let rawValues = allData.map(one => one.rawValue);
    let rawAngles = allData.map(one => one.rawAngle);
    
    let valueDomain = [
        d3.min(rawValues),
        d3.max(rawValues)
    ];
    let angleDomain = [
        d3.min(rawAngles),
        d3.max(rawAngles)
    ];
    let range = d3.range(
            angleDomain[0], 
            angleDomain[1], 
            (angleDomain[1] - angleDomain[0])/allData.length
        );

    let loessed = loess(
            rawAngles,
            rawValues
        );
    let shift = [];

    for (let i = 0, maxi = data.length; i < maxi; i++) {
        shift.push({
            angle: range[i],
            value: loessed[i]
        });
    }

    let value = d3.max(loessed);
    let angle = range[loessed.indexOf(value)];

    return {
        all: allData,
        valueDomain,
        angleDomain,
        range,
        loessed,
        value: wrapFixed(value),
        angle: wrapFixed(angle),
        shift
    }
}

function getMonitorData(data) {
    if (data.start === undefined || TempMonitor === undefined) {
        return [];
    }
    let shake = [].concat(TempMonitor);
    let shift = [];
    let range = data.end - data.start;
    let max = TempMax;
    let min = TempMin;

    TempMonitor = undefined;
    TempMax = 0;
    TempMin = 0;

    if (range !== 0 && max !== min) {
        shift = shake.map(one => {
            if (data.direction) {
                one.angle = (data.end - one.time) / range * 360;
            } else {
                one.angle = (one.time - data.start) / range * 360;
            }
    
            delete one.time;
    
            one.rawValue = one.value;
    
            one.value = (one.value - min) / (max - min) * 100;
    
            if (data.direction) {
                one.angle += data.zeroAngle;
            } else {
                one.angle -= data.zeroAngle;
            }
    
            while(one.angle < 0 || one.angle > 360) {
                if (one.angle < 0) {
                    one.angle += 360;
                } else if (one.angle > 360) {
                    one.angle -= 360;
                }
            }
    
            one.rawAngle = one.angle;
    
            one.value = wrapFixed(one.value);
            one.angle = wrapFixed(Math.PI * one.angle / 180);
    
            return one;
        });
    }

    return shift;
}

function wrapFixed(v) {
    return Math.round(v * 100) / 100;
}

function saveInTemp(x, time) {
    if (TempMonitor === undefined) {
        TempMonitor = [];
    }
    TempMonitor.unshift({
        value: x,
        time: time
    });
}

function getTime(s) {
    return parseInt(s.split('@')[1]);
}

function arrayPipe(array, len, data) {
    array.unshift(data);
    while(array.length > len) {
        array.pop();
    }
    return [].concat(array);
}

function avg(array) {
    if (array.length === 0) {
        return undefined;
    } else {
        return parseFloat((array.reduce(sum, 0) / array.length).toFixed(2));
    } 
}

function sum(acc, one) {
    return acc + one;
}

// 从毫秒的数组中计算出每分钟转数
function getRPM(array) {
    let count = array.length;
    let timeRange = array[0] - array[count - 1];

    if (timeRange <= 0) {
        return;
    } else {
        return count / timeRange * 60 * 1000;
    }
}