//= require_tree ./templates
//= require_self

App = Em.Application.create();
App.Store = DS.Store.extend({ revision: 4, adapter: DS.fixtureAdapter });

App.Repository = DS.Model.extend({
  ownerName: DS.attr('string'),
  name: DS.attr('string'),

  builds: DS.hasMany('App.Build', { key: 'build_ids' }),

  lastBuild: function() {
    return this.getPath('builds.firstObject');
  }.property()
});

App.Build = DS.Model.extend({
  number: DS.attr('number'),
  repository: DS.belongsTo('App.Repository')
});

App.Build.FIXTURES = [
  { id: 1, repositoryId: 1, repository_id: 1, number: 1 },
  { id: 2, repositoryId: 1, repository_id: 1, number: 2 },
  { id: 3, repositoryId: 2, repository_id: 2, number: 3 },
  { id: 4, repositoryId: 3, repository_id: 3, number: 4 }
];

App.Repository.FIXTURES = [
  { id: 1, owner_name: 'travis-ci', name: 'travis-core',   build_ids: [1, 2] },
  { id: 2, owner_name: 'travis-ci', name: 'travis-assets', build_ids: [3] },
  { id: 3, owner_name: 'travis-ci', name: 'travis-hub',    build_ids: [4] },
];

App.ApplicationController  = Em.Controller.extend();
App.RepositoriesController = Em.ArrayController.extend();
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

var onTrue = function(object, path, callback) {
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

var onLoaded = function(object, callback) {
  if(object) {
    var path = Ember.isArray(object) ? 'firstObject.isLoaded' : 'isLoaded';
    // should observe RecordArray.isLoaded instead, but that doesn't seem to exist?
    onTrue(object, path, function() {
      callback(Ember.isArray(object) ? object.get('firstObject') : object);
    });
  } else {
    callback(object);
  }
}

App.Router = Em.Router.extend({
  enableLogging: true,
  location: 'hash',

  root: Em.Route.extend({
    viewRepository: Ember.Route.transitionTo('current'),

    index: Em.Route.extend({
      route: '/',

      connectOutlets: function(router) {
        router.connectLayout({}, function(repository) {
          router.connectCurrent(repository.get('lastBuild'));
        });
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
        var params = router.serializeRepository(repository);
        router.connectLayout(params, function(repository) {
          router.connectCurrent(repository.get('lastBuild'));
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
        var params = router.serializeRepository(repository);
        router.connectLayout(params, function(repository) {
          var builds = repository.get('builds');
          // why do i have to wait here. is repo.isLoaded true before the hasMany array is loaded?
          onLoaded(builds, function() {
            router.connectHistory(builds)
          })
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
        router.connectLayout(params, function(repository, build) {
          router.connectBuild(build)
        });
      }
    }),
    viewBuild: Ember.Route.transitionTo('build')
  }),

  serializeRepository: function(repository) {
    if(repository instanceof DS.Model) {
      return repository.getProperties('ownerName', 'name');
    } else {
      return repository || {};
    }
  },

  serializeBuild: function(build) {
    if(build instanceof DS.Model) {
      var repository = build.get('repository')
      // var repository = App.Repository.find(build.get('repositoryId')); // wat.
      var params = this.serializeRepository(repository);
      return $.extend(params, { id: build.get('id') });
    } else {
      return build || {};
    }
  },

  connectLayout: function(params, callback) {
    var repositories = App.Repository.find();
    this.connectLeft(repositories);
    this.connectMain(repositories, params, callback);
    this.connectRight();
  },

  connectLeft: function(repositories) {
    this.get('applicationController').connectOutlet({ outletName: 'left', name: 'repositories', context: repositories })
  },

  connectRight: function() {
    // this.get('applicationController').connectOutlet({ outletName: 'right', name: 'sidebar' })
  },

  connectLoading: function() {
    this.get('applicationController').connectOutlet({ outletName: 'main', name: 'loading' });
  },

  connectMain: function(repositories, params, callback) {
    this.connectLoading();

    if(params.ownerName && params.name) {
      // needs to implement findQuery
      // var repositories = App.Repository.find(params);
      repositories = App.Repository.find().filter(function(data) {
        return data.get('owner_name') == params.owner_name && data.get('name') == params.name;
      })
    }
    var build = params.id ? App.Build.find(params.id) : undefined;

    onLoaded(repositories, function(repository) {
      onLoaded(build, function(build) {
        this.connectTabs(repository, build);
        this.connectRepository(repository);
        callback(repository, build);
      }.bind(this));
    }.bind(this));
  },

  connectRepository: function(repository) {
    this.get('applicationController').connectOutlet({ outletName: 'main', name: 'repository', context: repository });
  },

  connectTabs: function(repository, build) {
    this.setPath('tabsController.repository', repository);
    this.setPath('tabsController.build', build);
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
