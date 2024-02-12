import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';

import { registerDeprecationHandler } from '@ember/debug';
registerDeprecationHandler((message, opts, next) => {});

setup(QUnit.assert); //'assert.dom is not a function'

setApplication(Application.create(config.APP));

start({ setupTestIsolationValidation: true });
