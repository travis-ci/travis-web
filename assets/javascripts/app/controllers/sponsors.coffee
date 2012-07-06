Travis.SponsorsController = Em.ArrayController.extend
  page: 0

  arrangedContent: (->
    @get('shuffled').slice(@start(), @end())
  ).property('shuffled.length', 'page')

  shuffled: (->
    if content = @get('content') then $.shuffle(content) else []
  ).property('content.length')

  tick: ->
    @set('page', if @isLast() then 0 else @get('page') + 1)

  pages: (->
    length = @getPath('content.length')
    if length then parseInt(length / @get('perPage') + 1) else 1
  ).property('length')

  isLast: ->
    @get('page') == @get('pages') - 1

  start: ->
    @get('page') * @get('perPage')

  end: ->
    @start() + @get('perPage')
