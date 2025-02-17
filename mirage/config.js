/* global server */
import { Response, createServer } from 'miragejs';
import config from 'travis/config/environment';
import fuzzysort from 'fuzzysort';

const { validAuthToken, apiEndpoint } = config;

export default function (server) {
  server.timing = 0;
  server.urlPrefix = apiEndpoint;
  server.namespace = '';
  server.logging = window.location.search.includes('mirage-logging=true');

  /*
  const _defaultHandler = server.pretender._handlerFor;

  /*server.pretender._handlerFor = function (verb, path, request) {
    const authHeader = request.requestHeaders.Authorization;
    if (authHeader && authHeader !== `token ${validAuthToken}`) {
      return _defaultHandler.apply(this, ['GET', '/unauthorized', request]);
    }
    return _defaultHandler.apply(this, arguments);
  };*/

  return createServer({
    ...server,
    routes,
  });
}

function routes() {
  this.get(
    'https://pnpcptp8xh9k.statuspage.io/api/v2/status.json',
    function () {
      return {
        page: {
          id: 'pnpcptp8xh9k',
          name: 'Travis CI',
          url: 'https://www.traviscistatus.com',
          updated_at: '2017-06-06T09:49:24.032Z',
        },
        status: {
          indicator: 'none',
          description: 'AllSystems Operational',
        },
      };
    },
  );

  this.get(`${config.urls.community}/top.json`, function () {
    return {
      topic_list: {
        topics: [
          {
            id: 4,
            slug: 'we-are-the-rats',
            title: 'MICHAEL its your birthday today!',
          },
          {
            id: 8,
            slug: 'snow-halation',
            title: 'What is snow halation? Is it snow *inhalation*?',
          },
          { id: 15, slug: 'time-333', title: 'Time for 3 at 33' },
          {
            id: 16,
            slug: 'waypoint-forever',
            title: 'Be good, and be good at it',
          },
          {
            id: 23,
            slug: 'big-boy-season',
            title: 'Congrats! You will be missed, best of luck',
          },
          { id: 42, slug: 'riku-shows-up', title: 'Simple and clean' },
        ],
      },
    };
  });

  this.get('/unauthorized', function () {
    return new Response(403, {}, {});
  });

  this.get('/users', function ({ users }, request) {
    let userData = JSON.parse(localStorage.getItem('travis.user')),
      id = userData.id;
    return this.serialize(users.find(id), 'v2');
  });

  this.get('/orgs', function (schema) {
    return schema.organizations.all();
  });

  this.get('/user', function (schema, request) {
    const authorization = request.requestHeaders.Authorization;
    const firstUser = schema.users.first();

    if (authorization !== `token ${firstUser.token}`) {
      return new Response(403, {}, {});
    }

    let res = this.serialize(firstUser, 'v3');
    return res;
  });

  this.get('/logout', function () {
    return new Response(200, {}, {});
  });

  this.get('/users/:id', function ({ users }, request) {
    return this.serialize(users.find(request.params.id), 'user');
  });

  this.get('/users/permissions', (schema, request) => {
    const authorization = request.requestHeaders.Authorization;

    if (!authorization) {
      return {};
    }

    const token = authorization.split(' ')[1];
    const user = schema.users.where({ token }).models[0];

    if (user) {
      const permissions = schema.permissions.where({ userId: user.id });

      return permissions.models.reduce(
        (combinedPermissions, permissions) => {
          ['admin', 'push', 'pull', 'permissions'].forEach((property) => {
            if (permissions.attrs[property]) {
              combinedPermissions[property].push(
                parseInt(permissions.repositoryId),
              );
            }
          });

          return combinedPermissions;
        },
        {
          admin: [],
          push: [],
          pull: [],
          permissions: [],
        },
      );
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

  this.get('/v3/owner/:provider/:login/executions', function (schema, request) {
    const from = request.queryParams.from;
    const to = request.queryParams.to;
    const login = request.params.login;
    const provider = request.params.provider;
    let response = {
      '@type': 'executions',
      '@href': `/v3/owner/${provider}/${login}/executions?from=${from}&to=${to}`,
      '@representation': 'standard',
      executions: [
        {
          '@type': 'execution',
          '@representation': 'standard',
          id: 1,
          os: 'linux',
          instance_size: 'standard-2',
          arch: 'amd64',
          virtualization_type: 'vm',
          queue: 'builds.gce',
          job_id: 1,
          repository_id: 1,
          owner_id: 1,
          owner_type: 'Organization',
          plan_id: 1,
          sender_id: 1,
          credits_consumed: 0,
          started_at: '2020-10-22T15:09:38.000Z',
          finished_at: '2020-10-22T15:09:58.000Z',
          created_at: '2020-10-22T15:09:59.404Z',
          updated_at: '2020-10-22T15:09:59.404Z',
        },
      ],
    };
    return response;
  });

  this.get(
    '/v3/owner/:provider/:login/executions_per_repo',
    function (schema, request) {
      const from = request.queryParams.from;
      const to = request.queryParams.to;
      const login = request.params.login;
      const provider = request.params.provider;
      let response = {
        '@type': 'executionsperrepo',
        '@href': `/v3/owner/${provider}/${login}/executions_per_repo?from=${from}&to=${to}`,
        '@representation': 'standard',
        executionsperrepo: [
          {
            repository_id: 1,
            os: 'linux',
            credits_consumed: 10,
            minutes_consumed: 1,
            repository: {
              '@type': 'repository',
              '@href': '/repo/1',
              '@representation': 'standard',
              '@permissions': {
                read: false,
                delete_key_pair: false,
                create_request: false,
                admin: false,
                activate: false,
                deactivate: false,
                migrate: false,
                star: false,
                unstar: false,
                build_cancel: true,
                build_restart: true,
                build_debug: true,
                create_cron: false,
                create_env_var: false,
                create_key_pair: false,
              },
              id: 1,
              name: 'reponame',
              slug: `${login}/reponame`,
              description: 'reponame',
              github_id: 1,
              vcs_id: '1',
              vcs_type: 'GithubRepository',
              github_language: null,
              active: true,
              private: true,
              owner: {
                '@type': 'organization',
                id: 10619,
                login: `${login}`,
                '@href': '/org/1',
              },
              owner_name: `${login}`,
              vcs_name: 'reponame',
              default_branch: {
                '@type': 'branch',
                '@href': '/repo/1/branch/main',
                '@representation': 'minimal',
                name: 'main',
              },
              starred: false,
              managed_by_installation: true,
              active_on_org: false,
              migration_status: null,
              history_migration_status: null,
              shared: false,
              config_validation: true,
            },
          },
          {
            repository_id: 2,
            os: 'windows',
            credits_consumed: 20,
            minutes_consumed: 2,
            repository: {
              '@type': 'repository',
              '@href': '/repo/2',
              '@representation': 'standard',
              '@permissions': {
                read: false,
                delete_key_pair: false,
                create_request: false,
                admin: false,
                activate: false,
                deactivate: false,
                migrate: false,
                star: false,
                unstar: false,
                build_cancel: true,
                build_restart: true,
                build_debug: true,
                create_cron: false,
                create_env_var: false,
                create_key_pair: false,
              },
              id: 1,
              name: 'reponame2',
              slug: `${login}/reponame2`,
              description: 'reponame2',
              github_id: 1,
              vcs_id: '1',
              vcs_type: 'GithubRepository',
              github_language: null,
              active: true,
              private: true,
              owner: {
                '@type': 'organization',
                id: 10619,
                login: `${login}`,
                '@href': '/org/1',
              },
              owner_name: `${login}`,
              vcs_name: 'reponame',
              default_branch: {
                '@type': 'branch',
                '@href': '/repo/1/branch/main',
                '@representation': 'minimal',
                name: 'main',
              },
              starred: false,
              managed_by_installation: true,
              active_on_org: false,
              migration_status: null,
              history_migration_status: null,
              shared: false,
              config_validation: true,
            },
          },
          {
            repository_id: 3,
            os: 'osx',
            credits_consumed: 30,
            minutes_consumed: 3,
            repository: {
              '@type': 'repository',
              '@href': '/repo/2',
              '@representation': 'standard',
              '@permissions': {
                read: false,
                delete_key_pair: false,
                create_request: false,
                admin: false,
                activate: false,
                deactivate: false,
                migrate: false,
                star: false,
                unstar: false,
                build_cancel: true,
                build_restart: true,
                build_debug: true,
                create_cron: false,
                create_env_var: false,
                create_key_pair: false,
              },
              id: 1,
              name: 'reponame3',
              slug: `${login}/reponame3`,
              description: 'reponame3',
              github_id: 1,
              vcs_id: '1',
              vcs_type: 'GithubRepository',
              github_language: null,
              active: true,
              private: true,
              owner: {
                '@type': 'organization',
                id: 10619,
                login: `${login}`,
                '@href': '/org/1',
              },
              owner_name: `${login}`,
              vcs_name: 'reponame',
              default_branch: {
                '@type': 'branch',
                '@href': '/repo/1/branch/main',
                '@representation': 'minimal',
                name: 'main',
              },
              starred: false,
              managed_by_installation: true,
              active_on_org: false,
              migration_status: null,
              history_migration_status: null,
              shared: false,
              config_validation: true,
            },
          },
        ],
      };
      return response;
    },
  );

  this.get(
    '/v3/owner/:provider/:login/executions_per_sender',
    function (schema, request) {
      const from = request.queryParams.from;
      const to = request.queryParams.to;
      const login = request.params.login;
      const provider = request.params.provider;
      let response = {
        '@type': 'executionspersender',
        '@href': `/v3/owner/${provider}/${login}/executions_per_sender?from=${from}&to=${to}`,
        '@representation': 'standard',
        executionspersender: [
          {
            credits_consumed: 0,
            minutes_consumed: 1,
            sender_id: 1,
            sender: {
              '@type': 'user',
              '@href': '/user/1',
              '@representation': 'standard',
              '@permissions': {
                read: true,
                sync: false,
              },
              id: 1,
              login: `${login}`,
              name: `${login}`,
              github_id: 1,
              vcs_id: '1',
              vcs_type: 'GithubUser',
              avatar_url: 'https://avatars0.githubusercontent.com/u/1?v=4',
              education: false,
              allow_migration: false,
              allowance: {
                '@type': 'allowance',
                '@representation': 'minimal',
                subscription_type: 1,
                public_repos: true,
                private_repos: false,
                concurrency_limit: 1,
                user_usage: false,
                pending_user_licenses: false,
                id: 1,
              },
              email: null,
              is_syncing: false,
              synced_at: '2020-10-27T19:30:19Z',
              recently_signed_up: false,
              secure_user_hash: 'hash',
            },
          },
          {
            credits_consumed: 0,
            minutes_consumed: 1,
            sender_id: 0,
            sender: {
              '@type': 'user',
              '@href': '/user/1',
              '@representation': 'standard',
              '@permissions': {
                read: true,
                sync: false,
              },
              id: 1,
              login: 'cron',
              name: '',
              internal: true,
              github_id: 1,
              vcs_id: '1',
              vcs_type: 'GithubUser',
              avatar_url: 'https://avatars0.githubusercontent.com/u/1?v=4',
              education: false,
              allow_migration: false,
              allowance: {
                '@type': 'allowance',
                '@representation': 'minimal',
                subscription_type: 1,
                public_repos: true,
                private_repos: false,
                concurrency_limit: 1,
                user_usage: false,
                pending_user_licenses: false,
                id: 1,
              },
              email: null,
              is_syncing: false,
              synced_at: '2020-10-27T19:30:19Z',
              recently_signed_up: false,
              secure_user_hash: 'hash',
            },
          },
        ],
      };
      return response;
    },
  );

  this.post('/subscriptions', function (schema, request) {
    const attrs = JSON.parse(request.requestBody);
    const owner = attrs.organization_id
      ? schema.organizations.first()
      : schema.users.first();

    const updatedAttrs = {
      ...attrs,
      owner,
      plan: schema.plans.find(attrs.plan),
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

    response['@permissions'] = owners.map((owner) => {
      return {
        owner: {
          // The API for now is returning these capitalised
          type: `${owner.modelName.slice(0, 1).toUpperCase()}${owner.modelName.slice(1)}`,
          id: owner.id,
        },
        create: (owner.permissions || {}).createSubscription,
      };
    });

    return response;
  });

  this.get(
    '/subscription/:subscription_id/invoices',
    function (schema, { params }) {
      return schema.subscriptions.find(params.subscription_id).invoices;
    },
  );

  this.patch(
    '/subscription/:subscription_id/address',
    function (schema, { params, requestBody }) {
      const attrs = JSON.parse(requestBody);

      const subscription = schema.subscriptions.where({
        id: params.subscription_id,
      });
      subscription.update('billing_info', {
        ...attrs,
      });
    },
  );

  this.get('/coupons/:coupon', function (schema, { params }) {
    const coupon = schema.coupons.find(params.coupon);
    if (!coupon) {
      return new Response(
        404,
        { 'Content-Type': 'application/json' },
        {
          '@type': 'error',
          error_type: 'not_found',
          error_message: `No such coupon: ${params.coupon}`,
        },
      );
    } else {
      return this.serialize(coupon);
    }
  });

  this.post(
    '/subscription/:subscription_id/cancel',
    function (schema, { params, requestBody }) {
      const subscription = schema.subscriptions.where({
        id: params.subscription_id,
      });
      subscription.update('status', 'canceled');
    },
  );

  this.post(
    '/subscription/:subscription_id/pause',
    function (schema, { params, requestBody }) {
      const subscription = schema.subscriptions.where({
        id: params.subscription_id,
      });
      subscription.update('cancellation_requested', true);
    },
  );

  this.post(
    '/v2_subscription/:subscription_id/pause',
    function (schema, { params, requestBody }) {
      const subscription = schema.v2Subscriptions.where({
        id: params.subscription_id,
      });
      subscription.update('cancellation_requested', true);
    },
  );

  this.patch(
    '/subscription/:subscription_id/resubscribe',
    function (schema, { params, requestBody }) {
      const subscription = schema.subscriptions.where({
        id: params.subscription_id,
      });
      subscription.update('status', 'subscribed');
      return {
        payment_intent: {
          client_secret: '',
        },
      };
    },
  );

  this.get('/plans');

  this.get('/plans_for/user', function (schema) {
    return schema.plans.all();
  });

  this.get('/plans_for/organization/:organization_id', function (schema) {
    return schema.plans.all();
  });

  this.post('/v2_subscriptions', function (schema, request) {
    const attrs = JSON.parse(request.requestBody);
    const owner = attrs.organization_id
      ? schema.organizations.where({ id: attrs.organization_id }).models[0]
      : schema.users.where({ token: validAuthToken }).models[0];

    const updatedAttrs = {
      ...attrs,
      owner,
      plan: schema.v2PlanConfigs.find(attrs.plan),
      addons: [
        {
          id: 1,
          name: 'Free 40 000 credits (renewed monthly)',
          type: 'credit_public',
          current_usage: {
            id: 1,
            addon_id: 1,
            addon_quantity: 40000,
            addon_usage: 100,
            remaining: 39900,
            active: true,
          },
        },
        {
          id: 2,
          name: '25 000 credits (2,5k Linux build minutes)',
          type: 'credit_private',
          current_usage: {
            id: 2,
            addon_id: 2,
            addon_quantity: 25000,
            addon_usage: 10,
            remaining: 24990,
            active: true,
          },
        },
        {
          id: 3,
          name: 'Standard Tier user licenses',
          type: 'user_license',
          current_usage: {
            id: 3,
            addon_id: 3,
            addon_quantity: 1000,
            addon_usage: 0,
            remaining: 1000,
            active: true,
          },
        },
      ],
      source: 'stripe',
    };
    const savedSubscription = schema.v2Subscriptions.create(updatedAttrs);

    return this.serialize(savedSubscription);
  });

  this.get('/v2_subscriptions', function (schema, params) {
    let response = this.serialize(schema.v2Subscriptions.all());

    let owners = schema.organizations.all().models.slice();
    owners.push(schema.users.where({ token: validAuthToken }).models[0]);

    response['@permissions'] = owners.map((owner) => {
      return {
        owner: {
          // The API for now is returning these capitalised
          type: `${owner.modelName.substr(0, 1).toUpperCase()}${owner.modelName.substr(1)}`,
          id: owner.id,
        },
        create: (owner.permissions || {}).createSubscription,
      };
    });

    return response;
  });

  this.get(
    '/v2_subscription/:subscription_id/invoices',
    function (schema, { params }) {
      return schema.v2Subscriptions.find(params.subscription_id).invoices;
    },
  );

  this.patch(
    '/v2_subscription/:subscription_id/address',
    function (schema, { params, requestBody }) {
      const attrs = JSON.parse(requestBody);

      const subscription = schema.v2Subscriptions.where({
        id: params.subscription_id,
      });
      subscription.update('billing_info', {
        ...attrs,
      });
    },
  );

  this.patch(
    '/v2_subscription/:subscription_id/creditcard',
    function (schema, { params, requestBody }) {
      const attrs = JSON.parse(requestBody);

      const subscription = schema.v2Subscriptions.where({
        id: params.subscription_id,
      });
      subscription.update('credit_card_info', {
        ...attrs,
      });
    },
  );

  this.get('/v2_plans_for/user', function (schema) {
    return schema.v2PlanConfigs.all();
  });

  this.get('/v2_plans_for/organization/:organization_id', function (schema) {
    return schema.v2PlanConfigs.all();
  });

  this.get('/broadcasts', (schema) => {
    return schema.broadcasts.all();
  });

  this.get('/repos', function (schema, { queryParams }) {
    // search apparently still uses v2, so different response necessary
    const query = queryParams.search;
    if (query) {
      const allRepositories = schema.repositories.all();
      const filtered = allRepositories.models.filter((repo) =>
        repo.attrs.slug.includes(query),
      );
      return {
        repos: filtered,
      };
    }

    let repos = schema.repositories.all();

    let starred = queryParams['starred'];
    if (starred) {
      repos = repos.filter((repo) => repo.starred);
    }

    if (queryParams && queryParams['repository.active']) {
      let paramValue = queryParams['repository.active'];

      if (paramValue === 'true') {
        repos = repos.filter((repo) => repo.active);
      }
    }

    // standard v3 response returning all repositories
    return repos;
  });

  this.get('/repo/:id', function (schema, { params }) {
    const repo = schema.repositories.find(params.id);
    return repo || new Response(404, {}, {});
  });

  this.get('/repo/:provider/:slug_or_id', function (schema, { params }) {
    const { slug_or_id } = params;
    let repo;
    if (slug_or_id.match(/^\d+$/)) {
      repo = schema.repositories.find(slug_or_id);
    } else {
      const slug = decodeURIComponent(slug_or_id);
      repo = schema.repositories.findBy({ slug });
    }
    return repo || new Response(404, {}, {});
  });

  this.get('/repo/:repositoryId/crons', function (schema, request) {
    const { repositoryId } = request.params;
    return this.serialize(schema.crons.where({ repositoryId }), 'cron');
  });

  this.post(
    '/repo/:repositoryId/branch/:branchName/cron',
    function (schema, request) {
      const { repositoryId } = request.params;
      return this.serialize(schema.crons.where({ repositoryId }), 'cron');
    },
  );

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

  this.get(
    '/v3/repo/:repositoryId/build_permissions',
    function (schema, request) {
      const { repositoryId } = request.params;
      const repository = schema.repositories.find(repositoryId);
      const owner = repository.owner;

      let response = {
        '@type': 'build_permissions',
        '@href': `/v3/repo/${repositoryId}/build_permissions`,
        '@representation': 'standard',
        '@pagination': {
          limit: 25,
          offset: 0,
          count: 1,
          is_first: true,
          is_last: true,
          next: null,
          prev: null,
          first: {
            '@href': `/v3/repo/${repositoryId}/build_permissions`,
            offset: 0,
            limit: 25,
          },
          last: {
            '@href': `/v3/repo/${repositoryId}/build_permissions`,
            offset: 0,
            limit: 25,
          },
        },
        build_permissions: [
          {
            '@type': 'build_permission',
            '@representation': 'standard',
            user: {
              '@type': 'user',
              '@href': `/user/${owner.id}`,
              '@representation': 'minimal',
              id: owner.id,
              login: owner.login,
              name: owner.login,
              vcs_type: 'GithubUser',
            },
            permission: true,
            role: null,
          },
        ],
      };
      return response;
    },
  );

  this.get(
    '/v3/org/:organizationId/build_permissions',
    function (schema, request) {
      const { organizationId } = request.params;
      const org = schema.organizations.find(organizationId);
      const owner = schema.owners?.first || {};

      let response = {
        '@type': 'build_permissions',
        '@href': `/v3/${org.id}/10619/build_permissions`,
        '@representation': 'standard',
        '@pagination': {
          limit: 25,
          offset: 0,
          count: 1,
          is_first: true,
          is_last: true,
          next: null,
          prev: null,
          first: {
            '@href': `/v3/org/${org.id}/build_permissions`,
            offset: 0,
            limit: 25,
          },
          last: {
            '@href': `/v3/org/${org.id}/build_permissions`,
            offset: 0,
            limit: 25,
          },
        },
        build_permissions: [
          {
            '@type': 'build_permission',
            '@representation': 'standard',
            user: {
              '@type': 'user',
              '@href': `/user/${owner.id}`,
              '@representation': 'minimal',
              id: owner.id,
              login: owner.login,
              name: owner.login,
              vcs_type: 'GithubUser',
            },
            permission: true,
            role: 'admin',
          },
        ],
      };
      return response;
    },
  );

  this.post(
    '/repo/:repositoryId/email_subscription',
    function ({ repositories }, request) {
      const repo = repositories.find(request.params.repositoryId);
      repo.update({ email_subscribed: true });
      return new Response(204, {}, {});
    },
  );

  this.delete(
    '/repo/:repositoryId/email_subscription',
    function ({ repositories }, request) {
      const repo = repositories.find(request.params.repositoryId);
      repo.update({ email_subscribed: false });
      return new Response(204, {}, {});
    },
  );

  this.get('/v3/preferences', function (schema) {
    return schema.preferences.all();
  });

  this.get('/v3/org/:org_id/preferences', function (schema) {
    return schema.preferences.all();
  });

  this.get('/v3/preference/:id', function (schema, request) {
    return schema.preferences.findBy({ name: request.params.id });
  });

  this.patch('/v3/preference/:id', function (schema, request) {
    const preference = schema.preferences.findBy({ name: request.params.id });
    if (!preference) return new Response(404, {}, {});
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
    let formattedSettings = settings.models.map((setting) => {
      return {
        name: setting.attrs.name,
        value: setting.attrs.value,
      };
    });

    return {
      // This simulates a possible API bug: https://github.com/travis-pro/team-teal/issues/2023
      settings: formattedSettings.concat(null),
    };
  });

  this.get('/repo/:id/caches', function (schema, request) {
    const caches = schema.caches.where({ repositoryId: request.params.id });
    return caches;
  });

  this.patch('/settings/ssh_key/:repository_id', function (schema, request) {
    const sshKeys = schema.sshKeys.where({
      repositoryId: request.queryParams.repository_id,
    });
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
        },
      };
    }
  });

  this.post('/settings/env_vars', function (schema, request) {
    const envVar = server.create('env_var', request.params);
    let res = {
      env_var: {
        id: envVar.id,
        name: envVar.name,
        public: envVar.public,
        repository_id: request.params.repository_id,
      },
    };
    return res;
  });

  this.get('/settings/env_vars', function (schema, request) {
    const envVars = schema.envVars.where({
      repositoryId: request.queryParams.repository_id,
    });

    return {
      env_vars: envVars.models.map((envVar) => {
        envVar.attrs.repository_id = envVar.repositoryId;
        return envVar;
      }),
    };
  });

  this.delete('/settings/env_vars/:env_var_id', function (schema, request) {
    schema.envVars
      .where({ envVarId: request.params.env_var_id })
      .models.map((envVar) => envVar.destroyRecord());

    return new Response(204, {}, {});
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
      type: 'custom',
    }).models[0];
    return this.serialize(sshKeys, 'v2');
  });

  this.get('/owner/:provider/:login', function (schema, request) {
    let owner = schema.users.where({ login: request.params.login }).models[0];
    if (owner) {
      return this.serialize(owner, 'owner');
    } else {
      return new Response(404, {}, {});
    }
  });

  this.get('/owner/:provider/:login/allowance', function (schema, request) {
    const users = schema.users.where({ login: request.params.login }).models;
    let owner;
    if (users.length === 0) {
      const orgs = schema.organizations.where({
        login: request.params.login,
      }).models;
      owner = orgs[0];
    } else {
      owner = users[0];
    }
    const allowance = schema.allowances
      .all()
      .filter((allowance) => allowance.id === owner.id);
    if (allowance) {
      return this.serialize(allowance, 'allowance');
    } else {
      return new Response(404, {}, {});
    }
  });

  this.get('/v3/build_backups', function (schema, request) {
    const repository_id = request.queryParams.repository_id;

    let response = {
      '@type': 'build_backups',
      '@href': `/v3/build_backups?repository_id=${repository_id}&offset=0`,
      '@representation': 'standard',
      '@pagination': {
        limit: 25,
        offset: 0,
        count: 1,
        is_first: true,
        is_last: true,
        next: null,
        prev: null,
        first: {
          '@href': `/v3/build_backups?repository_id=${repository_id}&offset=0`,
          offset: 0,
          limit: 25,
        },
        last: {
          '@href': `/v3/build_backups?repository_id=${repository_id}&offset=0`,
          offset: 0,
          limit: 25,
        },
      },
      build_backups: [
        {
          '@type': 'build_backup',
          '@href': '/v3/build_backup/120',
          '@representation': 'standard',
          file_name: `repository_${repository_id}_builds_123-456.json`,
          created_at: '2021-02-19T13:54:15Z',
        },
      ],
    };

    return response;
  });

  this.get(
    '/owner/:provider/:login/repos',
    function (schema, { params, queryParams = {} }) {
      const { login } = params;
      const { sort_by, name_filter } = queryParams;

      const repositories = schema.repositories
        .all()
        .filter((repo) => repo.owner.login === login);

      if (sort_by) {
        repositories.models = repositories.models.sortBy(sort_by);
      }

      if (name_filter) {
        repositories.models = repositories.models.filter((repo) => {
          return fuzzysort.single(name_filter, repo.name);
        });
      }

      const filterableProperties = [
        'managed_by_installation',
        'active_on_org',
        'active',
      ];

      filterableProperties.forEach((property) => {
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
    },
  );

  this.delete('/settings/ssh_key/:repo_id', function (schema, request) {
    schema.sshKeys
      .where({ repositoryId: request.queryParams.repository_id })
      .models.map((sshKey) => sshKey.destroyRecord());

    return new Response(204, {}, {});
  });

  this.get('/settings/ssh_key/:repo_id', function (schema, request) {
    const repo = schema.repositories.find(request.params.repo_id);
    const { customSshKey } = repo;
    return {
      ssh_key: {
        id: 1,
        description: customSshKey.description,
        fingerprint: customSshKey.fingerprint,
      },
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
      jobs = jobs.where((j) =>
        ['created', 'queued', 'received', 'started'].includes(j.state),
      );
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
        result: true,
      };
    } else {
      return new Response(404, {}, {});
    }
  });

  this.post('/build/:id/priority', (schema, request) => {
    let build = schema.builds.find(request.params.id);
    if (build) {
      return {
        flash: [{ notice: 'The build was successfully prioritized.' }],
        result: true,
      };
    } else {
      return new Response(404, {}, {});
    }
  });

  this.post('/build/:id/cancel', (schema, request) => {
    let build = schema.builds.find(request.params.id);
    if (build) {
      return new Response(204, {}, {});
    } else {
      return new Response(404, {}, {});
    }
  });

  this.post('/job/:id/restart', (schema, request) => {
    let job = schema.jobs.find(request.params.id);
    if (job) {
      return {
        flash: [{ notice: 'The job was successfully restarted.' }],
        result: true,
      };
    } else {
      return new Response(404, {}, {});
    }
  });

  this.post('/job/:id/cancel', (schema, request) => {
    let job = schema.jobs.find(request.params.id);
    if (job) {
      return new Response(204, {}, {});
    } else {
      return new Response(404, {}, {});
    }
  });

  this.get('/builds', (schema, { queryParams: { event_type: eventType } }) => {
    return schema.builds
      .all()
      .filter((build) => eventType.includes(build.eventType));
  });

  this.get('/repo/:repo_id/builds', function (schema, request) {
    let builds = schema.builds.where({ repositoryId: request.params.repo_id });

    let branchName = request.queryParams['branch.name'];
    if (branchName) {
      builds = builds.filter(
        (build) => (build.branch && build.branch.attrs.name) === branchName,
      );
    }

    if (request.queryParams.event_type !== 'pull_request') {
      builds = builds.filter(
        (build) => build.attrs.event_type !== 'pull_request',
      );
    } else {
      builds = builds.filter(
        (build) => build.attrs.event_type === 'pull_request',
      );
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

  this.get(
    '/repo/:repo_id/requests',
    function (schema, { params: { repo_id: repoId } }) {
      let requests = schema.requests.where({ repositoryId: repoId });

      return requests;
    },
  );

  this.post('/repo/:repo_id/requests', function (schema, request) {
    const requestBody = JSON.parse(request.requestBody);
    const fakeRequestId = 5678;
    let repository = schema.find('repository', request.params.repo_id);
    server.create('build', {
      number: '2',
      id: 9999,
      repository,
      state: 'started',
    });

    return new Response(
      200,
      {},
      {
        request: {
          id: fakeRequestId,
          message: requestBody.request.message,
          branch: requestBody.request.branch,
          config: requestBody.request.config,
        },
        resource_type: 'request',
      },
    );
  });

  this.get('/repo/:repo_id/request/:request_id', function (schema, request) {
    let build = schema.builds.find(9999);

    return new Response(
      200,
      {},
      {
        id: request.params.request_id,
        result: 'approved',
        builds: [build],
      },
    );
  });

  this.get(
    '/repo/:repo_id/request/:request_id/messages',
    function ({ messages }, { params: { request_id: requestId } }) {
      return this.serialize(messages.where({ requestId }));
    },
  );

  this.get('/job/:id/log', function (schema, request) {
    let jobId = request.params.id;
    let log = schema.logs.find(jobId);
    if (log) {
      const { id, content } = log.attrs;
      return {
        id,
        content,
        log_parts: [{ number: 1, content }],
        '@raw_log_href': `/v3/job/${jobId}/log.txt`,
      };
    } else {
      return new Response(404, {}, {});
    }
  });

  this.get('/user/:user_id/beta_features', function (schema) {
    return this.serialize(schema.features.all());
  });

  this.put(
    '/user/:user_id/beta_feature/:feature_id',
    function (schema, request) {
      let feature = schema.features.find(request.params.feature_id);
      let requestBody = JSON.parse(request.requestBody);
      feature.update('enabled', requestBody.enabled);
      return this.serialize(feature);
    },
  );

  this.get(
    '/user/:id/beta_migration_requests',
    function ({ betaMigrationRequests }, request) {
      if (betaMigrationRequests)
        return betaMigrationRequests.where({ owner_id: request.params.id });
      return new Response(404, {}, {});
    },
  );

  this.post(
    '/user/:id/beta_migration_request',
    function ({ betaMigrationRequests }, request) {
      const { organizations } = JSON.parse(request.requestBody) || {};
      const betaRequest = betaMigrationRequests.create({
        owner_id: request.params.id,
        organizations,
      });
      return betaRequest;
    },
  );

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

  this.get('/storage/billing_wizard_state', function (schema, request) {
    return new Response(200, { id: 'billing_wizard_state', value: 0 }, {});
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
        data: queryParams,
      };
      response.data.values = [];

      names.map((name) => {
        response.data.values.push(
          ...schema.insightMetrics
            // Filter by time period. Allows testing percent change widgets
            .where((m) => m.time >= start && m.time <= end)
            // It's easier to generate dates in descending order,
            // but they're expected in ascending order, so reverse!
            .models.reverse()
            .map((metric) => {
              return {
                name,
                interval: queryParams.interval,
                time: `${metric.time.toISOString().split('.')[0].replace('T', ' ')} UTC`,
                value: metric.value,
              };
            }),
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
        data: queryParams,
      };
      response.data.count =
        schema.insightMetrics.all().models.length > 0 ? 75 : 0;

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
