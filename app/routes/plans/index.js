import BasicRoute from 'travis/routes/basic';

export default BasicRoute.extend({
  model() {
    const appQueryParams = this.paramsFor('application');
    return { appQueryParams };
  },
});
