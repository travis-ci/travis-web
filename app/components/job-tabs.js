import Component from '@ember/component';
import { match, not, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import WithConfigValidation from 'travis/mixins/components/with-config-validation';

export default Component.extend(WithConfigValidation, {
  tagName: 'div',
  classNames: ['travistab'],

  router: service(),
  modelName: reads('model.constructor.modelName'),

  isConfig: match('router.currentRouteName', /config$/),
  isLog: not('isConfig'),

  messages: reads('request.messages')
});
