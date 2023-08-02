import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  subscriptionType: attr('number'),
  publicRepos: attr('boolean'),
  privateRepos: attr('boolean'),
  userUsage: attr('boolean'),
  pendingUserLicenses: attr('boolean'),
  concurrencyLimit: attr('number'),
  paymentChangesBlockCredit: attr('boolean'),
  paymentChangesBlockCaptcha: attr('boolean'),
  creditCardBlockDuration: attr('number'),
  captchaBlockDuration: attr('number'),

  owner: belongsTo('owner')
});
