import Route from '@ember/routing/route';
import {inject as service} from "@ember/service";

export default class NoBuild extends Route {
  @service tabStates;
  model() {
    return this.modelFor('repo');
  }

  setupController(controller, model, transition) {
    this.tabStates.setMainTab('current');
    super.setupController(controller, model, transition);
    controller.set('repo', model);
  }
}
