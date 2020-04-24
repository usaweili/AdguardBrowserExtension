import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import App from './components/App';

ReactDOM.render(
    <Provider>
        <App />
    </Provider>,
    document.getElementById('root')
);
