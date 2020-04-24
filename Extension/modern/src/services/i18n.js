import browser from 'webextension-polyfill';

const translate = (key) => {
    return browser.i18n.getMessage(key);
};

const i18n = {
    translate,
};

export default i18n;
