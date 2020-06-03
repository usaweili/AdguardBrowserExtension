import React, { Component } from 'react';
import SettingsSection from '../Settings/SettingsSection';
import SettingsSet from '../Settings/SettingsSet';
import Setting from '../Settings/Setting';
import messenger from '../../../../services/messenger';
import log from '../../../../services/log';

const MISCELLANEOUS_META = {
    sets: {
        useOptimizedFilters: {
            id: 'useOptimizedFilters',
            title: 'Use optimized filters',
            description: 'Lists of filters optimized for mobile devices',
            settings: ['useOptimizedFilters'],
        },
        integrationModeCheckbox: {
            id: 'integrationModeCheckbox',
            title: 'Enable integration mode',
            description: 'Learn more about it',
            settings: ['integrationModeCheckbox'],
        },
        enableHitsCount: {
            id: 'enableHitsCount',
            title: 'Send statistics of ad filters usage',
            description: 'Learn more about it',
            settings: ['enableHitsCount'],
        },
        enableShowContextMenu: {
            id: 'enableShowContextMenu',
            title: 'Add AdGuard item to browser\'s context menu',
            settings: ['enableShowContextMenu'],
        },
        showInfoAboutAdguardFullVersion: {
            id: 'showInfoAboutAdguardFullVersion',
            title: 'Show information on the AdGuard full version',
            settings: ['showInfoAboutAdguardFullVersion'],
        },
        showAppUpdatedNotification: {
            id: 'showAppUpdatedNotification',
            title: 'Notify about extension updates',
            settings: ['showAppUpdatedNotification'],
        },
    },
    settings: {
        useOptimizedFilters: {
            id: 'useOptimizedFilters',
            type: 'checkbox',
        },
        integrationModeCheckbox: {
            id: 'integrationModeCheckbox',
            type: 'checkbox',
        },
        enableHitsCount: {
            id: 'enableHitsCount',
            type: 'checkbox',
        },
        enableShowContextMenu: {
            id: 'enableShowContextMenu',
            type: 'checkbox',
        },
        showInfoAboutAdguardFullVersion: {
            id: 'showInfoAboutAdguardFullVersion',
            type: 'checkbox',
        },
        showAppUpdatedNotification: {
            id: 'showAppUpdatedNotification',
            type: 'checkbox',
        },
    },
};

class Miscellaneous extends Component {
    async componentDidMount() {
        let settings;
        const settingsIds = Object.keys(MISCELLANEOUS_META.settings);
        try {
            settings = await messenger.getSettingsByIds(settingsIds);
        } catch (e) {
            log.error(e);
        }
        this.setState({ settings });
    }

    handleSettingChange = async ({ id, data }) => {
        try {
            await messenger.updateSetting(id, data);
            log.info(`Settings ${id} was changed to ${data}`);
        } catch (e) {
            log.error(e);
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
        const settingsMeta = settingsIds
            .map((settingId) => MISCELLANEOUS_META.settings[settingId]);
        const enrichedSettings = settingsMeta
            .map((settingsMetadata) => ({
                ...settingsMetadata,
                ...settingsData[settingsMetadata.id],
            }));

        return enrichedSettings.map((setting) => (
            <Setting key={setting.id} setting={setting} handler={this.handleSettingChange} />
        ));
    };

    renderSets = () => {
        const setsOrder = [
            'useOptimizedFilters',
            'integrationModeCheckbox',
            'enableHitsCount',
            'enableShowContextMenu',
            'showInfoAboutAdguardFullVersion',
            'showAppUpdatedNotification',
        ];
        const sets = setsOrder.map((setId) => MISCELLANEOUS_META.sets[setId]);
        return sets.map((set) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <SettingsSet key={set.id} {...set}>{this.renderSettings(set.settings)}</SettingsSet>
        ));
    };

    handleFilteringLogClick = async () => {
        await messenger.openFilteringLog();
    };

    handleResetStatisticsClick = async () => {
        await messenger.resetStatistics();
    };

    handleOpenChangelog = () => {
        // TODO [maximtop] replace link with tds
        window.open('https://github.com/AdguardTeam/AdguardBrowserExtension/releases', '_blank');
    };

    render() {
        const { settings } = this.state;
        return (
            <>
                <h2 className="title">Miscellaneous</h2>
                {settings
                && (
                    <SettingsSection>
                        {this.renderSets()}
                    </SettingsSection>
                )}
                <button
                    type="button"
                    className="button button--m button--green content__btn"
                    onClick={this.handleFilteringLogClick}
                >
                    Filtering log
                </button>
                <button
                    type="button"
                    className="button button--m button--green-bd content__btn"
                    onClick={this.handleResetStatisticsClick}
                >
                    Reset statistics
                </button>
                <button
                    type="button"
                    className="button button--m button--green-bd content__btn"
                    onClick={this.handleOpenChangelog}
                >
                    Changelog
                </button>
            </>
        );
    }
}

export default Miscellaneous;
