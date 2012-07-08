@displaysReposList = (repos) ->
  elements = $('#repositories li').toArray()
  ix = 0
  for repo in repos
    element = elements[ix]
    expect($('a.current', element).attr('href')).toEqual "#!/#{repo.slug}"
    expect($('a.last_build', element).attr('href')).toEqual repo.build.url
    expect($('.duration', element).text()).toEqual repo.build.duration
    expect($('.finished_at', element).text()).toEqual repo.build.finishedAt
    ix += 1

@displaysRepository = (repo) ->
  expect($('#repository h3 a').attr('href')).toEqual (repo.href)

@displaysTabs = (tabs) ->
  for name, tab of tabs
    expect($("#tab_#{name} a").attr('href')).toEqual tab.href unless tab.hidden
    expect($("#tab_#{name}").hasClass('active')).toEqual !!tab.active
    expect($("#tab_#{name}").hasClass('display')).toEqual !tab.hidden if name in ['build', 'job']


@displaysSummary = (data) ->
  element = $('#summary .left:first-child dt:first-child')
  expect(element.text()).toEqual $.camelize(data.type)

  element = $('#summary .number a')
  expect(element.attr('href')).toEqual "#!/#{data.repo}/#{data.type}s/#{data.id}"

  element = $('#summary .finished_at')
  expect(element.text()).toEqual data.finishedAt

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
    expect(element.text()).toEqual job.finishedAt

    element = $("#{data.element} tr:nth-child(#{ix}) td:nth-child(6)")
    expect(element.text()).toEqual job.rvm

@displaysBuildsList = (builds) ->
  rows = $('#builds tbody tr').toArray()
  ix = 0
  for build in builds
    row = rows[ix]
    expect($('.number a', row).attr('href')).toEqual "#!/#{build.slug}/builds/#{build.id}"
    expect($('.number a', row).text()).toEqual build.number
    expect($('.message', row).text()).toEqual build.message
    expect($('.duration', row).text()).toEqual build.duration
    expect($('.finished_at', row).text()).toEqual build.finishedAt
    ix += 1

@displaysLog = (lines) ->
  ix = 0
  log = $.map(lines, (line) -> ix += 1; "#{ix}#{line}").join("\n")
  expect($('#log').text().trim()).toEqual log



