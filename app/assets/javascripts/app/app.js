//= require_tree ./templates
//= require_self

App = Em.Application.create();
App.Store = DS.Store.extend({ revision: 4, adapter: DS.fixtureAdapter });

App.Repository = DS.Model.extend({
  ownerName: DS.attr('string'),
  name:      DS.attr('string')
});
App.Build = DS.Model.extend({
  number: DS.attr('number')
});

App.Repository.FIXTURES = [{ id: 1, owner_name: 'travis-ci', name: 'travis-core' }];
App.Build.FIXTURES      = [{ id: 1, number: 1 }, { id: 2, number: 2 }];

App.ApplicationController = Em.Controller.extend();
App.RepositoryController  = Em.Controller.extend();
App.TabsController        = Em.Controller.extend();
App.CurrentController     = Em.Controller.extend();
App.HistoryController     = Em.ArrayController.extend();
App.BuildController       = Em.Controller.extend();

App.ApplicationView       = Em.View.extend({ templateName: 'application' });
App.RepositoryView        = Em.View.extend({ templateName: 'repository' });
App.TabsView              = Em.View.extend({ templateName: 'tabs' });
App.CurrentView           = Em.View.extend({ templateName: 'current' });
App.HistoryView           = Em.View.extend({ templateName: 'history' });
App.BuildView             = Em.View.extend({ templateName: 'build' });

App.store = App.Store.create();

App.Router = Em.Router.extend({
  enableLogging: true,
  location: 'hash',

  root: Em.Route.extend({
    index: Ember.Route.extend({
      route: '/',
      redirectsTo: 'repository'
    }),

    repository: Em.Route.extend({
      route: '/:repository_ownerName/:repository_name',

      viewCurrent: Ember.Route.transitionTo('current'),
      viewHistory: Ember.Route.transitionTo('history'),
      viewBuild:   Ember.Route.transitionTo('build'),

      enter: function(router) {
        router.get('applicationController').connectOutlet({ name: 'repository', context: App.store.find(App.Repository, 1) });
      },

      current: Em.Route.extend({
        route: '/',
        connectOutlets: function(router, context) {
          router.get('repositoryController').connectOutlet({ name: 'current', context: App.store.find(App.Build, 1)});
        }
      }),

      history: Em.Route.extend({
        route: '/builds',
        connectOutlets: function(router, context) {
          router.get('repositoryController').connectOutlet({ name: 'history', context: App.store.findAll(App.Build)});
        }
      }),

      build: Em.Route.extend({
        route: '/builds/:build_id',
        connectOutlets: function(router, context) {
          params = { id: 1 }
          router.get('repositoryController').connectOutlet({ name: 'build', context: App.store.find(App.Build, params.id)});
        }
      })
    })
  })
});

App.initialize();

