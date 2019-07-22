import React, { Fragment, Component } from 'react';
import SettingsSection from '../Settings/SettingsSection';
import SettingsSet from '../Settings/SettingsSet';
import Setting from '../Settings/Setting';
import background from '../../services/background';

const filtersUpdatePeriodOptions = [48, 24, 12, 6, 1, 0].map((hours) => {
    const MS_IN_HOUR = 1000 * 60 * 60;
    let optionTitle;
    if (hours > 1) {
        optionTitle = `${hours} hours`;
    } else if (hours === 1) {
        optionTitle = `${hours} hour`;
    } else if (hours === 0) {
        optionTitle = 'Disabled';
    }
    return {
        value: hours * MS_IN_HOUR,
        title: optionTitle,
    };
});

const GENERAL_SETTINGS = {
    sections: {
        general: {
            id: 'general',
            title: 'General',
            sets: ['allowAcceptableAds', 'showPageStatistic', 'filtersAutodetect', 'filtersUpdatePeriod'],
        },
        browsingSecurity: {
            id: 'browsingSecurity',
            title: 'Browsing security',
            sets: ['safebrowsingEnabled', 'sendSafebrowsingStats'],
        },
    },
    sets: {
        allowAcceptableAds: {
            id: 'allowAcceptableAds',
            title: 'Allow search ads and the self-promotion of websites',
            description: 'Learn more about it',
            settings: ['allowAcceptableAds'],
        },
        showPageStatistic: {
            id: 'showPageStatistic',
            title: 'Indicate the number of blocked ads on the AdGuard extension icon',
            settings: ['showPageStatistic'],
        },
        filtersAutodetect: {
            id: 'filtersAutodetect',
            title: 'Activate the most appropriate filters automatically',
            settings: ['filtersAutodetect'],
        },
        filtersUpdatePeriod: {
            id: 'filtersUpdatePeriod',
            title: 'Filters update interval',
            settings: ['filtersUpdatePeriod'],
        },
        safebrowsingEnabled: {
            id: 'safebrowsingEnabled',
            title: 'Phishing and malware protection',
            description: 'Learn more about it',
            settings: ['safebrowsingEnabled'],
        },
        sendSafebrowsingStats: {
            id: 'sendSafebrowsingStats',
            title: 'Help us develop Browsing security filters',
            description: 'Submit anonymous security-related information',
            settings: ['sendSafebrowsingStats'],
        },
    },
    settings: {
        allowAcceptableAds: {
            id: 'allowAcceptableAds',
            type: 'checkbox',
        },
        showPageStatistic: {
            id: 'showPageStatistic',
            type: 'checkbox',
        },
        filtersAutodetect: {
            id: 'filtersAutodetect',
            type: 'checkbox',
        },
        filtersUpdatePeriod: {
            id: 'filtersUpdatePeriod',
            type: 'select',
            options: filtersUpdatePeriodOptions,
        },
        safebrowsingEnabled: {
            id: 'safebrowsingEnabled',
            type: 'checkbox',
        },
        sendSafebrowsingStats: {
            id: 'sendSafebrowsingStats',
            type: 'checkbox',
        },
    },
};

class General extends Component {
    state = {};

    async componentDidMount() {
        this._isMounted = true;
        let settings;
        const requiredSettingsIds = Object.keys(GENERAL_SETTINGS.settings);
        try {
            settings = await background.getSettingsByIds(requiredSettingsIds);
        } catch (e) {
            console.log(e);
        }
        if (!this._isMounted) {
            return;
        }
        this.setState({ settings });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleSettingChange = async ({ id, data }) => {
        try {
            await background.updateSetting(id, data);
            console.log(`Settings ${id} was changed to ${data}`);
        } catch (e) {
            console.log(e);
            // TODO handle errors;
            return;
        }
        this.setState((state) => {
            const { settings } = state;
            const setting = settings[id];
            const updatedSetting = {
                ...setting,
                value: data,
            };
            return {
                ...state,
                settings: {
                    ...settings,
                    [id]: updatedSetting,
                },
            };
        });
    };

    renderSettings = (settingsIds) => {
        const settingsData = this.state.settings;
        const settingsMeta = settingsIds.map(settingId => GENERAL_SETTINGS.settings[settingId]);
        const enrichedSettings = settingsMeta.map((settingMeta) => {
            const settingData = settingsData[settingMeta.id];
            return { ...settingMeta, ...settingData };
        });
        return enrichedSettings.map(setting => (
            <Setting key={setting.id} setting={setting} handler={this.handleSettingChange}/>
        ));
    };

    renderSets = setsIds => setsIds.map((setId) => {
        const set = GENERAL_SETTINGS.sets[setId];
        return (
            <SettingsSet key={set.id} {...set}>
                {this.renderSettings(set.settings)}
            </SettingsSet>
        );
    });

    renderSections = () => {
        const sectionsOrder = ['general', 'browsingSecurity'];
        return sectionsOrder.map((sectionId) => {
            const section = GENERAL_SETTINGS.sections[sectionId];
            return (
                <SettingsSection
                    key={section.id}
                    {...section}
                >
                    {this.renderSets(section.sets)}
                </SettingsSection>
            );
        });
    };

    handleImportSettings = async () => {
        let result;
        try {
            result = await background.importSettings();
        } catch (e) {
            // TODO show flash notification
            console.log(e);
        }

        if (!result) {
            console.log('was unable to import settings');
            return;
        }

        let settings;
        const requiredSettingsIds = Object.keys(GENERAL_SETTINGS.settings);
        try {
            settings = await background.getSettingsByIds(requiredSettingsIds);
        } catch (e) {
            console.log(e);
        }
        this.setState(settings);
    };

    handleExportSettings = async () => {
        let result;
        try {
            result = await background.exportSettings();
        } catch (e) {
            console.log(e);
        }
        if (result) {
            console.log('settings exported successfully');
        } else {
            console.log('was unable to export settings');
        }
    };

    render() {
        const { settings } = this.state;
        return (
            <Fragment>
                <h2 className="title">Settings</h2>
                {settings
                && this.renderSections()}
                <button
                    type="button"
                    className="button button--m button--green content__btn"
                    onClick={this.handleExportSettings}
                >
                    Export settings
                </button>
                <button
                    type="button"
                    className="button button--m button--green-bd content__btn"
                    onClick={this.handleImportSettings}
                >
                    Import settings
                </button>
            </Fragment>
        );
    }
}

export default General;
