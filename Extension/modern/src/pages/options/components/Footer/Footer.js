import React from 'react';
import './footer.pcss';

const Footer = () => (
    <div className="footer">
        <div className="footer__rate">
            <div className="footer__in container">
                <div className="footer__rate-desc">
                    Do you like Adguard?
                </div>
                <button type="button" className="button button--rate">
                    Rate it
                </button>
            </div>
        </div>
        <div className="footer__nav">
            <div className="footer__in container">
                <div className="footer__copyright">
                    <div className="footer__logo" />
                    <div className="footer__copyright-label">
                        &copy; Adguard, 2009-2019
                    </div>
                </div>
                <div className="footer__nav-in">
                    <a href="https://adguard.com/forward.html?action=adguard_site&from=options_screen_footer&app=browser_extension" className="footer__nav-item">
                        Official Website
                    </a>
                    <a href="https://adguard.com/forward.html?action=discuss&from=options_screen&app=browser_extension" className="footer__nav-item">
                        Discuss AdGuard
                    </a>
                    <a href="https://adguard.com/forward.html?action=github_options&from=options_screen&app=browser_extension" className="footer__nav-item">
                        Github
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default Footer;
