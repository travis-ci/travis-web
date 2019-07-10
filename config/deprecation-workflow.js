/* global window */
window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-component.send-action' },
    { handler: 'silence', matchId: 'ember-data:method-calls-on-destroyed-store' },
    { handler: 'silence', matchId: 'ember-keyboard-shortcuts.mixins' }
  ]
};
