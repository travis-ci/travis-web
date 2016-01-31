import Ember from 'ember';

var StylesheetsManagerInitializer, initialize, stylesheetsManager;

stylesheetsManager = Ember.Object.create({
  enable: function(id) {
    return $("#" + id).removeAttr('disabled');
  },
  disable: function(id) {
    return $("#" + id).attr('disabled', 'disabled');
  }
});

initialize = function(application) {
  application.register('stylesheetsManager:main', stylesheetsManager, {
    instantiate: false
  });
  return application.inject('route', 'stylesheetsManager', 'stylesheetsManager:main');
};

StylesheetsManagerInitializer = {
  name: 'inject-stylesheets-manager',
  initialize: initialize
};

export {initialize};

export default StylesheetsManagerInitializer;
