import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { UTM_FIELD_LIST } from 'travis/routes/application';

export default Controller.extend({
  features: service(),

  queryParams: [...UTM_FIELD_LIST],
});
