import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import BuildFaviconMixin from 'travis/mixins/build-favicon';
import Ember from 'ember';

let { service } = Ember.inject;

export default TravisRoute.extend(BuildFaviconMixin, {
  flashes: service(),
  needsAuth: false,

  beforeModel() {
    this._super(...arguments);
    if(this.signedIn()) {
      this.setupPendo();
    }
    //this.get('auth').refreshUserData()
  },

  renderTemplate: function() {
    if (this.get('config').pro) {
      $('body').addClass('pro');
    }
    return this._super(...arguments);
  },

  activate() {
    var repos;
    this.get('stylesheetsManager').disable('dashboard');
    if (!config.pro) {
      repos = this.get('store').peekAll('repo');
      repos.forEach((repo) => {
        return this.subscribeToRepo(repo);
      });
      return repos.addArrayObserver(this, {
        willChange: 'reposWillChange',
        didChange: 'reposDidChange'
      });
    }
  },

  reposWillChange() {},

  reposDidChange(array, start, removedCount, addedCount) {
    var addedRepos;
    addedRepos = array.slice(start, start + addedCount);
    return addedRepos.forEach((repo) => {
      return this.subscribeToRepo(repo);
    });
  },

  subscribeToRepo: function(repo) {
    if (this.pusher) {
      return this.pusher.subscribe("repo-" + (repo.get('id')));
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

  setupPendo() {
    if(!window.pendo) {
      return;
    }

    let user = this.get('auth.currentUser');

    var options = {
      visitor: {
        id: user.get('id'),
        github_login: user.get('login'),
        email: user.get('email')
      }
    };

    window.pendo.identify(options);
  },

  actions: {
    redirectToGettingStarted() {
      // do nothing, we handle it only in index path
    },

    renderDefaultTemplate() {
      if (this.renderDefaultTemplate) {
        return this.renderDefaultTemplate();
      }
    },

    error(error) {
      var authController;
      if (error === 'needs-auth') {
        authController = Ember.getOwner(this).lookup('controller:auth');
        authController.set('redirected', true);
        return this.transitionTo('auth');
      } else {
        return true;
      }
    },

    renderFirstSync() {
      return this.transitionTo('first_sync');
    },

    afterSignIn() {
      var transition;
      this.setupPendo();
      this.get('flashes').clear();
      if (transition = this.auth.get('afterSignInTransition')) {
        this.auth.set('afterSignInTransition', null);
        return transition.retry();
      } else {
        return this.transitionTo('main');
      }
    },

    afterSignOut() {
      this.controllerFor('repos').reset();
      this.controllerFor('repo').reset();
      this.setDefault();
      if (this.get('config').pro) {
        return this.transitionTo('home-pro');
      } else {
        return this.transitionTo('home');
      }
    }
  }
});
