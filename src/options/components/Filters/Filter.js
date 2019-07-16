import React from 'react';
import PropTypes from 'prop-types';
import './filter.pcss';

function Filter(props) {
    const {
        name, children,
    } = props;
    return (
        <div className="filter" role="presentation">
            <div className="filter__info">
                <div className="group__title">
                    {name}
                </div>
                {children}
            </div>
        </div>
    );
}

Filter.propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.node]).isRequired,
};

export default Filter;
