import { URLSearchParams } from 'url';
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
  router: service(),

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

  searchParams: computed('router.currentURL', function () {
    let search = '';
    try {
      search = this.router.location.getURL().split('?')[1] || '';
    } catch (e) {}
    return new URLSearchParams(search);
  }),

  hasParamsInUrl: computed('searchParams', function () {
    return UTM_FIELD_NAMES.any(field => this.searchParams.has(field));
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
        const value = this.searchParams.get(field);
        this.set(SERVICE_UTM_VARS[field], value);
      });
      if (forceClear) this.removeFromUrl();
    }
  },

  removeFromStorage() {
    const [campaign, content, medium, source, term] = new Array(5).fill(null);
    this.setProperties({ campaign, content, medium, source, term });
  },

  removeFromUrl() {
    const { searchParams, hasParamsInUrl, router } = this;

    if (hasParamsInUrl) {
      UTM_FIELD_NAMES.forEach(field => searchParams.delete(field));
      const { queryParams } = router.recognize(`/?${searchParams.toString()}`) || {};
      router.transitionTo({ queryParams });
    }
  }

});

class QueryParamsHash extends Object {
  toString() {
    return Object.entries(this).map(([key, value]) => `${key}=${value}`).join('&');
  }
}
