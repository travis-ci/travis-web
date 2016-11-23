/* eslint-disable camelcase */
import DS from 'ember-data';
import Ember from 'ember';

const { service } = Ember.inject;

export default DS.Store.extend({
  auth: service(),
  defaultAdapter: 'application',
  adapter: 'application',

  init() {
    this._super(...arguments);
    return this.set('pusherEventHandlerGuards', {});
  },

  addPusherEventHandlerGuard(name, callback) {
    return this.get('pusherEventHandlerGuards')[name] = callback;
  },

  removePusherEventHandlerGuard(name) {
    return delete this.get('pusherEventHandlerGuards')[name];
  },

  canHandleEvent(event, data) {
    let callback, name, ref, ref1;
    ref = event.split(':');
    name = ref[0];
    ref1 = this.get('pusherEventHandlerGuards');
    for (name in ref1) {
      callback = ref1[name];
      if (!callback(event, data)) {
        return false;
      }
    }
    return true;
  },

  receivePusherEvent(event, data) {
    let job, ref1;
    const [name, type] = event.split(':');

    if (!this.canHandleEvent(event, data)) {
      return;
    }

    if (name === 'job' && ((ref1 = data.job) != null ? ref1.commit : void 0)) {
      this.push(this.normalize('commit', data.job.commit));
    }

    if (event === 'job:log') {
      data = data.job;
      job = this.recordForId('job', data.id);
      return job.appendLog({
        number: parseInt(data.number),
        content: data._log,
        final: data.final
      });
    } else if (data[name]) {
      return this.loadOne(name, data);
    } else {
      if (!type) {
        throw `can't load data for ${name}`;
      }
    }
  },

  loadOne(type, json) {
    let data, default_branch, last_build_id;

    if (type === 'build') {
      const v3CompatiblePayload = this.convertBuildToV3(json);
      const normalized = this.normalize(type, v3CompatiblePayload);
      this.push(normalized);
    } else {
      this.push(this.normalize(type, json));
    }

    // we get other types of records only in a few situations and
    // it's not always needed to update data, so I'm specyfing which
    // things I want to update here:
    if (type === 'build' && (json.repository || json.repo)) {
      data = json.repository || json.repo;
      default_branch = data.default_branch;
      if (default_branch) {
        default_branch.default_branch = true;
      }
      last_build_id = default_branch.last_build_id;

      // a build is a synchronous relationship on a branch model, so we need to
      // have a build record present when we put default_branch from a repository
      // model into the store. We don't send last_build's payload in pusher, so
      // we need to get it here, if it's not already in the store. In the future
      // we may decide to make this relationship async, but I don't want to
      // change the code at the moment
      let lastBuild = this.peekRecord('build', last_build_id);
      if (!last_build_id || lastBuild) {
        return this.push(this.normalize('repo', data));
      } else {
        return this.findRecord('build', last_build_id).then(() => {
          this.push(this.normalize('repo', data));
        });
      }
    }
  },

  convertBuildToV3(json) {
    const { build, commit } = json;
    let response = {};
    const {
      id,
      number,
      state,
      event_type,
      branch,
      repository_id,
    } = build;

    response = Object.assign(response, {
      '@type': 'build',
      '@representation': 'standard',
      id,
      number,
      state,
      event_type,
    });

    if (branch) {
      response.branch = {
        '@type': 'branch',
        '@href': `/repo/${repository_id}/branch/${branch}`,
        '@representation': 'standard',
        name: branch
      };
    }

    if (commit) {
      response.commit = {
        '@type': 'commit',
        '@representation': 'standard',
        id: commit.id,
        sha: commit.sha,
        message: commit.message,
        compare_url: commit.compare_url,
        committed_at: '2017-03-01T13:22:18Z',
      };
    }

    return response;
  },
});
