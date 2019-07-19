import React, { Component, Fragment } from 'react';
import background from '../../services/background';
import './about-page.pcss';

export default class About extends Component {
    state = {};

    async componentDidMount() {
        let version;
        try {
            version = await background.getAppVersion();
        } catch (e) {
            console.log(e);
        }
        this.setState(state => ({ ...state, version }));
    }

    render() {
        const { version } = this.state;
        if (!version) {
            return '';
        }
        return (
            <Fragment>
                <h2 className="title">About</h2>
                <div className="about">
                    <div className="logo about__logo" />
                    <div className="about__version">
                        Version
                        {' '}
                        {version}
                    </div>
                    <div className="about__copyright">
                        <div className="about__copyright-item">
                            © 2009-2019 AdGuard Software Ltd.
                        </div>
                        <div className="about__copyright-item">
                            All rights reserved.
                        </div>
                    </div>
                    <div className="about__menu">
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://adguard.com/forward.html?action=eula&amp;from=options_screen&amp;app=browser_extension"
                            className="about__menu-item"
                        >
                            End-User License Agreement
                        </a>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://adguard.com/forward.html?action=privacy&amp;from=options_screen&amp;app=browser_extension"
                            className="about__menu-item"
                        >
                            Privacy Policy
                        </a>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://adguard.com/forward.html?action=acknowledgments&amp;from=options_screen&amp;app=browser_extension"
                            className="about__menu-item"
                        >
                            Acknowledgments
                        </a>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://adguard.com/forward.html?action=github_options&amp;from=options_screen&amp;app=browser_extension"
                            className="about__menu-item"
                        >
                            Github
                        </a>
                    </div>
                </div>
            </Fragment>
        );
    }
}
