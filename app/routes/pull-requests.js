import TravisRoute from 'travis/routes/basic';

import WindowTitleMixin from 'travis/mixins/builds/window-title';
import StateInitializationMixin from 'travis/mixins/builds/state-initialization';

const mixins = [
  WindowTitleMixin,
  StateInitializationMixin,
];

export default TravisRoute.extend(...mixins, {
  contentType: 'pull_requests',

  contentDidChange() {
    const path = this.get('path');
    this.controllerFor('pull-requests').set('model', this.controllerFor('repo').get(path));
  },
});
