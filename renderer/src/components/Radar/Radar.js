import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import RD3Component from '../../../lib/react-d3';
import RadarChart from './chart';
import Color from 'color';
import { Acc_Count } from '../../../../common/consts';

class Radar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined
        };
        this.timer = undefined;
    }
    componentDidMount() {
        this.startTimer();
    }
    componentWillUnmount() {
        clearTimeout(this.timer);
    }
    startTimer = () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.draw, this.props.refreshRate);
    }
    draw = () => {
        this.setState({
            data: getRadar(this.props.monitorData)
        });
        this.startTimer();
    }
    render() {
        return (
            <RD3Component data={this.state.data} />
        )
    }
};

export default connect(
    state => ({
        monitorData: state.monitorData,
        refreshRate: state.refreshRate
    }),
    {
        // actions
    }
)(Radar);

const margin = { top: 70, right: 100, bottom: 60, left: 100 },
    width = 400,
    height = 400;
const color = d3.scaleOrdinal()
    .range((() => {
        let re = [];
        let startColor = Color("#51d2ed");//["#EDC951", "#CC333F", "#00A0B0"]

        for (let i = 0, maxi = Acc_Count; i < maxi; i++) {
            re.push(startColor = startColor.rotate(360 / Acc_Count));
        }

        return re;
    })());
const axis = (() => {
    let re = [];
    const split = 4 * 3;

    for (let i = 0, maxi = split; i < maxi; i++) {
        re.push(`${i * 360 / split}˚`);
    }

    return remapData(re);
})();

function remapData(array) {
    let re = [].concat(array).reverse();
    re.unshift(re.pop());
    return re;
}

const radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 100,
    levels: 5,
    roundStrokes: true,
    color: color
};

function getRadar(data) {
    let ele = document.createElement('div');

    // data.forEach(one => {
    //     one.forEach(i => {
    //         if (i.value >= i.max) {
    //             console.log(i);
    //         }
    //     });
    // });

    RadarChart(ele, data, axis, radarChartOptions);

    return ele;
}