import { safe, formatConfig as formatConfigHelper } from 'travis/utils/helpers';

export default function(config) {
  return safe(formatConfigHelper(config));
}
