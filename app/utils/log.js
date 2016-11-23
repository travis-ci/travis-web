/* eslint-disable no-console, no-control-regex */

import ansiparse from 'npm:ansiparse';

var Log = function () {
  this.autoCloseFold = true;
  this.listeners = [];
  this.renderer = new Log.Renderer;
  this.children = new Log.Nodes(this);
  this.parts = {};
  this.folds = new Log.Folds(this);
  this.times = new Log.Times(this);
  return this;
};

export default Log;

Log.extend = function (one, other) {
  var name;
  for (name in other) {
    one[name] = other[name];
  }
  return one;
};

Log.extend(Log, {
  DEBUG: false,
  SLICE: 500,
  TIMEOUT: 25,
  FOLD: /fold:(start|end):([\w_\-\.]+)/,
  TIME: /time:(start|end):([\w_\-\.]+):?([\w_\-\.\=\,]*)/,
  create: function (options) {
    var listener, log, _i, _len, _ref;
    options || (options = {});
    log = new Log();
    if (options.limit) {
      log.listeners.push(log.limit = new Log.Limit(options.limit));
    }
    _ref = options.listeners || [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
      log.listeners.push(listener);
    }
    return log;
  }
});

var newLineAtTheEndRegexp, newLineRegexp, rRegexp, removeCarriageReturns;

Log.Node = function (id, num) {
  this.id = id;
  this.num = num;
  this.key = Log.Node.key(this.id);
  this.children = new Log.Nodes(this);
  return this;
};

Log.extend(Log.Node, {
  key: function (id) {
    if (id) {
      return id.split('-').map(function (i) {
        return '000000'.concat(i).slice(-6);
      }).join('');
    }
  }
});

Log.extend(Log.Node.prototype, {
  addChild: function (node) {
    return this.children.add(node);
  },
  remove: function () {
    this.log.remove(this.element);
    return this.parent.children.remove(this);
  }
});

Object.defineProperty(Log.Node.prototype, 'log', {
  get: function () {
    var _ref;
    return this._log || (this._log = ((_ref = this.parent) != null ? _ref.log : void 0) || this.parent);
  }
});

Object.defineProperty(Log.Node.prototype, 'firstChild', {
  get: function () {
    return this.children.first;
  }
});

Object.defineProperty(Log.Node.prototype, 'lastChild', {
  get: function () {
    return this.children.last;
  }
});

Log.Nodes = function (parent) {
  if (parent) {
    this.parent = parent;
  }
  this.items = [];
  this.index = {};
  return this;
};

Log.extend(Log.Nodes.prototype, {
  add: function (item) {
    var ix, next, prev, _ref, _ref1;
    ix = this.position(item) || 0;
    this.items.splice(ix, 0, item);
    if (this.parent) {
      item.parent = this.parent;
    }
    prev = function (item) {
      while (item && !item.children.last) {
        item = item.prev;
      }
      return item != null ? item.children.last : void 0;
    };
    next = function (item) {
      while (item && !item.children.first) {
        item = item.next;
      }
      return item != null ? item.children.first : void 0;
    };
    // eslint-disable-next-line
    if (item.prev = this.items[ix - 1] || prev((_ref = this.parent) != null ? _ref.prev : void 0)) {
      item.prev.next = item;
    }
    // eslint-disable-next-line
    if (item.next = this.items[ix + 1] || next((_ref1 = this.parent) != null ? _ref1.next : void 0)) {
      item.next.prev = item;
    }
    return item;
  },
  remove: function (item) {
    this.items.splice(this.items.indexOf(item), 1);
    if (item.next) {
      item.next.prev = item.prev;
    }
    if (item.prev) {
      item.prev.next = item.next;
    }
    if (this.items.length === 0) {
      return this.parent.remove();
    }
  },
  position: function (item) {
    var ix, _i;
    for (ix = _i = this.items.length - 1; _i >= 0; ix = _i += -1) {
      if (this.items[ix].key < item.key) {
        return ix + 1;
      }
    }
  },
  indexOf: function () {
    return this.items.indexOf.apply(this.items, arguments);
  },
  slice: function () {
    return this.items.slice.apply(this.items, arguments);
  },
  each: function (func) {
    return this.items.slice().forEach(func);
  },
  map: function (func) {
    return this.items.map(func);
  }
});

