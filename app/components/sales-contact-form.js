import Component from '@ember/component';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

const pardotFormUrl = config.urls.pardotHost + config.urls.pardotForm;

export default Component.extend({
  tagName: '',

  utm: service(),

  pardotFormUrl: computed('utm.existing', function () {
    const { existing, hasData } = this.utm;
    return hasData ? `${pardotFormUrl}?${existing}` : pardotFormUrl;
  }),

  setHeight(element) {
    window.addEventListener('message', (event) => {
      if (event.origin === config.urls.pardotHost && event.data) {
        element.style.height = `${event.data.scrollHeight + 10}px`;
      }
    });
  },
});
