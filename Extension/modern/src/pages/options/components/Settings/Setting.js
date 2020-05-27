import React from 'react';
import Checkbox from './Checkbox';
import Select from './Select';
import TextInput from './TextInput';

export const SETTINGS_TYPES = {
    CHECKBOX: 'checkbox',
    SELECT: 'select',
    INPUT: 'input',
};

export default function Setting(props) {
    const { setting, handler } = props;
    switch (setting.type) {
        case SETTINGS_TYPES.CHECKBOX: {
            return (
                <Checkbox
                    key={setting.id}
                    {...setting}
                    handler={handler}
                />
            );
        }
        case SETTINGS_TYPES.SELECT: {
            return (
                <Select
                    key={setting.id}
                    {...setting}
                    handler={handler}
                />
            );
        }
        case SETTINGS_TYPES.INPUT: {
            return (
                <TextInput
                    key={setting.id}
                    {...setting}
                    handler={handler}
                />
            );
        }
        default:
            throw new Error(`
                There is no right component for a type: "${setting.type}".
                Available types: ${Object.values(SETTINGS_TYPES).join(', ')}
            `);
    }
}
