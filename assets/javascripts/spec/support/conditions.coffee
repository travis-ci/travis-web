@repositoriesRendered = ->
  $('#repositories li a.current').text() != ''

@buildRendered = ->
  $('#build .summary .number').text() != ''

@matrixRendered = ->
  $('#jobs').text() != ''


