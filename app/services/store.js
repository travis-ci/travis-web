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
    let build, commit, job, ref1, ref2;
    let [name, type] = event.split(':');

    if (!this.canHandleEvent(event, data)) {
      return;
    }

    if (name === 'job' && ((ref1 = data.job) != null ? ref1.commit : void 0)) {
      this.push(this.normalize('commit', data.job.commit));
    }

    if (name === 'build' && ((ref2 = data.build) != null ? ref2.commit : void 0)) {
      build = data.build;
      commit = {
        id: build.commit_id,
        author_email: build.author_email,
        author_name: build.author_name,
        branch: build.branch,
        committed_at: build.committed_at,
        committer_email: build.committer_email,
        committer_name: build.committer_name,
        compare_url: build.compare_url,
        message: build.message,
        sha: build.commit
      };
      delete data.build.commit;
      this.push(this.normalize('commit', commit));
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
      // eslint-disable-next-line
      console.log({event})
      data = data[name];
      // request the updated record to get state update from API.
      this.reloadRecord(name, data.id);
      // when build starts, the repository must also be refreshed
      if (event === 'build:created') {
        this.reloadRecord('repo', data.repository_id);
      }
    } else {
      if (!type) {
        throw `can't load data for ${name}`;
      }
    }
  },

  reloadRecord(type, id) {
    let record = this.peekRecord(type, id);
    if (record) {
      record.reload();
    } else {
      return this.findRecord(type, id);
    }
  },
});
