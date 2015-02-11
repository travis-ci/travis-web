// Copyright (c) 2010-2012 Slash7 LLC http://charmhq.com/
// Copyright (c) 2010-2012 Thomas Fuchs http://mir.aculo.us/
// License: https://github.com/cheerful/charmeur/blob/master/MIT-LICENSE
(function(){
  var tab, box, email, shown = false, sending = false, openmsg = null, callbacks = {},
    VENDORS = ['webkit','moz','o','ms'],
    STYLE =
      '.feedback-button {' +
      '  display: inline-block;' +
      '  position: fixed;' +
      '  right: 0;' +
      '  left: auto;' +
      '  top: 35%;' +
      '  margin: 0;' +
      '  padding: 1.5em 1em .5em;' +
      '  border-radius: 4px;' +
      '  transform: rotate(90deg) translateY(-140%);' +
      '  will-change: transform;' +
      '  transition: transform ease 200ms;' +
      '  background: #ffffff;' +
      '  font-size: 13px;' +
      '  color: #a2afb3;' +
      '  text-transform: uppercase;' +
      '  box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.15);' +
      '}' +
      '.feedback-button:hover {' +
      '  transform: rotate(90deg) translateY(-130%);' +
      '}' +
      '.feedback-popup {' +
      '    position: fixed;' +
      '    top: 50%;' +
      '    left: 50%;' +
      '    width: 30em;' +
      '    transform: translate(-50%, -50%);' +
      '    padding: 1em 1.3em;' +
      '    background-color: #ffffff;' +
      '    border-radius: 5px;' +
      '    z-index: 999;'
      '    box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.15);' +
      '  }' +
      '  .feedback-popup h1 {' +
      '    margin: 0 0 .4em;' +
      '    padding-left: .4em;' +
      '    color: #347389;' +
      '    font-size: 20px;' +
      '  }' +
      '  .feedback-popup textarea {' +
      '    box-sizing: border-box;' +
      '    display: block;' +
      '    width: 100%;' +
      '    height: 10em;' +
      '    margin-bottom: .8em;' +
      '    padding: .5em .6em;' +
      '    resize: vertical;' +
      '    background-color: #f4f3eb;' +
      '    font-size: 15px;' +
      '    color: #7d7e80;' +
      '    border: none;' +
      '    font-family: "Source Sans Pro", Helvetica, sans-serif;' +
      '  }' +
      '  .feedback-popup .submit {' +
      '    margin-right: 1em;' +
      '    padding: .3em .7em;' +
      '    background-color: #37a766;' +
      '    color: #ffffff;' +
      '    font-size: 15px;' +
      '    border: none;' +
      '    border-radius: 4px;' +
      '    font-family: "Source Sans Pro", Helvetica, sans-serif;' +
      '  }' +
      '  .feedback-popup a {' +
      '    color: #7d7e80;' +
      '    font-size: 15px;' +
      '    text-decoration: none;' +
      '  }' +
      '  .feedback-popup a:hover {' +
      '    text-decoration: underline;' +
      '  }',
    BOX =
      '<div class="feedback-popup">' +
      '<h1>Have feedback or questions?</h1>' +
      '<iframe id="CHARM_FORM_TARGET" name="CHARM_FORM_TARGET" src="javascript:void(0)" onload="__CHARM&&__CHARM.iFrameLoaded&&__CHARM.iFrameLoaded()" onerror="__CHARM&&__CHARM.iFrameError&&__CHARM.iFrameError()"></iframe>' +
      '<form id="CHARM_FORM" action="https://secure.charmhq.com/feedback" method="POST" accept-charset="utf-8">' +
      '<div id="CHARM_YOUR_EMAIL"></div>'+
      '<div id="CHARM_YOUR_COMMENT"></div>'+
      '<textarea id="CHARM_COMMENT" name="content" class="ignore-return-pressed" placeholder="Let us know and we will get right back to you by email"></textarea>' +
      '<input id="CHARM_SUBMIT" type="submit" class="submit" value="">' +
      '<a href="#" title="" id="CHARM_CANCEL"></a>' +
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

  function vendored(property, value){
    var string = '';
    for(var i=0;i<VENDORS.length;i++)
      string += '-'+VENDORS[i]+'-'+property+":"+value+';';
    string += property+":"+value+';';
    return string;
  }
 
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
  function css(id,style){ $(id).style.cssText += ';' + style; }
  
  function csstag(styles){
    var css = document.createElement('style');
    css.setAttribute('type','text/css');
    if('styleSheet' in css)
      css.styleSheet.cssText = styles;
    else
      css.innerHTML = styles;
    
    document.getElementsByTagName('head')[0].appendChild(css);
  }
  
  function init(){
    tab = document.createElement('a');
    tab.id = "CHARM_TAB";
    tab.className = 'feedback-button';
    tab.innerHTML = 'Feedback & Support';
    tab.href = "https://secure.charmhq.com/feedback/" + __CHARM.key;
    tab.onclick = function(){ show(); return false };
    document.body.appendChild(tab);
    csstag(STYLE);
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
        box.className = 'closed' + ($('CHARM_YOUR_EMAIL') ? ' with-email' : '');
      } else {
        $('CHARM_YOUR_EMAIL').parentNode.removeChild($('CHARM_YOUR_EMAIL'));
        $('CHARM_YOUR_COMMENT').parentNode.removeChild($('CHARM_YOUR_COMMENT'));
        userdata('email');
      }

      customize('text');
      customize('submit', 'value');
      customize('cancel');
      
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

      if('charm_url' in __CHARM){
        $('CHARM_FORM').action = __CHARM['charm_url'];
      }

      setTimeout(function(){
        var scrollTop = document.body.scrollTop;
        
        box.className = 'open' + ($('CHARM_YOUR_EMAIL') ? ' with-email' : '');
        css(box, 'display:block');
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
    css(box, 'display:block');
    box.offsetLeft;
    box.className = 'open' + ($('CHARM_YOUR_EMAIL') ? ' with-email' : '');
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
    setTimeout(function(){
      css(box, 'display:none');
    }, 260);
  }

  function hideTab(){
    tab.className = 'hidden';
  }

  function showTab(){
    tab.className = '';
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
})();
