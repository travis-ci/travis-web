//= require_tree ./templates
//= require_self

App = Em.Application.create();
App.Store = DS.Store.extend({ revision: 4, adapter: DS.fixtureAdapter });

App.Repository = DS.Model.extend({
  ownerName: DS.attr('string'),
  name:      DS.attr('string')
});
App.Repository.FIXTURES = [
  { id: 1, owner_name: 'travis-ci', name: 'travis-core' },
  { id: 2, owner_name: 'travis-ci', name: 'travis-assets' },
  { id: 3, owner_name: 'travis-ci', name: 'travis-hub' }
];

App.Build = DS.Model.extend({
  repository_id: DS.attr('number'),
  number: DS.attr('number'),
  repository: DS.belongsTo('App.Repository')
});
App.Build.FIXTURES = [
  { id: 1, repository_id: 1, number: 1 },
  { id: 2, repository_id: 1, number: 2 },
  { id: 3, repository_id: 2, number: 3 },
  { id: 4, repository_id: 3, number: 4 }
];

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

var onRepositoryLoaded = function(object, callback) {
  // should observe RecordArray.isLoaded instead, but that doesn't seem to exist?
  var path = Ember.isArray(object) ? 'firstObject.isLoaded' : 'isLoaded';
  onReady(object, path, function() {
    callback(object.get('firstObject') || object)
  });
}

App.Router = Em.Router.extend({
  enableLogging: true,
  location: 'hash',

  root: Em.Route.extend({
    viewRepository: Ember.Route.transitionTo('current'),

    index: Em.Route.extend({
      route: '/',

      connectOutlets: function(router) {
        router.connectLayout(null, null, function(repository) {
          // should use repository.lastBuild()
          router.connectCurrent(Build.find(1))
        })
      },

      viewCurrent: Ember.Route.transitionTo('current'),
      viewHistory: Ember.Route.transitionTo('history'),
      viewBuild:   Ember.Route.transitionTo('build'),
    }),

    current: Em.Route.extend({
      route: '/:ownerName/:name',

      serialize: function(router, repository) {
        return router.serializeRepository(repository);
      },

      connectOutlets: function(router, repository) {
        params = router.serializeRepository(repository);
        // needs to implement findQuery
        // var repositories = App.Repository.find(params);
        var repositories = App.Repository.find().filter(function(data) {
          return data.get('owner_name') == params.owner_name && data.get('name') == params.name;
        })

        router.connectLayout(repositories, null, function(repository) {
          // should use repository.lastBuild()
          router.connectCurrent(App.Build.find(1))
        });
      }
    }),
    viewCurrent: Ember.Route.transitionTo('current'),

    history: Em.Route.extend({
      route: '/:ownerName/:name/builds',

      serialize: function(router, repository) {
        return router.serializeRepository(repository);
      },

      connectOutlets: function(router, repository) {
        params = router.serializeRepository(repository);
        // needs to implement findQuery
        // var repositories = App.Repository.find(params);
        var repositories = App.Repository.find().filter(function(data) {
          return data.get('owner_name') == params.owner_name && data.get('name') == params.name;
        })

        router.connectLayout(repository, null, function(repository) {
          router.connectHistory(App.Build.find())
        });
      }
    }),
    viewHistory: Ember.Route.transitionTo('history'),

    build: Em.Route.extend({
      route: '/:ownerName/:name/builds/:id',

      serialize: function(router, build) {
        return router.serializeBuild(build);
      },

      connectOutlets: function(router, build) {
        params = router.serializeBuild(build);
        // needs to implement findQuery
        // var repositories = App.Repository.find(params);
        var repositories = App.Repository.find().filter(function(data) {
          return data.get('owner_name') == params.owner_name && data.get('name') == params.name;
        })
        var build = App.Build.find(params.id)

        router.connectLayout(repositories, build, function(repository) {
          router.connectBuild(build)
        });
      }
    }),
    viewBuild: Ember.Route.transitionTo('build')
  }),

  serializeRepository: function(repository) {
    return repository.getProperties ? repository.getProperties('ownerName', 'name') : repository;
  },

  serializeBuild: function(build) {
    if(build && build.get) {
      var repository = build.get('repository') || App.Repository.find(build.get('repository_id')); // wat.
      var params = this.serializeRepository(repository);
      return $.extend(params, { id: build.get('id') });
    } else {
      return build;
    }
  },

  connectLayout: function(repository, build, callback) {
    var repositories = App.Repository.find();

    this.connectLeft(repositories);
    this.connectLoading();

    onRepositoryLoaded(repository || repositories, function(repository) {
      this.connectMain(repository, build)
      callback(repository);
    }.bind(this));
  },

  connectLeft: function(repositories) {
    this.get('applicationController').connectOutlet({ outletName: 'left', name: 'repositories', context: repositories })
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

  connectCurrent: function(build) {
    this.get('repositoryController').connectOutlet({ outletName: 'tab', name: 'current', context: build});
  },

  connectHistory: function(builds) {
    this.get('repositoryController').connectOutlet({ outletName: 'tab', name: 'history', context: builds});
  },

  connectBuild: function(build) {
    this.get('repositoryController').connectOutlet({ outletName: 'tab', name: 'build', context: build});
  }
});

App.initialize();
