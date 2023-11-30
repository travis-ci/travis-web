import Service from "@ember/service";


export default Service.extend({
  log: null,
  logContent: null,


  setLogContent(logContent) {
   this.set('logContent', logContent);
  },

  setLog(log) {
    this.set('log', log);
  },

  clear() {
    this.set('log', null);
    this.set('logContent', null);
  }
});
