import React from 'react';
import PropTypes from 'prop-types';

const renderEnabledFilters = (enabledFiltersNames) => {
    const SLICE_POINT = 3;
    const displayable = enabledFiltersNames.slice(0, SLICE_POINT);
    const countable = enabledFiltersNames.slice(SLICE_POINT);

    if (countable.length > 0) {
        return `Enabled: ${displayable.join(', ')} and ${countable.length} more`;
    }

    if (displayable.length > 1) {
        const [last, ...rest] = displayable.reverse();
        return `Enabled: ${rest.join(', ')} and ${last}`;
    }

    if (displayable.length === 1) {
        return `Enabled: ${displayable[0]}`;
    }

    return 'No filters enabled';
};

function Group(props) {
    const { name, children, enabledFilters } = props;
    return (
        <div className="setting">
            <div className="setting__info">
                <div className="setting__icon" />
                <div className="setting__title">
                    {name}
                </div>
                <div className="setting__desc">
                    {renderEnabledFilters(enabledFilters)}
                </div>
                {children}
            </div>
        </div>
    );
}

Group.defaultProps = {
    enabledFilters: [],
};

Group.propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.node]).isRequired,
    enabledFilters: PropTypes.arrayOf(PropTypes.string),
};

export default Group;
