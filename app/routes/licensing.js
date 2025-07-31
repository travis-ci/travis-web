import BasicRoute from 'travis/routes/basic';
import TailwindBaseMixin from 'travis/mixins/tailwind-base';

export default BasicRoute.extend(TailwindBaseMixin, {
  titleToken: 'Licensing Information',

  activate() {
    this._super(...arguments);
  }
});
