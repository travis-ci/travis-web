import Ember from 'ember';
import computed from 'ember-computed-decorators';

const { service } = Ember.inject;

export default Ember.Controller.extend({
  auth: service(),

  @computed('features.proVersion', 'features.enterpriseVersion')
  landingPage(pro, enterprise) {
    let version = 'default';

    if (pro) {
      version = 'pro';
    } else if (enterprise) {
      version = 'enterprise';
    }

    return `landing/${version}-page`;
  },
});
