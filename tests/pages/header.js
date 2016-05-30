import {
  create,
  clickable
} from 'ember-cli-page-object';

export default create({
  clickDashboardLink: clickable('.topbar h1#logo a')
});