Object.defineProperty(Log.Nodes.prototype, 'first', {
  get: function () {
    return this.items[0];
  }
});

Object.defineProperty(Log.Nodes.prototype, 'last', {
  get: function () {
    return this.items[this.length - 1];
  }
});

Object.defineProperty(Log.Nodes.prototype, 'length', {
  get: function () {
    return this.items.length;
  }
});

Log.Part = function (id, num, string) {
  Log.Node.apply(this, arguments);
  this.string = string || '';
  this.string = this.string.replace(/\033\[1000D/gm, '\r');
  this.string = this.string.replace(/\r+\n/gm, '\n');
  this.strings = this.string.split(/^/gm) || [];
  this.slices = ((function () {
    var _results;
    _results = [];
    while (this.strings.length > 0) {
      _results.push(this.strings.splice(0, Log.SLICE));
    }
    return _results;
  }).call(this));
  return this;
};

Log.extend(Log.Part, {
  create: function (log, num, string) {
    var part;
    part = new Log.Part(num.toString(), num, string);
    log.addChild(part);
    return part.process(0, -1);
  }
});

Log.Part.prototype = Log.extend(new Log.Node, {
  remove: function () {},
  process: function (slice, num) {
    var node, span, spans, string, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4,
      _this = this;
    _ref = this.slices[slice] || [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      string = _ref[_i];
      if ((_ref1 = this.log.limit) != null ? _ref1.limited : void 0) {
        return;
      }
      spans = [];
      _ref2 = Log.Deansi.apply(string);
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        node = _ref2[_j];
        span = Log.Span.create(this, '' + this.id + '-' + (num += 1), num, node.text, node['class']);
        span.render();
        spans.push(span);
      }
      if ((_ref3 = spans[0]) != null ? (_ref4 = _ref3.line) != null ? _ref4.cr : void 0 : void 0) {
        spans[0].line.clear();
      }
    }
    if (!(slice >= this.slices.length - 1)) {
      return setTimeout((function () {
        return _this.process(slice + 1, num);
      }), Log.TIMEOUT);
    }
  }
});

newLineAtTheEndRegexp = new RegExp('\n$');

newLineRegexp = new RegExp('\n');

rRegexp = new RegExp('\r');

removeCarriageReturns = function (string) {
  var index;
  index = string.lastIndexOf('\r');
  if (index === -1) {
    return string;
  }
  return string.substr(index + 1);
};

var foldNameCount = {};

Log.Span = function (id, num, text, classes) {
  var fold, time, _ref;
  Log.Node.apply(this, arguments);

  fold = text.match(Log.FOLD);
  time = text.match(Log.TIME);

  if (fold) {
    this.fold = true;
    this.event = fold[1];

    var foldName = fold[2];
    this.text = foldName;

    if (!foldNameCount[foldName]) {
      foldNameCount[foldName] = 0;
    }

    var foldCount = foldNameCount[foldName];
    this.name = foldName + '-' + foldCount;
    this.visibleName = this.text;

    if (this.event === 'end') {
      foldNameCount[foldName]++;
    }
  } else if (time) {
    this.time = true;
    this.event = time[1];
    this.name = time[2];
    this.stats = time[3];
  } else {
    this.text = text;
    this.text = removeCarriageReturns(this.text);
    this.text = this.text.replace(newLineAtTheEndRegexp, '');
    this.nl = !!((_ref = text[text.length - 1]) != null ? _ref.match(newLineRegexp) : void 0);
    this.cr = !!text.match(rRegexp);
    this['class'] = this.cr && ['clears'] || classes;
  }
  return this;
};

Log.extend(Log.Span, {
  create: function (parent, id, num, text, classes) {
    var span;
    span = new Log.Span(id, num, text, classes);
    parent.addChild(span);
    return span;
  },
  render: function (parent, id, num, text, classes) {
    var span;
    span = this.create(parent, id, num, text, classes);
    return span.render();
  }
});

