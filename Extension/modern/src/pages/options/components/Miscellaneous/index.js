import React, {Fragment, useContext} from 'react';
import {observer} from 'mobx-react';
import SettingsSection from '../Settings/SettingsSection';
import SettingsSet from '../Settings/SettingsSet';
import Setting from '../Settings/Setting';
import messenger from '../../../../services/messenger';
import rootStore from "../../stores";
import log from "../../../../services/log.js";
import i18n from "../../../../services/i18n";

const MISCELLANEOUS_META = {
    sets: {
        useOptimizedFilters: {
            id: 'useOptimizedFilters',
            title: i18n.translate('options_use_optimized_filters'),
            description: i18n.translate('options_use_optimized_filters_desc'),
            settings: ['useOptimizedFilters'],
        },
        integrationModeCheckbox: {
            id: 'integrationModeCheckbox',
            title: i18n.translate('options_disable_integration_mode'),
            description: i18n.translate('options_learn_more'),
            settings: ['integrationModeCheckbox'],
        },
        enableHitsCount: {
            id: 'enableHitsCount',
            title: i18n.translate('options_collect_hit_stats'),
            description: i18n.translate('options_learn_more'),
            settings: ['enableHitsCount'],
        },
        enableShowContextMenu: {
            id: 'enableShowContextMenu',
            title: i18n.translate('options_show_context_menu'),
            settings: ['enableShowContextMenu'],
        },
        showInfoAboutAdguardFullVersion: {
            id: 'showInfoAboutAdguardFullVersion',
            title: i18n.translate('options_show_adguard_full_version'),
            settings: ['showInfoAboutAdguardFullVersion'],
        },
        showAppUpdatedNotification: {
            id: 'showAppUpdatedNotification',
            title: i18n.translate('options_show_app_updated_notification'),
            settings: ['showAppUpdatedNotification'],
        },
    },
    settings: {
        useOptimizedFilters: {
            id: 'use-optimized-filters',
            type: 'checkbox',
            inverted: false,
        },
        integrationModeCheckbox: {
            id: 'integration-mode-disabled',
            type: 'checkbox',
            inverted: true
        },
        enableHitsCount: {
            id: 'hits-count-disabled',
            type: 'checkbox',
            inverted: true
        },
        enableShowContextMenu: {
            id: 'context-menu-disabled',
            type: 'checkbox',
            inverted: true
        },
        showInfoAboutAdguardFullVersion: {
            id: 'show-info-about-adguard-disabled',
            type: 'checkbox',
            inverted: true
        },
        showAppUpdatedNotification: {
            id: 'show-app-updated-disabled',
            type: 'checkbox',
            inverted: true
        },
    },
};


const Miscellaneous = observer(() => {
    const {settingsStore} = useContext(rootStore);
    const {settings} = settingsStore;

    if (!settings) {
        return null;
    }

    const settingChangeHandler = async ({id, data}) => {
        log.info(`Setting ${id} set to ${data}`);
        await settingsStore.updateSetting(id, data);
    };

    const renderSettings = (settingsIds) => {
        const settingsMeta = settingsIds.map(settingId => MISCELLANEOUS_META.settings[settingId]);
        const enrichedSettings = settingsMeta.map(settingMeta => {
            const settingData = settings.values[settingMeta.id];
            return {
                ...settingMeta,
                value: settingData
            };
        });

        return enrichedSettings.map(setting => (
            <Setting
                key={setting.id}
                id={setting.id}
                type={setting.type}
                value={setting.value}
                inverted={setting.inverted}
                handler={settingChangeHandler}
            />
        ));
    };

    const renderSets = () => {
        const setsOrder = [
            'useOptimizedFilters',
            'integrationModeCheckbox',
            'enableHitsCount',
            'enableShowContextMenu',
            'showInfoAboutAdguardFullVersion',
            'showAppUpdatedNotification',
        ];
        const sets = setsOrder.map(setId => MISCELLANEOUS_META.sets[setId]);
        return sets.map(set => {
            const inverted = MISCELLANEOUS_META.settings[set.id].inverted;
            const disabled = !settings.values[MISCELLANEOUS_META.settings[set.id].id];
            return (
                <SettingsSet
                    key={set.id}
                    {...set}
                    disabled={inverted ? !disabled : disabled}
                >
                    {renderSettings(set.settings)}
                </SettingsSet>
        )});
    };

    const handleFilteringLogClick = async () => {
        await messenger.openFilteringLog();
    };

    const handleResetStatisticsClick = async () => {
        await messenger.resetStatistics();
    };

    const handleOpenChangelog = () => {
        // TODO [maximtop] replace link with tds
        window.open('https://github.com/AdguardTeam/AdguardBrowserExtension/releases', '_blank');
    };

    return (
        <Fragment>
            <h2 className="title">Miscellaneous</h2>
            {settings
            && (
                <SettingsSection>
                    {renderSets()}
                </SettingsSection>
            )}
            <button
                type="button"
                className="button button--m button--green content__btn"
                onClick={handleFilteringLogClick}
            >
                Filtering log
            </button>
            <button
                type="button"
                className="button button--m button--green-bd content__btn"
                onClick={handleResetStatisticsClick}
            >
                Reset statistics
            </button>
            <button
                type="button"
                className="button button--m button--green-bd content__btn"
                onClick={handleOpenChangelog}
            >
                Changelog
            </button>
        </Fragment>
    );
});

export default Miscellaneous;
