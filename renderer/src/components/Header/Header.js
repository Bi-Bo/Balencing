import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { NumericInput, HTMLSelect, Switch } from '@blueprintjs/core';
import { selSourceList, selSource } from '../../redux/selectors';
import { setZeroAngle, setSource, setRefreshRate, setDirectionChange } from '../../redux/actions';
import styles from './Header.less';

class Header extends PureComponent {
    constructor(props) {
        super(props);
    }
    handleSourceSel = e => {
        this.props.setSource(e.target.value);
    }
    handleDirectionChange = e => {
        this.props.setDirectionChange(!this.props.directionChange);
    }
    handleZeroAngleSet = value => {
        this.props.setZeroAngle(value);
    }
    handleRefreshRateSet = value => {
        this.props.setRefreshRate(value);
    }
    render() {
        return (
            <Fragment>
                <span className={styles.part}>
                    信号源：<HTMLSelect 
                        options={this.props.sourceList} 
                        onChange={this.handleSourceSel}
                        value={this.props.source}
                    />
                </span>
                <span className={styles.part}>
                    改变方向：<Switch checked={this.props.directionChange} 
                            onChange={this.handleDirectionChange}
                            large={true}
                            inline={true}
                    />
                </span>
                <span className={styles.part}>
                    0位角度：<NumericInput 
                        onValueChange={this.handleZeroAngleSet}
                        value={this.props.zeroAngle}
                    />
                </span>
                <span className={styles.part}>
                    刷新间隔(ms)：<NumericInput
                        onValueChange={this.handleRefreshRateSet}
                        value={this.props.refreshRate}
                    />
                </span>
            </Fragment>
        );
    }
};

export default connect(
    state => ({
        sourceList: selSourceList(state),
        source: selSource(state),
        directionChange: state.directionChange,
        zeroAngle: state.zeroAngle,
        refreshRate: state.refreshRate
    }),
    {
        setSource,
        setDirectionChange,
        setZeroAngle,
        setRefreshRate
    }
)(Header);