Log.Span.prototype = Log.extend(new Log.Node, {
  render: function () {
    var tail;
    if (this.time && this.event === 'end' && this.prev) {
      if (Log.DEBUG) {
        console.log('S.0 insert ' + this.id + ' after prev ' + this.prev.id);
      }
      this.nl = this.prev.nl;
      this.log.insert(this.data, {
        after: this.prev.element
      });
      this.line = this.prev.line;
    } else if (!this.fold && this.prev && !this.prev.fold && !this.prev.nl) {
      if (Log.DEBUG) {
        console.log('S.1 insert ' + this.id + ' after prev ' + this.prev.id);
      }
      this.log.insert(this.data, {
        after: this.prev.element
      });
      this.line = this.prev.line;
    } else if (!this.fold && this.next && !this.next.fold && !this.next.time) {
      if (Log.DEBUG) {
        console.log('S.2 insert ' + this.id + ' before next ' + this.next.id);
      }
      this.log.insert(this.data, {
        before: this.next.element
      });
      this.line = this.next.line;
    } else {
      this.line = Log.Line.create(this.log, [this]);
      this.line.render();
    }
    if (this.nl && (tail = this.tail).length > 0) {
      this.split(tail);
    }
    if (this.time) {
      return this.log.times.add(this);
    }
  },
  remove: function () {
    Log.Node.prototype.remove.apply(this);
    if (this.line) {
      return this.line.remove(this);
    }
  },
  split: function (spans) {
    var line, span, _i, _len;
    if (Log.DEBUG) {
      console.log('S.4 split [' + (spans.map(function (span) {
        return span.id;
      }).join(', ')) + ']');
    }
    for (_i = 0, _len = spans.length; _i < _len; _i++) {
      span = spans[_i];
      this.log.remove(span.element);
    }
    line = Log.Line.create(this.log, spans);
    line.render();
    if (line.cr) {
      return line.clear();
    }
  },
  clear: function () {
    if (this.prev && this.isSibling(this.prev) && this.isSequence(this.prev)) {
      this.prev.clear();
      return this.prev.remove();
    }
  },
  isSequence: function (other) {
    return this.parent.num - other.parent.num === this.log.children.indexOf(this.parent) - this.log.children.indexOf(other.parent);
  },
  isSibling: function (other) {
    var _ref, _ref1;
    return ((_ref = this.element) != null ? _ref.parentNode : void 0) === ((_ref1 = other.element) != null ? _ref1.parentNode : void 0);
  },
  siblings: function (type) {
    var siblings, span;
    siblings = [];
    while ((span = (span || this)[type]) && this.isSibling(span)) {
      siblings.push(span);
    }
    return siblings;
  }
});

Object.defineProperty(Log.Span.prototype, 'data', {
  get: function () {
    return {
      id: this.id,
      type: 'span',
      text: this.text,
      'class': this['class'],
      time: this.time
    };
  }
});

Object.defineProperty(Log.Span.prototype, 'line', {
  get: function () {
    return this._line;
  },
  set: function (line) {
    if (this.line) {
      this.line.remove(this);
    }
    this._line = line;
    if (this.line) {
      return this.line.add(this);
    }
  }
});

Object.defineProperty(Log.Span.prototype, 'element', {
  get: function () {
    return document.getElementById(this.id);
  }
});

Object.defineProperty(Log.Span.prototype, 'head', {
  get: function () {
    return this.siblings('prev').reverse();
  }
});

Object.defineProperty(Log.Span.prototype, 'tail', {
  get: function () {
    return this.siblings('next');
  }
});

Log.Line = function (log) {
  this.log = log;
  this.spans = [];
  return this;
};

Log.extend(Log.Line, {
  create: function (log, spans) {
    var line, span, _i, _len;
    if ((span = spans[0]) && span.fold) {
      line = new Log.Fold(log, span.event, span.name, span.visibleName);
    } else {
      line = new Log.Line(log);
    }
    for (_i = 0, _len = spans.length; _i < _len; _i++) {
      span = spans[_i];
      span.line = line;
    }
    return line;
  }
});

