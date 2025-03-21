
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, reads, empty } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  router: service(),
  auth: service(),
  store: service(),
  owner: alias('account'),
  v2subscription: reads('owner.v2subscription'),
  isV2SubscriptionEmpty: empty('v2subscription'),
  isOrganization: reads('owner.isOrganization'),
  user: reads('auth.currentUser'),
  allSelected: false,
  filter: '',

  init() {
    this._super(...arguments);
    let orgs = this.fetchPlanShares();
    for (let org of orgs) {
      org.set('selectedToSwitch', false);
    }
  },

  planShares: computed('v2subscription', 'user', 'owner', 'filter', 'allSelected', function () {
    let result = [];
    const orgs = this.user.accounts.organizations?.toArray() || [];
    for (let org of orgs) {
      if (org.id != this.owner.id || !this.isOrganization) {
        if (this.filter != '' &&
            (
              org.login != null && org.login.indexOf(this.filter) < 0 ||
              org.fullName != null && org.fullName.indexOf(this.filter) < 0
            )
        ) continue;

        if (this.hasOwnPlan(org)) continue;
        result.push(org);
      }
    }
    return result;
  }),

  fetchPlanShares() {
    let result = [];
    const orgs = this.user.accounts.organizations?.toArray() || [];
    for (let org of orgs) {
      if (org.id != this.owner.id || !this.isOrganization) {
        if (this.hasOwnPlan(org)) continue;

        let p = this.getShared(org.id);
        if (p != null) {
          org.set('onSharedPlan', true);
          org.set('planSharedFrom', this.getDate(p.created_at));
        } else {
          org.set('onSharedPlan', false);
          org.set('planSharedFrom', '-');
        }
        result.push(org);
      }
    }
    return result;
  },

  filterPlaceholder: computed(function () {
    return `Filter ${this.user.isAssembla ? 'Assembla Spaces' : 'Organizations'}`;
  }),

  getDate(val = null) {
    const date = val == null ? new Date() : new Date(val);
    return date.toLocaleDateString();
  },

  hasOwnPlan(org) {
    return (org.v2subscription && (!org.v2subscription.sharedBy || org.v2subscription.sharedBy != this.owner.id)) || org.subscription != null;
  },

  getShared(id) {
    const shares = this.owner.v2subscription?.planShares;
    if (shares != null) {
      for (let p of shares.toArray()) {
        if (p.donor?.id == this.owner.id && p.receiver?.id == id) return p;
      }
    }
    return null;
  },

  switchShare(org, value) {
    if (value) {
      org.set('onSharedPlan', true);
      org.set('planSharedFrom', this.getDate());
      this.v2subscription.share.perform(org.id);
    } else {
      org.set('onSharedPlan', false);
      org.set('planSharedFrom', '-');
      this.v2subscription.delete_share.perform(org.id);
    }
  },

  bulkShare: task(function* () {
    let orgs = this.fetchPlanShares();
    let ids = [];
    for (let org of orgs) {
      if (org.selectedToSwitch) {
        ids.push(org.id);
        org.set('onSharedPlan', true);
        org.set('planSharedFrom', this.getDate());
      }
    }
    yield this.v2subscription.shareMultiple.perform(ids, true);
  }).drop(),

  bulkUnshare: task(function* () {
    let ids = [];
    let orgs = this.fetchPlanShares();
    for (let org of orgs) {
      if (org.selectedToSwitch) {
        ids.push(org.id);
        org.set('onSharedPlan', false);
        org.set('planSharedFrom', '-');
      }
    }
    yield this.v2subscription.shareMultiple.perform(ids, false);
  }).drop(),

  actions: {
    setShared(org, value) {
      this.switchShare(org, value);
    },

    setFilter(ev) {
      this.set('filter', event.target.value);
    },

    switchAll() {
      let orgs = this.fetchPlanShares();
      for (let org of orgs) {
        org.set('selectedToSwitch', !this.allSelected);
      }
      this.set('allSelected', !this.allSelected);
    },
    switchOrgSelection(org) {
      org.set('selectedToSwitch', !org.selectedToSwitch);
    },
  }

});
