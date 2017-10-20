/* eslint-disable camelcase */
import { later } from '@ember/runloop';
import DS from 'ember-data';
import PaginatedCollectionPromise from 'travis/utils/paginated-collection-promise';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import FilteredArrayManager from 'travis/utils/filtered-array-manager';
import fetchLivePaginatedCollection from 'travis/utils/fetch-live-paginated-collection';

export default DS.Store.extend({
  @service auth: null,

  defaultAdapter: 'application',
  adapter: 'application',

  init() {
    this._super(...arguments);
    this.filteredArraysManager = FilteredArrayManager.create({ store: this });
  },

  // Fetch a filtered collection.
  //
  // modelName      - a type of the model passed as a string, for example 'repo'
  // queryParams    - params that will be passed to the store.query function when
  //                  fetching records on the initial call. Passing null or
  //                  undefined here will stop any requests from happening,
  //                  filtering will be based only on existing records
  // filterFunction - a function that will be called to determine wheather a
  //                  record should be included in the filtered collection. A
  //                  passed function will be called with a record as an
  //                  argument
  // dependencies   - a list of dependencies that will trigger the re-evaluation
  //                  of a record. When one of the dependencies changes on any
  //                  of the records in the store, it may be added or removed
  //                  from a filtered array.
  // forceReload    - if set to true, store.query will be run on each call
  //                  instead of only running it on the first run
  //
  // Example:
  //
  //   store.filter(
  //     'repo',
  //     { starred: true },
  //     (repo) => repo.get('starred'),
  //     ['starred'],
  //     true
  //   )
  //
  // Rationale for our own implementation of store.filter:
  //
  // The default implementation of filter is rather limited and misses a few
  // scenarios important to us. The problem is that when you use the default
  // store.filter implementation, it evaluates if a record should be added to a
  // filtered array only when a new record is added to the store or when a
  // property on a record itself changes. That means that we can't observe
  // computed properties that depend on anything else than defined properties.
  // Our implementation allows to pass dependencies as an optional argument,
  // which allows to pass any property as a dependency.
  //
  // One more change in relation to the default filter representation is that
  // the default store.filter implementation will always fetch new records. The
  // new implementation has an identity map built in and it will always fetch
  // the same array for the same set of arguments. Thanks to that running
  // store.filter multiple times will return immediately on the second and
  // subsequent tries.
  //
  // If you need to also fetch new results each time the function is run, you
  // can set forceReload option to true, but it will still resolve immediately
  // once a first query is already finished.
  //
  // For more info you may also see comments in FilteredArraysManager.
  filter(modelName, queryParams, filterFunction, dependencies, forceReload) {
    if (!dependencies) {
      // just do what filter would normally do
      return this._super(...arguments);
    } else {
      return this.filteredArraysManager.fetchArray(...arguments);
    }
  },

  // Returns a collection with pagination data. If the first page is requested,
  // the collection will be live updated. Otherwise keeping the calculations and
  // figuring out if the record should be put on the page is not easily
  // achieveable (or even impossible in some cases).
  //
  // modelName   - a type of the model as a string, for example 'repo'
  // queryParams - params for a store.query call that will be fired to fetch the
  //               data from the server
  // options     - additional options:
  //               filter      - a filter function that will be used to test if a
  //                             record should be added or removed from the array. It
  //                             will be called with a record under test as an
  //                             argument. It only matters for live updates
  //               sort        - either a string or a function to sort the collection
  //                             with. If it's a string, it should be the name of the
  //                             property to sort by, with an optional ':asc' or
  //                             ':desc' suffixes, for example 'id:desc'. If it's a
  //                             function it will be called with 2 records to compare
  //                             as an argument
  //               dependencies - a set of dependencies that will be watched to
  //                              re-evaluate if a record should be a part of a
  //                              collection
  //               forceReload  - if set to true, store.query will be run on
  //                              call
  //
  // Examples:
  //
  //   store.paginated(
  //     'repo',
  //     { active: true, offset: 0, limit: 10 },
  //     {
  //       filter: (repo) => repo.get('active'),
  //       sort: 'id:desc',
  //       dependencies: ['active'],
  //       forceReload: true
  //     }
  //
  paginated(modelName, queryParams, options) {
    if (!queryParams.offset) {
      // we're on the first page, live updates can be enabled
      return fetchLivePaginatedCollection(this, ...arguments);
    } else {
      return PaginatedCollectionPromise.create({
        content: this.query(...arguments)
      });
    }
  },

  receivePusherEvent(event, data) {
    let build, commit, job, name, ref, ref1, ref2, type;
    ref = event.split(':');
    name = ref[0];
    type = ref[1];

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

    if (name === 'branch') {
      // force reload of repo branches
      // delay to resolve race between github-sync and live
      const branchName = data.branch;

      later(() => {
        this.findRecord('branch', `/repo/${data.repository_id}/branch/${branchName}`);
      }, config.intervals.branchCreatedSyncDelay);

      delete data.branch;
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

    this.push(this.normalize(type, json));

    // we get other types of records only in a few situations and
    // it's not always needed to update data, so I'm specyfing which
    // things I want to update here:
    if (type === 'build' && (json.repository || json.repo)) {
      data = json.repository || json.repo;
      default_branch = data.default_branch;
      if (default_branch) {
        default_branch.default_branch = true;
        default_branch['@href'] = `/repo/${data.id}/branch/${default_branch.name}`;
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
  }
});