Log.extend(Log.Line.prototype, {
  add: function (span) {
    var ix;
    if (span.cr) {
      this.cr = true;
    }
    if (this.spans.indexOf(span) > -1) {
      // noop
    } else if ((ix = this.spans.indexOf(span.prev)) > -1) {
      return this.spans.splice(ix + 1, 0, span);
    } else if ((ix = this.spans.indexOf(span.next)) > -1) {
      return this.spans.splice(ix, 0, span);
    } else {
      return this.spans.push(span);
    }
  },
  remove: function (span) {
    var ix;
    if ((ix = this.spans.indexOf(span)) > -1) {
      return this.spans.splice(ix, 1);
    }
  },
  render: function () {
    var fold;
    if ((fold = this.prev) && fold.event === 'start' && fold.active) {
      if (this.next && !this.next.fold) {
        if (Log.DEBUG) {
          console.log('L.0 insert ' + this.id + ' before next ' + this.next.id);
        }
        return this.element = this.log.insert(this.data, {
          before: this.next.element
        });
      } else {
        if (Log.DEBUG) {
          console.log('L.0 insert ' + this.id + ' into fold ' + fold.id);
        }
        fold = this.log.folds.folds[fold.name].fold;
        return this.element = this.log.insert(this.data, {
          into: fold
        });
      }
    } else if (this.prev) {
      if (Log.DEBUG) {
        console.log('L.1 insert ' + this.spans[0].id + ' after prev ' + this.prev.id);
      }
      return this.element = this.log.insert(this.data, {
        after: this.prev.element
      });
    } else if (this.next) {
      if (Log.DEBUG) {
        console.log('L.2 insert ' + this.spans[0].id + ' before next ' + this.next.id);
      }
      return this.element = this.log.insert(this.data, {
        before: this.next.element
      });
    } else {
      if (Log.DEBUG) {
        console.log('L.3 insert ' + this.spans[0].id + ' into #log');
      }
      return this.element = this.log.insert(this.data);
    }
  },
  clear: function () {
    var cr, _i, _len, _ref, _results;
    _ref = this.crs;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cr = _ref[_i];
      _results.push(cr.clear());
    }
    return _results;
  }
});

Object.defineProperty(Log.Line.prototype, 'id', {
  get: function () {
    var _ref;
    return (_ref = this.spans[0]) != null ? _ref.id : void 0;
  }
});

Object.defineProperty(Log.Line.prototype, 'data', {
  get: function () {
    return {
      type: 'paragraph',
      nodes: this.nodes
    };
  }
});

Object.defineProperty(Log.Line.prototype, 'nodes', {
  get: function () {
    return this.spans.map(function (span) {
      return span.data;
    });
  }
});

Object.defineProperty(Log.Line.prototype, 'prev', {
  get: function () {
    var _ref;
    return (_ref = this.spans[0].prev) != null ? _ref.line : void 0;
  }
});

Object.defineProperty(Log.Line.prototype, 'next', {
  get: function () {
    var _ref;
    return (_ref = this.spans[this.spans.length - 1].next) != null ? _ref.line : void 0;
  }
});

Object.defineProperty(Log.Line.prototype, 'crs', {
  get: function () {
    return this.spans.filter(function (span) {
      return span.cr;
    });
  }
});

Log.Fold = function (log, event, name, visibleName) {
  Log.Line.apply(this, arguments);
  this.fold = true;
  this.event = event;
  this.name = name;
  this.visibleName = visibleName;
  return this;
};

Log.Fold.prototype = Log.extend(new Log.Line, {
  render: function () {
    var element, _ref;
    if (this.prev && this.prev.element) {
      if (Log.DEBUG) {
        console.log('F.1 insert ' + this.id + ' after prev ' + this.prev.id);
      }
      element = this.prev.element;
      this.element = this.log.insert(this.data, {
        after: element
      });
    } else if (this.next) {
      if (Log.DEBUG) {
        console.log('F.2 insert ' + this.id + ' before next ' + this.next.id);
      }
      element = this.next.element || this.next.element.parentNode;
      this.element = this.log.insert(this.data, {
        before: element
      });
    } else {
      if (Log.DEBUG) {
        console.log('F.3 insert ' + this.id);
      }
      this.element = this.log.insert(this.data);
    }
    if (this.span.next && ((_ref = this.span.prev) != null ? _ref.isSibling(this.span.next) : void 0)) {
      this.span.prev.split([this.span.next].concat(this.span.next.tail));
    }
    return this.active = this.log.folds.add(this.data);
  }
});

