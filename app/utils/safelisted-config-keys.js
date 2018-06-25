import intersection from 'lodash.intersection';
import configKeysMap from 'travis/utils/keys-map';

export default function safelistedConfigKeys(config) {
  if (!config) {
    return [];
  }
  return intersection([Object.keys(config), Object.keys(configKeysMap)]);
}
