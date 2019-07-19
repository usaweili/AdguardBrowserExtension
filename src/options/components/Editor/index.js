import React from 'react';
import AceEditor from 'react-ace';

import 'brace/ext/searchbox';
import 'brace/theme/textmate';

import './mode-adguard';

import './editor.pcss';

function onChange(newValue) {
    console.log('change', newValue);
}

function Editor() {
    return (
        <div className="editor">
            <AceEditor
                mode="adguard"
                theme="textmate"
                onChange={onChange}
                name="user-filter"
                editorProps={{ $blockScrolling: true }}
            />
        </div>
    );
}

export default Editor;