Object.defineProperty(Log.Fold.prototype, 'id', {
  get: function () {
    return 'fold-' + this.event + '-' + this.name;
  }
});

Object.defineProperty(Log.Fold.prototype, 'span', {
  get: function () {
    return this.spans[0];
  }
});

Object.defineProperty(Log.Fold.prototype, 'data', {
  get: function () {
    return {
      type: 'fold',
      id: this.id,
      event: this.event,
      name: this.name,
      visibleName: this.visibleName
    };
  }
});

Log.prototype = Log.extend(new Log.Node, {
  set: function (num, string) {
    if (this.parts[num]) {
      return console.log('part ' + num + ' exists');
    } else {
      this.parts[num] = true;
      return Log.Part.create(this, num, string);
    }
  },
  insert: function (data, pos) {
    this.trigger('insert', data, pos);
    return this.renderer.insert(data, pos);
  },
  remove: function (node) {
    this.trigger('remove', node);
    return this.renderer.remove(node);
  },
  hide: function (node) {
    this.trigger('hide', node);
    return this.renderer.hide(node);
  },
  trigger: function () {
    var args, ix, listener, _i, _len, _ref, _results;
    args = [this].concat(Array.prototype.slice.apply(arguments));
    _ref = this.listeners;
    _results = [];
    for (ix = _i = 0, _len = _ref.length; _i < _len; ix = ++_i) {
      listener = _ref[ix];
      _results.push(listener.notify.apply(listener, args));
    }
    return _results;
  }
});

Log.Listener = function () {};

Log.extend(Log.Listener.prototype, {
  notify: function (log, event) {
    if (this[event]) {
      return this[event].apply(this, [log].concat(Array.prototype.slice.call(arguments, 2)));
    }
  }
});

Log.Folds = function (log) {
  this.log = log;
  this.folds = {};
  return this;
};

Log.extend(Log.Folds.prototype, {
  add: function (data) {
    var fold, _base, _name;
    fold = (_base = this.folds)[_name = data.name] || (_base[_name] = new Log.Folds.Fold);
    fold.receive(data, {
      autoCloseFold: this.log.autoCloseFold
    });
    return fold.active;
  }
});

Log.Folds.Fold = function () {
  return this;
};

Log.extend(Log.Folds.Fold.prototype, {
  receive: function (data, options) {
    this[data.event] = data.id;
    if (this.start && this.end && !this.active) {
      return this.activate(options);
    }
  },
  activate: function (options) {
    var fragment, nextSibling, node, parentNode, toRemove, _i, _len, _ref;
    options || (options = {});
    if (Log.DEBUG) {
      console.log('F.n - activate ' + this.start);
    }
    if (!this.fold) { return; }
    toRemove = this.fold.parentNode;
    parentNode = toRemove.parentNode;
    nextSibling = toRemove.nextSibling;
    parentNode.removeChild(toRemove);
    fragment = document.createDocumentFragment();
    _ref = this.nodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      fragment.appendChild(node);
    }
    this.fold.appendChild(fragment);
    parentNode.insertBefore(toRemove, nextSibling);
    this.fold.setAttribute('class', this.classes(options['autoCloseFold']));
    return this.active = true;
  },
  classes: function (autoCloseFold) {
    var classes;
    classes = this.fold.getAttribute('class').split(' ');
    classes.push('fold');
    if (!autoCloseFold) {
      classes.push('open');
    }
    if (this.fold.childNodes.length > 2) {
      classes.push('active');
    }
    return classes.join(' ');
  }
});

Object.defineProperty(Log.Folds.Fold.prototype, 'fold', {
  get: function () {
    return this._fold || (this._fold = document.getElementById(this.start));
  }
});

Object.defineProperty(Log.Folds.Fold.prototype, 'nodes', {
  get: function () {
    var node, nodes;
    node = this.fold;
    nodes = [];
    while ((node = node.nextSibling) && node.id !== this.end) {
      nodes.push(node);
    }
    return nodes;
  }
});

Log.Times = function (log) {
  this.log = log;
  this.times = {};
  return this;
};

