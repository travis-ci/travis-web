window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-router.router' },
    { handler: 'silence', matchId: 'macro-computed-deprecated' },
  ]
};
