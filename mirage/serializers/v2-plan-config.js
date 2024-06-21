import { Serializer } from 'miragejs';
import { isArray } from '@ember/array';

export default class extends Serializer {
  serializeSingle(plan) {
    return plan.id;
  }

  serialize(object) {
    if (isArray(object.models)) {
      return {
        '@type': 'v2_plans',
        '@href': '/v2_plans_for',
        '@representation': 'standard',
        v2_plans: object.models.map((plan) => {
          return {
            id: plan.attrs.id,
            name: plan.attrs.name,
            starting_price: plan.attrs.startingPrice,
            starting_users: plan.attrs.startingUsers,
            private_credits: plan.attrs.privateCredits,
            public_credits: plan.attrs.publicCredits,
            addon_configs: plan.attrs.addonConfigs,
            plan_type: plan.attrs.planType,
            annual: plan.attrs.isAnnual,
          };
        }),
      };
    } else {
      let metadata = {
        '@type': 'v2_plan',
        '@href': '/v2_plans_for',
        '@representation': 'standard',
      };
      return Object.assign(metadata, object.attrs);
    }
  }
}
