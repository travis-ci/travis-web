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

  didRender() {
    if (this.plugins && Object.keys(this.plugins.customOptions).length > 0) {
      if (this.plugins.customOptions.active === 'all') {
        this.set('pluginsFilter', 'all');
        this.set('pluginsFilterLabel', PLUGINS_FILTER_LABELS['all']);
      } else if (this.plugins.customOptions.active === 'yes') {
        this.set('pluginsFilter', 'active');
        this.set('pluginsFilterLabel', PLUGINS_FILTER_LABELS['active']);
      } else if (this.plugins.customOptions.active === 'no') {
        this.set('pluginsFilter', 'inactive');
        this.set('pluginsFilterLabel', PLUGINS_FILTER_LABELS['inactive']);
      }
    }
  },

  actions: {
    setFilter(filter, dropdown) {
      dropdown.actions.close();
      this.set('pluginsFilter', filter);
      this.set('pluginsFilterLabel', PLUGINS_FILTER_LABELS[filter]);
      if (filter === 'active') {
        this.plugins.applyCustomOptions({ active: 'yes' });
      } else if (filter === 'inactive') {
        this.plugins.applyCustomOptions({ active: 'no' });
      } else {
        this.plugins.applyCustomOptions({ active: 'all' });
      }
    }
  }
});
