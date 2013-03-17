@notEmpty = (selector) ->
  -> $(selector).text().trim() != ''

@hasText = (selector, text) ->
  -> $(selector).text().trim() == text

@reposRendered   = notEmpty('#repos li.selected')
@buildRendered   = notEmpty('#summary .number')
@buildsRendered  = notEmpty('#builds .number')
@jobRendered     = notEmpty('#summary .number')
@jobsRendered    = notEmpty('#jobs .number')
@queuesRendered  = notEmpty('#queue_linux li')
@workersRendered = notEmpty('.worker')

