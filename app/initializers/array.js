export function initialize() {
  if (!Array.prototype.removeObject) {
    Array.prototype.removeObject = function(item) {
      const index = this.indexOf(item);
      if (index !== -1) {
        this.splice(index, 1);
      }
    };
  }
}

export default {
  initialize
};
