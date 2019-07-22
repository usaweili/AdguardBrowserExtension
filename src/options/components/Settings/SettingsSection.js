import React from 'react';
import PropTypes from 'prop-types';

function SettingsSection(props) {
    const { title, children } = props;
    return (
        <div key={title}>
            <div className="settings-group">
                {title && <h3 className="subtitle">{title}</h3>}
                {children}
            </div>
        </div>
    );
}

SettingsSection.defaultProps = {
    title: '',
};

SettingsSection.propTypes = {
    title: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default SettingsSection;
