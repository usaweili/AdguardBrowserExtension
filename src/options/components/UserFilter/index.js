import React, { Fragment } from 'react';
import Editor from '../Editor';

function UserFilter() {
    return (
        <Fragment>
            <h2 className="title">UserFilter</h2>
            <div className="editor">
                <Editor />
            </div>
            <button type="button">Import</button>
            <button type="button">Export</button>
        </Fragment>
    );
}

export default UserFilter;
