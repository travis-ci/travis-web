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
    if(Ember.isArray(payload.models)) {
      let records = payload.models.map( (record) => { return _turnIntoV3Singular(type, record); } );

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
    const users = schema.users.all().models.map(user => Ember.merge(user.attrs, {type: 'user'}));
    const accounts = schema.accounts.all().models.map(account => account.attrs);

    return { accounts: users.concat(accounts) };
  });

  this.get('/hooks', (schema, request) => {
    const hooks = schema.hooks.where({'owner_name': request.queryParams.owner_name});
    return { hooks: hooks.models.map(hook => hook.attrs) };
  });

  this.put('/hooks/:id', (schema, request) => {
    const user = schema.hooks.find(request.params.id);
    return user.update(JSON.parse(request.requestBody).hook);
  });

  this.get('/users/:id', (schema, request) => {
    if(request.requestHeaders.Authorization === 'token testUserToken') {
      let user = schema.users.find(request.params.id);
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
    // return { repos: schema.repositories.all() };
    return turnIntoV3('repository', schema.repositories.all());
  });

  this.get('/repo/:slug', function(schema, request) {
    let repos = schema.repositories.where({ slug: decodeURIComponent(request.params.slug) });
    return turnIntoV3('repository', repos[0]);
  });
  this.get('/v3/repo/:id/crons', function(schema, request) {
    return turnIntoV3('crons', schema.crons.all());
  });
  this.get('/jobs/:id', function(schema, request) {
    let job = schema.jobs.find(request.params.id).attrs;
    return {job: job, commit: schema.commits.find(job.commit_id).attrs};
  });

  this.get('/jobs', function(schema, request) {
    return {jobs: schema.jobs.all()};
  });

  this.get('/builds', function(schema, request) {
    return {builds: schema.builds.all()};
  });

  this.get('/builds/:id', function(schema, request) {
    let build = schema.builds.find(request.params.id).attrs;
    let jobs = schema.jobs.where({build_id: build.id}).models.map(job => job.attrs);
    return {build: build, jobs: jobs, commit: schema.commits.find(build.commit_id).attrs};
  });

  this.post('/builds/:id/restart', (schema, request) => {
    return {
      flash: [{notice: "The build was successfully restarted."}],
      result: true
    };
  });

  this.get('/jobs/:id/log', function(schema, request) {
    let log = schema.logs.find(request.params.id);
    if(log) {
      return { log: { parts: [{ id: log.attrs.id, number: 1, content: log.attrs.content}] }};
    } else {
      return new Mirage.Response(404, {}, {});
    }
  });
}

/*
You can optionally export a config that is only loaded during tests
export function testConfig() {

}
*/
