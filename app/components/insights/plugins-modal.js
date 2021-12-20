import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';

import { default as JSEncrypt } from 'jsencrypt';
import CryptoJS from 'crypto-js';
import config from 'travis/config/environment';

const { newInsights } = config;

export default Component.extend({
  store: service(),
  flashes: service(),
  api: service(),

  init() {
    this._super(...arguments);

    this.api.get('/insights_public_key').then((data) => {
      this.set('encryptionKey', data['key_body']);
      this.set('encryptionKeyHash', data['key_hash']);
    });
  },

  encryptionKey: null,
  encryptionKeyHash: null,

  kubeKeyGenerated: false,
  kubeGeneratedPublicId: null,
  kubeGeneratedPrivateKey: null,

  pluginTypes: computed(() => newInsights.pluginTypes.sort((a, b) => a.name.localeCompare(b.name))),

  selectedPlugin: newInsights.pluginTypes[0],

  pluginHelpTextHeader: computed('selectedPlugin', function () {
    return newInsights.pluginHelpText[this.selectedPlugin.id][0];
  }),
  pluginHelpText: computed('selectedPlugin', function () {
    return newInsights.pluginHelpText[this.selectedPlugin.id][1];
  }),

  pluginPublicKeyLabel: computed('selectedPlugin', function () {
    if (newInsights.publicKeyLabels[this.selectedPlugin.id]) {
      return newInsights.publicKeyLabels[this.selectedPlugin.id][0];
    } else {
      return 'Public Key';
    }
  }),
  pluginPublicKeyTooltip: computed('selectedPlugin', function () {
    if (newInsights.publicKeyLabels[this.selectedPlugin.id]) {
      return newInsights.publicKeyLabels[this.selectedPlugin.id][1];
    } else {
      return 'This is the public key of the plugin';
    }
  }),
  pluginPublicKeyPlaceholder: computed('selectedPlugin', function () {
    if (newInsights.publicKeyLabels[this.selectedPlugin.id]) {
      return newInsights.publicKeyLabels[this.selectedPlugin.id][2];
    } else {
      return 'Enter Your Public Key';
    }
  }),

  pluginPrivateKeyLabel: computed('selectedPlugin', function () {
    if (newInsights.privateKeyLabels[this.selectedPlugin.id]) {
      return newInsights.privateKeyLabels[this.selectedPlugin.id][0];
    } else {
      return 'Private Key';
    }
  }),
  pluginPrivateKeyTooltip: computed('selectedPlugin', function () {
    if (newInsights.privateKeyLabels[this.selectedPlugin.id]) {
      return newInsights.privateKeyLabels[this.selectedPlugin.id][1];
    } else {
      return 'This is the private key of the plugin';
    }
  }),
  pluginPrivateKeyPlaceholder: computed('selectedPlugin', function () {
    if (newInsights.privateKeyLabels[this.selectedPlugin.id]) {
      return newInsights.privateKeyLabels[this.selectedPlugin.id][2];
    } else {
      return 'Enter Your Private Key';
    }
  }),

  pluginUrlLabel: computed('selectedPlugin', function () {
    if (newInsights.urlLabels[this.selectedPlugin.id]) {
      return newInsights.urlLabels[this.selectedPlugin.id][0];
    } else {
      return 'Domain';
    }
  }),
  pluginUrlTooltip: computed('selectedPlugin', function () {
    if (newInsights.urlLabels[this.selectedPlugin.id]) {
      return newInsights.urlLabels[this.selectedPlugin.id][1];
    } else {
      return 'This is the domain of the plugin';
    }
  }),
  pluginUrlPlaceholder: computed('selectedPlugin', function () {
    if (newInsights.urlLabels[this.selectedPlugin.id]) {
      return newInsights.urlLabels[this.selectedPlugin.id][2];
    } else {
      return 'Enter Your Domain';
    }
  }),

  isExternalPlugin: computed('selectedPlugin', function () {
    return newInsights.externalPlugins.includes(this.selectedPlugin.id);
  }),

  isThreePartPlugin: computed('selectedPlugin', function () {
    return newInsights.threePartPlugins.includes(this.selectedPlugin.id);
  }),

  isUrlPlugin: computed('selectedPlugin', function () {
    return newInsights.urlPlugins.includes(this.selectedPlugin.id);
  }),

  pluginHasPublicKey: computed('selectedPlugin', function () {
    return newInsights.publicKeyPlugins.includes(this.selectedPlugin.id);
  }),

  isTestRunning: reads('testConnection.isRunning'),
  isTestCompleted: false,
  isTestPassed: false,

  pluginName: '',
  publicId: '',
  privateKey: '',
  accountName: '',
  appKey: '',
  domain: '',
  useForSubplugins: false,

  isFormValid: computed('pluginName', function () {
    return !!this.pluginName;
  }),

  save: task(function* () {
    try {
      yield this.store.createRecord('insights-plugin', {
        name: this.pluginName,
        publicId: this.publicId,
        privateKey: this.privateKey,
        pluginType: this.selectedPlugin.id,
        accountName: this.accountName,
        appKey: this.appKey,
        domain: this.domain,
        subPlugin: this.useForSubplugins ? '1' : '0'
      }).save();
      this.reloadPlugins();
      this.onClose();
      this.flashes.success("User Plugin was successfully created! We're running a scan now, so it should update on your <a href='/insights/notifications'>Notifications</a> within the next five minutes.");
    } catch (error) {
      this.onClose();
      this.flashes.error('Unable to save plugin - please try again.');
    }
  }).drop(),

  testConnection: task(function* () {
    this.set('isTestCompleted', false);
    this.set('isTestPassed', false);
    this.set('testFailMessage', '');

    try {
      const res = yield this.api.post('/insights_plugins/authenticate_key',  {
        data: {
          plugin_type: this.selectedPlugin.id,
          public_id: this.publicKey,
          private_key: this.encryptInputValueForAuthentication(this.privateKey),
          app_key: this.encryptInputValueForAuthentication(this.appKey),
          domain: this.domain,
          key_hash: this.encryptionKeyHash
        }
      });
      this.set('isTestCompleted', true);
      if (res.success) {
        this.set('isTestPassed', true);
      } else {
        this.set('isTestPassed', false);
        this.set('testFailMessage', res.error_msg);
      }
    } catch (e) {
      this.set('isTestCompleted', true);
      this.set('isTestPassed', false);
      this.set('testFailMessage', e.error_message);
    }
  }),

  generateRandomString: function () {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let x = 0; x <= 40; x++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  },

  encryptInputValueForAuthentication: function (inputValue) {
    const encrypted = CryptoJS.AES.encrypt(inputValue, this.generateRandomString());
    const encrypt = new JSEncrypt;
    encrypt.setPublicKey(this.encryptionKey);

    const key = encrypt.encrypt(encrypted.key.toString(CryptoJS.enc.Base64));
    const iv = encrypt.encrypt(encrypted.iv.toString(CryptoJS.enc.Base64));
    const ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    return `${key}:${iv}:${ciphertext}`;
  },

  generateKubeKey: task(function* () {
    return yield this.api.get('/insights_plugins/generate_key', {
      data: {
        plugin_name: this.pluginName,
        plugin_type: this.selectedPlugin.id
      }
    }).then((data) => {
      this.set('kubeKeyGenerated', true);
      this.set('kubeGeneratedPublicId', data['keys'][0]);
      this.set('kubeGeneratedPrivateKey', data['keys'][1]);
    });
  }).drop(),

  actions: {
    closeCreateKubePlugin() {
      this.set('kubeKeyGenerated', false);
      this.set('kubeGeneratedPublicId', null);
      this.set('kubeGeneratedPrivateKey', null);
      this.reloadPlugins();
      this.onClose();
    }
  }
});
