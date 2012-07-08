@notEmpty = (selector) ->
  -> $(selector).text().trim() != ''

@hasText = (selector, text) ->
  -> $(selector).text().trim() == text

@reposRendered  = notEmpty('#repositories li a.current')
@buildRendered  = notEmpty('#summary .number')
@buildsRendered = notEmpty('#builds .number')
@matrixRendered = notEmpty('#jobs')
@jobRendered    = notEmpty('#summary .number')

