import Ember from 'ember';
import Mirage from 'ember-cli-mirage';

export default function() {
  let _turnIntoV3Singular = function(type, record) {
    if(record.attrs) {
      record = record.attrs;
    }
    record['@type'] = type;
    record['@href'] = `/${type}/${record.id}`;

    return record;
  };

  let turnIntoV3 = function(type, payload) {
    let response;
    if(Ember.isArray(payload)) {
      let records = payload.map( (record) => { return _turnIntoV3Singular(type, record); } );

      let pluralized = Ember.String.pluralize(type);
      response = {};
      response['@type'] = pluralized;
      response['@href'] = `/${pluralized}`;
      response[pluralized] = records;
    } else {
      response = _turnIntoV3Singular(type, payload);
    }
    return response;
  };

  this.get('/accounts', (schema, request) => {
    const users = schema.user.all().map(user => Ember.merge(user.attrs, {type: 'user'}));
    const accounts = schema.account.all().map(account => account.attrs);

    return { accounts: users.concat(accounts) };
  });

  this.get('/hooks', (schema, request) => {
    const hooks = schema.hook.where({'owner_name': request.queryParams.owner_name});
    return { hooks: hooks.map(hook => hook.attrs) };
  });

  this.put('/hooks/:id', (schema, request) => {
    const user = schema.hook.find(request.params.id);
    return user.update(JSON.parse(request.requestBody).hook);
  });

  this.get('/users/:id', (schema, request) => {
    if(request.requestHeaders.Authorization === 'token testUserToken') {
      let user = schema.user.find(request.params.id);
      if (user) {
        return { user: user.attrs };
      }
    } else {
      return new Mirage.Response(403, {}, {});
    }
  });

  this.get('/users/permissions', (schema, request) => {
    let permissions = schema.permissions.find(1);
    if (permissions) {
      return permissions.attrs;
    }
  });

  this.get('/v3/broadcasts', (schema, request) => {
    return { broadcasts: [] };
  });

  this.get('/repos', function(schema, request) {
    return turnIntoV3('repository', schema.repository.all());
  });

  this.get('/repo/:slug', function(schema, request) {
    let repos = schema.repository.where({ slug: decodeURIComponent(request.params.slug) });
    return turnIntoV3('repository', repos[0]);
  });
  this.get('/v3/repo/:id/crons', function(schema, request) {
    return turnIntoV3('crons', schema.cron.all().map(cron => {
      // FIXME perhaps turnIntoV3 needs to handle related data somehow?
      cron.attrs.branch = {
        "@href": cron.attrs.branchId
      };

      return cron;
    }));
  });

  this.get('/repos/:id/settings', function(schema, request) {
    const repo = schema.repository.find(request.params.id);
    return {settings: repo.settings};
  });

  this.get('/settings/env_vars', function(schema, request) {
    // FIXME placeholder
    const repo = schema.repository.find(request.queryParams.repository_id);
    return {env_vars: repo.env_vars.map(envVar => { envVar.repository_id = request.queryParams.repository_id; return envVar; })};
  });

  this.get('/settings/ssh_key/:repo_id', function() {
    // FIXME placeholder
    return {file: 'not found'};
  });

  this.get('/v3/repo/:id', function(schema, request) {
    const repo = schema.repository.find(request.params.id);
    return turnIntoV3('repository', repo);
  });

  this.get('/v3/repo/:id/branches', function(schema) {
    // FIXME placeholder
    return turnIntoV3('branch', schema.branch.all());
  });

  this.get('/repos/:id/key', function() {
    // FIXME placeholder
    return {key: 'hello', fingerprint: 'yes'};
  });

  this.get('/jobs/:id', function(schema, request) {
    let job = schema.job.find(request.params.id).attrs;
    return {job: job, commit: schema.commit.find(job.commit_id).attrs};
  });

  this.get('/jobs', function(schema, request) {
    return {jobs: schema.job.all()};
  });

  this.get('/builds/:id', function(schema, request) {
    let build = schema.build.find(request.params.id).attrs;
    let jobs = schema.job.where({build_id: build.id}).map(job => job.attrs);
    return {build: build, jobs: jobs, commit: schema.commit.find(build.commit_id).attrs};
  });

  this.post('/builds/:id/restart', (schema, request) => {
    return {
      flash: [{notice: "The build was successfully restarted."}],
      result: true
    };
  });

  this.get('/jobs/:id/log', function(schema, request) {
    let log = schema.log.find(request.params.id);
    if(log) {
      return { log: { parts: [{ id: log.attrs.id, number: 1, content: log.attrs.content}] }};
    } else {
      return new Mirage.Response(404, {}, {});
    }
  });

  // UNCOMMENT THIS FOR LOGGING OF HANDLED REQUESTS
  // this.pretender.handledRequest = function(verb, path, request) {
  //   console.log("Handled this request:", `${verb} ${path}`, request);
  // }
}

/*
You can optionally export a config that is only loaded during tests
export function testConfig() {

}
*/
