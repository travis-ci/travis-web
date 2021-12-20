import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

const PROBE_FILTER_LABELS = {
  'active': 'Active Probes',
  'all': 'All Probes',
  'inactive': 'Inactive Probes'
};

export default Component.extend({
  store: service(),
  accounts: service(),

  owner: reads('accounts.user'),

  probeFilterLabel: 'Active Probes',
  probeFilter: 'active',

  lastScanEndedAt: null,

  probes: reads('owner.insightsProbes'),

  actions: {
    setFilter(filter, dropdown) {
      dropdown.actions.close();
      this.set('probeFilter', filter);
      this.set('probeFilterLabel', PROBE_FILTER_LABELS[filter]);
      if (filter === 'active') {
        this.probes.applyCustomOptions({ active: true });
      } else if (filter === 'inactive') {
        this.probes.applyCustomOptions({ active: false });
      } else {
        this.probes.applyCustomOptions({ active: undefined });
      }
    }
  }
});
