import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { EVENTS } from 'travis/utils/dynamic-query';

const { PAGE_CHANGED } = EVENTS;

export default TravisRoute.extend({
  features: service(),
  accounts: service(),

  owner: reads('accounts.user'),

  page: 1,

  queryParams: {
    page: {
      refreshModel: true
    }
  },

  model({ page }) {
    this.setProperties({ page });
  },

  afterModel() {
    const { owner } = this;
    if (owner && !owner.error) {
      owner.insightsProbes.switchToPage(this.page);
    }
  },

  redirect() {
    const { owner } = this;
    if (owner && !owner.error) {
      this.owner.insightsProbes.on(PAGE_CHANGED, page => {
        const queryParams = { page };
        this.transitionTo({ queryParams });
      });
    }
  },
});
