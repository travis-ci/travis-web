import Ember from 'ember';

export default (function () {
  function LogFolder(element) {
    this.element = element;
    let handlerSelector = '.fold';
    if (this.element) {
      this.element
        .off('click', handlerSelector) // remove any previous click handlers
        .on('click', handlerSelector, (function (_this) {
          return function (event) {
            let folder = _this.getFolderFromLine(Ember.$(event.target));
            _this.toggle(folder);
            event.preventDefault();
            return false;
          };
        })(this));
    }
  }

  LogFolder.prototype.fold = function (line) {
    var folder;
    folder = this.getFolderFromLine(line);
    if (folder.hasClass('open')) {
      return this.toggle(folder);
    }
  };

  LogFolder.prototype.unfold = function (line) {
    var folder;
    folder = this.getFolderFromLine(line);
    if (!folder.hasClass('open')) {
      return this.toggle(folder);
    }
  };

  LogFolder.prototype.toggle = function (folder) {
    return folder.toggleClass('open');
  };

  LogFolder.prototype.getFolderFromLine = function (line) {
    return line.parent('.fold');
  };

  return LogFolder;
})();
