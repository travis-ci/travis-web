import resolver from './helpers/resolver';
import { start } from 'ember-cli-qunit';
import './helpers/with-feature';

import {
  setResolver
} from 'ember-qunit';

setResolver(resolver);

start();
