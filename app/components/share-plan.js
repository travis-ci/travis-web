
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, reads, empty } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  router: service(),
  auth: service(),
  store: service(),
  accounts: service(),
  owner: alias('account'),
  v2subscription: reads('owner.v2subscription'),
  isV2SubscriptionEmpty: empty('v2subscription'),
  isOrganization: reads('owner.isOrganization'),
  user: reads('auth.currentUser'),
  allSelected: false,
  filter: '',
  isDonorUser: reads('owner.isUser'),

  init() {
    this._super(...arguments);
    if (!this.account.v2subscriptions) {
      this.accounts.fetchV2Subscriptions.perform().then(() => {
        let orgs = this.fetchPlanShares();
        for (let org of orgs) {
          org.set('selectedToSwitch', false);
        }
      });
    } else {
      let orgs = this.fetchPlanShares();
      for (let org of orgs) {
        org.set('selectedToSwitch', false);
      }
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
    const shares = this.v2subscription?.planShares;
    if (shares) {
      for (let planShare of shares.toArray()) {
        let found = false;
        for (let org of result) {
          if (planShare.receiver.id == org.id) {
            found = true;
          }
        }
        if (!found) {
          let org = {
            id: planShare.receiver.id,
            login: `${planShare.receiver.login} [removed from organization]`,
            onSharedPlan: true,
            planSharedFrom: this.getDate(planShare.created_at),
            set: function (key, value) {
              switch (key) {
                case 'onSharedPlan':
                  self.onSharedPlan = value;
                  break;
                default:
                  break;
              }
            }
          };
          result.push(org);
        }
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

        let planShare = this.getShared(org.id);
        if (planShare != null) {
          org.set('onSharedPlan', true);
          org.set('planSharedFrom', this.getDate(planShare.created_at));
        } else {
          org.set('onSharedPlan', false);
          org.set('planSharedFrom', '-');
        }
        result.push(org);
      }
    }
    return result;
  },

  orgPlaceholder: computed(function () {
    return `${this.user.isAssembla ? 'Spaces' : 'Organizations'}`;
  }),

  filterPlaceholder: computed(function () {
    return `Filter ${this.user.isAssembla ? 'Assembla Spaces' : 'Organizations'}`;
  }),

  getDate(val = null) {
    const date = val == null ? new Date() : new Date(val);
    return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
  },

  hasOwnPlan(org) {
    return (org.v2subscription && (!org.v2subscription.sharedBy || org.v2subscription.sharedBy != this.owner.id)) || org.subscription != null;
  },

  getShared(id) {
    const shares = this.owner.v2subscription?.planShares;
    if (shares != null) {
      for (let planShare of shares.toArray()) {
        if (planShare.donor?.id == this.owner.id && planShare.receiver?.id == id) return planShare;
      }
    }
    return null;
  },

  switchShare(org, value) {
    if (value) {
      org.set('onSharedPlan', true);
      org.set('planSharedFrom', this.getDate());
      this.v2subscription.share.perform(org);
    } else {
      org.set('onSharedPlan', false);
      org.set('planSharedFrom', '-');
      this.v2subscription.delete_share.perform(org);
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
    if (!window.confirm('Are you sure you want to stop sharing these plans?')) {
      return;
    }
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
      if (value === false && !window.confirm('Are you sure you want to stop sharing this plan?')) {
        return;
      }
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
