@notEmpty = (selector) ->
  -> $(selector).text().trim() != ''

@hasText = (selector, text) ->
  -> $(selector).text().trim() == text

@reposRendered   = notEmpty('#repositories li a.current')
@buildRendered   = notEmpty('#summary .number')
@buildsRendered  = notEmpty('#builds .number')
@jobRendered     = notEmpty('#summary .number')
@jobsRendered    = notEmpty('#jobs .number')
@queuesRendered  = notEmpty('#queue_common li')
@workersRendered = notEmpty('.worker')

