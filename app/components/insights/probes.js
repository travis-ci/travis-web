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

  didRender() {
    if (this.probes) {
      if (Object.keys(this.probes.customOptions).length > 0) {
        if (this.probes.customOptions.active === 'all') {
          this.set('probeFilter', 'all');
          this.set('probeFilterLabel', PROBE_FILTER_LABELS['all']);
        } else if (this.probes.customOptions.active === 'yes') {
          this.set('probeFilter', 'active');
          this.set('probeFilterLabel', PROBE_FILTER_LABELS['active']);
        } else if (this.probes.customOptions.active === 'no') {
          this.set('probeFilter', 'inactive');
          this.set('probeFilterLabel', PROBE_FILTER_LABELS['inactive']);
        }
      }
    }
  },

  actions: {
    setFilter(filter, dropdown) {
      dropdown.actions.close();
      this.set('probeFilter', filter);
      this.set('probeFilterLabel', PROBE_FILTER_LABELS[filter]);
      if (filter === 'active') {
        this.probes.applyCustomOptions({ active: 'yes' });
      } else if (filter === 'inactive') {
        this.probes.applyCustomOptions({ active: 'no' });
      } else {
        this.probes.applyCustomOptions({ active: 'all' });
      }
    }
  }
});
