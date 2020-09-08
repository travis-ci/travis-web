import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';
import { stubService } from 'travis/tests/helpers/stub-service';

// stub auth service
const authStub = Service.extend({
  currentUser: EmberObject.create()
});

module('Integration | Component | Dialog | prioritize build modal', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    stubService('auth', authStub);
  });

  test('it shows the priority action modal and loading indicator if task is in running state', async function (assert) {
    this.set('build', EmberObject.create());
    this.set('job', EmberObject.create());
    this.set('priority', EmberObject.create({ isRunning: true }));
    this.set('fakeAction', () => {});

    await render(hbs`<Dialogs::prioritize-build-modal @build={{build}} @job={{job}} @isOpen={{true}} @onClose={{fakeAction}} @increasePriority={{priority}} />`);
    assert.dom('.repo-actions-modal__header').exists();
    assert.dom('.repo-actions-modal__header').hasText('Prioritize your build');
    assert.dom('.repo-actions-modal__controls').exists();
  });
});
