import { helper } from '@ember/component/helper';
import { copy } from '@ember/object/internals';

export function safeFormatConfig(config) {
  const rejectKeys = ['.result', 'notifications', 'branches', 'linux_shared'];
  const rejectIfEmptyKeys = ['addons'];

  // create deep copy of config
  let deepCopy = copy(config[0] || {}, true);

  rejectKeys.forEach((keyToReject) => {
    delete deepCopy[keyToReject];
  });

  rejectIfEmptyKeys.forEach((key) => {
    if (deepCopy[key] && Object.keys(deepCopy[key]).length < 1) {
      delete deepCopy[key];
    }
  });

  return JSON.stringify(deepCopy, null, 2);
}

export default helper(safeFormatConfig);
