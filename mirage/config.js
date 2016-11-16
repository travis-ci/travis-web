/* global server */
import Ember from 'ember';
import Mirage from 'ember-cli-mirage';
import config from 'travis/config/environment';

export default function () {
  if (config.environment === 'development' || config.environment === 'production') {
    this.passthrough(
      'https://api.travis-ci.org/users/**',
      'https://api.travis-ci.org/v3/**',
      'https://api.travis-ci.org/builds',
      'https://api.travis-ci.org/builds/**',
      'https://api.travis-ci.org/requests',
      'https://api.travis-ci.org/jobs',
      'https://api.travis-ci.org/jobs/**',
      'https://api.travis-ci.org/repos',
      'https://api.travis-ci.org/repos/**',
      'https://api.travis-ci.org/repo/**',
      'https://api.travis-ci.org/settings/**',
      'https://api.travis-ci.org/accounts',
      'https://api.travis-ci.org/hooks',
      'https://s3.amazonaws.com/**',
      'https://app.getsentry.com/**',
      'https://pnpcptp8xh9k.statuspage.io/api/v2/status.json'
    );
  }

  this.get('/accounts', (schema/* , request*/) => {
    const users = schema.users.all().models.map(user => Ember.merge(user.attrs, { type: 'user' }));
    const accounts = schema.accounts.all().models.map(account => account.attrs);

    return { accounts: users.concat(accounts) };
  });

  this.get('/hooks', function ({ hooks }, { queryParams: { owner_name } }) {
    return this.serialize(hooks.where({ owner_name }), 'v2');
  });

  this.put('/hooks/:id', (schema, request) => {
    const user = schema.hooks.find(request.params.id);
    server.create('repository', { id: request.params.id });
    return user.update(JSON.parse(request.requestBody).hook);
  });

  this.get('/users/:id', function ({ users }, request) {
    if (request.requestHeaders.Authorization === 'token testUserToken') {
      return this.serialize(users.find(request.params.id), 'v2');
    } else {
      return new Mirage.Response(403, {}, {});
    }
  });

  this.get('/users/permissions', (schema, request) => {
    const token = request.requestHeaders.Authorization.split(' ')[1];
    const user = schema.users.where({ token }).models[0];

    if (user) {
      const permissions = schema.permissions.where({ userId: user.id });

      return permissions.models.reduce((combinedPermissions, permissions) => {
        ['admin', 'push', 'pull', 'permissions'].forEach(property => {
          if (permissions.attrs[property]) {
            combinedPermissions[property].push(parseInt(permissions.repositoryId));
          }
        });

        return combinedPermissions;
      }, {
        admin: [],
        push: [],
        pull: [],
        permissions: []
      });
    } else {
      return {};
    }
  });

  this.get('/v3/broadcasts', schema => {
    return schema.broadcasts.all();
  });

  this.get('/repos', function (schema/* , request*/) {
    return schema.repositories.all();
  });

  this.get('/repo/:slug', function (schema, request) {
    let repos = schema.repositories.where({ slug: decodeURIComponent(request.params.slug) });

    return {
      repo: repos.models[0].attrs
    };
  });

  this.get('/v3/repo/:id/crons', function (schema/* , request*/) {
    return schema.crons.all();
  });

  this.get('/cron/:id');

  this.get('/repo/:id/settings', function (schema, request) {
    let settings = schema.settings.where({ repositoryId: request.params.id });

    return {
      user_settings: settings.models.map(setting => {
        return {
          name: setting.attrs.name,
          value: setting.attrs.value
        };
      })
    };
  });

  this.get('/repos/:id/caches', function (schema, request) {
    const caches = schema.caches.where({ repositoryId: request.params.id });
    return this.serialize(caches, 'v2');
  });

  this.get('/settings/env_vars', function (schema, request) {
    const envVars = schema.envVars.where({ repositoryId: request.queryParams.repository_id });

    return {
      env_vars: envVars.models.map(envVar => {
        envVar.attrs.repository_id = envVar.repositoryId;
        return envVar;
      })
    };
  });

  this.get('/settings/ssh_key/:repo_id', function (schema, request) {
    let sshKeys = schema.sshKeys.where({
      repositoryId: request.params.repo_id,
      type: 'custom'
    }).models[0];
    return this.serialize(sshKeys, 'v2');
  });

  this.get('/v3/repo/:id', function (schema, request) {
    return schema.repositories.find(request.params.id);
  });

  this.get('/v3/repo/:id/branches', function (schema) {
    return schema.branches.all();
  });

  this.get('/v3/owner/:login', function (schema, request) {
    return this.serialize(schema.users.where({ login: request.params.login }).models[0], 'owner');
  });

  this.get('/repos/:id/key', function (schema, request) {
    const key = schema.sshKeys.where({
      repositoryId: request.params.id,
      type: 'default'
    }).models[0];
    return {
      key: key.attrs.key,
      fingerprint: key.attrs.fingerprint
    };
  });

  this.get('/commits/:id', function (schema, request) {
    let commit = schema.commits.find(request.params.id);
    return new Mirage.Response(200, {}, commit.attrs);
  });

  this.get('/jobs/:id', function (schema, request) {
    let job = schema.jobs.find(request.params.id);
    return this.serialize(job, 'v2-job');
  });

  this.get('/jobs');

  this.get('/builds', function (schema/* , request*/) {
    return { builds: schema.builds.all().models.map(build => {
      if (build.commit) {
        build.attrs.commit_id = build.commit.id;
      }

      return build;
    }), commits: schema.commits.all().models };
  });

  this.get('/builds/:id', function (schema, request) {
    const build = schema.builds.find(request.params.id);
    const response = {
      build: build.attrs,
      jobs: build.jobs.models.map(job => job.attrs)
    };

    if (build.commit) {
      response.commit = build.commit.attrs;
    }

    return response;
  });

  this.post('/build/:id/restart', (schema, request) => {
    let build = schema.builds.find(request.params.id);
    if (build) {
      return {
        flash: [{ notice: 'The build was successfully restarted.' }],
        result: true
      };
    } else {
      return new Mirage.Response(404, {}, {});
    }
  });

  this.post('/build/:id/cancel', (schema, request) => {
    let build = schema.builds.find(request.params.id);
    if (build) {
      return new Mirage.Response(204, {}, {});
    } else {
      return new Mirage.Response(404, {}, {});
    }
  });

  this.post('/job/:id/restart', (schema, request) => {
    let job = schema.jobs.find(request.params.id);
    if (job) {
      return {
        flash: [{ notice: 'The job was successfully restarted.' }],
        result: true
      };
    } else {
      return new Mirage.Response(404, {}, {});
    }
  });

  this.post('/job/:id/cancel', (schema, request) => {
    let job = schema.jobs.find(request.params.id);
    if (job) {
      return new Mirage.Response(204, {}, {});
    } else {
      return new Mirage.Response(404, {}, {});
    }
  });

  this.get('/v3/repo/:repo_id/builds', function (schema, request) {
    const branch = schema.branches.where({ name: request.queryParams['branch.name'] }).models[0];
    const builds = schema.builds.where({ branchId: branch.id });

    /**
     * TODO remove this once the seializers/build is removed.
     * The modelName causes Mirage to know how to serialise it.
     */
    return this.serialize({
      models: builds.models.reverse(),
      modelName: 'build'
    }, 'v3');
  });

  this.get('/jobs/:id/log', function (schema, request) {
    let log = schema.logs.find(request.params.id);
    if (log) {
      return { log: { parts: [{ id: log.attrs.id, number: 1, content: log.attrs.content }] } };
    } else {
      return new Mirage.Response(404, {}, {});
    }
  });

  this.timing = 400; // default

  let featuresURL = config.environment === 'test' ? '/features' : 'https://api.travis-ci.org/features';
  this.get(featuresURL, function (schema) {
    let features = schema.features.all();
    if (features.models.length) {
      return this.serialize(features);
    } else {
      schema.db.features.insert([
        {
          name: 'Dashboard',
          description: 'UX improvements over the current implementation',
          enabled: true
        },
        {
          name: 'Show your Pride',
          description: 'Let 🌈in your heart (and travis)',
          enabled: true
        },
        {
          name: 'Do Nothing Feature',
          description: 'This feature does absolutely nothing',
          enabled: true
        }
      ]);
      return this.serialize(schema.features.all());
    }
  });

  let featurePutURL = config.environment === 'test' ? '/feature/:id' : 'https://api.travis-ci.org/feature/:id';
  this.put(featurePutURL, function (schema, request) {
    let feature = schema.features.find(request.params.id);
    let requestBody = JSON.parse(request.requestBody);
    feature.update('enabled', requestBody.enabled);
    return this.serialize(feature);
  });

  // UNCOMMENT THIS FOR LOGGING OF HANDLED REQUESTS
  // this.pretender.handledRequest = function (verb, path, request) {
  //   console.log('Handled this request:', `${verb} ${path}`, request);
  //   try {
  //     const responseJson = JSON.parse(request.responseText);
  //     console.log(responseJson);
  //   } catch (e) {}
  // };
}

/*
   You can optionally export a config that is only loaded during tests
   export function testConfig() {

   }
   */
