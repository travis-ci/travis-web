// Copyright (c) 2010-2012 Slash7 LLC http://charmhq.com/
// Copyright (c) 2010-2012 Thomas Fuchs http://mir.aculo.us/
// License: https://github.com/cheerful/charmeur/blob/master/MIT-LICENSE

window.bootstrapCharm = function(){
  var tab, box, email, shown = false, sending = false, openmsg = null, callbacks = {},
    BOX =
      '<div class="feedback-popup">' +
      '<h1>Have feedback or questions?</h1>' +
      '<iframe id="CHARM_FORM_TARGET" name="CHARM_FORM_TARGET" src="javascript:void(0)" onload="__CHARM&&__CHARM.iFrameLoaded&&__CHARM.iFrameLoaded()" onerror="__CHARM&&__CHARM.iFrameError&&__CHARM.iFrameError()"></iframe>' +
      '<form id="CHARM_FORM" target="CHARM_FORM_TARGET" method="POST" accept-charset="utf-8">'+
      '<div id="CHARM_YOUR_EMAIL"></div>'+
      '<div id="CHARM_YOUR_COMMENT"></div>'+
      '<textarea id="CHARM_COMMENT" name="content" class="ignore-return-pressed" placeholder="Let us know and we will get right back to you by email"></textarea>' +
      '<input id="CHARM_SUBMIT" type="submit" class="submit" value="Send Feedback">' +
      '<a href="#" title="" id="CHARM_CANCEL">cancel</a>' +
      '</form>' +
      '</div>',
    DEFAULTS = {
      text: '',
      submit: 'Send feedback',
      cancel: 'cancel',
      your_email: 'Your email address:',
      your_comment: 'Your message:',
      feedback_sending: 'Sending...',
      feedback_sent: 'Your feedback was sent!<br/>We will get back to you as soon as possible!',
      feedback_error: 'There was a problem sending your message.<br/>Please contact support directly.<br/><br/>close this message'
    };

  function log(s){
    'console' in window && 'log' in console && console.log(s);
  }

  if(!("__CHARM" in window)) {
    log('no CHARM data found');
    return;
  }

  if(!(typeof __CHARM == 'object')) {
    log('CHARM must be an object');
    return;
  }
  
  function $(id){ return typeof id == 'string' ? document.getElementById(id) : id; }

  function init(){
    tab = document.createElement('a');
    tab.id = "CHARM_TAB";
    tab.className = 'feedback-button';
    tab.innerHTML = 'Feedback & Support';
    tab.href = "https://secure.charmhq.com/feedback/" + __CHARM.key;
    tab.onclick = function(){ show(); return false };
    document.body.appendChild(tab);
  }

  function template(string){
    for(var prop in __CHARM)
      string = string.replace(new RegExp('{'+prop+'}'), __CHARM[prop]);
    return string;
  }

  function customize(id, property){
    $('CHARM_'+id.toUpperCase())[property||'innerHTML'] = template((id in __CHARM) ? __CHARM[id] : DEFAULTS[id]);
  }

  function userdata(name){
    if(name in __CHARM) data(name, __CHARM[name]);
  }

  function data(name, value){
    var node = document.createElement('input');
    node.type = 'hidden';
    node.value = value;
    node.name = name;
    $('CHARM_FORM').appendChild(node);
  }
  
  __CHARM.iFrameLoaded = function(){ 
    if(!sending) return; sending = false; success();
  };
  
  __CHARM.iFrameError = function(){ 
    if(!sending) return; sending = false; error();
  };
  
  function show(options){
    if(shown) return;
    hideTab();
    shown = true;
    
    callbacks = options || {};
    
    before();
    
    if(!box) {
      box = document.createElement('div');
      box.id = "CHARM_BOX";
      box.className = 'feedback-popup';
      box.innerHTML = BOX;
      document.body.appendChild(box);
      
      if(!('email' in __CHARM) || !(/@/.test(__CHARM.email+''))){
        email = document.createElement('input');
        email.id   = 'CHARM_EMAIL';
        email.type = 'text';
        email.name = 'email';
        email.value = '';
        customize('your_email');
        customize('your_comment');
        $('CHARM_YOUR_EMAIL').appendChild(email);
        box.className = 'feedback-popup closed' + ($('CHARM_YOUR_EMAIL') ? ' with-email' : '');
      } else {
        $('CHARM_YOUR_EMAIL').parentNode.removeChild($('CHARM_YOUR_EMAIL'));
        $('CHARM_YOUR_COMMENT').parentNode.removeChild($('CHARM_YOUR_COMMENT'));
        userdata('email');
      }

      // customize('text');
      // customize('submit', 'value');
      // customize('cancel');
      
      userdata('key');
      userdata('customer');
      userdata('customer_info');
      userdata('first_name');
      userdata('last_name');
      userdata('user_info');
      userdata('customer_id');
      userdata('subject');

      data('location', location.href);
      data('user_agent', navigator.userAgent);
      data('local_time', (new Date).toString());

      $('CHARM_FORM').action = __CHARM['url'];

      setTimeout(function(){
        var scrollTop = document.body.scrollTop;
        
        box.className = 'feedback-popup open' + ($('CHARM_YOUR_EMAIL') ? ' with-email' : '');
        $('CHARM_FORM').onsubmit = function(){ 
          var ok = !($('CHARM_COMMENT').value.replace(/^\s+/, '').replace(/\s+$/, '') == "");
          if(ok){
            sending = true; 
            hide(); 
            message('feedback_sending', false);
          }
          return ok;
        };
        $('CHARM_CANCEL').onclick = function(){ cancel(); return false };
        
        setTimeout(function(){
          if($('CHARM_EMAIL'))
            $('CHARM_EMAIL').focus();
          else
            $('CHARM_COMMENT').focus();
          document.body.scrollTop = scrollTop;
        }, 10);
      }, 10);

      return;
    }
    box.offsetLeft;
    box.className = 'feedback-popup open' + ($('CHARM_YOUR_EMAIL') ? ' with-email' : '');
    if($('CHARM_EMAIL'))
      $('CHARM_EMAIL').focus();
    else
      $('CHARM_COMMENT').focus();
  }
  
  __CHARM.show = show;
  
  function cancel(){
    hide();
    showTab();
    after();
  }
  
  function success(){
    showTab();
    message('feedback_sent');
    if(__CHARM.success) __CHARM.success();
    if(callbacks.success) callbacks.success();
    after();
    $('CHARM_COMMENT').value = "";
    callbacks = {};
  }
  
  function error(){
    show();
    message('feedback_error', false);
    if(__CHARM.error) __CHARM.error();
    if(callbacks.error) callbacks.error();
    after();
    callbacks = {};
  }

  function message(id, autoclose){
    if(openmsg) closeMessage(openmsg);
    var msg = document.createElement('div');
    msg.id = "CHARM_MESSAGE";
    msg.innerHTML = template((id in __CHARM) ? __CHARM[id] : DEFAULTS[id]);
    document.body.appendChild(msg);
    msg.className = 'open';
    msg.onclick = function(){ closeMessage(msg); };
    if(autoclose === undefined || !autoclose === false)
      setTimeout(function(){ closeMessage(msg); }, 4000);
    openmsg = msg;
  }

  function closeMessage(msg){
    msg.className = 'closed';
    setTimeout(function(){
      if(msg && msg.parentNode) msg.parentNode.removeChild(msg);
    }, 260);
    openmsg = null;
  }
  
  function hide(){
    if(!shown) return;
    shown = false;
    box.className = 'closed' + ($('CHARM_YOUR_EMAIL') ? ' with-email' : '');
  }

  function hideTab(){
    tab.classList.add('hidden');
  }

  function showTab(){
    tab.classList.remove('hidden');
  }
  
  function after(){
    if(__CHARM.after) __CHARM.after();
    if(callbacks.after) callbacks.after();
    callbacks = {};
  }
  
  function before(){
    if(__CHARM.before) __CHARM.before();
    if(callbacks.before) callbacks.before();
  }
  
  init();
};
