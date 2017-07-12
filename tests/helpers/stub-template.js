import Ember from 'ember';

export function stubTemplate(app, name, template) {
  let container = app.container || app.__container__;
  container.registry.register(`template:${name}`, template);
}

Ember.Test.registerHelper('stubTemplate', stubTemplate);
