/* eslint-disable max-len */
import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { htmlSafe } from '@ember/string';
import Ember from 'ember';

const { escapeExpression: escape } = Ember.Handlebars.Utils;

export default Component.extend({
  @computed('message.code', 'message.args')
  readableMessage(code, args) {
    if (this[code]) {
      return htmlSafe(this[code](args));
    } else {
      return `unrecognised message code ${escape(code)}`;
    }
  },

  alert() {
    return 'using a plain string as a secure';
  },

  alias(args) {
    return `<code>${escape(args.alias)}</code> is an alias for <code>${escape(args.actual)}</code>, using <code>${escape(args.actual)}</code>`;
  },

  cast(args) {
    return `casting value <code>${escape(args.given_value)}</code> (<code>${escape(args.given_type)}</code>) to <code>${escape(args.value)}</code> (<code>${escape(args.type)}</code>)`;
  },

  default(args) {
    return `missing <code>${escape(args.key)}</code>, defaulting to: <code>${escape(args.default)}</code>`;
  },

  deprecated(args) {
    return `<code>${escape(args.key)}</code> is deprecated`;
  },

  downcase(args) {
    return `downcasing <code>${escape(args.value)}</code>`;
  },

  edge(args) {
    return `<code>${escape(args.given)}</code> is experimental and might be removed in the future`;
  },

  flagged(args) {
    return `your repository must be feature flagged for <code>${escape(args.given)}</code> to be used`;
  },

  irrelevant(args) {
    return `specified <code>${escape(args.key)}</code>, but this setting is not relevant for the <code>${escape(args.on_key)}</code> <code>${escape(args.on_value)}</code>`;
  },

  unsupported(args) {
    return `<code>${escape(args.key)}</code> (<code>${escape(args.value)}</code>) is not supported on the <code>${escape(args.on_key)}</code> <code>${escape(args.on_value)}</code>`;
  },

  required(args) {
    return `missing required key <code>${escape(args.key)}</code>`;
  },

  empty(args) {
    return `dropping empty section <code>${escape(args.key)}</code>`;
  },

  find_key(args) {
    return `key <code>${escape(args.original)}</code> is not known, but <code>${escape(args.key)}</code> is, using <code>${escape(args.key)}</code>`;
  },

  find_value(args) {
    return `value <code>${escape(args.original)}</code> is not known, but <code>${escape(args.value)}</code> is, using <code>${escape(args.value)}</code>`;
  },

  clean_key(args) {
    return `key <code>${escape(args.original)}</code> contains special characters, using <code>${escape(args.key)}</code>`;
  },

  clean_value(args) {
    return `value <code>${escape(args.original)}</code> is not known, but <code>${escape(args.value)}</code> is, using <code>${escape(args.value)}</code>`;
  },

  underscore_key(args) {
    return `key <code>${escape(args.original)}</code> is camelcased, using <code>${escape(args.key)}</code>`;
  },

  migrate(args) {
    return `migrating <code>${escape(args.key)}</code> to <code>${escape(args.to)}</code> (value: <code>${escape(args.value)}</code>)`;
  },

  misplaced_key(args) {
    return `dropping misplaced key <code>${escape(args.key)}</code> (<code>${escape(args.value)}</code>)`;
  },

  unknown_key(args) {
    return `dropping unknown key <code>${escape(args.key)}</code> (<code>${escape(args.value)}</code>)`;
  },

  unknown_value(args) {
    return `dropping unknown value: <code>${escape(args.value)}</code>`;
  },

  unknown_default(args) {
    return `dropping unknown value: <code>${escape(args.value)}</code>, defaulting to: <code>${escape(args.default)}</code>`;
  },

  unknown_var(args) {
    return `unknown template variable <code>${escape(args.var)}</code>`;
  },

  invalid_key(args) {
    return `<code>${escape(args.key)}</code> is not a valid key`;
  },

  invalid_type(args) {
    return `dropping unexpected <code>${escape(args.actual)}</code>, expected <code>${escape(args.expected)}</code> (<code>${escape(args.value)}</code>)`;
  },

  invalid_format(args) {
    return `dropping invalid format: <code>${escape(args.value)}</code>`;
  },

  invalid_seq(args) {
    return `unexpected sequence, using the first value (<code>${escape(args.value)}</code>)`;
  },

  invalid_cond(args) {
    return `unable to parse condition (<code>${escape(args.value)}</code>)`;
  },

  @computed('message.level')
  iconClass(level) {
    return `icon icon-${level}`;
  },

  @computed('message.level')
  tooltipText(level) {
    return {
      info: 'information',
      warn: 'warning',
      error: 'error'
    }[level];
  }
});
/* eslint-enable max-len */
