import React from 'react';
import PropTypes from 'prop-types';
import './settings.pcss';

const SettingsSet = (props) => {
    const { title, description, children, disabled } = props;
    const settingInfoClassName = `setting__info${disabled ? ' disabled': ''}`;
    return (
        <div className="setting">
            <div className={settingInfoClassName}>
                <div className="setting__title">
                    {title}
                </div>
                { description
                && (
                    <div className="setting__desc">
                        {description}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

SettingsSet.defaultProps = {
    description: '',
    title: '',
};

SettingsSet.propTypes = {
    title: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired,
    disabled: PropTypes.bool,
};

export default SettingsSet;
