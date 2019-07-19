import React, { Component, Fragment } from 'react';
import SettingsSection from '../Settings/SettingsSection';
import SettingsSet from '../Settings/SettingsSet';
import Setting from '../Settings/Setting';
import Editor from '../Editor';
import background from '../../services/background';

const WHITELIST_SETTINGS = {
    sections: {
        whitelistSection: {
            id: 'stealthModeSection',
            sets: ['invertWhitelist'],
        },
    },
    sets: {
        invertWhitelist: {
            id: 'invertWhitelist',
            title: 'Invert whitelist',
            description: 'Unblock ads everywhere except for the whitelist',
            settings: ['invertWhitelist'],
        },
    },
    settings: {
        invertWhitelist: { id: 'invertWhitelist', type: 'checkbox' },
    },
};

class Whitelist extends Component {
    state = {};

    async componentDidMount() {
        let settings;
        const requiredSettingsIds = Object.keys(WHITELIST_SETTINGS.settings);

        try {
            settings = await background.getSettingsByIds(requiredSettingsIds);
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
        const settingsMeta = settingsIds.map(settingId => WHITELIST_SETTINGS.settings[settingId]);
        const enrichedSettings = settingsMeta.map((settingMeta) => {
            const settingData = settingsData[settingMeta.id];
            return { ...settingMeta, ...settingData };
        });
        return enrichedSettings.map(setting => (
            <Setting key={setting.id} setting={setting} handler={this.handleSettingChange} />
        ));
    };

    renderSets = (setsIds) => {
        const sets = setsIds.map(setId => WHITELIST_SETTINGS.sets[setId]);
        return sets.map(set => (
            <SettingsSet key={set.id} {...set}>
                {this.renderSettings(set.settings)}
            </SettingsSet>
        ));
    };

    renderSections = () => {
        const order = ['whitelistSection'];
        return order.map((sectionId) => {
            const section = WHITELIST_SETTINGS.sections[sectionId];
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
                <h2 className="title">
                    Whitelist
                </h2>
                <div className="desc">
                    AdGuard does not filter websites from the whitelist.
                </div>
                {settings
                && this.renderSections()}
                <Editor />
                <button type="button">Import</button>
                <button type="button">Export</button>
            </Fragment>
        );
    }
}

export default Whitelist;
