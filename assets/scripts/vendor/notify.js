var notify = {
  list: [],
  id: 0,
  log: function(msg) {
    console.log(msg)
  },
  compatible: function() {
    if (typeof Notification === 'undefined') {
      notify.log("Notifications are not available for your browser.");
      return false;
    }
    return true;
  },
  authorize: function() {
    if (notify.compatible()) {
      Notification.requestPermission(function(permission) {
        notify.log("Permission to display: "+permission);
      });
    }
  },
  showDelayed: function(seconds) {
    notify.log("A notification will be triggered in "+seconds+" seconds. Try minimising the browser now.");
    setTimeout(notify.show, (seconds*1000));
  },
  show: function(title, body, tag, icon) {

    if (typeof Notification === 'undefined') { notify.log("Notifications are not available for your browser."); return; }
    if (notify.compatible()) {
      notify.id++;
      var id = notify.id;
      notify.list[id] = new Notification(title, {
        body: body,
        tag: tag,
        icon: icon,
        lang: "",
        dir: "auto",
      });
      notify.log("Notification #"+id+" queued for display");
      notify.list[id].onclick = function() { notify.logEvent(id, "clicked"); };
      notify.list[id].onshow  = function() { 
        notify.logEvent(id, "showed");
        setTimeout(function() { notify.list[id].close() }, 5000);
      };
      notify.list[id].onerror = function() { notify.logEvent(id, "errored"); };
      notify.list[id].onclose = function() { notify.logEvent(id, "closed");  };

      console.log("Created a new notification ...");
      console.log(notify.list[id]);
    }
  },
  logEvent: function(id, event) {
    notify.log("Notification #"+id+" "+event);
  }
};