Log.extend(Log.Times.prototype, {
  add: function (node) {
    var time, _base, _name;
    time = (_base = this.times)[_name = node.name] || (_base[_name] = new Log.Times.Time);
    return time.receive(node);
  },
  duration: function (name) {
    if (this.times[name]) {
      return this.times[name].duration;
    }
  }
});

Log.Times.Time = function () {
  return this;
};

Log.extend(Log.Times.Time.prototype, {
  receive: function (node) {
    this[node.event] = node;
    if (Log.DEBUG) {
      console.log('T.0 - ' + node.event + ' ' + node.name);
    }
    if (this.start && this.end) {
      return this.finish();
    }
  },
  finish: function () {
    var element;
    if (Log.DEBUG) {
      console.log('T.1 - finish ' + this.start.name);
    }
    element = document.getElementById(this.start.id);
    if (element) {
      return this.update(element);
    }
  },
  update: function (element) {
    element.setAttribute('class', 'duration');
    element.setAttribute('title', 'This command finished after ' + this.duration + ' seconds.');
    return element.lastChild.nodeValue = '' + this.duration + 's';
  }
});

Object.defineProperty(Log.Times.Time.prototype, 'duration', {
  get: function () {
    var duration;
    duration = this.stats.duration / 1000 / 1000 / 1000;
    return duration.toFixed(2);
  }
});

Object.defineProperty(Log.Times.Time.prototype, 'stats', {
  get: function () {
    var stat, stats, _i, _len, _ref;
    if (!(this.end && this.end.stats)) {
      return {};
    }
    stats = {};
    _ref = this.end.stats.split(',');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      stat = _ref[_i];
      stat = stat.split('=');
      stats[stat[0]] = stat[1];
    }
    return stats;
  }
});

