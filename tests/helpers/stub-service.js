import { getContext } from '@ember/test-helpers';

export function stubService(name, service) {
  let { owner } = getContext();
  owner.register(`service:${name}`, service);
}

export function stubConfig(name, config, options) {
  let { owner } = getContext();
  owner.register(`config:${name}`, config, options);
}
