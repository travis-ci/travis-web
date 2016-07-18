import Ember from 'ember';
import { safe, formatConfig as formatConfigHelper } from 'travis/utils/helpers';

export function safeFormatConfig(config, options) {
  return JSON.stringify(config, null, 2);
}

export default Ember.Helper.helper(safeFormatConfig);
