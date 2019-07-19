import React, { Component, Fragment } from 'react';
import SettingsSection from '../Settings/SettingsSection';
import SettingsSet from '../Settings/SettingsSet';
import Setting from '../Settings/Setting';
import background from '../../services/background';

const STEALTH_META = {
    sections: {
        stealthModeSection: {
            id: 'stealthModeSection',
            sets: ['stealthMode'],
        },
        cookiesSection: {
            id: 'cookiesSection',
            title: 'Cookies',
            sets: ['thirdPartyCookies', 'firstPartyCookies'],
        },
        miscellaneousSection: {
            id: 'miscellaneousSection',
            title: 'Miscellaneous',
            sets: [
                'hideReferrer',
                'hideSearchQueries',
                'sendNotTrack',
                'removeClientData',
                'blockWebrtc',
                'stripTrackingParams',
            ],
        },
    },
    sets: {
        stealthMode: {
            id: 'stealthMode',
            title: 'Stealth Mode',
            description: 'Protect your identity and sensitive personal infor…rs by blocking the most popular tracking methods.',
            settings: ['stealthMode'],
        },
        thirdPartyCookies: {
            id: 'thirdPartyCookies',
            title: 'Self-destructing third-party cookies',
            description: 'Limit the lifetime of third-party cookies (minutes)',
            settings: ['thirdPartyCookies', 'thirdPartyTime'],
        },
        firstPartyCookies: {
            id: 'firstPartyCookies',
            title: 'Self-destructing first-party cookies (not recommended)',
            description: 'Limit the lifetime of first-party cookies (minutes)',
            settings: ['firstPartyCookies', 'firstPartyTime'],
        },
        hideReferrer: {
            id: 'hideReferrer',
            title: 'Hide Referrer from third-parties',
            description: 'Prevent third-parties from knowing what website you are visiting',
            settings: ['hideReferrer'],
        },
        hideSearchQueries: {
            id: 'hideSearchQueries',
            title: 'Hide your search queries',
            description: 'Hide the queries for websites visited from a search engine',
            settings: ['hideSearchQueries'],
        },
        sendNotTrack: {
            id: 'sendNotTrack',
            title: 'Send Do-Not-Track header',
            description: 'Prevent websites from tracking you',
            settings: ['sendNotTrack'],
        },
        removeClientData: {
            id: 'removeClientData',
            title: 'Remove X-Client-Data header',
            description: 'Block Google Chrome from sending its version and modifications information to Google domains',
            settings: ['removeClientData'],
        },
        blockWebrtc: {
            id: 'blockWebrtc',
            title: 'Block WebRTC',
            description: 'Prevent a possible disclosure of your real IP address even with proxy or VPN through WebRTC',
            settings: ['blockWebrtc'],
        },
        stripTrackingParams: {
            id: 'stripTrackingParams',
            title: 'Remove tracking parameters',
            description: 'Comma-separated list of tracking parameters which AdGuard will remove from pages addresses.',
            settings: ['stripTrackingParams'],
        },
    },
    settings: {
        stealthMode: { id: 'stealthMode', type: 'checkbox' },
        thirdPartyCookies: { id: 'thirdPartyCookies', type: 'checkbox' },
        thirdPartyTime: { id: 'thirdPartyTime', type: 'input' },
        firstPartyCookies: { id: 'firstPartyCookies', type: 'checkbox' },
        firstPartyTime: { id: 'firstPartyTime', type: 'input' },
        hideReferrer: { id: 'hideReferrer', type: 'checkbox' },
        hideSearchQueries: { id: 'hideSearchQueries', type: 'checkbox' },
        sendNotTrack: { id: 'sendNotTrack', type: 'checkbox' },
        removeClientData: { id: 'removeClientData', type: 'checkbox' },
        blockWebrtc: { id: 'blockWebrtc', type: 'checkbox' },
        stripTrackingParams: { id: 'stripTrackingParams', type: 'checkbox' },
    },
};

class Stealth extends Component {
    state = {};

    async componentDidMount() {
        let settings;
        const requiredSettingsIds = Object.keys(STEALTH_META.settings);

        try {
            settings = await background.getSettingsByIds(requiredSettingsIds);
        } catch (e) {
            console.log(e);
        }
        this.setState({ settings });
    }

    // TODO [maximtop] throttle input
    handleSettingChange = async ({ id, data }) => {
        try {
            await background.updateSetting(id, data);
            console.log(`Settings ${id} was changed to ${data}`);
        } catch (e) {
            console.log(e);
            return;
        }
        this.setState((state) => {
            const { settings } = state;
            const setting = settings[id];
            const updatedSetting = { ...setting, value: data };
            return {
                ...state,
                settings: { ...settings, [id]: updatedSetting },
            };
        });
    };

    renderSettings = (settingsIds) => {
        const settingsData = this.state.settings;
        const settingsMeta = settingsIds.map(settingId => STEALTH_META.settings[settingId]);
        const enrichedSettings = settingsMeta.map((settingMeta) => {
            const settingData = settingsData[settingMeta.id];
            return { ...settingMeta, ...settingData };
        });
        return enrichedSettings.map(setting => (
            <Setting key={setting.id} setting={setting} handler={this.handleSettingChange} />
        ));
    };

    renderSets = (setsIds) => {
        const sets = setsIds.map(setId => STEALTH_META.sets[setId]);
        return sets.map(set => (
            <SettingsSet key={set.id} {...set}>
                {this.renderSettings(set.settings)}
            </SettingsSet>
        ));
    };

    renderSections = () => {
        const sectionsOrder = ['stealthModeSection', 'cookiesSection', 'miscellaneousSection'];
        return sectionsOrder.map((sectionId) => {
            const section = STEALTH_META.sections[sectionId];
            return (
                <SettingsSection
                    key={section.id}
                    title={section.title}
                >
                    {this.renderSets(section.sets)}
                </SettingsSection>
            );
        });
    };

    render() {
        const { settings } = this.state;
        return (
            <Fragment>
                <h2 className="title">Stealth Mode</h2>
                {settings
                && this.renderSections()}
            </Fragment>
        );
    }
}

export default Stealth;
