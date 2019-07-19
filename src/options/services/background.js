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
}

const background = new Background();

export default background;
