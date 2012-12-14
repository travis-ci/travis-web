I18nBoundView = Ember.View.extend Ember._Metamorph, {

  key: null,

  valueDidChange: ->
    return if this.morph.isRemoved()
    this.morph.html(this.valueForRender())

  valueForRender: ->
    new Handlebars.SafeString I18n.t(this.key)

  init: ->
    this._super()
    Travis.addObserver('locale', this, 'valueDidChange')

  didInsertElement: ->
    this.valueDidChange()

  destroy: ->
    Travis.removeObserver('locale', this, 'valueDidChange')
    this._super()

  render: (buffer) ->
    buffer.push(this.valueForRender())
}

Ember.Handlebars.registerHelper 't', (key, options) ->
  view = options.data.view
  bindView = view.createChildView(I18nBoundView, { key: key })
  view.appendChild(bindView)
  # dont write any content from this helper, let the child view
  # take care of itself.
  false

