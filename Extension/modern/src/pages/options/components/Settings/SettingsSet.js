import React from 'react';
import PropTypes from 'prop-types';

const SettingsSet = (props) => {
    const { title, description, children } = props;
    return (
        <div className="setting">
            <div className="setting__info">
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
};

export default SettingsSet;
