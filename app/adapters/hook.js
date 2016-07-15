import ApplicationAdapter from 'travis/adapters/application';

export default ApplicationAdapter.extend({
  updateRecord(store, type, snapshot) {
    return this._super(...arguments).then(() => {
      return { hook: { id: snapshot.id } };
    });
  }
});
