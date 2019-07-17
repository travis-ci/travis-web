/* global server */
import { Response } from 'ember-cli-mirage';
import config from 'travis/config/environment';
import fuzzysort from 'fuzzysort';

const { validAuthToken, apiEndpoint } = config;

export default function () {
  const _defaultHandler = this.pretender._handlerFor;

  this.pretender._handlerFor = function (verb, path, request) {
    const authHeader = request.requestHeaders.Authorization;
    if (authHeader && authHeader !== `token ${validAuthToken}`) {
      return _defaultHandler.apply(this, ['GET', '/unauthorized', request]);
    }
    return _defaultHandler.apply(this, arguments);
  };

  this.get('https://pnpcptp8xh9k.statuspage.io/api/v2/status.json', function () {
    return {
      'page': {
        'id': 'pnpcptp8xh9k',
        'name': 'Travis CI',
        'url': 'https://www.traviscistatus.com',
        'updated_at': '2017-06-06T09:49:24.032Z'
      },
      'status': {
        'indicator': 'none',
        'description': 'AllSystems Operational'
      }
    };
  });

  this.get(`${config.urls.community}/top.json`, function () {
    return {
      topic_list: {
        topics: [
          { id: 4, slug: 'we-are-the-rats', title: 'MICHAEL its your birthday today!' },
          { id: 8, slug: 'snow-halation', title: 'What is snow halation? Is it snow *inhalation*?' },
          { id: 15, slug: 'time-333', title: 'Time for 3 at 33' },
          { id: 16, slug: 'waypoint-forever', title: 'Be good, and be good at it' },
          { id: 23, slug: 'big-boy-season', title: 'Congrats! You will be missed, best of luck' },
          { id: 42, slug: 'riku-shows-up', title: 'Simple and clean' },
        ]
      }
    };
  });

  this.get('/unauthorized', function () {
    return new Response(403, {}, {});
  });

  this.urlPrefix = apiEndpoint;
  this.namespace = '';
  this.logging = window.location.search.includes('mirage-logging=true');

  this.get('/users', function ({ users }, request) {
    let userData = JSON.parse(localStorage.getItem('travis.user')),
      id = userData.id;
    return this.serialize(users.find(id), 'v2');
  });

  this.get('/orgs', function (schema) {
    return schema.organizations.all();
  });

  this.get('/user', function (schema) {
    return this.serialize(schema.users.first(), 'v3');
  });

  this.get('/users/:id', function ({ users }, request) {
    return this.serialize(users.find(request.params.id), 'user');
  });

  this.get('/users/permissions', (schema, request) => {
    let authorization = request.requestHeaders.Authorization;

    if (!authorization) {
      return {};
    }

    const token = authorization.split(' ')[1];
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

  this.get('/trials', function (schema, params) {
    let response = this.serialize(schema.trials.all());

    let owners = schema.organizations.all().models.slice();
    owners.push(schema.users.first());

    return response;
  });

  this.post('/subscriptions', function (schema, request) {
    const attrs = JSON.parse(request.requestBody);

    const updatedAttrs = {
      ...attrs,
      plan: schema.plans.find(attrs.plan),
      owner: schema.users.first(),
      source: 'stripe',
      status: 'pending',
      valid_to: new Date(2018, 5, 19),
    };

    const savedSubscription = schema.subscriptions.create(updatedAttrs);

    return this.serialize(savedSubscription);
  });

  this.get('/subscriptions', function (schema, params) {
    let response = this.serialize(schema.subscriptions.all());

    let owners = schema.organizations.all().models.slice();
    owners.push(schema.users.first());

    response['@permissions'] = owners.map(owner => {
      return {
        owner: {
          // The API for now is returning these capitalised
          type: `${owner.modelName.substr(0, 1).toUpperCase()}${owner.modelName.substr(1)}`,
          id: owner.id
        },
        create: (owner.permissions || {}).createSubscription
      };
    });

    return response;
  });

  this.get('/subscription/:subscription_id/invoices', function (schema, { params }) {
    return schema.subscriptions.find(params.subscription_id).invoices;
  });

  this.get('/plans');

  this.get('/broadcasts', schema => {
    return schema.broadcasts.all();
  });

  this.get('/repos', function (schema, { queryParams }) {
    // search apparently still uses v2, so different response necessary
    const query = queryParams.search;
    if (query) {
      const allRepositories = schema.repositories.all();
      const filtered = allRepositories.models.filter(repo => repo.attrs.slug.includes(query));
      return {
        repos: filtered
      };
    }

    let repos = schema.repositories.all();

    let starred = queryParams['starred'];
    if (starred) {
      repos = repos.filter(repo => repo.starred);
    }

    if (queryParams && queryParams['repository.active']) {
      let paramValue = queryParams['repository.active'];

      if (paramValue === 'true') {
        repos = repos.filter(repo => repo.active);
      }
    }

    // standard v3 response returning all repositories
    return repos;
  });

  this.get('/repo/:slug_or_id', function (schema, request) {
    if (request.params.slug_or_id.match(/^\d+$/)) {
      let repo = schema.repositories.find(request.params.slug_or_id);

      if (repo) {
        return repo;
      } else {
        return new Response(404, {});
      }
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

  this.post('/repo/:repositoryId/branch/:branchName/cron', function (schema, request) {
    const { repositoryId } = request.params;
    return this.serialize(schema.crons.where({ repositoryId }), 'cron');
  });

  this.post('/repo/:repositoryId/activate', function (schema, request) {
    const { repositoryId } = request.params;
    const repository = schema.repositories.find(repositoryId);

    if (repository) {
      repository.update('active', true);
    }

    return this.serialize(repository);
  });

  this.post('/repo/:repositoryId/migrate', function (schema, request) {
    const { repositoryId } = request.params;
    const repository = schema.repositories.find(repositoryId);

    if (repository) {
      repository.update('migrate', 'requested');
    }

    return this.serialize(repository);
  });

  this.post('/repo/:repositoryId/email_subscription', function ({ repositories }, request) {
    const repo = repositories.find(request.params.repositoryId);
    repo.update({ email_subscribed: true });
    return new Response(204);
  });

  this.delete('/repo/:repositoryId/email_subscription', function ({ repositories }, request) {
    const repo = repositories.find(request.params.repositoryId);
    repo.update({ email_subscribed: false });
    return new Response(204);
  });

  this.get('/v3/preferences', function (schema) {
    return schema.preferences.all();
  });

  this.get('/v3/preference/:id', function (schema, request) {
    return schema.preferences.findBy({ name: request.params.id });
  });

  this.patch('/v3/preference/:id', function (schema, request) {
    const preference = schema.preferences.findBy({ name: request.params.id });
    if (!preference)
      return new Response(404, {});
    const requestBody = JSON.parse(request.requestBody);
    preference.update('value', requestBody['preference.value']);
    return preference;
  });

  this.post('/repo/:repositoryId/deactivate', function (schema, request) {
    const { repositoryId } = request.params;
    const repository = schema.repositories.find(repositoryId);

    if (repository) {
      repository.update('active', false);
    }

    return this.serialize(repository);
  });

  this.get('/cron/:id');

  this.get('/repo/:id/settings', function (schema, request) {
    let settings = schema.settings.where({ repositoryId: request.params.id });
    let formattedSettings = settings.models.map(setting => {
      return {
        name: setting.attrs.name,
        value: setting.attrs.value
      };
    });

    return {
      // This simulates a possible API bug: https://github.com/travis-pro/team-teal/issues/2023
      settings: formattedSettings.concat(null)
    };
  });

  this.get('/repo/:id/caches', function (schema, request) {
    const caches = schema.caches.where({ repositoryId: request.params.id });
    return caches;
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

  this.get('/repo/:repository_id/branch/:branch', function (schema, request) {
    const id = `/v3/repo/${request.params.repository_id}/branch/${request.params.branch}`;
    return this.serialize(schema.branches.find(id));
  });

  this.get('/settings/ssh_key/:repo_id', function (schema, request) {
    let sshKeys = schema.sshKeys.where({
      repositoryId: request.params.repo_id,
      type: 'custom'
    }).models[0];
    return this.serialize(sshKeys, 'v2');
  });

  this.get('/owner/:login', function (schema, request) {
    let owner = schema.users.where({ login: request.params.login }).models[0];
    if (owner) {
      return this.serialize(owner, 'owner');
    } else {
      return new Response(404, {}, {});
    }
  });

  this.get('/owner/:login/repos', function (schema, { params, queryParams = {} }) {
    const { login } = params;
    const { sort_by, name_filter } = queryParams;

    const repositories = schema.repositories.all().filter(repo => repo.owner.login === login);

    if (sort_by) {
      repositories.models = repositories.models.sortBy(sort_by);
    }

    if (name_filter) {
      repositories.models = repositories.models.filter((repo) => {
        return fuzzysort.single(name_filter, repo.name);
      });
    }

    const filterableProperties = ['managed_by_installation', 'active_on_org', 'active'];

    filterableProperties.forEach(property => {
      let fullParamName = `repository.${property}`;

      if (queryParams[fullParamName]) {
        let paramValue = queryParams[fullParamName];

        if (paramValue === 'true') {
          repositories.models = repositories.models.filterBy(property);
        } else {
          repositories.models = repositories.models.rejectBy(property);
        }
      }
    });

    return this.serialize(repositories);
  });

  this.delete('/settings/ssh_key/:repo_id', function (schema, request) {
    schema.sshKeys
      .where({ repositoryId: request.queryParams.repository_id })
      .models
      .map(sshKey => sshKey.destroyRecord());

    return new Response(204);
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

  this.get('/job/:id', function (schema, request) {
    let job = schema.jobs.find(request.params.id);
    return this.serialize(job, 'job');
  });

  this.get('/jobs', function (schema, request) {
    let jobs = schema.jobs;
    if (request.queryParams.active) {
      jobs = jobs.where((j) => ['created', 'queued', 'received', 'started'].includes(j.state));
    }

    if (request.queryParams.state) {
      let states = request.queryParams.state.split(',');
      jobs = jobs.where((j) => states.includes(j.state));
    }

    return jobs.all ? jobs.all() : jobs;
  });

  this.get('/build/:id/jobs', (schema, request) => {
    request.noPagination = true;
    return schema.jobs.where({ buildId: request.params.id });
  });

  this.get('/build/:id/stages', (schema, request) => {
    return schema.stages.where({ buildId: request.params.id });
  });

  this.get('/build/:id');

  this.post('/build/:id/restart', (schema, request) => {
    let build = schema.builds.find(request.params.id);
    if (build) {
      return {
        flash: [{ notice: 'The build was successfully restarted.' }],
        result: true
      };
    } else {
      return new Response(404, {}, {});
    }
  });

  this.post('/build/:id/cancel', (schema, request) => {
    let build = schema.builds.find(request.params.id);
    if (build) {
      return new Response(204);
    } else {
      return new Response(404, {}, {});
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
      return new Response(404, {}, {});
    }
  });

  this.post('/job/:id/cancel', (schema, request) => {
    let job = schema.jobs.find(request.params.id);
    if (job) {
      return new Response(204);
    } else {
      return new Response(404, {}, {});
    }
  });

  this.get('/builds', (schema, { queryParams: { event_type: eventType } }) => {
    return schema.builds.all().filter(build => eventType.includes(build.eventType));
  });

  this.get('/repo/:repo_id/builds', function (schema, request) {
    let builds = schema.builds.where({ repositoryId: request.params.repo_id });

    let branchName = request.queryParams['branch.name'];
    if (branchName) {
      builds = builds.filter(build => (build.branch && build.branch.attrs.name) === branchName);
    }

    if (request.queryParams.event_type !== 'pull_request') {
      builds = builds.filter(build => build.attrs.event_type !== 'pull_request');
    } else {
      builds = builds.filter(build => build.attrs.event_type === 'pull_request');
    }

    if (!request.queryParams.sort_by) {
      builds = builds.sort((a, b) => {
        return parseInt(a.number) > parseInt(b.number) ? -1 : 1;
      });
    } else if (request.queryParams.sort_by === 'finished_at:desc') {
      builds = builds.sort((a, b) => {
        const aBuildNumber = parseInt(a.attrs.number);
        const bBuildNumber = parseInt(b.attrs.number);

        return aBuildNumber > bBuildNumber ? -1 : 1;
      });
    }

    /*
     * TODO remove this once the seializers/build is removed.
     * The modelName causes Mirage to know how to serialise it.
     */
    return this.serialize(builds, 'build');
  });

  this.get('/repo/:repo_id/requests', function (schema, { params: { repo_id: repoId } }) {
    let requests = schema.requests.where({ repositoryId: repoId });

    return requests;
  });

  this.post('/repo/:repo_id/requests', function (schema, request) {
    const requestBody = JSON.parse(request.requestBody);
    const fakeRequestId = 5678;
    let repository = schema.find('repository', request.params.repo_id);
    server.create('build', { number: '2', id: 9999, repository, state: 'started' });

    return new Response(200, {}, {
      request: {
        id: fakeRequestId,
        message: requestBody.request.message,
        branch: requestBody.request.branch,
        config: requestBody.request.config
      },
      resource_type: 'request'
    });
  });

  this.get('/repo/:repo_id/request/:request_id', function (schema, request) {
    let build = schema.builds.find(9999);

    return new Response(200, {}, {
      id: request.params.request_id,
      result: 'approved',
      builds: [build]
    });
  });

  this.get('/repo/:repo_id/request/:request_id/messages',
    function ({ messages }, { params: { request_id: requestId } }) {
      return this.serialize(messages.where({ requestId }));
    });

  this.get('/job/:id/log', function (schema, request) {
    let jobId = request.params.id;
    let log = schema.logs.find(jobId);
    if (log) {
      const { id, content } = log.attrs;
      return {
        id,
        content,
        log_parts: [
          { number: 1, content },
        ],
        '@raw_log_href': `/v3/job/${jobId}/log.txt`
      };
    } else {
      return new Response(404, {}, {});
    }
  });

  this.get('/user/:user_id/beta_features', function (schema) {
    return this.serialize(schema.features.all());
  });

  this.put('/user/:user_id/beta_feature/:feature_id', function (schema, request) {
    let feature = schema.features.find(request.params.feature_id);
    let requestBody = JSON.parse(request.requestBody);
    feature.update('enabled', requestBody.enabled);
    return this.serialize(feature);
  });

  this.get('/user/:id/beta_migration_requests', function ({ betaMigrationRequests }, request) {
    return betaMigrationRequests.where({ owner_id: request.params.id });
  });

  this.post('/user/:id/beta_migration_request', function ({ betaMigrationRequests }, request) {
    const { organizations } = JSON.parse(request.requestBody) || {};
    const betaRequest = betaMigrationRequests.create({
      owner_id: request.params.id,
      organizations
    });
    return betaRequest;
  });

  this.post('/repo/:repo_id/star', function (schema, request) {
    let repo = schema.repositories.find(request.params.repo_id);
    repo.update('starred', true);
  });

  this.post('/repo/:repo_id/unstar', function (schema, request) {
    let repo = schema.repositories.find(request.params.repo_id);
    repo.update('starred', false);
  });

  this.get('/v3/enterprise_license', function (schema, request) {
    return new Response(404, {}, {});
  });

  this.get('/insights/metrics', function (schema, { queryParams }) {
    const ownerId = parseInt(queryParams.owner_id);
    const names = queryParams.name.split(',');
    const owner = schema.users.find(ownerId);

    const start = new Date(queryParams.start_time);
    const end = new Date(queryParams.end_time);

    if (owner) {
      const response = {
        '@type': 'proxy',
        '@representation': 'standard',
        'data': queryParams
      };
      response.data.values = [];

      names.map(name => {
        response.data.values.push(...schema.insightMetrics
          // Filter by time period. Allows testing percent change widgets
          .where(m => m.time >= start && m.time <= end)
          // It's easier to generate dates in descending order,
          // but they're expected in ascending order, so reverse!
          .models.reverse().map(metric => {
            return {
              name,
              interval: queryParams.interval,
              time: `${metric.time.toISOString().split('.')[0].replace('T', ' ')} UTC`,
              value: metric.value,
            };
          })
        );
      });

      return response;
    } else {
      return new Response(404, {}, {});
    }
  });

  this.get('/insights/repos/active', function (schema, { queryParams }) {
    const owner = schema.users.find(queryParams.owner_id);

    if (owner) {
      const response = {
        '@type': 'proxy',
        '@representation': 'standard',
        'data': queryParams
      };
      response.data.count = schema.insightMetrics.all().models.length > 0 ? 75 : 0;

      return response;
    } else {
      return new Response(404, {}, {});
    }
  });
}

/*
   You can optionally export a config that is only loaded during tests
   export function testConfig() {

   }
   */
