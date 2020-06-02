import React, { Fragment, useContext } from 'react';
import { observer } from 'mobx-react';
import SettingsSection from '../Settings/SettingsSection';
import SettingsSet from '../Settings/SettingsSet';
import Setting from '../Settings/Setting';
import rootStore from "../../stores";
import log from "../../../../services/log.js";
import i18n from "../../../../services/i18n";


const STEALTH_META = {
    sections: {
        stealthModeSection: {
            id: 'stealthModeSection',
            sets: ['stealthMode'],
        },
        cookiesSection: {
            id: 'cookiesSection',
            title: i18n.translate('options_cookies_title'),
            sets: ['thirdPartyCookies', 'firstPartyCookies'],
        },
        miscellaneousSection: {
            id: 'miscellaneousSection',
            title: i18n.translate('context_miscellaneous_settings'),
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
            description: i18n.translate('options_privacy_desc'),
            settings: ['stealthMode'],
        },
        thirdPartyCookies: {
            id: 'thirdPartyCookies',
            title: i18n.translate('options_third_party_title'),
            description: i18n.translate('options_third_party_desc'),
            settings: ['thirdPartyCookies', 'thirdPartyTime'],
        },
        firstPartyCookies: {
            id: 'firstPartyCookies',
            title: i18n.translate('options_first_party_title'),
            description: i18n.translate('options_first_party_desc'),
            settings: ['firstPartyCookies', 'firstPartyTime'],
        },
        hideReferrer: {
            id: 'hideReferrer',
            title: i18n.translate('options_hide_referrer_title'),
            description: i18n.translate('options_hide_referrer_desc'),
            settings: ['hideReferrer'],
        },
        hideSearchQueries: {
            id: 'hideSearchQueries',
            title: i18n.translate('options_hide_search_queries_title'),
            description: i18n.translate('options_hide_search_queries_desc'),
            settings: ['hideSearchQueries'],
        },
        sendNotTrack: {
            id: 'sendNotTrack',
            title: i18n.translate('options_send_not_track_title'),
            description: i18n.translate('options_send_not_track_desc'),
            settings: ['sendNotTrack'],
        },
        removeClientData: {
            id: 'removeClientData',
            title: i18n.translate('options_remove_client_data_title'),
            description: i18n.translate('options_remove_client_data_desc'),
            settings: ['removeClientData'],
        },
        blockWebrtc: {
            id: 'blockWebrtc',
            title: i18n.translate('options_disable_webrtc_title'),
            description: i18n.translate('options_disable_webrtc_description'),
            settings: ['blockWebrtc'],
        },
        stripTrackingParams: {
            id: 'stripTrackingParams',
            title: i18n.translate('options_strip_tracking_params_title'),
            description: i18n.translate('options_strip_tracking_params_desc'),
            settings: ['stripTrackingParams'],
        },
    },
    settings: {
        stealthMode: { id: 'stealth_disable_stealth_mode', type: 'checkbox', inverted: true },
        thirdPartyCookies: { id: 'stealth-block-third-party-cookies', type: 'checkbox', inverted: false },
        thirdPartyTime: { id: 'stealth-block-third-party-cookies-time', type: 'input' },
        firstPartyCookies: { id: 'stealth-block-first-party-cookies', type: 'checkbox', inverted: false },
        firstPartyTime: { id: 'stealth-block-first-party-cookies-time', type: 'input' },
        hideReferrer: { id: 'stealth-hide-referrer', type: 'checkbox', inverted: false },
        hideSearchQueries: { id: 'stealth-hide-search-queries', type: 'checkbox', inverted: false },
        sendNotTrack: { id: 'stealth-send-do-not-track', type: 'checkbox', inverted: false },
        removeClientData: { id: 'stealth-remove-x-client', type: 'checkbox', inverted: false },
        blockWebrtc: { id: 'stealth-block-webrtc', type: 'checkbox', inverted: false },
        stripTrackingParams: { id: 'strip-tracking-parameters', type: 'checkbox', inverted: false },
        trackingParams: { id: 'tracking-parameters', type: 'input' },
    },
};

const Stealth = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { settings } = settingsStore;

    if (!settings) {
        return null;
    }

    // TODO [maximtop] throttle input
    const settingChangeHandler = async ({ id, data }) => {
        log.info(`Setting ${id} set to ${data}`);
        await settingsStore.updateSetting(id, data);
    };

    const renderSettings = (settingsIds) => {
        const settingsMeta = settingsIds.map(settingId => STEALTH_META.settings[settingId]);
        const enrichedSettings = settingsMeta.map((settingMeta) => {
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

    const renderSets = (setsIds) => {
        const sets = setsIds.map(setId => STEALTH_META.sets[setId]);
        return sets.map(set => {
            const inverted = STEALTH_META.settings[set.id].inverted;
            const disabled = !settings.values[STEALTH_META.settings[set.id].id];
            return (
                <SettingsSet
                    key={set.id}
                    {...set}
                    disabled={inverted ? !disabled : disabled}
                >
                    {renderSettings(set.settings)}
                </SettingsSet>
            )
        });
    };

    const renderSections = () => {
        const stealthModeSettings = STEALTH_META.sections.stealthModeSection;
        const stealthModeSection = (
            <SettingsSection
                key={stealthModeSettings.id}
                title={stealthModeSettings.title}
            >
                {renderSets(stealthModeSettings.sets)}
            </SettingsSection>
        );

        const isStealthModeDisabled = settings.values[STEALTH_META.settings.stealthMode.id];
        const sectionsOrder = ['cookiesSection', 'miscellaneousSection'];
        const sections = sectionsOrder.map((sectionId) => {
            const section = STEALTH_META.sections[sectionId];
            return (
                <SettingsSection
                    key={section.id}
                    title={section.title}
                    disabled={isStealthModeDisabled}
                >
                    {renderSets(section.sets)}
                </SettingsSection>
            );
        });
        return (
            <div>
                {stealthModeSection}
                {sections}
            </div>
        );
    };

    return (
        <Fragment>
            <h2 className="title">Stealth Mode</h2>
            {settings
            && renderSections()}
        </Fragment>
    );
});

export default Stealth;
