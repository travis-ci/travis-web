import { getContext } from '@ember/test-helpers';

export function stubTemplate(name, template) {
  let { owner } = getContext();
  owner.registry.register(`template:${name}`, template);
}
