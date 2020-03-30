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
      return htmlSafe(`unrecognised message code ${format(code)}`);
    }
  }),

  alias_key(key, args) {
    return `${format(key)}: key ${format(args.alias)} is an alias for ${format(args.key)}, using ${format(args.key)}`;
  },

  alias_value(key, args) {
    return `${format(key)}: value ${format(args.alias)} is an alias for ${format(args.value)}, using ${format(args.value)}`;
  },

  cast(key, args) {
    return `${format(key)}: casting value ${format(args.given_value)} (${format(args.given_type)}) to ${format(args.value)} (${format(args.type)})`;
  },
  condition(key, args) {
    return `${format(key)}: condition ${format(args.condition)} does not match, skipping notification`;
  },

  default(key, args) {
    return `${format(key)}: missing ${format(args.key)}, using the default ${format(args.default)}`;
  },

  deprecated(key, args) {
    return `${format(key)} is deprecated: ${format(args.info)}`;
  },

  deprecated_key(key, args) {
    return `${format(key)}: deprecated key ${format(args.key)} (${escape(args.info)})`;
  },

  deprecated_value(key, args) {
    return `${format(key)}: deprecated value ${format(args.value)} (${escape(args.info)})`;
  },

  downcase(key, args) {
    return `${format(key)}: downcasing ${format(args.value)}`;
  },

  duplicate(key, args) {
    return `${format(key)}: duplicate values: ${format(args.values)}`;
  },

  duplicate_key(key, args) {
    return `${format(key)}: duplicate key: ${format(args.key)}`;
  },

  edge(key, args) {
    return `${format(key)} is experimental and might change or be removed`;
  },

  flagged(key, args) {
    return `${format(key)} your repository must be feature flagged for ${format(args.key)} to be used`;
  },

  required(key, args) {
    return `${format(key)}: missing required key ${format(args.key)}`;
  },

  secure(key, args) {
    return `${format(key)}: using a plain string on a key that expects an encrypted string`;
  },

  empty(key, args) {
    return `${format(key)}: empty section`;
  },

  find_key(key, args) {
    return `${format(key)}: key ${format(args.original)} is not known, but ${format(args.key)} is, using ${format(args.key)}`;
  },

  find_value(key, args) {
    return `${format(key)}: value ${format(args.original)} is not known, but ${format(args.value)} is, using ${format(args.value)}`;
  },

  clean_key(key, args) {
    return `${format(key)}: key ${format(args.original)} contains special characters, using ${format(args.key)}`;
  },

  clean_value(key, args) {
    return `${format(key)}: value ${format(args.original)} is not known, but ${format(args.value)} is, using ${format(args.value)}`;
  },

  overwrite(key, args) {
    return `${format(key)}: both ${format(args.key)} and ${format(args.other)} given, ${format(args.key)} overwrites ${format(args.other)}`;
  },

  strip_key(key, args) {
    return `${format(key)}: key ${format(args.original)} contains whitespace, using ${format(args.key)}`;
  },

  underscore_key(key, args) {
    return `${format(key)}: key ${format(args.original)} is not underscored, using ${format(args.key)}`;
  },

  unexpected_seq(key, args) {
    return `${format(key)}: ${format(args.key)} unexpected sequence, using the first value (${format(args.value)})`;
  },

  unknown_key(key, args) {
    return `${format(key)}: unknown key ${format(args.key)} (${format(args.value)})`;
  },

  unknown_value(key, args) {
    return `${format(key)}: unknown value ${format(args.value)}`;
  },

  unknown_default(key, args) {
    return `${format(key)}: unknown value ${format(args.value)}, using the default ${format(args.default)}`;
  },

  unknown_var(key, args) {
    return `${format(key)}: unknown template variable ${format(args.var)}`;
  },

  unsupported(key, args) {
    return `${format(key)}: the key ${format(args.key)} (${format(args.value)}) is not supported on the ${format(args.on_key)} ${format(args.on_value)}`;
  },

  invalid_type(key, args) {
    return `${format(key)}: unexpected ${format(args.actual)}, expected ${format(args.expected)} (${format(args.value)})`;
  },

  invalid_format(key, args) {
    return `${format(key)}: invalid format ${format(args.value)}`;
  },

  invalid_condition(key, args) {
    return `${format(key)}: invalid condition ${format(args.condition)}`;
  },

  invalid_env_var(key, args) {
    return `${format(key)}: invalid env var ${format(args.var)}`;
  },

  skip_allow_failure(key, args) {
    return `${format(key)}: skipping jobs allow failure rule #${format(args.number)} because its condition does not match: ${format(args.condition)}`;
  },

  skip_exclude(key, args) {
    return `${format(key)}: skipping jobs exclude rule #${format(args.number)} because its condition does not match: ${format(args.condition)}`;
  },

  skip_import(key, args) {
    return `${format(key)}: skipping import ${format(args.source)} because its condition does not match: ${format(args.condition)}`;
  },

  skip_job(key, args) {
    return `${format(key)}: skipping job #${format(args.number)} because its condition does not match: ${format(args.condition)}`;
  },

  skip_notification(key, args) {
    return `${format(key)}: skipping notification ${format(args.type)} because its condition does not match: ${format(args.condition)}`;
  },

  skip_stage(key, args) {
    return `${format(key)}: skipping stage #${format(args.number)} because its condition does not match: ${format(args.condition)}`;
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
  return `<code>${escape(truncate(dump(obj, length), 30))}</code>`;
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
