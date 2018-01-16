import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  includes: 'build.request',

  coalesceFindRequests: true,

  groupRecordsForFindMany(store, snapshots) {
    let jobsByBuildId = {};
    let jobsWithoutBuildId = [];

    snapshots.forEach((snapshot) => {
      let build = snapshot.belongsTo('build');
      if (build) {
        if (!jobsByBuildId[build.id]) {
          jobsByBuildId[build.id] = [];
        }

        jobsByBuildId[build.id].push(snapshot);
      } else {
        jobsWithoutBuildId.push([snapshot]);
      }
    });

    return Object.values(jobsByBuildId).concat(jobsWithoutBuildId);
  },

  findMany(store, modelClass, ids, snapshots) {
    let build = snapshots[0].belongsTo('build');
    if (build) {
      return this.ajax(`${this.buildURL()}/build/${build.id}/jobs`);
    } else {
      return this.ajax(`${this.buildURL()}/job/${snapshots[0].id}`);
    }
  }
});
