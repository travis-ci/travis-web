import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  renderTemplate() {
    return this.render('not_found');
  }
});
