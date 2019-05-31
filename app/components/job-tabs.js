import { isEmpty } from '@ember/utils';
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  tagName: 'div',
  classNames: ['travistab'],

  didRender() {
    // Set the log to be default active tab unless something else is active
    if (isEmpty(this.$('.travistab-nav--secondary').find('.active'))) {
      this.$('#tab_log').addClass('active');
    }
  },

  tabTitle: computed('job.build.request.noYaml', function () {
    if (this.get('job.build.request.noYaml')) { return null; }

    return 'Look at this job’s config';
  })
});
