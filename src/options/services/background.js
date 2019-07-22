import browser from 'webextension-polyfill';

class Background {
    constructor() {
        this.backPage = null;
        this.settingsService = null;
    }

    async getBackPage() {
        if (!this.backPage) {
            try {
                this.backPage = await browser.runtime.getBackgroundPage();
            } catch (e) {
                console.log(e.message);
            }
        }
        return Promise.resolve(this.backPage);
    }

    async getSettingsService() {
        if (!this.settingsService) {
            try {
                await this.getBackPage();
                this.settingsService = this.backPage.settingsService;
            } catch (e) {
                console.log(e.message);
            }
        }
        return Promise.resolve(this.settingsService);
    }

    // TODO [maximtop] think may be there are possibilities to reduce duplication
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
        const settingsService = await this.resetStatistics();
        return settingsService.resetStatistics();
    }
}

const background = new Background();

export default background;
