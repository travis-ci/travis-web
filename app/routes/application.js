/* global Travis */
import URL from 'url';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import BuildFaviconMixin from 'travis/mixins/build-favicon';
import { inject as service } from '@ember/service';
import {
  bindKeyboardShortcuts,
  unbindKeyboardShortcuts
} from 'ember-keyboard-shortcuts';

export default TravisRoute.extend(BuildFaviconMixin, {
  router: service(),
  store: service(),
  auth: service(),
  features: service(),
  featureFlags: service(),
  flashes: service(),
  repositories: service(),
  storage: service(),
  wizard: service('wizard-state'),
  queryParams: {
    selectedPlanId: null,
  },

  needsAuth: false,

  init() {
    this.featureFlags;

    this.auth.afterSignOut(() => {
      this.afterSignOut();
    });

    return this._super(...arguments);
  },

  beforeModel() {
    return this.auth.autoSignIn();
  },

  model(model, transition) {
    console.log('plan id' + model.selectedPlanId);
    if (model.selectedPlanId) {
      this.storage.selectedPlanId = model.selectedPlanId;
    }
    if (this.auth.signedIn) {
      this.wizard.fetch.perform().then(() => { this.storage.wizardStep = this.wizard.state; });

      return this.get('featureFlags.fetchTask').perform();
    }
  },

  activate() {
    this.setupRepoSubscriptions();
    bindKeyboardShortcuts(this);
  },

  deactivate() {
    unbindKeyboardShortcuts(this);
  },

  // We send pusher updates through user channels now and this means that if a
  // user is not a collaborator of a repo or a user is not signed in, we need to
  // use repo channels for updates for each repo. This method ensures that a
  // visitor is subscribed to all of the public repos in the store as long as
  // they're not a collaborator. It also sets up an observer to subscribe to any
  // new repo that enters the store.
  setupRepoSubscriptions() {
    this.store.filter('repo', null,
      (repo) => !repo.get('private') && !repo.get('isCurrentUserACollaborator'),
      ['private', 'isCurrentUserACollaborator']
    ).then(repos => {
      this.store.subscribe(repos, 'repo', null,
        (repo) => !repo.get('private') && !repo.get('isCurrentUserACollaborator'),
        ['private', 'isCurrentUserACollaborator'], this.reposWillChange, this.reposDidChange);

      /*
      repos.addArrayObserver(this, {
        willChange: 'reposWillChange',
        didChange: 'reposDidChange'
      });*/
    });
  },

  reposWillChange(repos, thiz) {
    console.log('BEFORE');
    repos.forEach(repo => console.log(repo));
  },

  reposDidChange(repos, thiz) {
    console.log('AFTER');
    repos.forEach(repo => console.log(repo));
    repos.forEach(repo => thiz.subscribeToRepo(repo));
  },

  unsubscribeFromRepo: function (repo) {
    if (this.pusher && repo) {
      this.pusher.unsubscribe(`repo-${repo.get('id')}`);
    }
  },

  subscribeToRepo: function (repo) {
    if (this.pusher) {
      this.pusher.subscribe(`repo-${repo.get('id')}`);
    }
  },

  title(titleParts) {
    if (titleParts.length) {
      titleParts = titleParts.reverse();
      titleParts.push('Travis CI');
      return titleParts.join(' - ');
    } else {
      return config.defaultTitle;
    }
  },

  keyboardShortcuts: {
    'up': {
      action: 'disableTailing',
      preventDefault: false
    },
    'down': {
      action: 'disableTailing',
      preventDefault: false
    }
  },

  actions: {
    signIn(runAfterSignIn = true) {
      this.auth.signIn();
      if (runAfterSignIn) {
        this.afterSignIn();
      }
    },

    signOut() {
      this.auth.signOut();
    },

    disableTailing() {
      Travis.tailing.stop();
    },

    redirectToGettingStarted() {
      // keep as a no-op as this bubbles from other routes
    },

    error(error) {
      if (error === 'needs-auth') {
        const currentURL = new URL(window.location.href);
        const redirectUrl = currentURL.href;
        const queryParams = { redirectUrl };
        return this.router.transitionTo('signin', { queryParams });
      } else {
        return true;
      }
    },
  },

  afterSignIn() {
    this.flashes.clear();
    let transition = this.get('auth.afterSignInTransition');
    if (transition) {
      this.set('auth.afterSignInTransition', null);
      return transition.retry();
    } else {
      return this.router.transitionTo('index');
    }
  },

  afterSignOut() {
    try {
      this.featureFlags.reset();
      this.set('repositories.accessible', []);
      this.setDefault();
      if (this.get('features.enterpriseVersion')) {
        return this.router.transitionTo('signin');
      }
      return this.router.transitionTo('index');
    } catch (error) {}
  },
});
