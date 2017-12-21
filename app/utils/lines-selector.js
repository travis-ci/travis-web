import $ from 'jquery';
import { scheduleOnce, later } from '@ember/runloop';

export default (function () {
  LinesSelector.prototype.Location = {
    getHash: function () {
      return window.location.hash;
    },
    setHash: function (hash) {
      let path;
      path = `${window.location.pathname}${hash}`;
      return window.history.pushState({
        path: path
      }, null, path);
    }
  };

  LinesSelector.prototype.element = null;

  LinesSelector.prototype.scroll = null;

  LinesSelector.prototype.location = null;

  LinesSelector.prototype.view = null;

  LinesSelector.prototype.last_selected_line = null;

  function LinesSelector(element1, scroll, folder, location, onLogLineClick) {
    this.element = element1;
    this.scroll = scroll;
    this.folder = folder;
    this.location = location || this.Location;
    scheduleOnce('afterRender', this, function () {
      let ref;
      this.last_selected_line = (ref = this.getSelectedLines()) != null ? ref.first : void 0;
      return this.highlightLines();
    });
    this.element.on('click', 'a', (event) => {
      let callback = () => {
        let element = $(event.target).parent('.log-line');
        this.loadLineNumbers(element, event.shiftKey);
      };

      if (onLogLineClick) {
        onLogLineClick().then(callback);
      } else {
        callback();
      }
      event.preventDefault();
      return false;
    });
  }

  LinesSelector.prototype.willDestroy = function () {
    return this.destroyed = true;
  };

  LinesSelector.prototype.loadLineNumbers = function (element, multiple) {
    this.setHashValueWithLine(element, multiple);
    return this.highlightLines();
  };

  LinesSelector.prototype.highlightLines = function (tries) {
    tries = tries || 0;
    this.removeAllHighlights();
    let lines = this.getSelectedLines();
    if (lines) {
      let elements = this.element.find('.log-line:visible').slice(lines.first - 1, lines.last);
      if (elements.length) {
        elements.addClass('highlight');
      } else if (tries < 4) {
        later(this, (function () {
          if (!this.destroyed) {
            return this.highlightLines(tries + 1);
          }
        }), 500);
        return;
      }
    }
    this.scroll.tryScroll();
    return this.unfoldLines();
  };

  LinesSelector.prototype.unfoldLines = function () {
    let index, l, line, results;
    let lines = this.getSelectedLines();
    if (lines) {
      results = [];
      for (index in lines) {
        l = lines[index];
        line = this.element.find('.log-line:visible').slice(l - 1, l);
        results.push(this.folder.unfold(line));
      }
      return results;
    }
  };

  LinesSelector.prototype.setHashValueWithLine = function (line, multiple) {
    let hash, lineNumber, lines;
    lineNumber = this.getLineNumberFromElement(line);
    if (multiple && (this.last_selected_line != null)) {
      lines = [lineNumber, this.last_selected_line].sort((a, b) => a - b);
      hash = `#L${lines[0]}-L${lines[1]}`;
    } else {
      hash = `#L${lineNumber}`;
    }
    this.last_selected_line = lineNumber;
    return this.location.setHash(hash);
  };

  LinesSelector.prototype.getLineNumberFromElement = function (element) {
    if (this && this.element) {
      return this.element.find('.log-line:visible').index(element) + 1;
    }
  };

  LinesSelector.prototype.removeAllHighlights = function () {
    if (this && this.element) {
      return this.element.find('.log-line.highlight').removeClass('highlight');
    }
  };

  LinesSelector.prototype.getSelectedLines = function () {
    let match = this.location.getHash().match(/#L(\d+)(-L(\d+))?$/);
    if (match) {
      let first = match[1];
      let last = match[3] || match[1];
      return {
        first: first,
        last: last
      };
    }
  };

  return LinesSelector;
})();
