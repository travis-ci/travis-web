/* eslint-disable max-len */
import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  @computed('message.code', 'message.args')
  readableMessage(code, args) {
    // FIXME !!!
    return htmlSafe(this[code](args));
  },

  alert() {
    return 'using a plain string as a secure';
  },

  alias(args) {
    return `<code>${args.alias}</code> is an alias for <code>${args.actual}</code>, using <code>${args.actual}</code>`;
  },

  cast(args) {
    return `casting value <code>${args.given_value}</code> (<code>${args.given_type}</code>) to <code>${args.value}</code> (<code>${args.type}</code>)`;
  },

  default(args) {
    return `missing <code>${args.key}</code>, defaulting to: <code>${args.default}</code>`;
  },

  downcase(args) {
    return `downcasing <code>${args.value}</code>`;
  },

  edge(args) {
    return `<code>${args.key}</code> is experimental and might be removed in the future`;
  },

  flagged(args) {
    return `your repository must be feature flagged for <code>${args.key}</code> to be used`;
  },

  irrelevant(args) {
    return `specified <code>${args.key}</code>, but this setting is not relevant for the <code>${args.on_key}</code> <code>${args.on_value}</code>`;
  },

  unsupported(args) {
    return `<code>${args.key}</code> (<code>${args.value}</code>) is not supported on the <code>${args.on_key}</code> <code>${args.on_value}</code>`;
  },

  required(args) {
    return `missing required key <code>${args.key}</code>`;
  },

  empty(args) {
    return `dropping empty section <code>${args.key}</code>`;
  },

  find_key(args) {
    return `key <code>${args.original}</code> is not known, but <code>${args.key}</code> is, using <code>${args.key}</code>`;
  },

  find_value(args) {
    return `value <code>${args.original}</code> is not known, but <code>${args.value}</code> is, using <code>${args.value}</code>`;
  },

  clean_key(args) {
    return `key <code>${args.original}</code> contains special characters, using <code>${args.key}</code>`;
  },

  clean_value(args) {
    return `value <code>${args.original}</code> is not known, but <code>${args.value}</code> is, using <code>${args.value}</code>`;
  },

  underscore_key(args) {
    return `key <code>${args.original}</code> is camelcased, using <code>${args.key}</code>`;
  },

  migrate(args) {
    return `migrating <code>${args.key}</code> to <code>${args.to}</code> (value: <code>${args.value}</code>)`;
  },

  misplaced_key(args) {
    return `dropping misplaced key <code>${args.key}</code> (<code>${args.value}</code>)`;
  },

  unknown_key(args) {
    return `dropping unknown key <code>${args.key}</code> (<code>${args.value}</code>)`;
  },

  unknown_value(args) {
    return `dropping unknown value: <code>${args.value}</code>`;
  },

  unknown_default(args) {
    return `dropping unknown value: <code>${args.value}</code>, defaulting to: <code>${args.default}</code>`;
  },

  unknown_var(args) {
    return `unknown template variable <code>${args.var}</code>`;
  },

  invalid_key(args) {
    return `<code>${args.key}</code> is not a valid key`;
  },

  invalid_type(args) {
    return `dropping unexpected <code>${args.actual}</code>, expected <code>${args.expected}</code> (<code>${args.value}</code>)`;
  },

  invalid_format(args) {
    return `dropping invalid format: <code>${args.value}</code>`;
  },

  invalid_seq(args) {
    return `unexpected sequence, using the first value (<code>${args.value}</code>)`;
  },

  invalid_cond(args) {
    return `unable to parse condition (<code>${args.value}</code>)`;
  },

  @computed('message.level')
  iconClass(level) {
    return `icon icon-${level}`;
  }
});
/* eslint-enable max-len */
