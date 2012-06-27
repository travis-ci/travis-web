@repositoriesRendered = ->
  $('#repositories li').length > 0

@buildRendered = ->
  $('#build .summary .number').text() != ''

@matrixRendered = ->
  $('#jobs').text() != ''


