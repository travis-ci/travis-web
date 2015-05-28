`import { test, moduleForComponent } from 'ember-qunit'`

moduleForComponent 'loading-indicator', {
  # specify the other units that are required for this test
  # needs: ['component:foo', 'helper:bar']
}

test 'it renders', (assert) ->

  component = @subject(center: true)

  @append()

  ok component.$('span').hasClass('loading-indicator'), 'component has loading indicator class'
  ok component.$().hasClass('loading-container'), 'indicator gets parent class if centered flag is given'
