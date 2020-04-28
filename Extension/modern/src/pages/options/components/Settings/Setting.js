import React from 'react';
import Checkbox from './Checkbox';
import Select from './Select';
import TextInput from './TextInput';

export default function Setting(props) {
    const { setting, handler } = props;
    switch (setting.type) {
        case 'checkbox': {
            return (
                <Checkbox
                    key={setting.id}
                    {...setting}
                    handler={handler}
                />
            );
        }
        case 'select': {
            return (
                <Select
                    key={setting.id}
                    {...setting}
                    handler={handler}
                />
            );
        }
        case 'input': {
            return (
                <TextInput
                    key={setting.id}
                    {...setting}
                    handler={handler}
                />
            );
        }
        default:
            throw new Error(`There is no right component for a type: "${setting.type}". Available types: ["checkbox", "select", "input"]`);
    }
}
