import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    chooseRequest(request) {
      this.transitionToRoute('repo.preview.request', request);
    },
  }
});
