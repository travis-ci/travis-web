/* global window */
window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: 'throw', matchId: 'ember-router.router' },
    { handler: 'silence', matchId: 'macro-computed-deprecated' },
  ]
};
