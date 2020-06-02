import React from 'react';
import PropTypes from 'prop-types';
import './settings.pcss';

function SettingsSection(props) {
    const { title, children, disabled } = props;
    return (
        <div key={title}>
            <div
                className="settings-group"
                disabled={disabled}
            >
                {title && <h3 className="subtitle">{title}</h3>}
                {children}
            </div>
        </div>
    );
}

SettingsSection.defaultProps = {
    title: '',
    disabled: false,
};

SettingsSection.propTypes = {
    title: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default SettingsSection;
