import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './checkbox.pcss';

function Checkbox(props) {
    const {
        id, value, handler,
    } = props;

    const checkbox = React.createRef();

    useEffect(() => {
        const settingWrapper = checkbox.current.closest('.setting');
        if (!value) {
            settingWrapper.classList.add('setting--disabled');
        }
    }, []);

    const changeHandler = (e) => {
        const settingWrapper = e.target.closest('.setting');
        const { target: { name: id, checked: data } } = e;
        handler({ id, data });
        if (data) settingWrapper.classList.remove('setting--disabled');
        if (!data) settingWrapper.classList.add('setting--disabled');
    };

    return (
        <div
            className="checkbox"
            ref={checkbox}
        >
            <input
                type="checkbox"
                name={id}
                checked={value}
                onChange={changeHandler}
                id={id}
                className="checkbox__in"
            />
            <label
                htmlFor={id}
                className="checkbox__label"
            />
        </div>
    );
}

Checkbox.defaultProps = {
    value: false,
};

Checkbox.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    value: PropTypes.bool,
    handler: PropTypes.func.isRequired,
};

export default Checkbox;
