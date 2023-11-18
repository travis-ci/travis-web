import Application from 'travis/app';
import config from 'travis/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';

import { registerDeprecationHandler } from '@ember/debug';
registerDeprecationHandler((message, options, next) => {
});


setApplication(Application.create(config.APP));
QUnit.config.testTimeout = 5000;
setup(QUnit.assert);

start({ setupTestIsolationValidation: true });



