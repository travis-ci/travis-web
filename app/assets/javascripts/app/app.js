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

App.ApplicationController  = Em.Controller.extend();
App.RepositoriesController = Em.Controller.extend();
App.RepositoryController   = Em.Controller.extend();
App.TabsController         = Em.Controller.extend();
App.CurrentController      = Em.Controller.extend();
App.HistoryController      = Em.ArrayController.extend();
App.BuildController        = Em.Controller.extend();
App.LoadingController      = Em.Controller.extend();

App.ApplicationView        = Em.View.extend({ templateName: 'application' });
App.RepositoriesView       = Em.View.extend({ templateName: 'repositories' });
App.RepositoryView         = Em.View.extend({ templateName: 'repository' });
App.TabsView               = Em.View.extend({ templateName: 'tabs' });
App.CurrentView            = Em.View.extend({ templateName: 'current' });
App.HistoryView            = Em.View.extend({ templateName: 'history' });
App.BuildView              = Em.View.extend({ templateName: 'build' });
App.LoadingView            = Em.View.extend({ templateName: 'loading' });

App.store = App.Store.create();

var onReady = function(object, path, callback) {
  if(object.getPath(path)) {
    callback();
  } else {
    var observer = function() {
      object.removeObserver(path, observer);
      callback()
    };
    object.addObserver(path, observer);
  }
};

App.Router = Em.Router.extend({
  enableLogging: true,
  location: 'hash',

  serialize: function() {
    var ownerName = this.getPath('repositoryController.content.ownerName');
    var name = this.getPath('repositoryController.content.name');
    return { ownerName: ownerName, name: name };
  },

  connectLeft: function() {
    this.get('applicationController').connectOutlet({ outletName: 'left', name: 'repositories', context: App.Repository.find() })
  },

  connectLoading: function() {
    this.get('applicationController').connectOutlet({ outletName: 'main', name: 'loading' });
  },

  connectMain: function(repository, build) {
    this.setPath('tabsController.repository', repository);
    this.setPath('tabsController.build', build);

    this.get('applicationController').connectOutlet({ outletName: 'main', name: 'repository', context: repository });
    this.get('repositoryController').connectOutlet({ outletName: 'tabs', name: 'tabs' });
  },

  root: Em.Route.extend({
    viewRepository: Ember.Route.transitionTo('repository.current'),

    // why is applicationController undefined here? would like to share connecting the left outlet to repositories
    // connectOutlets: function(router) {
    //   router.connectLeft();
    // },

    index: Em.Route.extend({
      route: '/',

      connectOutlets: function(router) {
        router.connectLeft();
        router.connectLoading();

        var repositories = router.getPath('repositoriesController.content');
        // should observe RecordArray.isLoaded instead, but that doesn't seem to exist?
        onReady(repositories, 'firstObject.isLoaded', function() {
          router.connectMain(repositories.get('firstObject'), App.Build.find(1))
        });
      },

      viewCurrent: Ember.Route.transitionTo('repository.current'),
      viewHistory: Ember.Route.transitionTo('repository.history'),
      viewBuild:   Ember.Route.transitionTo('repository.build'),
    }),

    repository: Em.Route.extend({
      route: '/:ownerName/:name',

      connectOutlets: function(router) {
        router.connectLeft();
        router.connectLoading();

        // this would be a query for the repo based on path (how to retrieve the path here?)
        var repository = App.Repository.find(1);
        onReady(repository, 'isLoaded', function() {
          router.connectMain(repository, App.Build.find(1))
        })
      },

      viewCurrent: Ember.Route.transitionTo('current'),
      viewHistory: Ember.Route.transitionTo('history'),
      viewBuild:   Ember.Route.transitionTo('build'),

      current: Em.Route.extend({
        route: '/',

        serialize: function(router, context) {
          return router.serialize();
        },

        connectOutlets: function(router, context) {
          router.get('repositoryController').connectOutlet({ outletName: 'tab', name: 'current', context: App.Build.find(1)});
        }
      }),

      history: Em.Route.extend({
        route: '/builds',

        serialize: function(router, context) {
          return router.serialize();
        },

        connectOutlets: function(router, context) {
          router.get('repositoryController').connectOutlet({ outletName: 'tab', name: 'history', context: App.Build.find()});
        }
      }),

      build: Em.Route.extend({
        route: '/builds/:build_id',

        serialize: function(router, context) {
          return $.extend(router.serialize(), this._super(router, context));
        },

        connectOutlets: function(router, context) {
          params = { id: 1 }
          router.get('repositoryController').connectOutlet({ outletName: 'tab', name: 'build', context: App.Build.find(params.id)});
        }
      })
    })
  })
});

App.initialize();
