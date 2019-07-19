import React, { Fragment } from 'react';
import Editor from '../Editor';

function UserFilter() {
    return (
        <Fragment>
            <h2 className="title">UserFilter</h2>
            <Editor />
            <div className="actions">
                <button type="button" className="button button--m button--green actions__btn">
                    Import
                </button>
                <button type="button" className="button button--m button--green-bd actions__btn">
                    Export
                </button>
            </div>
        </Fragment>
    );
}

export default UserFilter;
