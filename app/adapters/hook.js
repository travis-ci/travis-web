import ApplicationAdapter from 'travis/adapters/application';

export default ApplicationAdapter.extend({
  updateRecord(store, type, snapshot) {
    const hook = {
      hook: {
        id: snapshot.id
      }
    };
    return this._super(...arguments).then(() => hook);
  }
});
