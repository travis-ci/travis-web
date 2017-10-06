import TextArea from '@ember/component/text-area';

export default TextArea.extend({
  click() {
    this.get('element').select();
  }
});
