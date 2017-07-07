import Ember from 'ember';

export function safeFormatConfig(config) {
  const rejectKeys = ['.result', 'notifications', 'branches', 'linux_shared'];
  const rejectIfEmptyKeys = ['addons'];

  // create deep copy of config
  let copy = Ember.copy(config[0] || {}, true);

  rejectKeys.forEach((keyToReject) => {
    delete copy[keyToReject];
  });

  rejectIfEmptyKeys.forEach((key) => {
    if (copy[key] && Object.keys(copy[key]).length < 1) {
      delete copy[key];
    }
  });

  return JSON.stringify(copy, null, 2);
}

export default Ember.Helper.helper(safeFormatConfig);
