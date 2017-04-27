import AbstractBuildsRoute from 'travis/routes/abstract-builds';

import RenderConfigMixin from 'travis/mixins/builds/rendering';
import WindowTitleMixin from 'travis/mixins/builds/window-title';

const mixins = [
  RenderConfigMixin,
  WindowTitleMixin,
];

export default AbstractBuildsRoute.extend(...mixins, {
  contentType: 'pull_requests'
});
