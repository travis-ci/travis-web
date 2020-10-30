import { Serializer } from 'ember-cli-mirage';
import { isArray } from '@ember/array';

export default Serializer.extend({
  serialize(object) {
    if (isArray(object.models)) {
      const allowance = object.models[0];
      return {
        '@type': 'allowance',
        '@href': '/owner/provider/login/allowance',
        '@representation': 'standard',
        'id': allowance.id,
        'subscription_type': allowance.subscription_type,
        'public_repos': allowance.public_repos,
        'private_repos': allowance.private_repos,
        'concurrency_limit': allowance.concurrency_limit
      };
    }
  }
});
