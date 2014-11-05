@displaysRepository = (repo) ->
  equal($('#repo h3 a').attr('href'), repo.href, 'repository title should link to repo page')
  equal($('#repo .github-icon a').attr('href'), "https://github.com#{repo.href}", 'github icon should link to repo on github')

@displaysTabs = (tabs) ->
  for name, tab of tabs
    equal($("#tab_#{name} a").attr('href'), tab.href, "#{name} tab should link to #{tab.href}") unless tab.hidden
    equal($("#tab_#{name}").hasClass('active'), !!tab.active, "#{name} tab should #{'not' unless tab.active} be active")
    equal($("#tab_#{name}").hasClass('display-inline'), !tab.hidden, "#{name} tab should have class display-inline") if name in ['build', 'job']

@displaysSummaryBuildLink = (link, number) ->
  element = $('#new-summary .build-status a')
  equal( element.attr('href') , link)
  equal( element.text().trim() , "##{number} started")

@displaysSummary = (data) ->
  element = $('#new-summary .build-status a')
  equal(element.attr('href'), "/#{data.repo}/#{data.type}s/#{data.id}")

  element = $('#new-summary .finished')
  equal(element.text().trim(), data.finishedAt)

  element = $('#new-summary .runtime')
  duration_regexp = new RegExp("(ran|running) for #{data.duration}")
  ok(duration_regexp.test(element.text().trim()))

  element = $('#new-summary .commit-changes a.commit')
  equal(element.attr('href'), "https://github.com/#{data.repo}/commit/#{data.commit}")

  element = $('#new-summary .commit-changes a.commit')
  equal(element.text(), "Commit #{data.commit}")

  element = $('#new-summary .branch')
  equal(element.text().trim(), data.branch)

  element = $('#new-summary .commit-changes a.compare')
  equal(element.attr('href'), "https://github.com/compare/#{data.compare}")

  element = $('#new-summary .commit-changes a.compare')
  equal(element.text(), "Compare #{data.compare}")

  element = $('#new-summary .subject')
  equal(element.text().trim(), "- #{data.message}")

@displaysSummaryGravatars = (data) ->
  element = $('#new-summary .author .committed img')
  equal(element.attr('src'), Travis.Urls.gravatarImage(data.committerEmail, 40))

  element = $('#new-summary .author .authored img')
  equal(element.attr('src'), Travis.Urls.gravatarImage(data.authorEmail, 40))

@displaysLog = (lines) ->
  log = lines.join('')
  equal($('#log p').text().trim(), log)

@listsRepos = (items) ->
  listsItems('repo', items)

@listsRepo = (data) ->
  row = $('#repos li')[data.row - 1]
  repo = data.item

  equal($('a.slug', row).attr('href'), "/#{repo.slug}")
  equal($('a.last_build', row).attr('href'), repo.build.url)
  equal($('.duration', row).text(), repo.build.duration)
  equal($('.finished_at', row).text(), repo.build.finishedAt)

@listsBuilds = (builds) ->
  listsItems('build', builds)

@listsBuild = (data) ->
  row = $('#builds tbody tr')[data.row - 1]
  build = data.item

  equal($('.number a', row).attr('href'), "/#{build.slug}/builds/#{build.id}")
  equal($('.number a', row).text().trim(), build.number)
  equal($('.message', row).text().trim(), build.message)
  equal($('.duration', row).text().trim(), build.duration)
  equal($('.finished_at', row).text().trim(), build.finishedAt)
  ok($(row).attr('class').match(build.color))

@listsJobs = (data) ->
  table = $(data.table)
  headers = ($(element).text() for element in $("thead th", table))
  deepEqual(headers, data.headers)

  $.each data.jobs, (row, job) -> listsJob(table: data.table, row: row + 1, item: job)

@listsJob = (data) ->
  row = $('tbody tr', data.table)[data.row - 1]
  job = data.item

  element = $(row)
  ok(element.attr('class').match(job.color))

  element = $("td.number", row)
  equal(element.text().trim(), job.number)

  element = $("td.number a", row)
  equal(element.attr('href'), "/#{job.repo}/jobs/#{job.id}")

  element = $("td.duration", row)
  equal(element.text().trim(), job.duration)

  element = $("td.finished_at", row)
  equal(element.text().trim(), job.finishedAt)

  element = $("td:nth-child(4)", row)
  equal(element.text().trim(), job.rvm)

@listsQueuedJobs = (jobs) ->
  listsItems('queuedJob', jobs)

@listsQueuedJob = (data) ->
  job = data.item
  text = $($("#queue_#{data.name} li")[data.row - 1]).text()
  ok(text.match(job.repo), "#{text} should contain #{job.repo}")
  ok(text.match(job.repo), "#{text} should contain #{job.number}")

@listsQueue = (data) ->
  name = data.item.name
  job  = data.item.item
  text = $($("#queue_#{name} li")[data.row - 1]).text()
  ok(text.match(job.repo), "#{text} should contain #{job.repo}")
  ok(text.match(job.repo), "#{text} should contain #{job.number}")

@listsItems = (type, items) ->
  $.each items, (row, item) =>
    window["lists#{$.camelize(type)}"](item: item, row: row + 1)

@listsQueues = (queues) ->
  listsItems('queue', queues)

@listsWorker = (data) ->
  group = $("#workers li:contains('#{data.group}')")
  element = $($('ul li', group)[data.row - 1])
  worker = data.item

  ok(element.text().match(worker.name))
  ok(element.text().match(worker.state))
