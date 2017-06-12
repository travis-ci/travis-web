import {
  create,
  contains,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/'),
  headerWrapperWhenUnauthenticated: contains('.topbar', { scope: '.feature-wrapper .top.landing-pro header.top' }),
  headerWrapperWhenAuthenticated: contains('.topbar', { scope: '.feature-wrapper .main .wrapper.non-centered header.top' }),
});
