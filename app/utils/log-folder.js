export default (function () {
  function LogFolder(element) {
    this.element = element;
    if (this.element) {
      const handleClick = (event) => {
        let folder = this.getFolderFromLine(event.target);
        this.toggle(folder);
        event.preventDefault();
      };

      this.element.addEventListener('click', handleClick);
    }
  }

  LogFolder.prototype.fold = function (line) {
    let folder;
    folder = this.getFolderFromLine(line);
    if (folder.classList && folder.classList.contains('open')) {
      return this.toggle(folder);
    }
  };

  LogFolder.prototype.unfold = function (line) {
    let folder;
    folder = this.getFolderFromLine(line);
    if (folder.classList && !folder.classList.contains('open')) {
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
