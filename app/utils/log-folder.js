export default (function() {
  function LogFolder(element) {
    this.element = element;
    this.element.on('click', '.fold', (function(_this) {
      return function(event) {
        var folder;
        folder = _this.getFolderFromLine($(event.target));
        _this.toggle(folder);
        event.preventDefault();
        return false;
      };
    })(this));
  }

  LogFolder.prototype.fold = function(line) {
    var folder;
    folder = this.getFolderFromLine(line);
    if (folder.hasClass('open')) {
      return this.toggle(folder);
    }
  };

  LogFolder.prototype.unfold = function(line) {
    var folder;
    folder = this.getFolderFromLine(line);
    if (!folder.hasClass('open')) {
      return this.toggle(folder);
    }
  };

  LogFolder.prototype.toggle = function(folder) {
    return folder.toggleClass('open');
  };

  LogFolder.prototype.getFolderFromLine = function(line) {
    return line.parent('.fold');
  };

  return LogFolder;

})();
