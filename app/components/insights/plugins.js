import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

const PLUGINS_FILTER_LABELS = {
  'active': 'Active Plugins',
  'all': 'All Plugins',
  'inactive': 'Inactive Plugins'
};

export default Component.extend({
  store: service(),
  accounts: service(),

  owner: reads('accounts.user'),

  showPluginsModal: false,
  pluginsFilterLabel: 'Active Plugins',
  pluginsFilter: 'active',

  plugins: reads('owner.insightsPlugins'),

  actions: {
    setFilter(filter, dropdown) {
      dropdown.actions.close();
      this.set('pluginsFilter', filter);
      this.set('pluginsFilterLabel', PLUGINS_FILTER_LABELS[filter]);
      if (filter === 'active') {
        this.plugins.applyCustomOptions({ active: true });
      } else if (filter === 'inactive') {
        this.plugins.applyCustomOptions({ active: false });
      } else {
        this.plugins.applyCustomOptions({ active: undefined });
      }
    }
  }
});
