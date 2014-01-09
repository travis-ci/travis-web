class Travis.LinesSelector
  element: null
  scroll: null
  location: null

  constructor: (@element, @scroll, @location) ->
    Ember.run.scheduleOnce 'afterRender', this, ->
      @highlightLines()

    @element.on 'click', 'a', (event) =>
      element = $(event.target).parent('p')
      @loadLineNumbers(element, event.shiftKey)

      event.preventDefault()
      false

  willDestroy: ->
    @location.hash = ''

  loadLineNumbers: (element, multiple) ->
    @setHashValueWithLine(element, multiple)
    @highlightLines()

  highlightLines: ->
    @removeAllHighlights()

    if lines = @getSelectedLines()
      @element.find('p:visible').slice(lines.first, lines.last).addClass('highlight')
    @scroll.tryScroll()

  setHashValueWithLine: (line, multiple) ->
    line_number = @getLineNumberFromElement(line)

    if !multiple
      hash = "#L#{line_number}"
    else
      selected_line = @element.find('p:visible.highlight:first')[0]
      selected_number = @getLineNumberFromElement(selected_line)
      lines = [line_number, selected_number].sort (a,b) -> a - b
      hash = "#L#{lines[0]}-L#{lines[1]}"
    @location.hash = hash

  getLineNumberFromElement: (element) ->
    @element.find('p:visible').index(element) + 1

  removeAllHighlights: ->
    @element.find('p.highlight').removeClass('highlight')

  getSelectedLines: ->
    if match = @location.hash.match(/#L(\d+)(-L(\d+))?$/)
      first = match[1] - 1
      last = match[3] || match[1]
      {first: first, last: last}
