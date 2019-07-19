import React, { Fragment, Component } from 'react';
import SettingsSection from '../Settings/SettingsSection';
import SettingsSet from '../Settings/SettingsSet';
import Setting from '../Settings/Setting';
import background from '../../services/background';

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
            title: "Add AdGuard item to browser's context menu",
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
        useOptimizedFilters: { id: 'useOptimizedFilters', type: 'checkbox' },
        integrationModeCheckbox: { id: 'integrationModeCheckbox', type: 'checkbox' },
        enableHitsCount: { id: 'enableHitsCount', type: 'checkbox' },
        enableShowContextMenu: { id: 'enableShowContextMenu', type: 'checkbox' },
        showInfoAboutAdguardFullVersion: { id: 'showInfoAboutAdguardFullVersion', type: 'checkbox' },
        showAppUpdatedNotification: { id: 'showAppUpdatedNotification', type: 'checkbox' },
    },
};

class Miscellaneous extends Component {
    state = {};

    async componentDidMount() {
        let settings;
        const settingsIds = Object.keys(MISCELLANEOUS_META.settings);
        try {
            settings = await background.getSettingsByIds(settingsIds);
        } catch (e) {
            console.log(e);
        }
        this.setState({ settings });
    }

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
        const settingsMeta = settingsIds
            .map(settingId => MISCELLANEOUS_META.settings[settingId]);
        const enrichedSettings = settingsMeta
            .map(settingsMetadata => ({
                ...settingsMetadata,
                ...settingsData[settingsMetadata.id],
            }));

        return enrichedSettings.map(setting => (
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
        const sets = setsOrder.map(setId => MISCELLANEOUS_META.sets[setId]);
        return sets.map(set => (
            <SettingsSet key={set.id} {...set}>{this.renderSettings(set.settings)}</SettingsSet>
        ));
    };

    render() {
        const { settings } = this.state;
        return (
            <Fragment>
                <h2 className="title">Miscellaneous</h2>
                {settings
                && (
                <SettingsSection>
                    {this.renderSets()}
                </SettingsSection>
                )}
                <button type="button" className="button button--m button--green content__btn">Filtering log</button>
                <button type="button" className="button button--m button--green-bd content__btn">Reset statistics</button>
                <button type="button" className="button button--m button--green-bd content__btn">Changelog</button>
            </Fragment>
        );
    }
}

export default Miscellaneous;
