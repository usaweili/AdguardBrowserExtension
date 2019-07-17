import React from 'react';
import PropTypes from 'prop-types';
import './checkbox.pcss';

function Checkbox(props) {
    const {
        id, value, handler,
    } = props;

    const changeHandler = (e) => {
        const { target: { name: id, checked: data } } = e;
        handler({ id, data });
    };

    return (
        <div className="checkbox">
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
