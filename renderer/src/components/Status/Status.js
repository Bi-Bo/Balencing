import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { resetXYZ } from '../../redux/actions';
import styles from './Status.less';

class Status extends PureComponent {
    constructor(props) {
        super(props);
    }
    handResetClick = e => {
        this.props.resetXYZ();
    }
    render() {
        return (
            <Fragment>
                <div className={styles.part}>
                    <label>转速：</label>
                </div>
                <div className={[
                    styles.part,
                    styles.underline
                ].join(' ')}>
                    <span>{this.props.avgRotate}</span>
                    <span className={styles.right}>RPM</span>
                </div>
                <div className={styles.part}>
                    <label>加速度：</label>
                </div>
                <div className={styles.part}>
                    <table className={styles.table}>
                        <tbody>
                            <tr>
                                <th></th>
                                <th>now</th>
                                <th>min</th>
                                <th>max</th>
                                <th>avg</th>
                            </tr>
                            <tr>
                                <th>X</th>
                                <th>{this.props.latestX}</th>
                                <th>{this.props.minX}</th>
                                <th>{this.props.maxX}</th>
                                <th>{this.props.avgX}</th>
                            </tr>
                            <tr>
                                <th>Y</th>
                                <th>{this.props.latestY}</th>
                                <th>{this.props.minY}</th>
                                <th>{this.props.maxY}</th>
                                <th>{this.props.avgY}</th>
                            </tr>
                            <tr>
                                <th>Z</th>
                                <th>{this.props.latestZ}</th>
                                <th>{this.props.minZ}</th>
                                <th>{this.props.maxZ}</th>
                                <th>{this.props.avgZ}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={[
                    styles.part,
                    styles.center
                ].join(' ')}>
                    <Button text="重置" 
                            onClick={this.handResetClick} 
                    />
                </div>
            </Fragment>
        );
    }
};

export default connect(
    state => ({
        latestX: onlyNumber(state.latestX),
        latestY: onlyNumber(state.latestY),
        latestZ: onlyNumber(state.latestZ),
        maxX: onlyNumber(state.maxX),
        maxY: onlyNumber(state.maxY),
        maxZ: onlyNumber(state.maxZ),
        minX: onlyNumber(state.minX),
        minY: onlyNumber(state.minY),
        minZ: onlyNumber(state.minZ),
        avgX: onlyNumber(state.avgX),
        avgY: onlyNumber(state.avgY),
        avgZ: onlyNumber(state.avgZ),
        avgRotate: onlyNumber(state.avgRotate)
    }),
    {
        resetXYZ
    }
)(Status);

function onlyNumber(d) {
    if (d === undefined || isNaN(d)) {
        return '';
    } else {
        return d;
    }
}