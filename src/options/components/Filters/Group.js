import React from 'react';
import PropTypes from 'prop-types';
import './group.pcss';

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
    const {
        name, children, enabledFilters, groupClickHandler,
    } = props;
    return (
        <div className="group" role="presentation" onClick={groupClickHandler}>
            <div className="group__info">
                <div className="group__icon" />
                <div className="group__title">
                    {name}
                </div>
                <div className="group__enabled_filters">
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
    groupClickHandler: PropTypes.func.isRequired,
};

export default Group;
