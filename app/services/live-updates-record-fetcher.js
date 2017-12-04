import Service from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';

/*
 * travis-live doesn't always send full payload. In such a situation we need to
 * query the API, but ideally we don't want to flood it with requests. This
 * service saves all the records that we need to fetch and flushes the list
 * after a specified time. That way if a few updates for jobs for the same build
 * are sent one after another, we will still send only one query.
 */
export default Service.extend({
  @service store: null,

  init() {
    this.recordsToFetch = [];

    return this._super(...arguments);
  },

  fetch(type, id, payload = {}) {
    this.recordsToFetch.push({ type: type, id: id, payload: payload });
    this.get('flushPusherFetches').perform();
  },

  flushPusherFetches: task(function* () {
    let interval = this.get('interval') ||
      config.intervals.fetchRecordsForPusherUpdatesThrottle;

    yield timeout(interval);

    this.fetchRecordsFromPusher();
  }).drop(),

  fetchRecordsFromPusher() {
    let recordsToFetch = this.recordsToFetch;
    this.recordsToFetch = [];

    let jobsByBuildId = {};
    let buildIds = [];

    recordsToFetch.forEach((data) => {
      let id = parseInt(data.id);
      if (data.type == 'job') {
        let buildId = data.payload.build_id;
        jobsByBuildId[buildId] = jobsByBuildId[buildId] || [];
        if (!jobsByBuildId[buildId].includes(id)) {
          jobsByBuildId[buildId].push(id);
        }
      } else if (data.type == 'build' && !buildIds.includes(id)) {
        buildIds.push(id);
      }
    });

    Object.keys(jobsByBuildId).forEach((buildId) => {
      buildId = parseInt(buildId);
      let jobsData = jobsByBuildId[buildId];
      let needToFetchBuild = buildIds.includes(buildId);

      // if we need to fetch build anyway or if we have more than one build,
      // just query for the build with jobs included
      if (needToFetchBuild || jobsData.length > 1) {
        let index = buildIds.indexOf(buildId);
        buildIds.splice(index, 1);
        this.get('store').queryRecord('build', { id: buildId, include: 'build.jobs' });
      } else {
        this.get('store').findRecord('job', jobsData[0], { reload: true });
      }
    });

    buildIds.forEach((id) => {
      this.get('store').findRecord('build', id, { reload: true });
    });
  }
});
