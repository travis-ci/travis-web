import {
  create,
  visitable,
  clickable,
  collection,
  text
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/'),
  navigateToProfilePage: clickable('#profile-page-link'),
  sidebarRepositories: collection({
    scope: 'ul.repos-list',
    itemScope: 'li.repo',
    item: {
      name: text('.tile h2.tile-title span.label-align')
    }
  })
});
