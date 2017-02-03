import _array from 'lodash/array';
import configKeysMap from 'travis/utils/keys-map';

export default function safelistedConfigKeys(config) {
  if (!config) {
    return [];
  }
  return _array.intersection([Object.keys(config), Object.keys(configKeysMap)]);
}
