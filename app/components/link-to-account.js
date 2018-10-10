import Component from '@ember/component';

const LinkToAccountComponent = Component.extend({
  tagName: '',

  routeName: '',
  routeModel: null
});

LinkToAccountComponent.reopenClass({
  positionalParams: ['routeName', 'routeModel']
});

export default LinkToAccountComponent;
