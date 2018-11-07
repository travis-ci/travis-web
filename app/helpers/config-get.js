import { helper } from '@ember/component/helper';
import { get } from '@ember/object';
import CONFIG from 'travis/config/environment';

export function configGet(params = []/* , hash*/) {
  const path = params[0] || '';
  return get(CONFIG, path);
}

export default helper(configGet);
