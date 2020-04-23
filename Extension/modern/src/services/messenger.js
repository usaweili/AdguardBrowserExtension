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

    // TODO [maximtop] fix methods
    async getAppVersion() {
        const settingsService = await this.getSettingsService();
        return settingsService.appVersion;
    }

    async getSettingsByIds(ids) {
        const settingsService = await this.getSettingsService();
        return settingsService.getSettingsByIds(ids);
    }

    async updateSetting(id, value) {
        const settingsService = await this.getSettingsService();
        return settingsService.updateSetting(id, value);
    }

    async getFiltersData() {
        const settingsService = await this.getSettingsService();
        return settingsService.getFiltersData();
    }

    async getFiltersInfo() {
        const settingsService = await this.getSettingsService();
        return settingsService.getFiltersInfo();
    }

    async updateFilters() {
        const settingsService = await this.getSettingsService();
        return settingsService.updateFilters();
    }

    async updateGroupStatus(id, value) {
        const settingsService = await this.getSettingsService();
        return settingsService.updateGroupStatus(id, value);
    }

    async updateFilterStatus(id, value) {
        const settingsService = await this.getSettingsService();
        return settingsService.updateFilterStatus(id, value);
    }

    async checkCustomUrl(url) {
        const settingsService = await this.getSettingsService();
        return settingsService.checkCustomUrl(url);
    }

    async addCustomFilter(url) {
        const settingsService = await this.getSettingsService();
        return settingsService.addCustomFilter(url);
    }

    async importSettings() {
        const settingsService = await this.getSettingsService();
        return settingsService.importSettings();
    }

    async exportSettings() {
        const settingsService = await this.getSettingsService();
        return settingsService.exportSettings();
    }

    async openFilteringLog() {
        const settingsService = await this.getSettingsService();
        return settingsService.openFilteringLog();
    }

    async resetStatistics() {
        const settingsService = await this.getSettingsService();
        return settingsService.resetStatistics();
    }
}

const background = new Messenger();

export default background;
