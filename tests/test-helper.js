import resolver from './helpers/resolver';
import registerSelectHelper from './helpers/register-select-helper';
import 'ember-feature-flags/tests/helpers/with-feature';

registerSelectHelper();
import {
  setResolver
} from 'ember-qunit';

setResolver(resolver);
