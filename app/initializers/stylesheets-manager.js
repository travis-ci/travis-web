import Ember from 'ember';

let StylesheetsManagerInitializer, initialize, stylesheetsManager;

stylesheetsManager = Ember.Object.create({
  enable(id) {
    return Ember.$(`#${id}`).removeAttr('disabled');
  },
  disable(id) {
    return Ember.$(`#${id}`).attr('disabled', 'disabled');
  }
});

initialize = application => {
  application.register('stylesheetsManager:main', stylesheetsManager, {
    instantiate: false
  });
  return application.inject('route', 'stylesheetsManager', 'stylesheetsManager:main');
};

StylesheetsManagerInitializer = {
  name: 'inject-stylesheets-manager',
  initialize
};

export { initialize };

export default StylesheetsManagerInitializer;
