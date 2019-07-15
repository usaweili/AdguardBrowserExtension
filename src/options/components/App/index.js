import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import '../../styles/styles.pcss';

import {
    General, Filters, Whitelist, UserFilter, Miscellaneous, Stealth, About, Footer, Sidebar,
} from '../index';

function App() {
    return (
        <HashRouter hashType="noslash">
            <div className="page container">
                <Sidebar />
                <div className="content">
                    <Route path="/" exact component={General} />
                    <Route path="/filters" component={Filters} />
                    <Route path="/stealth" component={Stealth} />
                    <Route path="/whitelist" component={Whitelist} />
                    <Route path="/user-filter" component={UserFilter} />
                    <Route path="/miscellaneous" component={Miscellaneous} />
                    <Route path="/about" component={About} />
                </div>
            </div>
            <Footer />
        </HashRouter>
    );
}

export default App;
