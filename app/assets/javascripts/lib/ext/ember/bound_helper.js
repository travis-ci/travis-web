// https://gist.github.com/2018185
// For reference: https://github.com/wagenet/ember.js/blob/ac66dcb8a1cbe91d736074441f853e0da474ee6e/packages/ember-handlebars/lib/views/bound_property_view.js
var BoundHelperView = Ember.View.extend(Ember._Metamorph, {

  context: null,
  options: null,
  property: null,
  // paths of the property that are also observed
  propertyPaths: [],

  value: Ember.K,

  valueForRender: function() {
    var value = this.value(Ember.getPath(this.context, this.property), this.options);
    if (this.options.escaped) { value = Handlebars.Utils.escapeExpression(value); }
    return value;
  },

  render: function(buffer) {
    buffer.push(this.valueForRender());
  },

  valueDidChange: function() {
    if (this.morph.isRemoved()) { return; }
    this.morph.html(this.valueForRender());
  },

  didInsertElement: function() {
    this.valueDidChange();
  },

  init: function() {
    this._super();
    Ember.addObserver(this.context, this.property, this, 'valueDidChange');
    this.get('propertyPaths').forEach(function(propName) {
        Ember.addObserver(this.context, this.property + '.' + propName, this, 'valueDidChange');
    }, this);
  },

  destroy: function() {
    Ember.removeObserver(this.context, this.property, this, 'valueDidChange');
    this.get('propertyPaths').forEach(function(propName) {
        this.context.removeObserver(this.property + '.' + propName, this, 'valueDidChange');
    }, this);
    this._super();
  }

});

Ember.registerBoundHelper = function(name, func) {
  var propertyPaths = Array.prototype.slice.call(arguments, 2);
  Ember.Handlebars.registerHelper(name, function(property, options) {
    var data = options.data,
        view = data.view,
        ctx  = this;

    var bindView = view.createChildView(BoundHelperView, {
      property: property,
      propertyPaths: propertyPaths,
      context: ctx,
      options: options.hash,
      value: func
    });

    view.appendChild(bindView);
  });
};

