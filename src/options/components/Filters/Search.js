import React, { Fragment, Component } from 'react';

class Search extends Component {
    render() {
        return (
            <Fragment>
                <div className="icon-search"></div>
                <input type="text" onChange={this.props.handler} />
                <select name="" id=""></select>
            </Fragment>
        )
    }
}

export default Search;
