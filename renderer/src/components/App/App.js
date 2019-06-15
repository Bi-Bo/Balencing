import React, { PureComponent, Fragment } from 'react';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import Radar from '../Radar/Radar';
import Serial from '../Serial/Serial';
import Status from '../Status/Status';
import Header from '../Header/Header';
import Monitor from '../Monitor/Monitor';
import styles from './App.less';
import Sine from '../Sine/Sine';

export default class extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={styles.base}>
                <div className={styles.leftPanel}>
                    <Serial />
                    <br />
                    <Status />
                </div>
                <div className={styles.rightPanel}>
                    <div className={styles.head}>
                        <Header />
                    </div>
                    <div className={styles.main}>
                        <div className={styles.center}>
                            <Radar />
                            <Sine />
                        </div>
                        <div className={styles.right}>
                            <div className={styles.top}>
                                <Monitor />
                            </div>
                            <div className={styles.bottom}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};