Log.Deansi = {
  CLEAR_ANSI: /(?:\033)(?:\[0?c|\[[0356]n|\[7[lh]|\[\?25[lh]|\(B|H|\[(?:\d+(;\d+){,2})?G|\[(?:[12])?[JK]|[DM]|\[0K)/gm,
  apply: function (string) {
    var nodes,
      _this = this;
    if (!string) {
      return [];
    }
    string = string.replace(this.CLEAR_ANSI, '');
    nodes = ansiparse(string).map(function (part) {
      return _this.node(part);
    });
    return nodes;
  },
  node: function (part) {
    var classes, node;
    node = {
      type: 'span',
      text: part.text
    };

    classes = this.classes(part);

    if (classes) {
      node['class'] = classes.join(' ');
    }
    return node;
  },
  classes: function (part) {
    var result;
    result = [];
    result = result.concat(this.colors(part));
    if (result.length > 0) {
      return result;
    }
  },
  colors: function (part) {
    var colors;
    colors = [];
    if (part.foreground) {
      colors.push(part.foreground);
    }
    if (part.background) {
      colors.push('bg-' + part.background);
    }
    if (part.bold) {
      colors.push('bold');
    }
    if (part.italic) {
      colors.push('italic');
    }
    if (part.underline) {
      colors.push('underline');
    }
    return colors;
  },
  hidden: function (part) {
    if (part.text.match(/\r/)) {
      part.text = part.text.replace(/^.*\r/gm, '');
      return true;
    }
  }
};

Log.Limit = function (maxLines) {
  this.maxLines = maxLines || 1000;
  return this;
};

Log.Limit.prototype = Log.extend(new Log.Listener, {
  count: 0,
  insert: function (log, node) {
    if (node.type === 'paragraph' && !node.hidden) {
      return this.count += 1;
    }
  }
});

Object.defineProperty(Log.Limit.prototype, 'limited', {
  get: function () {
    return this.count >= this.maxLines;
  }
});

Log.Renderer = function () {
  this.frag = document.createDocumentFragment();
  this.para = this.createParagraph();
  this.span = this.createSpan();
  this.text = document.createTextNode('');
  this.fold = this.createFold();
  return this;
};

Log.extend(Log.Renderer.prototype, {
  insert: function (data, pos) {
    var after, before, into, node;
    node = this.render(data);
    // eslint-disable-next-line
    if (into = pos != null ? pos.into : void 0) {
      if (typeof into === 'string') {
        into = document.getElementById(pos != null ? pos.into : void 0);
      }
      if (pos != null ? pos.prepend : void 0) {
        this.prependTo(node, into);
      } else {
        this.appendTo(node, into);
      }
    // eslint-disable-next-line
    } else if (after = pos != null ? pos.after : void 0) {
      if (typeof after === 'string') {
        after = document.getElementById(pos);
      }
      this.insertAfter(node, after);
    // eslint-disable-next-line
    } else if (before = pos != null ? pos.before : void 0) {
      if (typeof before === 'string') {
        before = document.getElementById(pos != null ? pos.before : void 0);
      }
      this.insertBefore(node, before);
    } else {
      this.insertBefore(node);
    }
    return node;
  },
  hide: function (node) {
    node.setAttribute('class', this.addClass(node.getAttribute('class'), 'hidden'));
    return node;
  },
  remove: function (node) {
    if (node) {
      node.parentNode.removeChild(node);
    }
    return node;
  },
  render: function (data) {
    var frag, node, type, _i, _len;
    if (data instanceof Array) {
      frag = this.frag.cloneNode(true);
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        node = data[_i];
        node = this.render(node);
        if (node) {
          frag.appendChild(node);
        }
      }
      return frag;
    } else {
      data.type || (data.type = 'paragraph');
      type = data.type[0].toUpperCase() + data.type.slice(1);
      return this['render' + type](data);
    }
  },
  renderParagraph: function (data) {
    var node, para, type, _i, _len, _ref;
    para = this.para.cloneNode(true);
    if (data.id) {
      para.setAttribute('id', data.id);
    }
    if (data.hidden) {
      para.setAttribute('style', 'display: none;');
    }
    _ref = data.nodes || [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      type = node.type[0].toUpperCase() + node.type.slice(1);
      node = this['render' + type](node);
      para.appendChild(node);
    }
    return para;
  },
  renderFold: function (data) {
    var fold;
    fold = this.fold.cloneNode(true);
    fold.setAttribute('id', data.id || ('fold-' + data.event + '-' + data.name));
    fold.setAttribute('class', 'fold-' + data.event);
    if (data.event === 'start') {
      fold.lastChild.lastChild.nodeValue = data.visibleName;
    } else {
      fold.removeChild(fold.lastChild);
    }
    return fold;
  },
  renderSpan: function (data) {
    var span;
    span = this.span.cloneNode(true);
    if (data.id) {
      span.setAttribute('id', data.id);
    }
    if (data['class']) {
      span.setAttribute('class', data['class']);
    }
    span.lastChild.nodeValue = data.text || '';
    return span;
  },
  renderText: function (data) {
    var text;
    text = this.text.cloneNode(true);
    text.nodeValue = data.text;
    return text;
  },
  createParagraph: function () {
    var para;
    para = document.createElement('p');
    para.appendChild(document.createElement('a'));
    return para;
  },
  createFold: function () {
    var fold;
    fold = document.createElement('div');
    fold.appendChild(this.createSpan());
    fold.lastChild.setAttribute('class', 'fold-name');
    return fold;
  },
  createSpan: function () {
    var span;
    span = document.createElement('span');
    span.appendChild(document.createTextNode(' '));
    return span;
  },
  insertBefore: function (node, other) {
    var log;
    if (other) {
      return other.parentNode.insertBefore(node, other);
    } else {
      log = document.getElementById('log');
      if (log) {
        return log.insertBefore(node, log.firstChild);
      }
    }
  },
  insertAfter: function (node, other) {
    if (other && other.nextSibling) {
      return this.insertBefore(node, other.nextSibling);
    } else {
      return this.appendTo(node, other.parentNode);
    }
  },
  prependTo: function (node, other) {
    if (other && other.firstChild) {
      return other.insertBefore(node, other.firstChild);
    } else {
      return other.appendTo(node, other);
    }
  },
  appendTo: function (node, other) {
    if (other) {
      return other.appendChild(node);
    }
  },
  addClass: function (classes, string) {
    if (classes != null ? classes.indexOf(string) : void 0) {
      return;
    }
    if (classes) {
      return '' + classes + ' ' + string;
    } else {
      return string;
    }
  }
});
