import TravisRoute from 'travis/routes/basic';

import RenderConfigMixin from 'travis/mixins/builds/rendering';
import WindowTitleMixin from 'travis/mixins/builds/window-title';
import StateInitializationMixin from 'travis/mixins/builds/state-initialization';

const mixins = [
  RenderConfigMixin,
  WindowTitleMixin,
  StateInitializationMixin,
];

export default TravisRoute.extend(...mixins, {
  contentType: 'pull_requests'
});
