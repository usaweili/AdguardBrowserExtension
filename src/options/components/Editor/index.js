import React from 'react';
import AceEditor from 'react-ace';

import 'brace/ext/searchbox';
import 'brace/theme/textmate';

import './mode-adguard';

function onChange(newValue) {
    console.log('change', newValue);
}

function Editor() {
    return (
        <AceEditor
            mode="adguard"
            theme="textmate"
            onChange={onChange}
            name="user-filter"
            editorProps={{ $blockScrolling: true }}
        />
    );
}

export default Editor;
