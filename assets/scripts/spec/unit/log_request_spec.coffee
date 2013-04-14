describe 'Travis.Log.Request', ->
  it 'constructs s3 url for log', ->
    Travis.config.api_endpoint = 'api.travis-ci.org'
    request = Travis.Log.Request.create(id: 10)
    s3Url = "https://s3.amazonaws.com/archive.travis-ci.org/jobs/10/log.txt"
    expect( request.s3Url() ).toEqual(s3Url)
