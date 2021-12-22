import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  // Clean the record without submitting
  // Submitting is done in the v2-subscription adapter
  updateRecord(store, type, snapshot) {
    return true;
  }
});
