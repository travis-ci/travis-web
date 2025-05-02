import Service, { inject as service } from '@ember/service';

/**
 * Service for cookies
 */
export default Service.extend({

  setSignedInCookie(value) {
    document.cookie = `travis_auth=${value? 'true':'false'}`;
  }
});
