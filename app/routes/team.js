import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  redirect()  {
    window.location.replace(config.urls.about);
  }
});
