export default (function () {
  function LogFolder(element) {
    this.element = element;
    if (this.element) {
      const _this = this;
      const handleClick = (event) => {
        let folder = _this.getFolderFromLine(event.target);
        _this.toggle(folder);
        event.preventDefault();
        return false;
      };
      const replaceEventListener = (el) => {
        el.removeEventListener('click', handleClick);
        el.addEventListener('click', handleClick);
      };
      replaceEventListener(this.element);
    }
  }

  LogFolder.prototype.fold = function (line) {
    let folder;
    folder = this.getFolderFromLine(line);
    if (folder.classList.contains('open')) {
      return this.toggle(folder);
    }
  };

  LogFolder.prototype.unfold = function (line) {
    let folder;
    folder = this.getFolderFromLine(line);
    if (!folder.classList.contains('open')) {
      return this.toggle(folder);
    }
  };

  LogFolder.prototype.toggle = function (folder) {
    return folder.classList && folder.classList.toggle('open');
  };

  LogFolder.prototype.getFolderFromLine = function (line) {
    let currentLine = line;
    while (currentLine.parentNode) {
      currentLine = currentLine.parentNode;
      if (currentLine.classList && currentLine.classList.contains('fold')) {
        break;
      }
    }
    return currentLine;
  };

  return LogFolder;
}());
