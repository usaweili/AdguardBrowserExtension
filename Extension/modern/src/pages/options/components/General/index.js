import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import SettingsSection from '../Settings/SettingsSection';
import SettingsSet from '../Settings/SettingsSet';
import Setting from '../Settings/Setting';
import rootStore from '../../stores';
import log from '../../../../services/log';
import i18n from '../../../../services/i18n';

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
            settings: ['showPageStatistic'],
        },
        filtersAutodetect: {
            id: 'filtersAutodetect',
            title: i18n.translate('options_enable_autodetect_filter'),
            settings: ['filtersAutodetect'],
        },
        filtersUpdatePeriod: {
            id: 'filtersUpdatePeriod',
            title: i18n.translate('options_set_update_interval'),
            settings: ['filtersUpdatePeriod'],
        },
        safebrowsingEnabled: {
            id: 'safebrowsingEnabled',
            title: i18n.translate('options_safebrowsing_enabled'),
            description: i18n.translate('options_learn_more'), // TODO add link here
            settings: ['safebrowsingEnabled'],
        },
        sendSafebrowsingStats: {
            id: 'sendSafebrowsingStats',
            title: i18n.translate('options_safebrowsing_help'),
            description: i18n.translate('options_safebrowsing_help_desc'),
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

const General = observer(() => {
    const {
        settingsStore,
    } = useContext(rootStore);

    const { settings } = settingsStore;

    const handleSettingChange = async ({ id, data }) => {
        try {
            await settingsStore.updateSetting(id, data);
        } catch (e) {
            log.error(e);
        }
    };

    const renderSettings = (settingsIds) => {
        const settingsData = settings;
        const settingsMeta = settingsIds.map((settingId) => GENERAL_SETTINGS.settings[settingId]);
        const enrichedSettings = settingsMeta.map((settingMeta) => {
            const settingData = settingsData[settingMeta.id];
            return { ...settingMeta, ...settingData };
        });
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
