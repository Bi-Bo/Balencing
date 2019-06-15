import React, { PureComponent, Fragment } from 'react';
import { Button, HTMLSelect, Switch } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { Connect_Status } from '../../../../common/consts';
import { selPortList, selBaudRateList, selBaudRate, selConnect } from '../../redux/selectors';
import { getPortList, setPort, connectPort, setBaudRate } from '../../redux/actions';
import styles from './Serial.less';

class Serial extends PureComponent {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.getPortList();
    }
    handleRefreshClick = e => {
        this.props.getPortList();
    }
    handlePortSet = e => {
        this.props.setPort(e.target.value);
    }
    handleBaudSel = e => {
        this.props.setBaudRate(e.target.value);
    }
    handleConnect = e => {
        this.props.connectPort();
    }
    render() {
        return (
            <Fragment>
                <div className={styles.part}>
                    <label>端口：</label>
                    <Button text="刷新" 
                            onClick={this.handleRefreshClick} 
                            className={styles.right}
                    />
                </div>
                <HTMLSelect options={this.props.portList} 
                            onChange={this.handlePortSet}
                            value={this.props.port}
                />
                <div className={styles.part}>
                    <label>波特率：</label>
                </div>
                <HTMLSelect options={this.props.baudRateList} 
                            onChange={this.handleBaudSel}
                            value={this.props.baudRate}
                />
                <div className={styles.part}>
                    <label>连接：</label>
                    <Switch checked={this.props.ifConnect === Connect_Status.On} 
                            onChange={this.handleConnect}
                            className={[
                                styles.right,
                                this.props.ifConnect === Connect_Status.Pending ? styles.waiting : ''
                            ].join(' ')}
                            large={true}
                    />
                </div>
            </Fragment>
        );
    }
};

export default connect(
    state => ({
        portList: selPortList(state),
        port: state.port,
        baudRateList: selBaudRateList(state),
        baudRate: selBaudRate(state),
        ifConnect: selConnect(state)
    }),
    {
        getPortList,
        setPort,
        connectPort,
        setBaudRate
    }
)(Serial);