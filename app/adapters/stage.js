import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  coalesceFindRequests: true,

  groupRecordsForFindMany(store, snapshots) {
    let stagesByBuildId = {};

    snapshots.forEach((snapshot) => {
      let buildId = snapshot.belongsTo('build').id;

      if (!stagesByBuildId[buildId]) {
        stagesByBuildId[buildId] = [];
      }

      stagesByBuildId[buildId].push(snapshot);
    });

    return Object.values(stagesByBuildId);
  },

  findMany(store, modelClass, ids, snapshots) {
    let buildId = snapshots[0].belongsTo('build').id;
    return this.ajax(`${this.buildURL()}/build/${buildId}/stages`);
  }
});
