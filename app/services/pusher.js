import Service from '@ember/service';
import { later } from '@ember/runloop';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';

export default Service.extend({
  @service store: null,
  @service liveUpdatesRecordFetcher: null,

  receive(event, data) {
    let build, commit, job;
    let store = this.get('store');
    let [name, type] = event.split(':');

    if (name === 'job' && data.job && data.job.commit) {
      store.push(store.normalize('commit', data.job.commit));
    }

    if (name === 'build' && data.build && data.build.commit) {
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
      store.push(store.normalize('commit', commit));
    }

    if (name === 'branch') {
      // force reload of repo branches
      // delay to resolve race between github-sync and live
      const branchName = data.branch;

      later(() => {
        store.findRecord('branch', `/repo/${data.repository_id}/branch/${branchName}`);
      }, config.intervals.branchCreatedSyncDelay);

      delete data.branch;
    }

    if (event === 'job:log') {
      data = data.job;
      job = store.recordForId('job', data.id);
      return job.appendLog({
        number: parseInt(data.number),
        content: data._log,
        final: data.final
      });
    } else if (data[name]) {
      if (data._no_full_payload) {
        // if payload is too big, travis-live will send us only the id of the
        // object or id with build_id for jobs. If that happens, just load the
        // object from the API
        let payload = {};
        if (name === 'job') {
          payload['build_id'] = data.job.build_id;
        }
        this.get('liveUpdatesRecordFetcher').fetch(name, data[name].id, payload);
      } else {
        return this.loadOne(name, data);
      }
    } else {
      if (!type) {
        throw `can't load data for ${name}`;
      }
    }
  },

  loadOne(type, json) {
    let data, defaultBranch, lastBuildId;
    let store = this.get('store');

    store.push(store.normalize(type, json));

    // we get other types of records only in a few situations and
    // it's not always needed to update data, so I'm specyfing which
    // things I want to update here:
    if (type === 'build' && (json.repository || json.repo)) {
      data = json.repository || json.repo;
      defaultBranch = data.default_branch;
      if (defaultBranch) {
        defaultBranch.default_branch = true;
        defaultBranch['@href'] = `/repo/${data.id}/branch/${defaultBranch.name}`;
      }
      lastBuildId = defaultBranch.last_build_id;

      // a build is a synchronous relationship on a branch model, so we need to
      // have a build record present when we put default_branch from a repository
      // model into the store. We don't send last_build's payload in pusher, so
      // we need to get it here, if it's not already in the store. In the future
      // we may decide to make this relationship async, but I don't want to
      // change the code at the moment
      let lastBuild = store.peekRecord('build', lastBuildId);
      if (!lastBuildId || lastBuild) {
        return store.push(store.normalize('repo', data));
      } else {
        return store.findRecord('build', lastBuildId).then(() => {
          store.push(store.normalize('repo', data));
        });
      }
    }
  }
});
