import TravisRoute from 'travis/routes/basic';
import TailwindBaseMixin from 'travis/mixins/tailwind-base';

export default TravisRoute.extend(TailwindBaseMixin, {
  needsAuth: false,
});
