import Mixin from '@ember/object/mixin';

export default Mixin.create({
  queryParams: ['page', 'apps-page', 'apps-org-page'],

  page: 1,
  'apps-page': 1,
  'apps-org-page': 1,
});
