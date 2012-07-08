describe 'events', ->
  beforeEach ->
    app
    waitFor buildRendered

  it 'foo', ->
    # Travis.app.receive 'job:created',
    #   job:
    #     id: 10
    #     repository_id: 1
    #     build_id: 10
    #     commit_id: 10
    #     log_id: 10
    #     number: '10.1'
    #   commit:
    #     id: 10
    #     sha: '1234567'
    #     branch: 'master'
    #     message: 'commit message 1'
    #     author_name: 'author name'
    #     author_email: 'author@email.com'
    #     committer_name: 'committer name'
    #     committer_email: 'committer@email.com'
    #     compare_url: 'http://github.com/compare/0123456..1234567'


    Travis.app.receive 'build:started',
      repository:
        id: 10
        owner: 'travis-ci'
        name: 'travis-support'
        slug: 'travis-ci/travis-support'
        build_ids: [10]
        last_build_id: 10
        last_build_number: 10
        last_build_started_at: '2012-07-02T00:02:00Z'
        description: 'Description of travis-hub'
      build:
        id: 10
        repository_id: 1
        commit_id: 10
        job_ids: [10]
        number: 10
        event_type: 'push'
        config: { rvm: ['rbx'] }
      commit:
        id: 10
        sha: '1234567'
        branch: 'master'
        message: 'commit message 1'
        author_name: 'author name'
        author_email: 'author@email.com'
        committer_name: 'committer name'
        committer_email: 'committer@email.com'
        compare_url: 'http://github.com/compare/0123456..1234567'
