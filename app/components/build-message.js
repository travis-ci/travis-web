/* eslint-disable max-len */
import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import Ember from 'ember';

const { escapeExpression: escape } = Ember.Handlebars.Utils;

export default Component.extend({
  readableMessage: computed('message.code', 'message.args', function () {
    let code = this.get('message.code');
    let key  = this.get('message.key');
    let args = this.get('message.args');

    if (this[code]) {
      return htmlSafe(this[code](key, args));
    } else {
      return htmlSafe(`unrecognised message code <code>${escape(code)}</code>`);
    }
  }),

  alias(key, args) {
    return `<code>${escape(key)}</code>: <code>${escape(args.alias)}</code> is an alias for <code>${escape(args.obj)}</code> (<code>${escape(args.type)}</code>), using <code>${escape(args.obj)}</code>`;
  },

  cast(key, args) {
    return `<code>${escape(key)}</code>: casting value <code>${escape(args.given_value)}</code> (<code>${escape(args.given_type)}</code>) to <code>${escape(args.value)}</code> (<code>${escape(args.type)}</code>)`;
  },

  default(key, args) {
    return `<code>${escape(key)}</code>: missing <code>${escape(args.key)}</code>, defaulting to: <code>${escape(args.default)}</code>`;
  },

  deprecated(key, args) {
    return `<code>${escape(key)}</code> is deprecated: <code>${escape(args.info)}</code>`;
  },

  deprecated_key(key, args) {
    return `<code>${escape(key)}</code> deprecated key <code>${escape(args.key)}</code> (${escape(args.info)})`;
  },

  deprecated_value(key, args) {
    return `<code>${escape(key)}</code>: deprecated value <code>${escape(args.value)}</code> (${escape(args.info)})`;
  },

  downcase(key, args) {
    return `<code>${escape(key)}</code>: downcasing <code>${escape(args.value)}</code>`;
  },

  duplicate(key, args) {
    return `<code>${escape(key)}</code>: duplicate values: <code>${escape(args.values)}</code>`;
  },

  edge(key, args) {
    return `<code>${escape(key)}</code> is experimental and might change or be removed`;
  },

  flagged(key, args) {
    return `<code>${escape(key)}</code> your repository must be feature flagged for <code>${escape(args.key)}</code> to be used`;
  },

  required(key, args) {
    return `<code>${escape(key)}</code> missing required key <code>${escape(args.key)}</code>`;
  },

  secure(key, args) {
    return `<code>${escape(key)}</code> using a plain string on a key that expects an encrypted string`;
  },

  empty(key, args) {
    return `<code>${escape(key)}</code> dropping empty section`;
  },

  find_key(key, args) {
    return `<code>${escape(key)}</code> key <code>${escape(args.original)}</code> is not known, but <code>${escape(args.key)}</code> is, using <code>${escape(args.key)}</code>`;
  },

  find_value(key, args) {
    return `<code>${escape(key)}</code> value <code>${escape(args.original)}</code> is not known, but <code>${escape(args.value)}</code> is, using <code>${escape(args.value)}</code>`;
  },

  clean_key(key, args) {
    return `<code>${escape(key)}</code> key <code>${escape(args.original)}</code> contains special characters, using <code>${escape(args.key)}</code>`;
  },

  clean_value(key, args) {
    return `<code>${escape(key)}</code> value <code>${escape(args.original)}</code> is not known, but <code>${escape(args.value)}</code> is, using <code>${escape(args.value)}</code>`;
  },

  strip_key(key, args) {
    return `<code>${escape(key)}</code> key <code>${escape(args.original)}</code> contains whitespace, using <code>${escape(args.key)}</code>`;
  },

  underscore_key(key, args) {
    return `<code>${escape(key)}</code> key <code>${escape(args.original)}</code> is not underscored, using <code>${escape(args.key)}</code>`;
  },

  unexpected_seq(key, args) {
    return `<code>${escape(key)}</code> <code>${escape(args.key)}</code> unexpected sequence, using the first value (<code>${escape(args.value)}</code>)`;
  },

  unknown_key(key, args) {
    return `<code>${escape(key)}</code> unknown key <code>${escape(args.key)}</code> (<code>${escape(args.value)}</code>)`;
  },

  unknown_value(key, args) {
    return `<code>${escape(key)}</code> dropping unknown value: <code>${escape(args.value)}</code>`;
  },

  unknown_default(key, args) {
    return `<code>${escape(key)}</code> dropping unknown value: <code>${escape(args.value)}</code>, defaulting to: <code>${escape(args.default)}</code>`;
  },

  unknown_var(key, args) {
    return `<code>${escape(key)}</code> unknown template variable <code>${escape(args.var)}</code>`;
  },

  unsupported(key, args) {
    return `<code>${escape(key)}</code> the key <code>${escape(args.key)}</code> (<code>${escape(args.value)}</code>) is not supported on the <code>${escape(args.on_key)}</code> <code>${escape(args.on_value)}</code>`;
  },

  invalid_type(key, args) {
    return `<code>${escape(key)}</code> dropping unexpected <code>${escape(args.actual)}</code>, expected <code>${escape(args.expected)}</code> (<code>${escape(args.value)}</code>)`;
  },

  invalid_format(key, args) {
    return `<code>${escape(key)}</code> dropping invalid format: <code>${escape(args.value)}</code>`;
  },

  invalid_condition(key, args) {
    return `<code>${escape(key)}</code> invalid condition: <code>${escape(args.condition)}</code>`;
  },

  invalid_env_var(key, args) {
    return `<code>${escape(key)}</code> invalid env var: <code>${escape(args.var)}</code>`;
  },

  iconClass: computed('message.level', function () {
    let level = this.get('message.level');
    return `icon icon-${level}`;
  }),

  tooltipText: computed('message.level', function () {
    let level = this.get('message.level');
    return {
      info: 'information',
      warn: 'warning',
      error: 'error'
    }[level];
  })
});
/* eslint-enable max-len */
