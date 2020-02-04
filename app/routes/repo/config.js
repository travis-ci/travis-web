import TravisRoute from 'travis/routes/basic';
import Ember from 'ember';
import Request from 'travis/models/request';

export default TravisRoute.extend({
  titleToken: 'Trigger Build',
});
