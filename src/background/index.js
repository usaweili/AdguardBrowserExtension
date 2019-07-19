import { getFiltersMeta } from './filters';

let SETTINGS = {
    allowAcceptableAds: { id: 'allowAcceptableAds', value: true },
    showPageStatistic: { id: 'showPageStatistic', value: true },
    filtersAutodetect: { id: 'filtersAutodetect', value: true },
    filtersUpdatePeriod: { id: 'filtersUpdatePeriod', value: 3600 },
    safebrowsingEnabled: { id: 'safebrowsingEnabled', value: true },
    sendSafebrowsingStats: { id: 'sendSafebrowsingStats', value: true },
    useOptimizedFilters: { id: 'useOptimizedFilters', value: false },
    integrationModeCheckbox: { id: 'integrationModeCheckbox', value: true },
    enableHitsCount: { id: 'enableHitsCount', value: false },
    enableShowContextMenu: { id: 'enableShowContextMenu', value: true },
    showInfoAboutAdguardFullVersion: { id: 'showInfoAboutAdguardFullVersion', value: true },
    showAppUpdatedNotification: { id: 'showAppUpdatedNotification', value: true },
    stealthMode: { id: 'stealthMode', value: false },
    thirdPartyCookies: { id: 'thirdPartyCookies', value: true },
    thirdPartyTime: { id: 'thirdPartyTime', value: 2880 },
    firstPartyCookies: { id: 'firstPartyCookies', value: false },
    firstPartyTime: { id: 'firstPartyTime', value: 4320 },
    hideReferrer: { id: 'hideReferrer', value: true },
    hideSearchQueries: { id: 'hideSearchQueries', value: true },
    sendNotTrack: { id: 'sendNotTrack', value: true },
    removeClientData: { id: 'removeClientData', value: true },
    blockWebrtc: { id: 'blockWebrtc', value: false },
    stripTrackingParams: { id: 'stripTrackingParams', value: true },
    invertWhitelist: { id: 'invertWhitelist', value: false },
};

global.settingsService = (async function settingsService() {
    const FILTERS_DATA = await getFiltersMeta();
    const APP_VERSION = '3.2.2';

    const getSettingsByIds = ids => ids.reduce((acc, id) => ({ ...acc, [id]: SETTINGS[id] }), {});

    const updateSetting = async (id, value) => {
        const setting = SETTINGS[id];
        if (!setting) {
            throw new Error(`there is no such setting ${id}`);
        }
        const updatedSetting = { ...setting, value };
        SETTINGS = { ...SETTINGS, [setting.id]: updatedSetting };
        console.log(`Setting ${id} was set to ${value}`);
        return true;
    };

    const updateGroupStatus = (id, value) => {
        const group = FILTERS_DATA.groups[id];
        if (!group) {
            throw new Error(`There is no group with id: ${id}`);
        }
        FILTERS_DATA.groups[id] = { ...group, enabled: value };
        console.log(`Group with id: "${id}" enabled property was set to: ${value}`);
        return true;
    };

    const updateFilterStatus = (id, value) => {
        const filter = FILTERS_DATA.filters[id];
        if (!filter) {
            throw new Error(`There is no filter with id: ${id}`);
        }
        FILTERS_DATA.filters[id] = { ...filter, enabled: value };
        console.log(`Filter with id: "${id}" enabled property was set to: ${value}`);
        return true;
    };

    const checkCustomUrl = (url) => {
        if (url.match('error')) {
            throw new Error('Url is not correct');
        }
        return ({
            title: 'AdGuard Base filter',
            description: 'EasyList + AdGuard English filter. This filter is necessary for quality ad blocking.',
            version: '2.0.64.6',
            rulesCount: '95007',
            homepage: 'http://adguard.com/filters.html#english',
            url: 'https://filters.adtidy.org/extension/chromium/filters/2.txt',
        });
    };

    const addCustomFilter = (filterToAdd) => {
        // TODO implement filter add
        console.log(filterToAdd);
    };

    const getFiltersData = () => FILTERS_DATA;

    return {
        appVersion: APP_VERSION,
        getSettingsByIds,
        updateSetting,
        getFiltersData,
        updateGroupStatus,
        updateFilterStatus,
        checkCustomUrl,
        addCustomFilter,
    };
}());
