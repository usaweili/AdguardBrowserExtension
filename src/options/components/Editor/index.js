import React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import AceEditor from 'react-ace';

import 'brace/ext/searchbox';
import 'brace/theme/textmate';

import './mode-adguard';

import './editor.pcss';

function onChange(newValue) {
    console.log('change', newValue);
}

function Editor() {
    const reactAceComponent = React.createRef();

    function onResize() {
        reactAceComponent.current.editor.resize();
    }

    return (
        <div className="editor">
            <AceEditor
                ref={reactAceComponent}
                width="100%"
                height="100%"
                mode="adguard"
                theme="textmate"
                onChange={onChange}
                name="user-filter"
                showPrintMargin={false}
                editorProps={{ $blockScrolling: true }}
            />
            <ReactResizeDetector handleWidth handleHeight onResize={onResize} />
        </div>
    );
}

export default Editor;
