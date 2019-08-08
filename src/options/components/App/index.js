import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import ScrollToTop from '../ScrollToTop';
import '../../styles/styles.pcss';

import {
    General, Filters, Whitelist, UserFilter, Miscellaneous, Stealth, About, Footer, Sidebar,
} from '../index';

function App() {
    return (
        <HashRouter hashType="noslash">
            <ScrollToTop>
                <div className="page container">
                    <Sidebar />
                    <div className="content">
                        <Switch>
                            <Route path="/" exact component={General} />
                            <Route path="/filters" component={Filters} />
                            <Route path="/stealth" component={Stealth} />
                            <Route path="/whitelist" component={Whitelist} />
                            <Route path="/user-filter" component={UserFilter} />
                            <Route path="/miscellaneous" component={Miscellaneous} />
                            <Route path="/about" component={About} />
                            <Route component={General} />
                        </Switch>
                    </div>
                </div>
                <Footer />
            </ScrollToTop>
        </HashRouter>
    );
}

export default App;
