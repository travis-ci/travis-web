import Ember from 'ember';

export function safeFormatConfig(config) {
  return JSON.stringify(config, null, 2);
}

export default Ember.Helper.helper(safeFormatConfig);
