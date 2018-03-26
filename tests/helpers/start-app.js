import Application from '../../app';
import config from '../../config/environment';
import registerClipboardHelpers from '../helpers/ember-cli-clipboard';
import { merge } from '@ember/polyfills';
import { run } from '@ember/runloop';

import './sign-in-user';
import './wait-for-element';

registerClipboardHelpers();

export default function startApp(attrs) {
  let attributes = merge({}, config.APP);
  attributes.autoboot = true;
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  let clearStorage = (storage) => {
    storage.removeItem('travis.token');
    storage.removeItem('trvais.user');
  };

  clearStorage(localStorage);
  clearStorage(sessionStorage);

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
