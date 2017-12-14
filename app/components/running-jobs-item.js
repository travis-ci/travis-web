import Component from '@ember/component';
import Polling from 'travis/mixins/polling';

export default Component.extend(Polling, {
  pollModels: 'job'
});
