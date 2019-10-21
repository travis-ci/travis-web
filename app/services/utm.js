import Service from '@ember/service';
import { isEmpty } from '@ember/utils';

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
  campaign: null,
  content: null,
  medium: null,
  source: null,
  term: null,

  capture(queryParams) {
    let found = false;
    try {
      UTM_FIELD_NAMES.forEach(field => {
        if (queryParams && !isEmpty(queryParams[field])) {
          found = true;
          this.set(SERVICE_UTM_VARS[field], queryParams[field]);
        }
      });
    } catch (e) {}
    return found;
  }
});
