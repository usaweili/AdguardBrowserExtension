import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import SettingsSection from '../Settings/SettingsSection';
import SettingsSet from '../Settings/SettingsSet';
import Setting, { SETTINGS_TYPES } from '../Settings/Setting';
import rootStore from '../../stores';
import log from '../../../../services/log';
import i18n from '../../../../services/i18n';

// TODO move into helpers
const hoursToMs = (hours) => {
    const MS_IN_HOUR = 1000 * 60 * 60;
    return hours * MS_IN_HOUR;
};

const filtersUpdatePeriodOptions = [
    {
        value: -1,
        title: i18n.translate('options_select_update_period_default'),
    },
    {
        value: hoursToMs(48),
        title: i18n.translate('options_select_update_period_48h'),
    },
    {
        value: hoursToMs(24),
        title: i18n.translate('options_select_update_period_24h'),
    },
    {
        value: hoursToMs(12),
        title: i18n.translate('options_select_update_period_12h'),
    },
    {
        value: hoursToMs(6),
        title: i18n.translate('options_select_update_period_6h'),
    },
    {
        value: hoursToMs(1),
        title: i18n.translate('options_select_update_period_1h'),
    },
    {
        value: 0,
        title: i18n.translate('options_select_update_period_disabled'),
    },
];

const getSettingsMap = (settings) => ({
    sections: {
        general: {
            id: 'general',
            title: i18n.translate('context_general_settings'),
            sets: [
                'allowAcceptableAds',
                'safebrowsingEnabled',
                'filtersAutodetect',
                'filtersUpdatePeriod',
            ],
        },
    },
    sets: {
        allowAcceptableAds: {
            id: 'allowAcceptableAds',
            title: i18n.translate('options_allow_acceptable_ads'),
            description: i18n.translate('options_learn_more'), // TODO add link here
            settings: ['allowAcceptableAds'],
        },
        safebrowsingEnabled: {
            id: 'safebrowsingEnabled',
            title: i18n.translate('options_safebrowsing_enabled'),
            description: i18n.translate('options_learn_more'), // TODO add link here
            settings: [settings.names.DISABLE_SAFEBROWSING],
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
    },
    settings: {
        // TODO add special handler
        allowAcceptableAds: {
            id: 'allowAcceptableAds',
            type: SETTINGS_TYPES.CHECKBOX,
        },
        [settings.names.DISABLE_DETECT_FILTERS]: {
            id: settings.names.DISABLE_DETECT_FILTERS,
            type: SETTINGS_TYPES.CHECKBOX,
            inverted: true,
        },
        [settings.names.FILTERS_UPDATE_PERIOD]: {
            id: settings.names.FILTERS_UPDATE_PERIOD,
            type: SETTINGS_TYPES.SELECT,
            options: filtersUpdatePeriodOptions,
        },
        [settings.names.DISABLE_SAFEBROWSING]: {
            id: settings.names.DISABLE_SAFEBROWSING,
            type: SETTINGS_TYPES.CHECKBOX,
            inverted: true,
        },
    },
});

const General = observer(() => {
    const {
        settingsStore,
    } = useContext(rootStore);

    const { settings } = settingsStore;

    if (!settings) {
        return null;
    }

    const settingsMap = getSettingsMap(settings);

    const handleSettingChange = async ({ id, data }) => {
        try {
            await settingsStore.updateSetting(id, data);
        } catch (e) {
            log.error(e);
        }
    };

    const renderSettings = (settingsIds) => {
        const enrichedSettings = settingsIds
            .map((settingId) => settingsMap.settings[settingId])
            .map((settingMeta) => {
                const value = settings.values[settingMeta.id];
                return { ...settingMeta, value };
            });
        return enrichedSettings.map((setting) => (
            <Setting key={setting.id} setting={setting} handler={handleSettingChange} />
        ));
    };

    const renderSets = (setsIds) => setsIds.map((setId) => {
        const set = settingsMap.sets[setId];
        return (
            <SettingsSet key={set.id} title={set.title} description={set.description}>
                {renderSettings(set.settings)}
            </SettingsSet>
        );
    });

    const renderSections = () => {
        const sections = ['general'];
        return sections.map((sectionId) => {
            const section = settingsMap.sections[sectionId];
            return (
                <SettingsSection
                    key={section.id}
                    title={section.title}
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
                {/* TODO translate */}
                Export settings
            </button>
            <button
                type="button"
                className="button button--m button--green-bd content__btn"
                onClick={handleImportSettings}
            >
                {/* TODO translate */}
                Import settings
            </button>
        </>
    );
});

export default General;
