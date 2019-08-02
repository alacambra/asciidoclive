import {Dropbox} from 'dropbox';
import environment from '../environment/environment';
import StorageProvider from './storage-provider';
import StorageType from './storage-type';

const SCRIPT_ELEMENT_ID = 'dropboxjs';

class DropboxStorageProvider extends StorageProvider {
  constructor() {
    super();
    if (this.isEnabled) {
      console.info('Dropbox storage provider enabled');
      this.init();
    } else {
      console.warn('Dropbox storage provider disabled');
    }
    Dropbox;
  }

  get storageType() {
    return StorageType.DROPBOX;
  }

  get isEnabled() {
    return !!environment.dropboxApiKey;
  }

  private init() {
    let existingScriptEl = document.getElementById(SCRIPT_ELEMENT_ID);
    if (!existingScriptEl) {
      let scriptEl = document.createElement('script');
      scriptEl.src = 'https://www.dropbox.com/static/api/2/dropins.js';
      scriptEl.id = SCRIPT_ELEMENT_ID;
      scriptEl.dataset['appKey'] = environment.dropboxApiKey!;
      document.body.appendChild(scriptEl);
    }
    this.checkIsReady();
  }

  private checkIsReady() {
    if (
      window['Dropbox'] &&
      window['Dropbox'].choose &&
      window['Dropbox'].save
    ) {
      this.isReady = true;
      console.info('Dropbox storage provider ready');
    } else {
      setTimeout(this.checkIsReady.bind(this), 100);
    }
  }
}

export default DropboxStorageProvider;
