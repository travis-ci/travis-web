import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import annotateYaml from 'travis/utils/annotate-yaml';

export default Component.extend({
  @computed('request.messages.[]', 'request.yaml_config')
  messageHighlights(messages, yaml) {
    return annotateYaml(messages, yaml);
  }
});
