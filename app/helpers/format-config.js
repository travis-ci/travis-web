import { helper } from '@ember/component/helper';

export function safeFormatConfig(config) {
  const rejectKeys = ['.result', 'notifications', 'branches', 'linux_shared'];
  const rejectIfEmptyKeys = ['addons'];

  // create deep copy of config
  const deepCopy = JSON.parse(JSON.stringify(config[0] || {}));

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
