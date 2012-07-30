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
  expect(element.attr('href')).toEqual "/#{data.repo}/#{data.type}s/#{data.id}"

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

@displaysLog = (lines) ->
  ix = 0
  log = $.map(lines, (line) -> ix += 1; "#{ix}#{line}").join("\n")
  expect($('#log').text().trim()).toEqual log

@listsRepos = (items) ->
  listsItems('repo', items)

@listsRepo = (data) ->
  row = $('#repositories li')[data.row - 1]
  repo = data.item

  expect($('a.current', row).attr('href')).toEqual "/#{repo.slug}"
  expect($('a.last_build', row).attr('href')).toEqual repo.build.url
  expect($('.duration', row).text()).toEqual repo.build.duration
  expect($('.finished_at', row).text()).toEqual repo.build.finishedAt

@listsBuilds = (builds) ->
  listsItems('build', builds)

@listsBuild = (data) ->
  row = $('#builds tbody tr')[data.row - 1]
  build = data.item

  expect($('.number a', row).attr('href')).toEqual "/#{build.slug}/builds/#{build.id}"
  expect($('.number a', row).text().trim()).toEqual build.number
  expect($('.message', row).text().trim()).toEqual build.message
  expect($('.duration', row).text().trim()).toEqual build.duration
  expect($('.finished_at', row).text().trim()).toEqual build.finishedAt
  expect($(row).attr('class')).toMatch build.color

@listsJobs = (data) ->
  table = $(data.table)
  headers = ($(element).text() for element in $("thead th", table))
  expect(headers).toEqual(data.headers)

  $.each data.jobs, (row, job) -> listsJob(table: data.table, row: row + 1, item: job)

@listsJob = (data) ->
  row = $('tbody tr', data.table)[data.row - 1]
  job = data.item

  element = $(row)
  expect(element.attr('class')).toMatch job.color

  element = $("td.number", row)
  expect(element.text()).toEqual job.number

  element = $("td.number a", row)
  expect(element.attr('href')).toEqual "/#{job.repo}/jobs/#{job.id}"

  element = $("td.duration", row)
  expect(element.text()).toEqual job.duration

  element = $("td.finished_at", row)
  expect(element.text()).toEqual job.finishedAt

  element = $("td:nth-child(6)", row)
  expect(element.text()).toEqual job.rvm

@listsQueuedJobs = (jobs) ->
  listsItems('queuedJob', jobs)

@listsQueuedJob = (data) ->
  console.log data
  job = data.item
  text = $($("#queue_#{data.name} li")[data.row - 1]).text()
  expect(text).toContain job.repo
  expect(text).toContain "##{job.number}"

@listsQueue = (data) ->
  name = data.item.name
  job  = data.item.item
  text = $($("#queue_#{name} li")[data.row - 1]).text()
  expect(text).toContain job.repo
  expect(text).toContain "##{job.number}"

@listsItems = (type, items) ->
  $.each items, (row, item) =>
    this["lists#{$.camelize(type)}"](item: item, row: row + 1)

@listsQueues = (queues) ->
  listsItems('queue', queues)

