import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import SettingsSection from '../Settings/SettingsSection';
import SettingsSet from '../Settings/SettingsSet';
import Setting from '../Settings/Setting';
import rootStore from '../../stores';
import log from '../../../../services/log';
import i18n from '../../../../services/i18n';

// TODO here should be an default option also
const filtersUpdatePeriodOptions = [48, 24, 12, 6, 1, 0, -1].map((hours) => {
    const MS_IN_HOUR = 1000 * 60 * 60;
    let optionTitle;
    // TODO translate options
    if (hours > 1) {
        optionTitle = `${hours} hours`;
    } else if (hours === 1) {
        optionTitle = `${hours} hour`;
    } else if (hours === 0) {
        optionTitle = 'Disabled';
    } else if (hours === -1) {
        optionTitle = 'Default';
    }
    return {
        value: hours * MS_IN_HOUR,
        title: optionTitle,
    };
});

const General = observer(() => {
    const {
        settingsStore,
    } = useContext(rootStore);

    const { settings } = settingsStore;

    if (!settings) {
        return null;
    }

    console.log(settings.names);

    const GENERAL_SETTINGS = {
        sections: {
            general: {
                id: 'general',
                title: i18n.translate('context_general_settings'),
                sets: ['allowAcceptableAds', 'showPageStatistic', 'filtersAutodetect', 'filtersUpdatePeriod'],
            },
            browsingSecurity: {
                id: 'browsingSecurity',
                title: i18n.translate('context_safebrowsing'),
                sets: ['safebrowsingEnabled', 'sendSafebrowsingStats'],
            },
        },
        sets: {
            allowAcceptableAds: {
                id: 'allowAcceptableAds',
                title: i18n.translate('options_allow_acceptable_ads'),
                description: i18n.translate('options_learn_more'), // TODO add link here
                settings: ['allowAcceptableAds'],
            },
            showPageStatistic: {
                id: 'showPageStatistic',
                title: i18n.translate('options_show_blocked_ads_count'),
                settings: [settings.names.DISABLE_SHOW_PAGE_STATS],
            },
            filtersAutodetect: {
                id: 'filtersAutodetect',
                title: i18n.translate('options_enable_autodetect_filter'),
                settings: [settings.names.DISABLE_DETECT_FILTERS],
            },
            filtersUpdatePeriod: {
                id: 'filtersUpdatePeriod',
                title: i18n.translate('options_set_update_interval'),
                settings: [settings.names.FILTERS_UPDATE_PERIOD],
            },
            safebrowsingEnabled: {
                id: 'safebrowsingEnabled',
                title: i18n.translate('options_safebrowsing_enabled'),
                description: i18n.translate('options_learn_more'), // TODO add link here
                settings: [settings.names.DISABLE_SAFEBROWSING],
            },
            sendSafebrowsingStats: {
                id: 'sendSafebrowsingStats',
                title: i18n.translate('options_safebrowsing_help'),
                description: i18n.translate('options_safebrowsing_help_desc'),
                settings: [settings.names.DISABLE_SEND_SAFEBROWSING_STATS],
            },
        },
        settings: {
            allowAcceptableAds: {
                id: 'allowAcceptableAds',
                type: 'checkbox',
            },
            [settings.names.DISABLE_SHOW_PAGE_STATS]: {
                id: settings.names.DISABLE_SHOW_PAGE_STATS,
                type: 'checkbox',
            },
            [settings.names.DISABLE_DETECT_FILTERS]: {
                id: settings.names.DISABLE_DETECT_FILTERS,
                type: 'checkbox',
            },
            [settings.names.FILTERS_UPDATE_PERIOD]: {
                id: settings.names.FILTERS_UPDATE_PERIOD,
                type: 'select',
                options: filtersUpdatePeriodOptions,
            },
            [settings.names.DISABLE_SAFEBROWSING]: {
                id: settings.names.DISABLE_SAFEBROWSING,
                type: 'checkbox',
            },
            [settings.names.DISABLE_SEND_SAFEBROWSING_STATS]: {
                id: settings.names.DISABLE_SEND_SAFEBROWSING_STATS,
                type: 'checkbox',
            },
        },
    };

    const handleSettingChange = async ({ id, data }) => {
        try {
            await settingsStore.updateSetting(id, data);
        } catch (e) {
            log.error(e);
        }
    };

    const renderSettings = (settingsIds) => {
        const enrichedSettings = settingsIds
            .map((settingId) => GENERAL_SETTINGS.settings[settingId])
            .map((settingMeta) => {
                const value = settings.values[settingMeta.id];
                return { ...settingMeta, value };
            });
        console.log(enrichedSettings);
        return enrichedSettings.map((setting) => (
            <Setting key={setting.id} setting={setting} handler={handleSettingChange} />
        ));
    };

    const renderSets = (setsIds) => setsIds.map((setId) => {
        const set = GENERAL_SETTINGS.sets[setId];
        return (
            <SettingsSet key={set.id} {...set}>
                {renderSettings(set.settings)}
            </SettingsSet>
        );
    });

    const renderSections = () => {
        const sections = ['general', 'browsingSecurity'];
        return sections.map((sectionId) => {
            const section = GENERAL_SETTINGS.sections[sectionId];
            return (
                <SettingsSection
                    key={section.id}
                    {...section}
                >
                    {renderSets(section.sets)}
                </SettingsSection>
            );
        });
    };

    const handleImportSettings = async () => {
        // TODO
    };

    const handleExportSettings = async () => {
        // TODO
    };

    return (
        <>
            <h2 className="title">Settings</h2>
            {settings
                && renderSections()}
            <button
                type="button"
                className="button button--m button--green content__btn"
                onClick={handleExportSettings}
            >
                Export settings
            </button>
            <button
                type="button"
                className="button button--m button--green-bd content__btn"
                onClick={handleImportSettings}
            >
                Import settings
            </button>
        </>
    );
});

export default General;
