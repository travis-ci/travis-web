/* global window */
window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-views.curly-components.jquery-element' },
    { handler: 'silence', matchId: 'computed-property.volatile' },
    { handler: 'silence', matchId: 'computed-property.override' }
  ]
};
