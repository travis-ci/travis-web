
export default function (elem, text, event = 'keyup') {
  var e = $.Event(event);
  e.which = 50;
  elem.val(text);
  elem.trigger(e);
}
