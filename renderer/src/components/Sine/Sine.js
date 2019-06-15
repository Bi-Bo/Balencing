import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import styles from './Sine.less';

const margin = 20;
const width = 600;
const height = 300;
const radius = 2;
const angleLinear = d3.scaleLinear()
    .domain([0, 360])
    .range([0, width]);

class Sine extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined
        };
        this.timer = undefined;
        this.next_ticket = undefined;
        this.ref = React.createRef();
    }
    componentDidMount() {
        initSine(this.ref.current);
        this.startTimer();
    }
    componentWillUnmount() {
        clearTimeout(this.timer);
        clearTimeout(this.next_ticket);
    }
    startTimer = () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.draw, this.props.refreshRate);
    }
    draw = () => {
        clearTimeout(this.next_ticket);
        this.next_ticket = setTimeout(this._draw, 1);
        this.startTimer();
    }
    _draw = () => {
        // while (this.ref.current.firstChild) {
        //     this.ref.current.removeChild(this.ref.current.firstChild);
        // }
        if (this.props.offset.all) {
            getSine(this.props.offset, this.ref.current);
        }
    }
    render() {
        return (
            <div className={styles.wrapper} ref={this.ref}></div>           
        )
    }
};

export default connect(
    state => ({
        refreshRate: state.refreshRate,
        offset: state.offset
    }),
    {
        // actions
    }
)(Sine);

function initSine(base) {
    let svg = d3.select(base)
        .append('svg')
        .attr('width', width + margin * 2)
        .attr('height', height + margin * 2);

    let lineWrapper = svg.append('g')
        .attr('class', 'lineWrapper')
        .attr('transform', 'translate(' + margin + ', ' + (height/2 + margin) + ')')
        .style('color', '#999');

    let pointWrapper = svg.append('g')
        .attr('class', 'pointWrapper')
        .attr('transform', 'translate(' + margin + ', ' + (height/2 + margin) + ')');

    let axis_x_fn = d3.axisBottom(angleLinear)
        .tickValues(d3.range(0, 360, 30))
        .tickSizeOuter(0);
    
    lineWrapper.append('g')
        .attr('class', 'axis_x')
        .call(axis_x_fn);
    
    lineWrapper.append('g')
        .attr('class', 'axis_y');

    lineWrapper.append('path')
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'red');
}

function getSine(offset, base) {
    let _base = d3.select(base);
    let svg = _base.select('svg');

    let lineWrapper = svg.select('g.lineWrapper');

    let valueLinear = d3.scaleLinear()
        .domain(offset.valueDomain)
        .range([-height/2, height/2].reverse());

    let axis_y_fn = d3.axisLeft(valueLinear)
        .tickSizeOuter(0);

    lineWrapper.select('g.axis_y')
        .call(axis_y_fn);

    let _data = [];

    for (let i = 0, maxi = offset.all.length; i < maxi; i++) {
        _data.push({
            angle: offset.range[i],
            value: offset.loessed[i]
        });
    }

    let line = d3.line()
        .x(d => angleLinear(d.angle))
        .y(d => valueLinear(d.value));

    lineWrapper.select('path.line')
        .attr('d', line(_data));
    
    let pointWrapper = svg.select('g.pointWrapper');    

    let points = pointWrapper.selectAll('circle')
        .data(offset.all);
    
    points.exit()
        .remove();
    
    points.enter()
        .append('circle')
        .attr('r', radius)
        .style('fill', '#3fb2e8')
        .style('stroke', 'none')
        .style('fill-opacity', 0.5)
        .merge(points)
        .attr('cx', d => angleLinear(d.rawAngle))
        .attr('cy', d => valueLinear(d.rawValue));
}