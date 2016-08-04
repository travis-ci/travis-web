import Ember from 'ember';

export function safeFormatConfig(config) {
  const rejectKeys = ['.result', 'notifications'];
  let result = {};
  Object.keys(config[0]).forEach(function (item) {
    if (rejectKeys.indexOf(item) === -1) {
      result[item] = config[0][item];
    }
  });
  return JSON.stringify(result, null, 2);
}

export default Ember.Helper.helper(safeFormatConfig);
