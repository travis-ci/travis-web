import Component from '@ember/component';
import { match, not, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import WithConfigValidation from 'travis/mixins/components/with-config-validation';

export default Component.extend(WithConfigValidation, {
  classNames: ['travistab'],

  router: service(),

  isConfig: match('router.currentRouteName', /config$/),
  isLog: not('isConfig'),

  repo: reads('build.repo'),
  messages: reads('build.request.messages'),

});
