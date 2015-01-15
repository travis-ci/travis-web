View = Ember.View.extend
  tagName: 'button'
  classNameBindings: ['isLoading', 'showMore']
  showMore: true
  attributeBindings: ['disabled']
  isLoadingBinding: 'controller.isLoading'
  template: Ember.Handlebars.compile('{{view.label}}')

  disabledBinding: 'isLoading'

  label: (->
    if @get('isLoading') then 'Loading' else 'Show more'
  ).property('isLoading')

  click: ->
    @get('controller').showMore()

Travis.ShowMoreButtonView = View
