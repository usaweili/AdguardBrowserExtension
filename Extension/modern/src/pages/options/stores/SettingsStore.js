import {
    action,
    observable,
    runInAction,
} from 'mobx';

import messenger from '../../../services/messenger';

class SettingsStore {
    @observable settings;

    @observable optionsReadyToRender = false;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @action
    async requestOptionsData() {
        const data = await messenger.getOptionsData();
        runInAction(() => {
            this.settings = data.settings;
            this.optionsReadyToRender = true;
        });
    }
}

export default SettingsStore;
