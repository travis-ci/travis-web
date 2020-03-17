import Component from '@ember/component';
import { computed } from '@ember/object';
import { match, not, or, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import WithConfigValidation from 'travis/mixins/components/with-config-validation';

export default Component.extend(WithConfigValidation, {
  tagName: 'div',
  classNames: ['travistab'],

  router: service(),
  modelName: reads('model.modelName'),

  build: null,
  job: null,
  model: or('job', 'build'),
  messages: reads('request.messages'),

  isConfig: match('router.currentRouteName', /config$/),
  isLog: not('isConfig'),

  route: computed('job', 'build', function () {
    if (this.job)
      return 'job';
    else if (this.build)
      return 'build';
    else
      throw new Error('You have to pass either job or build to this component');
  }),
});
