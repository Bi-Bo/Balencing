import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

class Empty extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div></div>
        );
    }
};

export default connect(
    state => ({
        prop: selectors(state)
    }),
    {
        actions
    }
)(Empty);