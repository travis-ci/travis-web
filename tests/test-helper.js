import Application from 'travis/app';
import config from 'travis/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start({ setupTestIsolationValidation: true });
