import Controller from '@ember/controller';
import { reads, equal, and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';

export const SECTION = {
  NONE: '',
  AUTH: 'api-auth',
  FEATURES: 'features',
  EMAIL: 'email',
  INSIGHTS: 'insights',
};

export const INSIGHTS_VIS_OPTIONS = [
  {
    key: 'private',
    displayValue: 'you',
    description: 'Do not allow everyone to see insights from your private builds',
    modalText: 'Do not allow everyone to see my private insights',
  }, {
    key: 'public',
    displayValue: 'everyone',
    description: 'Allow everyone to see insights from your private builds',
    modalText: 'Allow everyone to see my private build insights',
  }
];

export default Controller.extend({
  features: service(),
  api: service(),
  auth: service(),
  preferences: service(),
  flashes: service(),
  store: service(),

  queryParams: ['section'],
  section: SECTION.NONE,

  featureFlags: reads('model.featureFlags'),
  account: reads('model.account'),

  scrollToAuth: equal('section', SECTION.AUTH),
  scrollToFeatures: equal('section', SECTION.FEATURES),
  scrollToEmail: equal('section', SECTION.EMAIL),
  scrollToInsights: equal('section', SECTION.INSIGHTS),

  buildEmails: reads('preferences.buildEmails'),
  showResubscribeList: and('buildEmails', 'unsubscribedRepos.length'),

  privateInsightsVisibility: reads('preferences.privateInsightsVisibility'),
  insightsVisibilityOptions: computed(() => INSIGHTS_VIS_OPTIONS),

  customKeysLoaded: computed(function () {
    return this.auth.currentUser.customKeys;
  }),
  customKeys: computed('customKeysLoaded.[]', function () {
    return this.customKeysLoaded;
  }),

  isShowingAddKeyModal: false,

  userHasNoEmails: computed('auth.currentUser.emails', function () {
    return (!this.auth.currentUser.emails || this.auth.currentUser.emails.length === 0);
  }),

  userConfirmedAt: reads('auth.currentUser.confirmedAt'),

  confirmationButtonClass: computed('userHasNoEmails', function () {
    if (this.userHasNoEmails) { return 'button--white-and-teal disabled'; }

    return 'button--white-and-teal';
  }),

  toggleBuildEmails: task(function* (value) {
    try {
      yield this.preferences.set('build_emails', value);
    } catch (err) {
      this.flashes.clear();
      this.flashes.error('Something went wrong and your email settings were not saved.');
    }
  }).restartable(),

  setPrivateInsights: task(function* (val) {
    try {
      yield this.preferences.set('private_insights_visibility', val);
      this.flashes.clear();
      this.flashes.success(`Your private build insights are now ${val}.`);
    } catch (err) {
      this.flashes.clear();
      this.flashes.error('Something went wrong and your insights settings were not saved.');
    }
  }).restartable(),

  actions: {
    setInsightsVis(val) {
      this.setPrivateInsights.perform(val);
    },
    sendConfirmationEmail() {
      const { id } = this.auth.currentUser;
      this.flashes.success('The email has been sent. Please check your inbox and confirm your account.');
      this.api.get(`/auth/request_confirmation/${id}`, {'travisApiVersion': null});
    },
    toggleAddKeyModal() {
      this.toggleProperty('isShowingAddKeyModal');
    },
    customKeyDeleted(key) {
      const keys = this.get('customKeysLoaded');
      this.set('customKeysLoaded', keys.filter(obj => obj.id !== key.id));
    },
    customKeyAdded(key) {
      this.get('customKeysLoaded').pushObject(key);
    }
  },

  init() {
    this._super(...arguments);
    this.preferences.fetchPreferences.perform();
  },
});
