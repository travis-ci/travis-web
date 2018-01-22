window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: 'throw', matchId: 'ember-router.router' },
    { handler: 'throw', matchId: 'macro-computed-deprecated' },
  ]
};
