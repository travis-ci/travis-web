/* global server */
import Ember from 'ember';
import Mirage from 'ember-cli-mirage';
import config from 'travis/config/environment';

const { apiEndpoint } = config;

export default function () {
  this.namespace = apiEndpoint;

  this.get('/users/:id');
  this.get('/accounts', (schema/* , request*/) => {
    const users = schema.users.all().models.map(user => Ember.merge(user.attrs, { type: 'user' }));
    const accounts = schema.accounts.all().models.map(account => account.attrs);

    return { accounts: users.concat(accounts) };
  });

  this.get('/hooks', function ({ hooks }, { queryParams: { owner_name } }) {
    return this.serialize(hooks.where({ owner_name }), 'hook');
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

  this.get('/broadcasts', schema => {
    return schema.broadcasts.all();
  });

  this.get('/repos', function (schema/* , request*/) {
    return schema.repositories.all();
  });

  this.get('/repo/:slug_or_id', function (schema, request) {
    if (request.params.slug_or_id.match(/^\d+$/)) {
      return schema.repositories.find(request.params.slug_or_id);
    } else {
      let slug = request.params.slug_or_id;
      let repos = schema.repositories.where({ slug: decodeURIComponent(slug) });

      return repos.models[0];
    }
  });

  this.get('/repo/:repositoryId/crons', function (schema, request) {
    const { repositoryId } = request.params;
    return this.serialize(schema.crons.where({ repositoryId }), 'cron');
  });

  this.get('/cron/:id');

  this.get('/repo/:id/settings', function (schema, request) {
    let settings = schema.settings.where({ repositoryId: request.params.id });

    return {
      settings: settings.models.map(setting => {
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

  this.patch('/settings/ssh_key/:repository_id', function (schema, request) {
    const sshKeys = schema.sshKeys.where({ repositoryId: request.queryParams.repository_id });
    const [sshKey] = sshKeys.models;
    if (sshKey) {
      return {
        ssh_key: {
          id: sshKey.id,
          description: sshKey.description,
          value: sshKey.value,
        },
      };
    } else {
      const created = server.create('ssh_key', request.params);
      return {
        ssh_key: {
          id: created.id,
          description: created.description,
          value: created.value,
        }
      };
    }
  });

  this.post('/settings/env_vars', function (schema, request) {
    const envVar = server.create('env_var', request.params);
    return {
      env_var: {
        id: envVar.id,
        name: envVar.name,
        public: envVar.public,
        repository_id: request.params.repository_id,
      },
    };
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

  this.get('/repo/:repository_id/branches', function (schema) {
    return schema.branches.all();
  });

  this.get('/settings/ssh_key/:repo_id', function (schema, request) {
    let sshKeys = schema.sshKeys.where({
      repositoryId: request.params.repo_id,
      type: 'custom'
    }).models[0];
    return this.serialize(sshKeys, 'v2');
  });

  this.get('/owner/:login', function (schema, request) {
    return this.serialize(schema.users.where({ login: request.params.login }).models[0], 'owner');
  });

  this.delete('/settings/ssh_key/:repo_id', function (schema, request) {
    schema.sshKeys
      .where({ repositoryId: request.queryParams.repository_id })
      .models
      .map(sshKey => sshKey.destroyRecord());

    return new Mirage.Response(204, {}, {});
  });

  this.get('/settings/ssh_key/:repo_id', function (schema, request) {
    const repo = schema.repositories.find(request.params.repo_id);
    const { customSshKey } = repo;
    return {
      ssh_key: {
        id: 1,
        description: customSshKey.description,
        fingerprint: customSshKey.fingerprint,
      }
    };
  });

  this.get('/repos/:id/key', function (schema, request) {
    const repo = schema.repositories.find(request.params.id);
    const { defaultSshKey } = repo;
    return {
      fingerprint: defaultSshKey.fingerprint,
      key: '-----BEGIN PUBLIC KEY-----',
    };
  });

  this.get('/jobs/:id', function (schema, request) {
    let job = schema.jobs.find(request.params.id);
    return this.serialize(job, 'v2-job');
  });

  this.get('/jobs');

  this.get('/build/:id');

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

  this.get('/repo/:repo_id/builds', function (schema, request) {
    let builds = schema.builds.where({ repositoryId: request.params.repo_id });

    let branchName = request.queryParams['branch.name'];
    if (branchName) {
      builds = builds.filter(build => (build.branch && build.branch.attrs.name) === branchName);
    }

    let offset = request.queryParams.offset;
    if (offset) {
      builds = builds.slice(offset);
    }

    if (request.queryParams.event_type !== 'pull_request') {
      builds = builds.filter(build => build.attrs.event_type !== 'pull_request');
    } else {
      builds = builds.filter(build => build.attrs.event_type === 'pull_request');
    }

    if (!request.queryParams.sort_by) {
      builds = builds.sort((a, b) => {
        return parseInt(a.id) > parseInt(b.id) ? -1 : 1;
      });
    } else if (request.queryParams.sort_by === 'finished_at:desc') {
      builds = builds.sort((a, b) => {
        const aBuildNumber = parseInt(a.attrs.number);
        const bBuildNumber = parseInt(b.attrs.number);

        return aBuildNumber > bBuildNumber ? -1 : 1;
      });
    }

    /**
      * TODO remove this once the seializers/build is removed.
      * The modelName causes Mirage to know how to serialise it.
      */
    return this.serialize(builds, 'build');
  });

  this.get('/jobs/:id/log', function (schema, request) {
    let log = schema.logs.find(request.params.id);
    if (log) {
      return { log: { parts: [{ id: log.attrs.id, number: 1, content: log.attrs.content }] } };
    } else {
      return new Mirage.Response(404, {}, {});
    }
  });

  this.get('/user/:user_id/beta_features', function (schema) {
    let features = schema.features.all();
    if (features.models.length) {
      return this.serialize(features);
    } else {
      schema.db.features.insert([
        {
          name: 'Dashboard',
          description: 'UX improvements over the current implementation',
          enabled: false
        },
        {
          name: 'Show your Pride',
          description: 'Let 🌈 in your heart (and Travis CI)',
          enabled: false
        },
        {
          name: 'Comic Sans',
          description: 'Don\'t you miss those days?',
          enabled: false
        }
      ]);
      return this.serialize(schema.features.all());
    }
  });

  this.put('/user/:user_id/beta_feature/:feature_id', function (schema, request) {
    let feature = schema.features.find(request.params.feature_id);
    let requestBody = JSON.parse(request.requestBody);
    feature.update('enabled', requestBody.enabled);
    return this.serialize(feature);
  });
}

/*
   You can optionally export a config that is only loaded during tests
   export function testConfig() {

   }
   */
