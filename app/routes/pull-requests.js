import AbstractBuildsRoute from 'travis/routes/abstract-builds';
import TrackCurrentPage from 'travis/mixins/track-current-page';

export default AbstractBuildsRoute.extend(TrackCurrentPage, {
  contentType: 'pull_requests'
});
