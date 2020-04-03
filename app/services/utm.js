import URL from 'url';
import Service, { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';

export const UTM_FIELDS = {
  CAMPAIGN: 'utm_campaign',
  CONTENT: 'utm_content',
  MEDIUM: 'utm_medium',
  SOURCE: 'utm_source',
  TERM: 'utm_term',
};
export const UTM_FIELD_NAMES = Object.values(UTM_FIELDS);

export const SERVICE_UTM_VARS = {
  [UTM_FIELDS.CAMPAIGN]: 'campaign',
  [UTM_FIELDS.CONTENT]: 'content',
  [UTM_FIELDS.MEDIUM]: 'medium',
  [UTM_FIELDS.SOURCE]: 'source',
  [UTM_FIELDS.TERM]: 'term',
};

export default Service.extend({
  storage: service(),

  get url() {
    return new URL(window.location.href);
  },

  get hasParamsInUrl() {
    return UTM_FIELD_NAMES.any(field => this.url.searchParams.has(field));
  },

  campaign: alias('storage.utm.campaign'),
  content: alias('storage.utm.content'),
  medium: alias('storage.utm.medium'),
  source: alias('storage.utm.source'),
  term: alias('storage.utm.term'),

  all: computed(...Object.values(SERVICE_UTM_VARS), function () {
    return this.peek(UTM_FIELD_NAMES);
  }),

  existing: computed(...Object.values(SERVICE_UTM_VARS), function () {
    return this.peek(UTM_FIELD_NAMES, false);
  }),

  hasData: computed('existing', function () {
    return Object.keys(this.existing).length > 0;
  }),

  peek(fields, includeEmpty = true) {
    return fields.reduce((utmData, field) => {
      const value = this.get(SERVICE_UTM_VARS[field]);
      if (value || includeEmpty) {
        utmData[field] = value;
      }
      return utmData;
    }, new QueryParamsHash());
  },

  capture(forceClear = false) {
    if (this.hasParamsInUrl) {
      UTM_FIELD_NAMES.forEach(field => {
        const value = this.url.searchParams.get(field);
        this.set(SERVICE_UTM_VARS[field], value);
      });
      if (forceClear) this.clearUrl();
    }
  },

  removeFromStorage() {
    const [campaign, content, medium, source, term] = new Array(5).fill(null);
    this.setProperties({ campaign, content, medium, source, term });
  },

  removeFromUrl() {
    const { url, hasParamsInUrl } = this;

    if (hasParamsInUrl) {
      UTM_FIELD_NAMES.forEach(field => url.searchParams.delete(field));
      history.replaceState({}, null, url.toString());
    }
  }

});

class QueryParamsHash extends Object {
  toString() {
    return Object.entries(this).map(([key, value]) => `${key}=${value}`).join('&');
  }
}
