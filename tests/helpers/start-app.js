import Application from '../../app';
import config from '../../config/environment';
import registerClipboardHelpers from '../helpers/ember-cli-clipboard';
import { assign } from '@ember/polyfills';
import { run } from '@ember/runloop';
import signOutUser from 'travis/tests/helpers/sign-out-user';

import './sign-in-user';
import './wait-for-element';

registerClipboardHelpers();

export default function startApp(attrs) {
  let attributes = assign({}, config.APP);
  attributes.autoboot = true;
  attributes = assign(attributes, attrs); // use defaults, but you can override;

  signOutUser();

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
