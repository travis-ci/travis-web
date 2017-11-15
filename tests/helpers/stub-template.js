import { registerHelper } from '@ember/test';

export function stubTemplate(app, name, template) {
  let container = app.container || app.__container__;
  container.registry.register(`template:${name}`, template);
}

registerHelper('stubTemplate', stubTemplate);
