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
    const folder = this.getFolderFromLine(line);
    if (folder && folder.classList && folder.classList.contains('open')) {
      return this.toggle(folder);
    }
  };

  LogFolder.prototype.unfold = function (line) {
    const folder = this.getFolderFromLine(line);
    if (folder && folder.classList && !folder.classList.contains('open')) {
      return this.toggle(folder);
    }
  };

  LogFolder.prototype.toggle = function (folder) {
    return folder && folder.classList && folder.classList.toggle('open');
  };

  LogFolder.prototype.getFolderFromLine = function (line) {
    let firstFoldLine, currentElem = line, parentElem = line.parentNode;

    while (parentElem) {
      if (!parentElem.classList || parentElem.classList.contains('log-body-content')) {
        break;
      }

      if (parentElem.classList.contains('fold')) {
        const { children } = parentElem;
        if (children.length >= 2 && children[1] === currentElem) {
          firstFoldLine = parentElem;
        }
        break;
      }

      currentElem = currentElem.parentNode;
      parentElem = parentElem.parentNode;
    }

    return firstFoldLine;
  };

  return LogFolder;
}());
