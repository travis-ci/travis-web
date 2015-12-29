import { safe, formatConfig as formatConfigHelper } from 'travis/utils/helpers';

export default function(config, options) {
  return safe(formatConfigHelper(config));
}
