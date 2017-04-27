import AbstractBuildsRoute from 'travis/routes/abstract-builds';

import RenderConfig from 'travis/mixins/builds/rendering';

const mixins = [
  RenderConfig,
];

export default AbstractBuildsRoute.extend(...mixins, {
  contentType: 'pull_requests'
});
