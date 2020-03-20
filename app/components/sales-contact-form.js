import Component from '@ember/component';
import config from 'travis/config/environment';

const pardotFormUrl = config.urls.pardotHost + config.urls.pardotForm;

export default Component.extend({
  tagName: '',
  pardotFormUrl,
  setHeight(element) {
    window.addEventListener('message', (event) => {
      if (event.origin === config.urls.pardotHost && event.data) {
        element.style.height = `${event.data.scrollHeight + 10}px`;
      }
    });
  },
});
