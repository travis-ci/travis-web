import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

import './sign-in-user';
import './wait-for-element';

export default function startApp(attrs) {
  let application;

  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs) // use defaults, but you can override;

  let clearStorage = (storage) => {
    storage.removeItem('travis.token');
    storage.removeItem('trvais.user');
  };

  clearStorage(localStorage);
  clearStorage(sessionStorage);

  return Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
