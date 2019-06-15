import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import styles from './Monitor.less';

class Monitor extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Fragment>
                <div className={styles.part}>
                    <label>偏移：</label>
                </div>
                <div className={[
                    styles.part,
                    styles.inline
                ].join(' ')}>
                    <label className={styles.left}>角度</label>
                    <span>{this.props.angle}</span>
                    <label className={styles.right}>˚</label>
                </div>
                <div className={[
                    styles.part,
                    styles.inline
                ].join(' ')}>
                    <label className={styles.left}>量</label>
                    <span>{this.props.value}</span>
                </div>
            </Fragment>
        );
    }
};

export default connect(
    state => ({
        angle: state.offset.angle || 0,
        value: state.offset.value || 0
    }),
    {
        // actions
    }
)(Monitor);