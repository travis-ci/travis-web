import config from 'travis/config/environment';

export default function signInUser(user) {
  const { validAuthToken: token }  = config;
  user.attrs.token = token;
  user.attrs.rssToken = token;
  user.attrs.webToken = token;
  user.save();

  const localStorageUser = JSON.parse(JSON.stringify(user.attrs));
  localStorageUser.token = token;
  localStorageUser.rss_token = token;
  localStorageUser.web_token = token;
  window.localStorage.setItem('travis.token', token);
  window.localStorage.setItem('travis.rssToken', token);
  window.localStorage.setItem('travis.webToken', token);
  window.localStorage.setItem('travis.auth.updatedAt', Date.now());
  window.localStorage.setItem('travis.user', JSON.stringify(localStorageUser));
}
