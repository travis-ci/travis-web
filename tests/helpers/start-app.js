import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

import './sign-in-user';

export default function startApp(attrs) {
  let application;

  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(function() {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  // TODO: I'm not sure if this is the best thing to do, but it seems
  // easiest for now. That way in tests I can just write:
  //
  //     application.auth.signInForTests()
  application.auth = application.__container__.lookup('auth:main');

  return application;
}
