@displaysBuildSummary = (data) ->
  element = $('#summary .number a')
  expect(element.attr('href')).toEqual "#!/#{data.repo}/builds/#{data.id}"

  element = $('#summary .finished_at')
  expect(element.text()).toMatch /\d+ (\w+) ago/

  element = $('#summary .duration')
  expect(element.text()).toEqual data.duration

  element = $('#summary .commit a')
  expect(element.attr('href')).toEqual "http://github.com/#{data.repo}/commit/#{data.commit}"

  element = $('#summary .commit a')
  expect(element.text()).toEqual "#{data.commit} (#{data.branch})"

  element = $('#summary .compare a')
  expect(element.attr('href')).toEqual "http://github.com/compare/#{data.compare}"

  element = $('#summary .compare a')
  expect(element.text()).toEqual data.compare

  element = $('#summary .message')
  expect(element.text()).toEqual data.message

@displaysJobMatrix = (data) ->
  headers = ($(element).text() for element in $("#{data.element} thead th"))
  expect(headers).toEqual(data.headers)

  $.each data.jobs, (ix, job) ->
    ix = (ix + 1) * 3  # cuz metamorph is adding two script elements

    element = $("#{data.element} tr:nth-child(#{ix}) td.number")
    expect(element.text()).toEqual job.number

    element = $("#{data.element} tr:nth-child(#{ix}) td.number a")
    expect(element.attr('href')).toEqual "#!/#{job.repo}/jobs/#{job.id}"

    element = $("#{data.element} tr:nth-child(#{ix}) td.duration")
    expect(element.text()).toEqual job.duration

    element = $("#{data.element} tr:nth-child(#{ix}) td.finished_at")
    if job.finishedAt == '-'
      expect(element.text()).toEqual '-'
    else
      expect(element.text()).toMatch job.finishedAt

    element = $("#{data.element} tr:nth-child(#{ix}) td:nth-child(6)")
    expect(element.text()).toEqual job.rvm



