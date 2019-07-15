import React, { Fragment } from 'react';
import browser from 'webextension-polyfill';

const optionsUrl = browser.extension.getURL('options.html');

function App() {
    return (
        <Fragment>
            <h1>React popup</h1>
            <h2>
                <a href={optionsUrl} target="_blank" rel="noopener noreferrer">Options page</a>
            </h2>
        </Fragment>
    );
}

export default App;
