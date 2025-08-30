import BasicRoute from 'travis/routes/basic';
import TailwindBaseMixin from 'travis/mixins/tailwind-base';

export default BasicRoute.extend(TailwindBaseMixin, {
  needsAuth: true,
  titleToken: 'Licensing Information'
});
