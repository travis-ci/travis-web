@displaysBuildSummary = (data) ->
  element = $('#build .summary .number a')
  expect(element.attr('href')).toEqual "#!/#{data.repo}/builds/#{data.id}"

  element = $('#build .summary .finished_at')
  expect(element.text()).toMatch /\d+ (\w+) ago/

  element = $('#build .summary .duration')
  expect(element.text()).toEqual data.duration

  element = $('#build .summary .commit a')
  expect(element.attr('href')).toEqual "http://github.com/#{data.repo}/commit/#{data.commit}"

  element = $('#build .summary .commit a')
  expect(element.text()).toEqual "#{data.commit} (#{data.branch})"

  element = $('#build .summary .compare a')
  expect(element.attr('href')).toEqual "http://github.com/compare/#{data.compare}"

  element = $('#build .summary .compare a')
  expect(element.text()).toEqual data.compare

  element = $('#build .summary .message')
  expect(element.text()).toEqual data.message

@displaysBuildMatrix = (data) ->
  headers = ($(element).text() for element in $('#jobs thead th'))
  expect(headers).toEqual(data.headers)

  $.each data.jobs, (ix, job) ->
    ix = (ix + 1) * 3  # cuz metamorph is adding two script elements

    element = $("#jobs tr:nth-child(#{ix}) td.number")
    expect(element.text()).toEqual job.number

    element = $("#jobs tr:nth-child(#{ix}) td.number a")
    expect(element.attr('href')).toEqual "#!/#{job.repo}/jobs/#{job.id}"

    element = $("#jobs tr:nth-child(#{ix}) td.duration")
    expect(element.text()).toEqual job.duration

    element = $("#jobs tr:nth-child(#{ix}) td.finished_at")
    if job.finishedAt == '-'
      expect(element.text()).toEqual '-'
    else
      expect(element.text()).toMatch job.finishedAt

    element = $("#jobs tr:nth-child(#{ix}) td:nth-child(6)")
    expect(element.text()).toEqual job.rvm



