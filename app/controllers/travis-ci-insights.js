import Controller from '@ember/controller';

export default Controller.extend({
  selectedRepoIds: '',
  startDate: '',
  endDate: '',
  actions: {
    setSelectedRepoIds(val) {
      this.set('selectedRepoIds', val);
    },
  }
});
