import { getContext } from '@ember/test-helpers';

export function stubService(name, service) {
  let { owner } = getContext();
  owner.register(`service:${name}`, service);
}
