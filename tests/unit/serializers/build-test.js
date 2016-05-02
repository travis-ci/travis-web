import { moduleForModel, test } from 'ember-qunit';

moduleForModel('build', 'Unit | Serializer | build', {
  // Specify the other units that are required for this test.
  needs: ['serializer:build', 'model:commit', 'model:job', 'model:branch']
});

test("it normalizes the singular response", function() {
  QUnit.dump.maxDepth = 10;
  let payload = {
    build: {
      id: 1,
      repository_id: 2,
      commit_id: 3,
      number: "10",
      event_type: "push",
      pull_request: false,
      pull_request_title: null,
      pull_request_number:null,
      config: { "language": "ruby" },
      state: "passed",
      started_at: "2016-02-24T16:37:54Z",
      finished_at:"2016-02-24T16:40:10Z",
      duration: 72,
      job_ids:[5, 6]
    },
    commit: {
      id: 3,
      sha: "864c69a9588024331ba0190e9d8492ae0b6d5eff",
      branch: "development",
      branch_is_default: false,
      message: "A commit",
      committed_at: "2016-02-24T16:36:23Z",
      author_name: "Mr. Travis",
      author_email: "nothing@travis-ci.org",
      committer_name: "Mr. Travis",
      committer_email: "nothing@travis-ci.org",
      compare_url: "https://github.com/drogus/test-project-1/compare/432d5426aa67...864c69a95880"
    },
    jobs: [{
      id: 5,
      repository_id: 2,
      build_id: 1,
      commit_id: 3,
      log_id: 7,
      state: "passed",
      number: "10.1",
      config: { "language": "ruby" },
      started_at: "2016-02-24T16:37:54Z",
      finished_at: "2016-02-24T16:38:19Z",
      queue: "builds.docker",
      allow_failure: false,
      tags:null
    },{
      id: 6,
      repository_id: 2,
      build_id: 1,
      commit_id: 3,
      log_id: 8,
      state: "passed",
      number: "10.2",
      config: { "language": "ruby" },
      started_at: "2016-02-24T16:37:54Z",
      finished_at: "2016-02-24T16:38:19Z",
      queue: "builds.docker",
      allow_failure: false,
      tags:null
    }]
  };


  let store = this.store();
  let serializer = store.serializerFor('build');
  let result = serializer.normalizeResponse(store, store.modelFor('build'), payload, 1, 'findRecord');

  let expectedResult = {
    "data": {
      "id": "1",
      "type": "build",
      "attributes": {
        "state": "passed",
        "number": 10,
        "_duration": 72,
        "_config": { "language": "ruby" },
        "_startedAt": "2016-02-24T16:37:54Z",
        "_finishedAt": "2016-02-24T16:40:10Z",
        "pullRequest": false,
        "pullRequestTitle": null,
        "pullRequestNumber": null,
        "eventType": "push"
      },
      "relationships": {
        "branch": {
          "data": {
            "name": "development",
            "default_branch": false,
            "@href": "\/repo\/2\/branch\/development",
            "id": "\/repo\/2\/branch\/development",
            "type": "branch"
          }
        },
        "repo": {
          "data": {
            "id": "2",
            "type": "repo"
          }
        },
        "commit": {
          "data": {
            "id": "3",
            "sha": "864c69a9588024331ba0190e9d8492ae0b6d5eff",
            "branch": "development",
            "branch_is_default": false,
            "message": "A commit",
            "committed_at": "2016-02-24T16:36:23Z",
            "author_name": "Mr. Travis",
            "author_email": "nothing@travis-ci.org",
            "committer_name": "Mr. Travis",
            "committer_email": "nothing@travis-ci.org",
            "compare_url": "https:\/\/github.com\/drogus\/test-project-1\/compare\/432d5426aa67...864c69a95880",
            "type": "commit"
          }
        },
        "jobs": {
          "data": [
            {
              "id": "5",
              "repository_id": 2,
              "build_id": 1,
              "commit_id": 3,
              "log_id": 7,
              "state": "passed",
              "number": "10.1",
              "config": { "language": "ruby" },
              "started_at": "2016-02-24T16:37:54Z",
              "finished_at": "2016-02-24T16:38:19Z",
              "queue": "builds.docker",
              "allow_failure": false,
              "tags": null,
              "type": "job"
            },
            {
              "id": "6",
              "repository_id": 2,
              "build_id": 1,
              "commit_id": 3,
              "log_id": 8,
              "state": "passed",
              "number": "10.2",
              "config": { "language": "ruby" },
              "started_at": "2016-02-24T16:37:54Z",
              "finished_at": "2016-02-24T16:38:19Z",
              "queue": "builds.docker",
              "allow_failure": false,
              "tags": null,
              "type": "job"
            }
          ]
        }
      }
    },
    "included": [
      {
        "id": "\/repo\/2\/branch\/development",
        "type": "branch",
        "attributes": {},
        "relationships": {}
      },
      {
        "id": "3",
        "type": "commit",
        "attributes": {},
        "relationships": {}
      },
      {
        "id": "5",
        "type": "job",
        "attributes": {},
        "relationships": {}
      },
      {
        "id": "6",
        "type": "job",
        "attributes": {},
        "relationships": {}
      }
    ]
  };
  deepEqual(expectedResult, result);
});
