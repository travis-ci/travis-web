/* global server */
import Ember from 'ember';
import Mirage from 'ember-cli-mirage';

export default function () {
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

  this.get('/v3/repo/:repositoryId/crons', function (schema, request) {
    const { repositoryId } = request.params;
    return this.serialize(schema.crons.where({ repositoryId }), 'cron');
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

  this.get('/v3/repo/:id', function (schema, request) {
    return schema.repositories.find(request.params.id);
  });

  this.get('/v3/repo/:repository_id/branches', function (schema) {
    return schema.branches.all();
  });

  this.get('/v3/owner/:login', function (schema, request) {
    return this.serialize(schema.users.where({ login: request.params.login }).models[0], 'owner');
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

  this.get('/commits/:id', function (schema, request) {
    let commit = schema.commits.find(request.params.id);
    return new Mirage.Response(200, {}, commit.attrs);
  });

  this.get('/jobs/:id', function (schema, request) {
    let job = schema.jobs.find(request.params.id);
    return this.serialize(job, 'v2-job');
  });

  this.get('/jobs');

  this.get('/builds', function (schema, { queryParams:
    { event_type: eventType, after_number: afterNumber, ids } }) {
    const allBuilds = schema.builds.all();
    let builds;

    if (afterNumber) {
      builds = allBuilds.models.filter(build => build.number < afterNumber);
    } else if (ids) {
      builds = allBuilds.models.filter(build => ids.indexOf(build.id) > -1);
    } else if (eventType === 'pull_request') {
      builds = allBuilds.models;
    } else {
      // This forces the Show more button to show in the build history test
      builds = allBuilds.models.slice(0, 3);
    }

    return { builds: builds.map(build => {
      if (build.commit) {
        build.attrs.commit_id = build.commit.id;
      }

      if (build.jobs) {
        build.attrs.job_ids = build.jobs.models.map(job => job.id);
      }

      return build;
    }), commits: builds.map(build => build.commit) };
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
