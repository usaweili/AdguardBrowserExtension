import browser from 'webextension-polyfill';
import log from './log';

class Messenger {
    async sendMessage(type, data) {
        log.debug(`Request type: "${type}"`);
        if (data) {
            log.debug('Request data:', data);
        }

        const response = await browser.runtime.sendMessage({ type, data });

        if (response) {
            log.debug(`Response type: "${type}"`);
            log.debug('Response data:', response);
        }

        return response;
    }

    async getOptionsData() {
        return this.sendMessage('getOptionsData');
    }
}

const messenger = new Messenger();

export default messenger;
