import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  renderTemplate() {
    $('body').attr('id', 'not-found');
    return this.render('not_found');
  }
});
