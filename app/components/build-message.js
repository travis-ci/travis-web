/* eslint-disable max-len */
import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  @computed('message.code', 'message.args')
  readableMessage(code, args) {
    const MSGS = {
      alert: 'using a plain string as a secure',
      alias: `${args.alias} is an alias for ${args.value}, using ${args.value}`,
      cast: `casting value ${args.given_value} (${args.given_type}) to ${args.value} (${args.type})`,
      default: `missing ${args.key}, defaulting to: ${args.default}`,
      downcase: `downcasing ${args.value}`,
      edge: `${args.key} is experimental and might be removed in the future`,
      flagged: `your repository must be feature flagged for ${args.key} to be used`,
      irrelevant: `specified ${args.key}, but this setting is not relevant for the ${args.on_key} ${args.on_value}`,
      unsupported: `${args.key} (${args.value}) is not supported on the ${args.on_key} ${args.on_value}`,
      required: `missing required key ${args.key}`,
      empty: `dropping empty section ${args.key}`,
      find_key: `key ${args.original} is not known, but ${args.key} is, using ${args.key}`,
      find_value: `value ${args.original} is not known, but ${args.value} is, using ${args.value}`,
      clean_key: `key ${args.original} contains special characters, using ${args.key}`,
      clean_value: `value ${args.original} is not known, but ${args.value} is, using ${args.value}`,
      underscore_key: `key ${args.original} is camelcased, using ${args.key}`,
      migrate: `migrating ${args.key} to ${args.to} (value: ${args.value})`,
      misplaced_key: `dropping misplaced key ${args.key} (${args.value})`,
      unknown_key: `dropping unknown key ${args.key} (${args.value})`,
      unknown_value: `dropping unknown value: ${args.value}`,
      unknown_default: `dropping unknown value: ${args.value}, defaulting to: ${args.default}`,
      unknown_var: `unknown template variable ${args.var}`,
      invalid_key: `${args.key} is not a valid key`,
      invalid_type: `dropping unexpected ${args.actual}, expected ${args.expected} (${args.value})`,
      invalid_format: `dropping invalid format: ${args.value}`,
      invalid_seq: `unexpected sequence, using the first value (${args.value})`,
      invalid_cond: `unable to parse condition (${args.value})`,
      invalid_value: `${args.value} is not a valid value on this key`
    };

    return MSGS[code];
  },

  @computed('message.level')
  iconClass(level) {
    return `icon icon-${level}`;
  }
});
/* eslint-enable max-len */
