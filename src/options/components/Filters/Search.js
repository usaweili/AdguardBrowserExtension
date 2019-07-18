import React, { Component } from 'react';

class Search extends Component {
    render() {
        const { searchInputHandler, searchSelectHandler, searchInput, searchSelect } = this.props;
        return (
            <div className="search">
                <div className="search__ico" />
                <input
                    className="search__input"
                    type="text"
                    onChange={searchInputHandler}
                    value={searchInput}
                />
                <select
                    name="select_time"
                    className="form__select"
                    value={searchSelect}
                    onChange={searchSelectHandler}
                >
                    <option value="all">
                        All
                    </option>
                    <option value="enabled">
                        Enabled
                    </option>
                    <option value="disabled">
                        Disabled
                    </option>
                </select>
            </div>
        )
    }
}

export default Search;
