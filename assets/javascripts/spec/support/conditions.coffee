@repositoriesRendered = ->
  $('#repositories li a.current').text() != ''

@buildRendered = ->
  $('#summary .number').text() != ''

@matrixRendered = ->
  $('#jobs').text() != ''


