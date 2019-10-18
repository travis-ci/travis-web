import Model, { attr } from '@ember-data/model';

export const LEAD_UTM_FIELDS = {
  SOURCE: 'utm_source',
  CAMPAIGN: 'utm_campaign',
  MEDIUM: 'utm_medium',
  TERM: 'utm_term',
  CONTENT: 'utm_content',
};

export default Model.extend({
  name: attr('string'),
  email: attr('string'),
  team_size: attr('number'),
  phone: attr('string'),
  message: attr('string'),
  referral_source: attr('string'),
  utm_fields: attr(),
});
