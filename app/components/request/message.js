/* eslint-disable max-len */
import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, notEmpty } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import { typeOf } from '@ember/utils';
import { codeblockName } from 'travis/utils/format-config';
import Ember from 'ember';

const { escapeExpression: escape } = Ember.Handlebars.Utils;

export default Component.extend({
  tagName: '',

  readableMessage: computed('message.code', 'message.key', 'message.args', function () {
    const { code, key, args } = this.message;

    if (this[code]) {
      return htmlSafe(this[code](key, args));
    } else {
      return htmlSafe(`unrecognised message code <code>${escape(code)}</code>`);
    }
  }),

  alias_key(key, args) {
    return `<code>${escape(key)}</code>: key <code>${escape(args.alias)}</code> is an alias for <code>${escape(args.key)}</code>, using <code>${escape(args.key)}</code>`;
  },

  alias_value(key, args) {
    return `<code>${escape(key)}</code>: value <code>${escape(args.alias)}</code> is an alias for <code>${format(args.value)}</code>, using <code>${format(args.value)}</code>`;
  },

  cast(key, args) {
    return `<code>${escape(key)}</code>: casting value <code>${format(args.given_value)}</code> (<code>${escape(args.given_type)}</code>) to <code>${format(args.value)}</code> (<code>${escape(args.type)}</code>)`;
  },
  condition(key, args) {
    return `<code>${escape(key)}</code>: condition <code>${escape(args.condition)}</code> does not match, skipping notification`;
  },

  default(key, args) {
    return `<code>${escape(key)}</code>: missing <code>${escape(args.key)}</code>, using the default <code>${escape(args.default)}</code>`;
  },

  deprecated(key, args) {
    return `<code>${escape(key)}</code> is deprecated: <code>${escape(args.info)}</code>`;
  },

  deprecated_key(key, args) {
    return `<code>${escape(key)}</code>: deprecated key <code>${escape(args.key)}</code> (${escape(args.info)})`;
  },

  deprecated_value(key, args) {
    return `<code>${escape(key)}</code>: deprecated value <code>${format(args.value)}</code> (${escape(args.info)})`;
  },

  downcase(key, args) {
    return `<code>${escape(key)}</code>: downcasing <code>${escape(args.value)}</code>`;
  },

  duplicate(key, args) {
    return `<code>${escape(key)}</code>: duplicate values: <code>${format(args.values)}</code>`;
  },

  duplicate_key(key, args) {
    return `<code>${escape(key)}</code>: duplicate key: <code>${format(args.key)}</code>`;
  },

  edge(key, args) {
    return `<code>${escape(key)}</code> is experimental and might change or be removed`;
  },

  flagged(key, args) {
    return `<code>${escape(key)}</code> your repository must be feature flagged for <code>${escape(args.key)}</code> to be used`;
  },

  required(key, args) {
    return `<code>${escape(key)}</code>: missing required key <code>${escape(args.key)}</code>`;
  },

  secure(key, args) {
    return `<code>${escape(key)}</code>: using a plain string on a key that expects an encrypted string`;
  },

  empty(key, args) {
    return `<code>${escape(key)}</code>: empty section`;
  },

  find_key(key, args) {
    return `<code>${escape(key)}</code>: key <code>${escape(args.original)}</code> is not known, but <code>${escape(args.key)}</code> is, using <code>${escape(args.key)}</code>`;
  },

  find_value(key, args) {
    return `<code>${escape(key)}</code>: value <code>${escape(args.original)}</code> is not known, but <code>${escape(args.value)}</code> is, using <code>${escape(args.value)}</code>`;
  },

  clean_key(key, args) {
    return `<code>${escape(key)}</code>: key <code>${escape(args.original)}</code> contains special characters, using <code>${escape(args.key)}</code>`;
  },

  clean_value(key, args) {
    return `<code>${escape(key)}</code>: value <code>${escape(args.original)}</code> is not known, but <code>${escape(args.value)}</code> is, using <code>${escape(args.value)}</code>`;
  },

  overwrite(key, args) {
    return `<code>${escape(key)}</code>: both <code>${escape(args.key)}</code> and <code>${escape(args.other)}</code> given, <code>${escape(args.key)}</code> overwrites <code>${escape(args.other)}</code>`;
  },

  strip_key(key, args) {
    return `<code>${escape(key)}</code>: key <code>${escape(args.original)}</code> contains whitespace, using <code>${escape(args.key)}</code>`;
  },

  underscore_key(key, args) {
    return `<code>${escape(key)}</code>: key <code>${escape(args.original)}</code> is not underscored, using <code>${escape(args.key)}</code>`;
  },

  unexpected_seq(key, args) {
    return `<code>${escape(key)}</code>: <code>${escape(args.key)}</code> unexpected sequence, using the first value (<code>${format(args.value)}</code>)`;
  },

  unknown_key(key, args) {
    return `<code>${escape(key)}</code>: unknown key <code>${escape(args.key)}</code> (<code>${escape(args.value)}</code>)`;
  },

  unknown_value(key, args) {
    return `<code>${escape(key)}</code>: unknown value <code>${escape(args.value)}</code>`;
  },

  unknown_default(key, args) {
    return `<code>${escape(key)}</code>: unknown value <code>${escape(args.value)}</code>, using the default <code>${escape(args.default)}</code>`;
  },

  unknown_var(key, args) {
    return `<code>${escape(key)}</code>: unknown template variable <code>${escape(args.var)}</code>`;
  },

  unsupported(key, args) {
    return `<code>${escape(key)}</code>: the key <code>${escape(args.key)}</code> (<code>${escape(args.value)}</code>) is not supported on the <code>${escape(args.on_key)}</code> <code>${escape(args.on_value)}</code>`;
  },

  invalid_type(key, args) {
    return `<code>${escape(key)}</code>: unexpected <code>${escape(args.actual)}</code>, expected <code>${escape(args.expected)}</code> (<code>${format(args.value)}</code>)`;
  },

  invalid_format(key, args) {
    return `<code>${escape(key)}</code>: invalid format <code>${escape(args.value)}</code>`;
  },

  invalid_condition(key, args) {
    return `<code>${escape(key)}</code>: invalid condition <code>${escape(args.condition)}</code>`;
  },

  invalid_env_var(key, args) {
    return `<code>${escape(key)}</code>: invalid env var <code>${escape(args.var)}</code>`;
  },

  iconClass: computed('message.level', function () {
    let level = this.get('message.level');
    return `icon icon-level icon-${level}`;
  }),

  tooltipText: computed('message.level', function () {
    let level = this.get('message.level');
    return {
      info: 'information',
      warn: 'warning',
      error: 'error',
      alert: 'alert'
    }[level];
  }),

  hasMessageSrc: notEmpty('message.src'),
  hasMessageLine: notEmpty('message.line'),
  isLinkable: and('hasMessageSrc', 'hasMessageLine'),

  lineLink: computed('message.src', 'message.line', function () {
    const { src, line } = this.message;
    return `#${codeblockName(src)}.${line + 1}`;
  }),
});

function format(obj, length) {
  length = length || 30;
  return escape(truncate(dump(obj, length), 30));
}

function dump(obj, length) {
  switch (typeOf(obj)) {
    case 'array':
      return `[${obj.map((obj) => dump(obj, 10)).join(', ')}]`;
    case 'object':
      return `{ ${Object.entries(obj).map((entry) => `${entry[0]}: ${dump(entry[1], 10)}`).join(', ')} }`;
    case 'string':
      return `${truncate(obj, length)}`;
    default:
      return obj;
  }
}

function truncate(str, length) {
  if (str.length > length) {
    str = `${str.substring(0, length)} ...`;
  }
  return str;
}
/* eslint-enable max-len */
