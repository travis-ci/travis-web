/*jshint evil:true*/

minispade = {
  root: null,
  modules: {},
  loaded: {},

  globalEval: function(data) {
    if ( data ) {
      // We use execScript on Internet Explorer
      // We use an anonymous function so that context is window
      // rather than jQuery in Firefox
      ( window.execScript || function( data ) {
        window[ "eval" ].call( window, data );
      } )( data );
    }
  },

  require: function(name) {
    var loaded = minispade.loaded[name];
    var mod = minispade.modules[name];

    if (!loaded) {
      if (mod) {
        minispade.loaded[name] = true;

        if (typeof mod === "string") {
          this.globalEval(mod);
        } else {
          mod();
        }
      } else {
        if (minispade.root && name.substr(0,minispade.root.length) !== minispade.root) {
          return minispade.require(minispade.root+name);
        } else {
          throw "The module '" + name + "' could not be found";
        }
      }
    }

    return loaded;
  },

  requireAll: function(regex) {
    for (var module in this.modules) {
      if (!this.modules.hasOwnProperty(module)) { continue; }
      if (regex && !regex.test(module)) { continue; }
      minispade.require(module);
    }
  },

  register: function(name, callback) {
    minispade.modules[name] = callback;
  }
};
/*! jQuery v1.7.2 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cu(a){if(!cj[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){ck||(ck=c.createElement("iframe"),ck.frameBorder=ck.width=ck.height=0),b.appendChild(ck);if(!cl||!ck.createElement)cl=(ck.contentWindow||ck.contentDocument).document,cl.write((f.support.boxModel?"<!doctype html>":"")+"<html><body>"),cl.close();d=cl.createElement(a),cl.body.appendChild(d),e=f.css(d,"display"),b.removeChild(ck)}cj[a]=e}return cj[a]}function ct(a,b){var c={};f.each(cp.concat.apply([],cp.slice(0,b)),function(){c[this]=a});return c}function cs(){cq=b}function cr(){setTimeout(cs,0);return cq=f.now()}function ci(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ch(){try{return new a.XMLHttpRequest}catch(b){}}function cb(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function ca(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function b_(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bD.test(a)?d(a,e):b_(a+"["+(typeof e=="object"?b:"")+"]",e,c,d)});else if(!c&&f.type(b)==="object")for(var e in b)b_(a+"["+e+"]",b[e],c,d);else d(a,b)}function b$(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function bZ(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bS,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bZ(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bZ(a,c,d,e,"*",g));return l}function bY(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bO),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bB(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?1:0,g=4;if(d>0){if(c!=="border")for(;e<g;e+=2)c||(d-=parseFloat(f.css(a,"padding"+bx[e]))||0),c==="margin"?d+=parseFloat(f.css(a,c+bx[e]))||0:d-=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0;return d+"px"}d=by(a,b);if(d<0||d==null)d=a.style[b];if(bt.test(d))return d;d=parseFloat(d)||0;if(c)for(;e<g;e+=2)d+=parseFloat(f.css(a,"padding"+bx[e]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+bx[e]))||0);return d+"px"}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;b.nodeType===1&&(b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase(),c==="object"?b.outerHTML=a.outerHTML:c!=="input"||a.type!=="checkbox"&&a.type!=="radio"?c==="option"?b.selected=a.defaultSelected:c==="input"||c==="textarea"?b.defaultValue=a.defaultValue:c==="script"&&b.text!==a.text&&(b.text=a.text):(a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value)),b.removeAttribute(f.expando),b.removeAttribute("_submit_attached"),b.removeAttribute("_change_attached"))}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c,i[c][d])}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?+d:j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.2",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a!=null&&a==a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){if(typeof c!="string"||!c)return null;var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h,i){var j,k=d==null,l=0,m=a.length;if(d&&typeof d=="object"){for(l in d)e.access(a,c,l,d[l],1,h,f);g=1}else if(f!==b){j=i===b&&e.isFunction(f),k&&(j?(j=c,c=function(a,b,c){return j.call(e(a),c)}):(c.call(a,f),c=null));if(c)for(;l<m;l++)c(a[l],d,j?f.call(a[l],l,c(a[l],d)):f,i);g=1}return g?a:k?c.call(a):m?c(a[0],d):h},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m,n=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?n(g):h==="function"&&(!a.unique||!p.has(g))&&c.push(g)},o=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,j=!0,m=k||0,k=0,l=c.length;for(;c&&m<l;m++)if(c[m].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}j=!1,c&&(a.once?e===!0?p.disable():c=[]:d&&d.length&&(e=d.shift(),p.fireWith(e[0],e[1])))},p={add:function(){if(c){var a=c.length;n(arguments),j?l=c.length:e&&e!==!0&&(k=a,o(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){j&&f<=l&&(l--,f<=m&&m--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&p.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(j?a.once||d.push([b,c]):(!a.once||!e)&&o(b,c));return this},fire:function(){p.fireWith(this,arguments);return this},fired:function(){return!!i}};return p};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p=c.createElement("div"),q=c.documentElement;p.setAttribute("className","t"),p.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=p.getElementsByTagName("*"),e=p.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=p.getElementsByTagName("input")[0],b={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:p.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,pixelMargin:!0},f.boxModel=b.boxModel=c.compatMode==="CSS1Compat",i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete p.test}catch(r){b.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",function(){b.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),i.setAttribute("name","t"),p.appendChild(i),j=c.createDocumentFragment(),j.appendChild(p.lastChild),b.checkClone=j.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,j.removeChild(i),j.appendChild(p);if(p.attachEvent)for(n in{submit:1,change:1,focusin:1})m="on"+n,o=m in p,o||(p.setAttribute(m,"return;"),o=typeof p[m]=="function"),b[n+"Bubbles"]=o;j.removeChild(p),j=g=h=p=i=null,f(function(){var d,e,g,h,i,j,l,m,n,q,r,s,t,u=c.getElementsByTagName("body")[0];!u||(m=1,t="padding:0;margin:0;border:",r="position:absolute;top:0;left:0;width:1px;height:1px;",s=t+"0;visibility:hidden;",n="style='"+r+t+"5px solid #000;",q="<div "+n+"display:block;'><div style='"+t+"0;display:block;overflow:hidden;'></div></div>"+"<table "+n+"' cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",d=c.createElement("div"),d.style.cssText=s+"width:0;height:0;position:static;top:0;margin-top:"+m+"px",u.insertBefore(d,u.firstChild),p=c.createElement("div"),d.appendChild(p),p.innerHTML="<table><tr><td style='"+t+"0;display:none'></td><td>t</td></tr></table>",k=p.getElementsByTagName("td"),o=k[0].offsetHeight===0,k[0].style.display="",k[1].style.display="none",b.reliableHiddenOffsets=o&&k[0].offsetHeight===0,a.getComputedStyle&&(p.innerHTML="",l=c.createElement("div"),l.style.width="0",l.style.marginRight="0",p.style.width="2px",p.appendChild(l),b.reliableMarginRight=(parseInt((a.getComputedStyle(l,null)||{marginRight:0}).marginRight,10)||0)===0),typeof p.style.zoom!="undefined"&&(p.innerHTML="",p.style.width=p.style.padding="1px",p.style.border=0,p.style.overflow="hidden",p.style.display="inline",p.style.zoom=1,b.inlineBlockNeedsLayout=p.offsetWidth===3,p.style.display="block",p.style.overflow="visible",p.innerHTML="<div style='width:5px;'></div>",b.shrinkWrapBlocks=p.offsetWidth!==3),p.style.cssText=r+s,p.innerHTML=q,e=p.firstChild,g=e.firstChild,i=e.nextSibling.firstChild.firstChild,j={doesNotAddBorder:g.offsetTop!==5,doesAddBorderForTableAndCells:i.offsetTop===5},g.style.position="fixed",g.style.top="20px",j.fixedPosition=g.offsetTop===20||g.offsetTop===15,g.style.position=g.style.top="",e.style.overflow="hidden",e.style.position="relative",j.subtractsBorderForOverflowNotVisible=g.offsetTop===-5,j.doesNotIncludeMarginInBodyOffset=u.offsetTop!==m,a.getComputedStyle&&(p.style.marginTop="1%",b.pixelMargin=(a.getComputedStyle(p,null)||{marginTop:0}).marginTop!=="1%"),typeof d.style.zoom!="undefined"&&(d.style.zoom=1),u.removeChild(d),l=p=d=null,f.extend(b,j))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h,i,j=this[0],k=0,m=null;if(a===b){if(this.length){m=f.data(j);if(j.nodeType===1&&!f._data(j,"parsedAttrs")){g=j.attributes;for(i=g.length;k<i;k++)h=g[k].name,h.indexOf("data-")===0&&(h=f.camelCase(h.substring(5)),l(j,h,m[h]));f._data(j,"parsedAttrs",!0)}}return m}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split(".",2),d[1]=d[1]?"."+d[1]:"",e=d[1]+"!";return f.access(this,function(c){if(c===b){m=this.triggerHandler("getData"+e,[d[0]]),m===b&&j&&(m=f.data(j,a),m=l(j,a,m));return m===b&&d[1]?this.data(d[0]):m}d[1]=c,this.each(function(){var b=f(this);b.triggerHandler("setData"+e,d),f.data(this,a,c),b.triggerHandler("changeData"+e,d)})},null,c,arguments.length>1,null,!1)},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){var d=2;typeof a!="string"&&(c=a,a="fx",d--);if(arguments.length<d)return f.queue(this[0],a);return c===b?this:this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise(c)}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,f.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,f.prop,a,b,arguments.length>1)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.type]||f.valHooks[this.nodeName.toLowerCase()];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.type]||f.valHooks[g.nodeName.toLowerCase()];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h,i=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;i<g;i++)e=d[i],e&&(c=f.propFix[e]||e,h=u.test(e),h||f.attr(a,e,""),a.removeAttribute(v?e:c),h&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0,coords:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/(?:^|\s)hover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(
a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler,g=p.selector),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:g&&G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=f.event.special[c.type]||{},j=[],k,l,m,n,o,p,q,r,s,t,u;g[0]=c,c.delegateTarget=this;if(!i.preDispatch||i.preDispatch.call(this,c)!==!1){if(e&&(!c.button||c.type!=="click")){n=f(this),n.context=this.ownerDocument||this;for(m=c.target;m!=this;m=m.parentNode||this)if(m.disabled!==!0){p={},r=[],n[0]=m;for(k=0;k<e;k++)s=d[k],t=s.selector,p[t]===b&&(p[t]=s.quick?H(m,s.quick):n.is(t)),p[t]&&r.push(s);r.length&&j.push({elem:m,matches:r})}}d.length>e&&j.push({elem:this,matches:d.slice(e)});for(k=0;k<j.length&&!c.isPropagationStopped();k++){q=j[k],c.currentTarget=q.elem;for(l=0;l<q.matches.length&&!c.isImmediatePropagationStopped();l++){s=q.matches[l];if(h||!c.namespace&&!s.namespace||c.namespace_re&&c.namespace_re.test(s.namespace))c.data=s.data,c.handleObj=s,o=((f.event.special[s.origType]||{}).handle||s.handler).apply(q.elem,g),o!==b&&(c.result=o,o===!1&&(c.preventDefault(),c.stopPropagation()))}}i.postDispatch&&i.postDispatch.call(this,c);return c.result}},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){a._submit_bubble=!0}),d._submit_attached=!0)})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=d||c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9||d===11){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));o.match.globalPOS=p;var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.globalPOS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")[\\s/>]","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){return f.access(this,function(a){return a===b?f.text(this):this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a))},null,a,arguments.length)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f
.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){return f.access(this,function(a){var c=this[0]||{},d=0,e=this.length;if(a===b)return c.nodeType===1?c.innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(;d<e;d++)c=this[d]||{},c.nodeType===1&&(f.cleanData(c.getElementsByTagName("*")),c.innerHTML=a);c=0}catch(g){}}c&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,function(a,b){b.src?f.ajax({type:"GET",global:!1,url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)})}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||f.isXMLDoc(a)||!bc.test("<"+a.nodeName+">")?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g,h,i,j=[];b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);for(var k=0,l;(l=a[k])!=null;k++){typeof l=="number"&&(l+="");if(!l)continue;if(typeof l=="string")if(!_.test(l))l=b.createTextNode(l);else{l=l.replace(Y,"<$1></$2>");var m=(Z.exec(l)||["",""])[1].toLowerCase(),n=bg[m]||bg._default,o=n[0],p=b.createElement("div"),q=bh.childNodes,r;b===c?bh.appendChild(p):U(b).appendChild(p),p.innerHTML=n[1]+l+n[2];while(o--)p=p.lastChild;if(!f.support.tbody){var s=$.test(l),t=m==="table"&&!s?p.firstChild&&p.firstChild.childNodes:n[1]==="<table>"&&!s?p.childNodes:[];for(i=t.length-1;i>=0;--i)f.nodeName(t[i],"tbody")&&!t[i].childNodes.length&&t[i].parentNode.removeChild(t[i])}!f.support.leadingWhitespace&&X.test(l)&&p.insertBefore(b.createTextNode(X.exec(l)[0]),p.firstChild),l=p.childNodes,p&&(p.parentNode.removeChild(p),q.length>0&&(r=q[q.length-1],r&&r.parentNode&&r.parentNode.removeChild(r)))}var u;if(!f.support.appendChecked)if(l[0]&&typeof (u=l.length)=="number")for(i=0;i<u;i++)bn(l[i]);else bn(l);l.nodeType?j.push(l):j=f.merge(j,l)}if(d){g=function(a){return!a.type||be.test(a.type)};for(k=0;j[k];k++){h=j[k];if(e&&f.nodeName(h,"script")&&(!h.type||be.test(h.type)))e.push(h.parentNode?h.parentNode.removeChild(h):h);else{if(h.nodeType===1){var v=f.grep(h.getElementsByTagName("script"),g);j.splice.apply(j,[k+1,0].concat(v))}d.appendChild(h)}}}return j},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bp=/alpha\([^)]*\)/i,bq=/opacity=([^)]*)/,br=/([A-Z]|^ms)/g,bs=/^[\-+]?(?:\d*\.)?\d+$/i,bt=/^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,bu=/^([\-+])=([\-+.\de]+)/,bv=/^margin/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Top","Right","Bottom","Left"],by,bz,bA;f.fn.css=function(a,c){return f.access(this,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)},a,c,arguments.length>1)},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=by(a,"opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bu.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(by)return by(a,c)},swap:function(a,b,c){var d={},e,f;for(f in b)d[f]=a.style[f],a.style[f]=b[f];e=c.call(a);for(f in b)a.style[f]=d[f];return e}}),f.curCSS=f.css,c.defaultView&&c.defaultView.getComputedStyle&&(bz=function(a,b){var c,d,e,g,h=a.style;b=b.replace(br,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b))),!f.support.pixelMargin&&e&&bv.test(b)&&bt.test(c)&&(g=h.width,h.width=c,c=e.width,h.width=g);return c}),c.documentElement.currentStyle&&(bA=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f==null&&g&&(e=g[b])&&(f=e),bt.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),by=bz||bA,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){if(c)return a.offsetWidth!==0?bB(a,b,d):f.swap(a,bw,function(){return bB(a,b,d)})},set:function(a,b){return bs.test(b)?b+"px":b}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return bq.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bp,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bp.test(g)?g.replace(bp,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){return f.swap(a,{display:"inline-block"},function(){return b?by(a,"margin-right"):a.style.marginRight})}})}),f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)}),f.each({margin:"",padding:"",border:"Width"},function(a,b){f.cssHooks[a+b]={expand:function(c){var d,e=typeof c=="string"?c.split(" "):[c],f={};for(d=0;d<4;d++)f[a+bx[d]+b]=e[d]||e[d-2]||e[0];return f}}});var bC=/%20/g,bD=/\[\]$/,bE=/\r?\n/g,bF=/#.*$/,bG=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bH=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bI=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bJ=/^(?:GET|HEAD)$/,bK=/^\/\//,bL=/\?/,bM=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bN=/^(?:select|textarea)/i,bO=/\s+/,bP=/([?&])_=[^&]*/,bQ=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bR=f.fn.load,bS={},bT={},bU,bV,bW=["*/"]+["*"];try{bU=e.href}catch(bX){bU=c.createElement("a"),bU.href="",bU=bU.href}bV=bQ.exec(bU.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bR)return bR.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bM,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bN.test(this.nodeName)||bH.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bE,"\r\n")}}):{name:b.name,value:c.replace(bE,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b$(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b$(a,b);return a},ajaxSettings:{url:bU,isLocal:bI.test(bV[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bW},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bY(bS),ajaxTransport:bY(bT),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?ca(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cb(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bG.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bF,"").replace(bK,bV[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bO),d.crossDomain==null&&(r=bQ.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bV[1]&&r[2]==bV[2]&&(r[3]||(r[1]==="http:"?80:443))==(bV[3]||(bV[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),bZ(bS,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bJ.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bL.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bP,"$1_="+x);d.url=y+(y===d.url?(bL.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bW+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=bZ(bT,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)b_(g,a[g],c,e);return d.join("&").replace(bC,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cc=f.now(),cd=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cc++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=typeof b.data=="string"&&/^application\/x\-www\-form\-urlencoded/.test(b.contentType);if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(cd.test(b.url)||e&&cd.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(cd,l),b.url===j&&(e&&(k=k.replace(cd,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var ce=a.ActiveXObject?function(){for(var a in cg)cg[a](0,1)}:!1,cf=0,cg;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ch()||ci()}:ch,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,ce&&delete cg[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n);try{m.text=h.responseText}catch(a){}try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cf,ce&&(cg||(cg={},f(a).unload(ce)),cg[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var cj={},ck,cl,cm=/^(?:toggle|show|hide)$/,cn=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,co,cp=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cq;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(ct("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),(e===""&&f.css(d,"display")==="none"||!f.contains(d.ownerDocument.documentElement,d))&&f._data(d,"olddisplay",cu(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(ct("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(ct("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o,p,q;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]);if((k=f.cssHooks[g])&&"expand"in k){l=k.expand(a[g]),delete a[g];for(i in l)i in a||(a[i]=l[i])}}for(g in a){h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cu(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cm.test(h)?(q=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),q?(f._data(this,"toggle"+i,q==="show"?"hide":"show"),j[q]()):j[h]()):(m=cn.exec(h),n=j.cur(),m?(o=parseFloat(m[2]),p=m[3]||(f.cssNumber[i]?"":"px"),p!=="px"&&(f.style(this,i,(o||1)+p),n=(o||1)/j.cur()*n,f.style(this,i,n+p)),m[1]&&(o=(m[1]==="-="?-1:1)*o+n),j.custom(n,o,p)):j.custom(n,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:ct("show",1),slideUp:ct("hide",1),slideToggle:ct("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a){return a},swing:function(a){return-Math.cos(a*Math.PI)/2+.5}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cq||cr(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){f._data(e.elem,"fxshow"+e.prop)===b&&(e.options.hide?f._data(e.elem,"fxshow"+e.prop,e.start):e.options.show&&f._data(e.elem,"fxshow"+e.prop,e.end))},h()&&f.timers.push(h)&&!co&&(co=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cq||cr(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(co),co=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(cp.concat.apply([],cp),function(a,b){b.indexOf("margin")&&(f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)})}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cv,cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?cv=function(a,b,c,d){try{d=a.getBoundingClientRect()}catch(e){}if(!d||!f.contains(c,a))return d?{top:d.top,left:d.left}:{top:0,left:0};var g=b.body,h=cy(b),i=c.clientTop||g.clientTop||0,j=c.clientLeft||g.clientLeft||0,k=h.pageYOffset||f.support.boxModel&&c.scrollTop||g.scrollTop,l=h.pageXOffset||f.support.boxModel&&c.scrollLeft||g.scrollLeft,m=d.top+k-i,n=d.left+l-j;return{top:m,left:n}}:cv=function(a,b,c){var d,e=a.offsetParent,g=a,h=b.body,i=b.defaultView,j=i?i.getComputedStyle(a,null):a.currentStyle,k=a.offsetTop,l=a.offsetLeft;while((a=a.parentNode)&&a!==h&&a!==c){if(f.support.fixedPosition&&j.position==="fixed")break;d=i?i.getComputedStyle(a,null):a.currentStyle,k-=a.scrollTop,l-=a.scrollLeft,a===e&&(k+=a.offsetTop,l+=a.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(a.nodeName))&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),g=e,e=a.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&d.overflow!=="visible"&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),j=d}if(j.position==="relative"||j.position==="static")k+=h.offsetTop,l+=h.offsetLeft;f.support.fixedPosition&&j.position==="fixed"&&(k+=Math.max(c.scrollTop,h.scrollTop),l+=Math.max(c.scrollLeft,h.scrollLeft));return{top:k,left:l}},f.fn.offset=function(a){if(arguments.length)return a===b?this:this.each(function(b){f.offset.setOffset(this,a,b)});var c=this[0],d=c&&c.ownerDocument;if(!d)return null;if(c===d.body)return f.offset.bodyOffset(c);return cv(c,d,d.documentElement)},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,c){var d=/Y/.test(c);f.fn[a]=function(e){return f.access(this,function(a,e,g){var h=cy(a);if(g===b)return h?c in h?h[c]:f.support.boxModel&&h.document.documentElement[e]||h.document.body[e]:a[e];h?h.scrollTo(d?f(h).scrollLeft():g,d?g:f(h).scrollTop()):a[e]=g},a,e,arguments.length,null)}}),f.each({Height:"height",Width:"width"},function(a,c){var d="client"+a,e="scroll"+a,g="offset"+a;f.fn["inner"+a]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,c,"padding")):this[c]():null},f.fn["outer"+a]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,c,a?"margin":"border")):this[c]():null},f.fn[c]=function(a){return f.access(this,function(a,c,h){var i,j,k,l;if(f.isWindow(a)){i=a.document,j=i.documentElement[d];return f.support.boxModel&&j||i.body&&i.body[d]||j}if(a.nodeType===9){i=a.documentElement;if(i[d]>=i[e])return i[d];return Math.max(a.body[e],i[e],a.body[g],i[g])}if(h===b){k=f.css(a,c),l=parseFloat(k);return f.isNumeric(l)?l:k}f(a).css(c,h)},c,a,arguments.length,null)}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);
// lib/handlebars/base.js

/*jshint eqnull:true*/
this.Handlebars = {};

(function() {

Handlebars.VERSION = "1.0.rc.1";

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;


  var ret = "";
  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      for(var i=0, j=context.length; i<j; i++) {
        ret = ret + fn(context[i]);
      }
    } else {
      ret = inverse(this);
    }
    return ret;
  } else {
    return fn(context);
  }
});

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var ret = "";

  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + fn(context[i]);
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context) {
  Handlebars.log(context);
});

}());
;
// lib/handlebars/compiler/parser.js
/* Jison generated parser */
var handlebars = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"statements":6,"simpleInverse":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"inMustache":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"OPEN_PARTIAL":24,"params":25,"hash":26,"param":27,"STRING":28,"INTEGER":29,"BOOLEAN":30,"hashSegments":31,"hashSegment":32,"ID":33,"EQUALS":34,"pathSegments":35,"SEP":36,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",28:"STRING",29:"INTEGER",30:"BOOLEAN",33:"ID",34:"EQUALS",36:"SEP"},
productions_: [0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[25,2],[25,1],[27,1],[27,1],[27,1],[27,1],[26,1],[31,2],[31,1],[32,3],[32,3],[32,3],[32,3],[21,1],[35,3],[35,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1];
break;
case 2: this.$ = new yy.ProgramNode($$[$0-2], $$[$0]);
break;
case 3: this.$ = new yy.ProgramNode($$[$0]);
break;
case 4: this.$ = new yy.ProgramNode([]);
break;
case 5: this.$ = [$$[$0]];
break;
case 6: $$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 7: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1].inverse, $$[$0-1], $$[$0]);
break;
case 8: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0-1].inverse, $$[$0]);
break;
case 9: this.$ = $$[$0];
break;
case 10: this.$ = $$[$0];
break;
case 11: this.$ = new yy.ContentNode($$[$0]);
break;
case 12: this.$ = new yy.CommentNode($$[$0]);
break;
case 13: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]);
break;
case 14: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]);
break;
case 15: this.$ = $$[$0-1];
break;
case 16: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]);
break;
case 17: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], true);
break;
case 18: this.$ = new yy.PartialNode($$[$0-1]);
break;
case 19: this.$ = new yy.PartialNode($$[$0-2], $$[$0-1]);
break;
case 20:
break;
case 21: this.$ = [[$$[$0-2]].concat($$[$0-1]), $$[$0]];
break;
case 22: this.$ = [[$$[$0-1]].concat($$[$0]), null];
break;
case 23: this.$ = [[$$[$0-1]], $$[$0]];
break;
case 24: this.$ = [[$$[$0]], null];
break;
case 25: $$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 26: this.$ = [$$[$0]];
break;
case 27: this.$ = $$[$0];
break;
case 28: this.$ = new yy.StringNode($$[$0]);
break;
case 29: this.$ = new yy.IntegerNode($$[$0]);
break;
case 30: this.$ = new yy.BooleanNode($$[$0]);
break;
case 31: this.$ = new yy.HashNode($$[$0]);
break;
case 32: $$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 33: this.$ = [$$[$0]];
break;
case 34: this.$ = [$$[$0-2], $$[$0]];
break;
case 35: this.$ = [$$[$0-2], new yy.StringNode($$[$0])];
break;
case 36: this.$ = [$$[$0-2], new yy.IntegerNode($$[$0])];
break;
case 37: this.$ = [$$[$0-2], new yy.BooleanNode($$[$0])];
break;
case 38: this.$ = new yy.IdNode($$[$0]);
break;
case 39: $$[$0-2].push($$[$0]); this.$ = $$[$0-2];
break;
case 40: this.$ = [$$[$0]];
break;
}
},
table: [{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{1:[3]},{5:[1,16]},{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{17:22,21:23,33:[1,25],35:24},{17:26,21:23,33:[1,25],35:24},{17:27,21:23,33:[1,25],35:24},{17:28,21:23,33:[1,25],35:24},{21:29,33:[1,25],35:24},{1:[2,1]},{6:30,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{17:22,18:[1,31],21:23,33:[1,25],35:24},{10:32,20:[1,33]},{10:34,20:[1,33]},{18:[1,35]},{18:[2,24],21:40,25:36,26:37,27:38,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,38],28:[2,38],29:[2,38],30:[2,38],33:[2,38],36:[1,46]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],36:[2,40]},{18:[1,47]},{18:[1,48]},{18:[1,49]},{18:[1,50],21:51,33:[1,25],35:24},{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]},{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{21:52,33:[1,25],35:24},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{18:[2,22],21:40,26:53,27:54,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,23]},{18:[2,26],28:[2,26],29:[2,26],30:[2,26],33:[2,26]},{18:[2,31],32:55,33:[1,56]},{18:[2,27],28:[2,27],29:[2,27],30:[2,27],33:[2,27]},{18:[2,28],28:[2,28],29:[2,28],30:[2,28],33:[2,28]},{18:[2,29],28:[2,29],29:[2,29],30:[2,29],33:[2,29]},{18:[2,30],28:[2,30],29:[2,30],30:[2,30],33:[2,30]},{18:[2,33],33:[2,33]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],34:[1,57],36:[2,40]},{33:[1,58]},{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]},{18:[1,59]},{18:[1,60]},{18:[2,21]},{18:[2,25],28:[2,25],29:[2,25],30:[2,25],33:[2,25]},{18:[2,32],33:[2,32]},{34:[1,57]},{21:61,28:[1,62],29:[1,63],30:[1,64],33:[1,25],35:24},{18:[2,39],28:[2,39],29:[2,39],30:[2,39],33:[2,39],36:[2,39]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{18:[2,34],33:[2,34]},{18:[2,35],33:[2,35]},{18:[2,36],33:[2,36]},{18:[2,37],33:[2,37]}],
defaultActions: {16:[2,1],37:[2,23],53:[2,21]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        _handle_error:
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + this.terminals_[symbol]+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:
                                   if(yy_.yytext.slice(-1) !== "\\") this.begin("mu");
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1), this.begin("emu");
                                   if(yy_.yytext) return 14;

break;
case 1: return 14;
break;
case 2: this.popState(); return 14;
break;
case 3: return 24;
break;
case 4: return 16;
break;
case 5: return 20;
break;
case 6: return 19;
break;
case 7: return 19;
break;
case 8: return 23;
break;
case 9: return 23;
break;
case 10: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.popState(); return 15;
break;
case 11: return 22;
break;
case 12: return 34;
break;
case 13: return 33;
break;
case 14: return 33;
break;
case 15: return 36;
break;
case 16: /*ignore whitespace*/
break;
case 17: this.popState(); return 18;
break;
case 18: this.popState(); return 18;
break;
case 19: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 28;
break;
case 20: return 30;
break;
case 21: return 30;
break;
case 22: return 29;
break;
case 23: return 33;
break;
case 24: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 33;
break;
case 25: return 'INVALID';
break;
case 26: return 5;
break;
}
};
lexer.rules = [/^[^\x00]*?(?=(\{\{))/,/^[^\x00]+/,/^[^\x00]{2,}?(?=(\{\{))/,/^\{\{>/,/^\{\{#/,/^\{\{\//,/^\{\{\^/,/^\{\{\s*else\b/,/^\{\{\{/,/^\{\{&/,/^\{\{![\s\S]*?\}\}/,/^\{\{/,/^=/,/^\.(?=[} ])/,/^\.\./,/^[\/.]/,/^\s+/,/^\}\}\}/,/^\}\}/,/^"(\\["]|[^"])*"/,/^true(?=[}\s])/,/^false(?=[}\s])/,/^[0-9]+(?=[}\s])/,/^[a-zA-Z0-9_$-]+(?=[=}\s\/.])/,/^\[[^\]]*\]/,/^./,/^$/];
lexer.conditions = {"mu":{"rules":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"INITIAL":{"rules":[0,1,26],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = handlebars;
exports.parse = function () { return handlebars.parse.apply(handlebars, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
};
;
// lib/handlebars/compiler/base.js
Handlebars.Parser = handlebars;

Handlebars.parse = function(string) {
  Handlebars.Parser.yy = Handlebars.AST;
  return Handlebars.Parser.parse(string);
};

Handlebars.print = function(ast) {
  return new Handlebars.PrintVisitor().accept(ast);
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  // override in the host environment
  log: function(level, str) {}
};

Handlebars.log = function(level, str) { Handlebars.logger.log(level, str); };
;
// lib/handlebars/compiler/ast.js
(function() {

  Handlebars.AST = {};

  Handlebars.AST.ProgramNode = function(statements, inverse) {
    this.type = "program";
    this.statements = statements;
    if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); }
  };

  Handlebars.AST.MustacheNode = function(rawParams, hash, unescaped) {
    this.type = "mustache";
    this.escaped = !unescaped;
    this.hash = hash;

    var id = this.id = rawParams[0];
    var params = this.params = rawParams.slice(1);

    // a mustache is an eligible helper if:
    // * its id is simple (a single part, not `this` or `..`)
    var eligibleHelper = this.eligibleHelper = id.isSimple;

    // a mustache is definitely a helper if:
    // * it is an eligible helper, and
    // * it has at least one parameter or hash segment
    this.isHelper = eligibleHelper && (params.length || hash);

    // if a mustache is an eligible helper but not a definite
    // helper, it is ambiguous, and will be resolved in a later
    // pass or at runtime.
  };

  Handlebars.AST.PartialNode = function(id, context) {
    this.type    = "partial";

    // TODO: disallow complex IDs

    this.id      = id;
    this.context = context;
  };

  var verifyMatch = function(open, close) {
    if(open.original !== close.original) {
      throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
    }
  };

  Handlebars.AST.BlockNode = function(mustache, program, inverse, close) {
    verifyMatch(mustache.id, close);
    this.type = "block";
    this.mustache = mustache;
    this.program  = program;
    this.inverse  = inverse;

    if (this.inverse && !this.program) {
      this.isInverse = true;
    }
  };

  Handlebars.AST.ContentNode = function(string) {
    this.type = "content";
    this.string = string;
  };

  Handlebars.AST.HashNode = function(pairs) {
    this.type = "hash";
    this.pairs = pairs;
  };

  Handlebars.AST.IdNode = function(parts) {
    this.type = "ID";
    this.original = parts.join(".");

    var dig = [], depth = 0;

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i];

      if(part === "..") { depth++; }
      else if(part === "." || part === "this") { this.isScoped = true; }
      else { dig.push(part); }
    }

    this.parts    = dig;
    this.string   = dig.join('.');
    this.depth    = depth;

    // an ID is simple if it only has one part, and that part is not
    // `..` or `this`.
    this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;
  };

  Handlebars.AST.StringNode = function(string) {
    this.type = "STRING";
    this.string = string;
  };

  Handlebars.AST.IntegerNode = function(integer) {
    this.type = "INTEGER";
    this.integer = integer;
  };

  Handlebars.AST.BooleanNode = function(bool) {
    this.type = "BOOLEAN";
    this.bool = bool;
  };

  Handlebars.AST.CommentNode = function(comment) {
    this.type = "comment";
    this.comment = comment;
  };

})();;
// lib/handlebars/utils.js
Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  for (var p in tmp) {
    if (tmp.hasOwnProperty(p)) { this[p] = tmp[p]; }
  }

  this.message = tmp.message;
};
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /&(?!\w+;)|[<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;";
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (typeof value === "undefined") {
        return true;
      } else if (value === null) {
        return true;
      } else if (value === false) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/compiler/compiler.js

/*jshint eqnull:true*/
Handlebars.Compiler = function() {};
Handlebars.JavaScriptCompiler = function() {};

(function(Compiler, JavaScriptCompiler) {
  // the foundHelper register will disambiguate helper lookup from finding a
  // function in a context. This is necessary for mustache compatibility, which
  // requires that context functions in blocks are evaluated by blockHelperMissing,
  // and then proceed as if the resulting value was provided to blockHelperMissing.

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, out = [], params, param;

      for (var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if (opcode.opcode === 'DECLARE') {
          out.push("DECLARE " + opcode.name + "=" + opcode.value);
        } else {
          params = [];
          for (var j=0; j<opcode.args.length; j++) {
            param = opcode.args[j];
            if (typeof param === "string") {
              param = "\"" + param.replace("\n", "\\n") + "\"";
            }
            params.push(param);
          }
          out.push(opcode.opcode + " " + params.join(" "));
        }
      }

      return out.join("\n");
    },

    guid: 0,

    compile: function(program, options) {
      this.children = [];
      this.depths = {list: []};
      this.options = options;

      // These changes will propagate to the other compiler components
      var knownHelpers = this.options.knownHelpers;
      this.options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          this.options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.program(program);
    },

    accept: function(node) {
      return this[node.type](node);
    },

    program: function(program) {
      var statements = program.statements, statement;
      this.opcodes = [];

      for(var i=0, l=statements.length; i<l; i++) {
        statement = statements[i];
        this[statement.type](statement);
      }
      this.isSimple = l === 1;

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++, depth;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache,
          program = block.program,
          inverse = block.inverse;

      if (program) {
        program = this.compileProgram(program);
      }

      if (inverse) {
        inverse = this.compileProgram(inverse);
      }

      var type = this.classifyMustache(mustache);

      if (type === "helper") {
        this.helperMustache(mustache, program, inverse);
      } else if (type === "simple") {
        this.simpleMustache(mustache);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('pushLiteral', '{}');
        this.opcode('blockValue');
      } else {
        this.ambiguousMustache(mustache, program, inverse);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('pushLiteral', '{}');
        this.opcode('ambiguousBlockValue');
      }

      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('push', '{}');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        this.accept(val);
        this.opcode('assignToHash', pair[0]);
      }
    },

    partial: function(partial) {
      var id = partial.id;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
      } else {
        this.opcode('push', 'depth0');
      }

      this.opcode('invokePartial', id.original);
      this.opcode('append');
    },

    content: function(content) {
      this.opcode('appendContent', content.string);
    },

    mustache: function(mustache) {
      var options = this.options;
      var type = this.classifyMustache(mustache);

      if (type === "simple") {
        this.simpleMustache(mustache);
      } else if (type === "helper") {
        this.helperMustache(mustache);
      } else {
        this.ambiguousMustache(mustache);
      }

      if(mustache.escaped && !options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ambiguousMustache: function(mustache, program, inverse) {
      var id = mustache.id, name = id.parts[0];

      this.opcode('getContext', id.depth);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      this.opcode('invokeAmbiguous', name);
    },

    simpleMustache: function(mustache, program, inverse) {
      var id = mustache.id;

      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);

      if (id.parts.length) {
        this.opcode('lookupOnContext', id.parts[0]);
        for(var i=1, l=id.parts.length; i<l; i++) {
          this.opcode('lookup', id.parts[i]);
        }
      } else {
        this.opcode('pushContext');
      }
      this.opcode('resolvePossibleLambda');
    },

    helperMustache: function(mustache, program, inverse) {
      var params = this.setupFullMustacheParams(mustache, program, inverse),
          name = mustache.id.parts[0];

      if (this.options.knownHelpers[name]) {
        this.opcode('invokeKnownHelper', params.length, name);
      } else if (this.knownHelpersOnly) {
        throw new Error("You specified knownHelpersOnly, but used the unknown helper " + name);
      } else {
        this.opcode('invokeHelper', params.length, name);
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);
      this.opcode('lookupOnContext', id.parts[0]);

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
      }
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    INTEGER: function(integer) {
      this.opcode('pushLiteral', integer.integer);
    },

    BOOLEAN: function(bool) {
      this.opcode('pushLiteral', bool.bool);
    },

    comment: function() {},

    // HELPERS
    opcode: function(name) {
      this.opcodes.push({ opcode: name, args: [].slice.call(arguments, 1) });
    },

    declare: function(name, value) {
      this.opcodes.push({ opcode: 'DECLARE', name: name, value: value });
    },

    addDepth: function(depth) {
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    classifyMustache: function(mustache) {
      var isHelper   = mustache.isHelper;
      var isEligible = mustache.eligibleHelper;
      var options    = this.options;

      // if ambiguous, we can possibly resolve the ambiguity now
      if (isEligible && !isHelper) {
        var name = mustache.id.parts[0];

        if (options.knownHelpers[name]) {
          isHelper = true;
        } else if (options.knownHelpersOnly) {
          isEligible = false;
        }
      }

      if (isHelper) { return "helper"; }
      else if (isEligible) { return "ambiguous"; }
      else { return "simple"; }
    },

    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
          }

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.string);
        } else {
          this[param.type](param);
        }
      }
    },

    setupMustacheParams: function(mustache) {
      var params = mustache.params;
      this.pushParams(params);

      if(mustache.hash) {
        this.hash(mustache.hash);
      } else {
        this.opcode('pushLiteral', '{}');
      }

      return params;
    },

    // this will replace setupMustacheParams when we're done
    setupFullMustacheParams: function(mustache, program, inverse) {
      var params = mustache.params;
      this.pushParams(params);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      if(mustache.hash) {
        this.hash(mustache.hash);
      } else {
        this.opcode('pushLiteral', '{}');
      }

      return params;
    }
  };

  var Literal = function(value) {
    this.value = value;
  };

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name, type) {
      if (/^[0-9]+$/.test(name)) {
        return parent + "[" + name + "]";
      } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
        return parent + "." + name;
      }
      else {
        return parent + "['" + name + "']";
      }
    },

    appendToBuffer: function(string) {
      if (this.environment.isSimple) {
        return "return " + string + ";";
      } else {
        return "buffer += " + string + ";";
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },

    namespace: "Handlebars",
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options || {};

      Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n");

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        aliases: { }
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.registers = { list: [] };
      this.compileStack = [];

      this.compileChildren(environment, options);

      var opcodes = environment.opcodes, opcode;

      this.i = 0;

      for(l=opcodes.length; this.i<l; this.i++) {
        opcode = opcodes[this.i];

        if(opcode.opcode === 'DECLARE') {
          this[opcode.name] = opcode.value;
        } else {
          this[opcode.opcode].apply(this, opcode.args);
        }
      }

      return this.createFunctionContext(asObject);
    },

    nextOpcode: function() {
      var opcodes = this.environment.opcodes, opcode = opcodes[this.i + 1];
      return opcodes[this.i + 1];
    },

    eat: function(opcode) {
      this.i = this.i + 1;
    },

    preamble: function() {
      var out = [];

      if (!this.isChild) {
        var namespace = this.namespace;
        var copies = "helpers = helpers || " + namespace + ".helpers;";
        if(this.environment.usePartial) { copies = copies + " partials = partials || " + namespace + ".partials;"; }
        out.push(copies);
      } else {
        out.push('');
      }

      if (!this.environment.isSimple) {
        out.push(", buffer = " + this.initializeBuffer());
      } else {
        out.push("");
      }

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
    },

    createFunctionContext: function(asObject) {
      var locals = this.stackVars.concat(this.registers.list);

      if(locals.length > 0) {
        this.source[1] = this.source[1] + ", " + locals.join(", ");
      }

      // Generate minimizer alias mappings
      if (!this.isChild) {
        var aliases = [];
        for (var alias in this.context.aliases) {
          this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
        }
      }

      if (this.source[1]) {
        this.source[1] = "var " + this.source[1].substring(2) + ";";
      }

      // Merge children
      if (!this.isChild) {
        this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
      }

      if (!this.environment.isSimple) {
        this.source.push("return buffer;");
      }

      var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
      }

      if (asObject) {
        params.push(this.source.join("\n  "));

        return Function.apply(this, params);
      } else {
        var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + this.source.join("\n  ") + '}';
        Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
        return functionSource;
      }
    },

    // [blockValue]
    //
    // On stack, before: hash, inverse, program, value
    // On stack, after: return value of blockHelperMissing
    //
    // The purpose of this opcode is to take a block of the form
    // `{{#foo}}...{{/foo}}`, resolve the value of `foo`, and
    // replace it on the stack with the result of properly
    // invoking blockHelperMissing.
    blockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      this.replaceStack(function(current) {
        params.splice(1, 0, current);
        return current + " = blockHelperMissing.call(" + params.join(", ") + ")";
      });
    },

    // [ambiguousBlockValue]
    //
    // On stack, before: hash, inverse, program, value
    // Compiler value, before: lastHelper=value of last found helper, if any
    // On stack, after, if no lastHelper: same as [blockValue]
    // On stack, after, if lastHelper: value
    ambiguousBlockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      var current = this.topStack();
      params.splice(1, 0, current);

      this.source.push("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
    },

    // [appendContent]
    //
    // On stack, before: ...
    // On stack, after: ...
    //
    // Appends the string value of `content` to the current buffer
    appendContent: function(content) {
      this.source.push(this.appendToBuffer(this.quotedString(content)));
    },

    // [append]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Coerces `value` to a String and appends it to the current buffer.
    //
    // If `value` is truthy, or 0, it is coerced into a string and appended
    // Otherwise, the empty string is appended
    append: function() {
      var local = this.popStack();
      this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
      if (this.environment.isSimple) {
        this.source.push("else { " + this.appendToBuffer("''") + " }");
      }
    },

    // [appendEscaped]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Escape `value` and append it to the buffer
    appendEscaped: function() {
      var opcode = this.nextOpcode(), extra = "";
      this.context.aliases.escapeExpression = 'this.escapeExpression';

      if(opcode && opcode.opcode === 'appendContent') {
        extra = " + " + this.quotedString(opcode.args[0]);
        this.eat(opcode);
      }

      this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")" + extra));
    },

    // [getContext]
    //
    // On stack, before: ...
    // On stack, after: ...
    // Compiler value, after: lastContext=depth
    //
    // Set the value of the `lastContext` compiler value to the depth
    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;
      }
    },

    // [lookupOnContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext[name], ...
    //
    // Looks up the value of `name` on the current context and pushes
    // it onto the stack.
    lookupOnContext: function(name) {
      this.pushStack(this.nameLookup('depth' + this.lastContext, name, 'context'));
    },

    // [pushContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext, ...
    //
    // Pushes the value of the current context onto the stack.
    pushContext: function() {
      this.pushStackLiteral('depth' + this.lastContext);
    },

    // [resolvePossibleLambda]
    //
    // On stack, before: value, ...
    // On stack, after: resolved value, ...
    //
    // If the `value` is a lambda, replace it on the stack by
    // the return value of the lambda
    resolvePossibleLambda: function() {
      this.context.aliases.functionType = '"function"';

      this.replaceStack(function(current) {
        return "typeof " + current + " === functionType ? " + current + "() : " + current;
      });
    },

    // [lookup]
    //
    // On stack, before: value, ...
    // On stack, after: value[name], ...
    //
    // Replace the value on the stack with the result of looking
    // up `name` on `value`
    lookup: function(name) {
      this.replaceStack(function(current) {
        return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, 'context');
      });
    },

    // [pushStringParam]
    //
    // On stack, before: ...
    // On stack, after: string, currentContext, ...
    //
    // This opcode is designed for use in string mode, which
    // provides the string value of a parameter along with its
    // depth rather than resolving it immediately.
    pushStringParam: function(string) {
      this.pushStackLiteral('depth' + this.lastContext);
      this.pushString(string);
    },

    // [pushString]
    //
    // On stack, before: ...
    // On stack, after: quotedString(string), ...
    //
    // Push a quoted version of `string` onto the stack
    pushString: function(string) {
      this.pushStackLiteral(this.quotedString(string));
    },

    // [push]
    //
    // On stack, before: ...
    // On stack, after: expr, ...
    //
    // Push an expression onto the stack
    push: function(expr) {
      this.pushStack(expr);
    },

    // [pushLiteral]
    //
    // On stack, before: ...
    // On stack, after: value, ...
    //
    // Pushes a value onto the stack. This operation prevents
    // the compiler from creating a temporary variable to hold
    // it.
    pushLiteral: function(value) {
      this.pushStackLiteral(value);
    },

    // [pushProgram]
    //
    // On stack, before: ...
    // On stack, after: program(guid), ...
    //
    // Push a program expression onto the stack. This takes
    // a compile-time guid and converts it into a runtime-accessible
    // expression.
    pushProgram: function(guid) {
      if (guid != null) {
        this.pushStackLiteral(this.programExpression(guid));
      } else {
        this.pushStackLiteral(null);
      }
    },

    // [invokeHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // Pops off the helper's parameters, invokes the helper,
    // and pushes the helper's return value onto the stack.
    //
    // If the helper is not found, `helperMissing` is called.
    invokeHelper: function(paramSize, name) {
      this.context.aliases.helperMissing = 'helpers.helperMissing';

      var helper = this.lastHelper = this.setupHelper(paramSize, name);
      this.register('foundHelper', helper.name);

      this.pushStack("foundHelper ? foundHelper.call(" +
        helper.callParams + ") " + ": helperMissing.call(" +
        helper.helperMissingParams + ")");
    },

    // [invokeKnownHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // This operation is used when the helper is known to exist,
    // so a `helperMissing` fallback is not required.
    invokeKnownHelper: function(paramSize, name) {
      var helper = this.setupHelper(paramSize, name);
      this.pushStack(helper.name + ".call(" + helper.callParams + ")");
    },

    // [invokeAmbiguous]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of disambiguation
    //
    // This operation is used when an expression like `{{foo}}`
    // is provided, but we don't know at compile-time whether it
    // is a helper or a path.
    //
    // This operation emits more code than the other options,
    // and can be avoided by passing the `knownHelpers` and
    // `knownHelpersOnly` flags at compile-time.
    invokeAmbiguous: function(name) {
      this.context.aliases.functionType = '"function"';

      this.pushStackLiteral('{}');
      var helper = this.setupHelper(0, name);

      var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');
      this.register('foundHelper', helperName);

      var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');
      var nextStack = this.nextStack();

      this.source.push('if (foundHelper) { ' + nextStack + ' = foundHelper.call(' + helper.callParams + '); }');
      this.source.push('else { ' + nextStack + ' = ' + nonHelper + '; ' + nextStack + ' = typeof ' + nextStack + ' === functionType ? ' + nextStack + '() : ' + nextStack + '; }');
    },

    // [invokePartial]
    //
    // On stack, before: context, ...
    // On stack after: result of partial invocation
    //
    // This operation pops off a context, invokes a partial with that context,
    // and pushes the result of the invocation back.
    invokePartial: function(name) {
      var params = [this.nameLookup('partials', name, 'partial'), "'" + name + "'", this.popStack(), "helpers", "partials"];

      if (this.options.data) {
        params.push("data");
      }

      this.context.aliases.self = "this";
      this.pushStack("self.invokePartial(" + params.join(", ") + ");");
    },

    // [assignToHash]
    //
    // On stack, before: value, hash, ...
    // On stack, after: hash, ...
    //
    // Pops a value and hash off the stack, assigns `hash[key] = value`
    // and pushes the hash back onto the stack.
    assignToHash: function(key) {
      var value = this.popStack();
      var hash = this.topStack();

      this.source.push(hash + "['" + key + "'] = " + value + ";");
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
        var index = this.context.programs.length;
        child.index = index;
        child.name = 'program' + index;
        this.context.programs[index] = compiler.compile(child, options, this.context);
      }
    },

    programExpression: function(guid) {
      this.context.aliases.self = "this";

      if(guid == null) {
        return "self.noop";
      }

      var child = this.environment.children[guid],
          depths = child.depths.list, depth;

      var programParams = [child.index, child.name, "data"];

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("depth0"); }
        else { programParams.push("depth" + (depth - 1)); }
      }

      if(depths.length === 0) {
        return "self.program(" + programParams.join(", ") + ")";
      } else {
        programParams.shift();
        return "self.programWithDepth(" + programParams.join(", ") + ")";
      }
    },

    register: function(name, val) {
      this.useRegister(name);
      this.source.push(name + " = " + val + ";");
    },

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },

    pushStackLiteral: function(item) {
      this.compileStack.push(new Literal(item));
      return item;
    },

    pushStack: function(item) {
      this.source.push(this.incrStack() + " = " + item + ";");
      this.compileStack.push("stack" + this.stackSlot);
      return "stack" + this.stackSlot;
    },

    replaceStack: function(callback) {
      var item = callback.call(this, this.topStack());

      this.source.push(this.topStack() + " = " + item + ";");
      return "stack" + this.stackSlot;
    },

    nextStack: function(skipCompileStack) {
      var name = this.incrStack();
      this.compileStack.push("stack" + this.stackSlot);
      return name;
    },

    incrStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return "stack" + this.stackSlot;
    },

    popStack: function() {
      var item = this.compileStack.pop();

      if (item instanceof Literal) {
        return item.value;
      } else {
        this.stackSlot--;
        return item;
      }
    },

    topStack: function() {
      var item = this.compileStack[this.compileStack.length - 1];

      if (item instanceof Literal) {
        return item.value;
      } else {
        return item;
      }
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r') + '"';
    },

    setupHelper: function(paramSize, name) {
      var params = [];
      this.setupParams(paramSize, params);
      var foundHelper = this.nameLookup('helpers', name, 'helper');

      return {
        params: params,
        name: foundHelper,
        callParams: ["depth0"].concat(params).join(", "),
        helperMissingParams: ["depth0", this.quotedString(name)].concat(params).join(", ")
      };
    },

    // the params and contexts arguments are passed in arrays
    // to fill in
    setupParams: function(paramSize, params) {
      var options = [], contexts = [], param, inverse, program;

      options.push("hash:" + this.popStack());

      inverse = this.popStack();
      program = this.popStack();

      // Avoid setting fn and inverse if neither are set. This allows
      // helpers to do a check for `if (options.fn)`
      if (program || inverse) {
        if (!program) {
          this.context.aliases.self = "this";
          program = "self.noop";
        }

        if (!inverse) {
         this.context.aliases.self = "this";
          inverse = "self.noop";
        }

        options.push("inverse:" + inverse);
        options.push("fn:" + program);
      }

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          contexts.push(this.popStack());
        }
      }

      if (this.options.stringParams) {
        options.push("contexts:[" + contexts.join(",") + "]");
      }

      if(this.options.data) {
        options.push("data:data");
      }

      params.push("{" + options.join(",") + "}");
      return params.join(", ");
    }
  };

  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

  JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
    if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
      return true;
    }
    return false;
  };

})(Handlebars.Compiler, Handlebars.JavaScriptCompiler);

Handlebars.precompile = function(string, options) {
  options = options || {};

  var ast = Handlebars.parse(string);
  var environment = new Handlebars.Compiler().compile(ast, options);
  return new Handlebars.JavaScriptCompiler().compile(environment, options);
};

Handlebars.compile = function(string, options) {
  options = options || {};

  var compiled;
  function compile() {
    var ast = Handlebars.parse(string);
    var environment = new Handlebars.Compiler().compile(ast, options);
    var templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);
    return Handlebars.template(templateSpec);
  }

  // Template is only compiled on first use and cached after that point.
  return function(context, options) {
    if (!compiled) {
      compiled = compile();
    }
    return compiled.call(this, context, options);
  };
};
;
// lib/handlebars/runtime.js
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop
    };

    return function(context, options) {
      options = options || {};
      return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial);
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;
// Version: v0.9.8.1-437-g68d406e
// Last commit: 68d406e (2012-06-25 14:59:55 -0700)


(function() {
/*global __fail__*/

if ('undefined' === typeof Ember) {
  Ember = {};

  if ('undefined' !== typeof window) {
    window.Em = window.Ember = Em = Ember;
  }
}

/**
  Define an assertion that will throw an exception if the condition is not
  met.  Ember build tools will remove any calls to Ember.assert() when
  doing a production build. Example:

      // Test for truthiness
      Ember.assert('Must pass a valid object', obj);
      // Fail unconditionally
      Ember.assert('This code path should never be run')

  @static
  @function
  @param {String} desc
    A description of the assertion.  This will become the text of the Error
    thrown if the assertion fails.

  @param {Boolean} test
    Must be truthy for the assertion to pass. If falsy, an exception will be
    thrown.
*/
Ember.assert = function(desc, test) {
  if (!test) throw new Error("assertion failed: "+desc);
};


/**
  Display a warning with the provided message. Ember build tools will
  remove any calls to Ember.warn() when doing a production build.

  @static
  @function
  @param {String} message
    A warning to display.

  @param {Boolean} test
    An optional boolean. If falsy, the warning will be displayed.
*/
Ember.warn = function(message, test) {
  if (!test) {
    Ember.Logger.warn("WARNING: "+message);
    if ('trace' in Ember.Logger) Ember.Logger.trace();
  }
};

/**
  Display a deprecation warning with the provided message and a stack trace
  (Chrome and Firefox only). Ember build tools will remove any calls to
  Ember.deprecate() when doing a production build.

  @static
  @function
  @param {String} message
    A description of the deprecation.

  @param {Boolean} test
    An optional boolean. If falsy, the deprecation will be displayed.
*/
Ember.deprecate = function(message, test) {
  if (Ember && Ember.TESTING_DEPRECATION) { return; }

  if (arguments.length === 1) { test = false; }
  if (test) { return; }

  if (Ember && Ember.ENV.RAISE_ON_DEPRECATION) { throw new Error(message); }

  var error, stackStr = '';

  // When using new Error, we can't do the arguments check for Chrome. Alternatives are welcome
  try { __fail__.fail(); } catch (e) { error = e; }

  if (error.stack) {
    var stack;

    if (error['arguments']) {
      // Chrome
      stack = error.stack.replace(/^\s+at\s+/gm, '').
                          replace(/^([^\(]+?)([\n$])/gm, '{anonymous}($1)$2').
                          replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}($1)').split('\n');
      stack.shift();
    } else {
      // Firefox
      stack = error.stack.replace(/(?:\n@:0)?\s+$/m, '').
                          replace(/^\(/gm, '{anonymous}(').split('\n');
    }

    stackStr = "\n    " + stack.slice(2).join("\n    ");
  }

  Ember.Logger.warn("DEPRECATION: "+message+stackStr);
};



/**
  Display a deprecation warning with the provided message and a stack trace
  (Chrome and Firefox only) when the wrapped method is called.

  Ember build tools will not remove calls to Ember.deprecateFunc(), though
  no warnings will be shown in production.

  @static
  @function
  @param {String} message
    A description of the deprecation.

  @param {Function} func
    The function to be deprecated.
*/
Ember.deprecateFunc = function(message, func) {
  return function() {
    Ember.deprecate(message);
    return func.apply(this, arguments);
  };
};


window.ember_assert         = Ember.deprecateFunc("ember_assert is deprecated. Please use Ember.assert instead.",               Ember.assert);
window.ember_warn           = Ember.deprecateFunc("ember_warn is deprecated. Please use Ember.warn instead.",                   Ember.warn);
window.ember_deprecate      = Ember.deprecateFunc("ember_deprecate is deprecated. Please use Ember.deprecate instead.",         Ember.deprecate);
window.ember_deprecateFunc  = Ember.deprecateFunc("ember_deprecateFunc is deprecated. Please use Ember.deprecateFunc instead.", Ember.deprecateFunc);

})();

// Version: v0.9.8.1-437-g68d406e
// Last commit: 68d406e (2012-06-25 14:59:55 -0700)


(function() {
// ==========================================================================
// Project:  Ember Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Em:true ENV */

if ('undefined' === typeof Ember) {
  // Create core object. Make it act like an instance of Ember.Namespace so that
  // objects assigned to it are given a sane string representation.
  Ember = {};
}

/**
  @namespace
  @name Ember
  @version 1.0.pre

  All Ember methods and functions are defined inside of this namespace.
  You generally should not add new properties to this namespace as it may be
  overwritten by future versions of Ember.

  You can also use the shorthand "Em" instead of "Ember".

  Ember-Runtime is a framework that provides core functions for
  Ember including cross-platform functions, support for property
  observing and objects. Its focus is on small size and performance. You can
  use this in place of or along-side other cross-platform libraries such as
  jQuery.

  The core Runtime framework is based on the jQuery API with a number of
  performance optimizations.
*/

// aliases needed to keep minifiers from removing the global context
if ('undefined' !== typeof window) {
  window.Em = window.Ember = Em = Ember;
}

// Make sure these are set whether Ember was already defined or not

Ember.isNamespace = true;

Ember.toString = function() { return "Ember"; };


/**
  @static
  @type String
  @default '1.0.pre'
  @constant
*/
Ember.VERSION = '1.0.pre';

/**
  @static
  @type Hash
  @constant

  Standard environmental variables.  You can define these in a global `ENV`
  variable before loading Ember to control various configuration
  settings.
*/
Ember.ENV = 'undefined' === typeof ENV ? {} : ENV;

Ember.config = Ember.config || {};

// ..........................................................
// BOOTSTRAP
//

/**
  @static
  @type Boolean
  @default true
  @constant

  Determines whether Ember should enhances some built-in object
  prototypes to provide a more friendly API.  If enabled, a few methods
  will be added to Function, String, and Array.  Object.prototype will not be
  enhanced, which is the one that causes most troubles for people.

  In general we recommend leaving this option set to true since it rarely
  conflicts with other code.  If you need to turn it off however, you can
  define an ENV.EXTEND_PROTOTYPES config to disable it.
*/
Ember.EXTEND_PROTOTYPES = (Ember.ENV.EXTEND_PROTOTYPES !== false);


/**
  @static
  @type Boolean
  @default Ember.EXTEND_PROTOTYPES
  @constant

  Determines whether Ember should add ECMAScript 5 shims to older browsers.
*/
Ember.SHIM_ES5 = (Ember.ENV.SHIM_ES5 === false) ? false : Ember.EXTEND_PROTOTYPES;


/**
  @static
  @type Boolean
  @default true
  @constant

  Determines whether computed properties are cacheable by default.
  This option will be removed for the 1.1 release.

  When caching is enabled by default, you can use `volatile()` to disable
  caching on individual computed properties.
*/
Ember.CP_DEFAULT_CACHEABLE = (Ember.ENV.CP_DEFAULT_CACHEABLE !== false);

/**
  @static
  @type Boolean
  @default true
  @constant

  Determines whether views render their templates using themselves
  as the context, or whether it is inherited from the parent. This option
  will be removed in the 1.1 release.

  If you need to update your application to use the new context rules, simply
  prefix property access with `view.`:

      // Before:
      {{#each App.photosController}}
        Photo Title: {{title}}
        {{#view App.InfoView contentBinding="this"}}
          {{content.date}}
          {{content.cameraType}}
          {{otherViewProperty}}
        {{/view}}
      {{/each}}

      // After:
      {{#each App.photosController}}
        Photo Title: {{title}}
        {{#view App.InfoView}}
          {{date}}
          {{cameraType}}
          {{view.otherViewProperty}}
        {{/view}}
      {{/each}}
*/
Ember.VIEW_PRESERVES_CONTEXT = (Ember.ENV.VIEW_PRESERVES_CONTEXT !== false);

/**
  Empty function.  Useful for some operations.

  @returns {Object}
  @private
*/
Ember.K = function() { return this; };

/**
  @namespace
  @name window
  @description The global window object
*/


// Stub out the methods defined by the ember-debug package in case it's not loaded

if ('undefined' === typeof Ember.assert) { Ember.assert = Ember.K; }
if ('undefined' === typeof Ember.warn) { Ember.warn = Ember.K; }
if ('undefined' === typeof Ember.deprecate) { Ember.deprecate = Ember.K; }
if ('undefined' === typeof Ember.deprecateFunc) {
  Ember.deprecateFunc = function(_, func) { return func; };
}

// These are deprecated but still supported

if ('undefined' === typeof ember_assert) { window.ember_assert = Ember.K; }
if ('undefined' === typeof ember_warn) { window.ember_warn = Ember.K; }
if ('undefined' === typeof ember_deprecate) { window.ember_deprecate = Ember.K; }
if ('undefined' === typeof ember_deprecateFunc) {
  /** @private */
  window.ember_deprecateFunc = function(_, func) { return func; };
}


// ..........................................................
// LOGGER
//

/**
  @class

  Inside Ember-Metal, simply uses the window.console object.
  Override this to provide more robust logging functionality.
*/
Ember.Logger = window.console || { log: Ember.K, warn: Ember.K, error: Ember.K };

})();



(function() {
/*jshint newcap:false*/

// NOTE: There is a bug in jshint that doesn't recognize `Object()` without `new`
// as being ok unless both `newcap:false` and not `use strict`.
// https://github.com/jshint/jshint/issues/392

// Testing this is not ideal, but we want to use native functions
// if available, but not to use versions created by libraries like Prototype
/** @private */
var isNativeFunc = function(func) {
  // This should probably work in all browsers likely to have ES5 array methods
  return func && Function.prototype.toString.call(func).indexOf('[native code]') > -1;
};

// From: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/map
/** @private */
var arrayMap = isNativeFunc(Array.prototype.map) ? Array.prototype.map : function(fun /*, thisp */) {
  //"use strict";

  if (this === void 0 || this === null) {
    throw new TypeError();
  }

  var t = Object(this);
  var len = t.length >>> 0;
  if (typeof fun !== "function") {
    throw new TypeError();
  }

  var res = new Array(len);
  var thisp = arguments[1];
  for (var i = 0; i < len; i++) {
    if (i in t) {
      res[i] = fun.call(thisp, t[i], i, t);
    }
  }

  return res;
};

// From: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach
/** @private */
var arrayForEach = isNativeFunc(Array.prototype.forEach) ? Array.prototype.forEach : function(fun /*, thisp */) {
  //"use strict";

  if (this === void 0 || this === null) {
    throw new TypeError();
  }

  var t = Object(this);
  var len = t.length >>> 0;
  if (typeof fun !== "function") {
    throw new TypeError();
  }

  var thisp = arguments[1];
  for (var i = 0; i < len; i++) {
    if (i in t) {
      fun.call(thisp, t[i], i, t);
    }
  }
};

/** @private */
var arrayIndexOf = isNativeFunc(Array.prototype.indexOf) ? Array.prototype.indexOf : function (obj, fromIndex) {
  if (fromIndex === null || fromIndex === undefined) { fromIndex = 0; }
  else if (fromIndex < 0) { fromIndex = Math.max(0, this.length + fromIndex); }
  for (var i = fromIndex, j = this.length; i < j; i++) {
    if (this[i] === obj) { return i; }
  }
  return -1;
};

Ember.ArrayPolyfills = {
  map: arrayMap,
  forEach: arrayForEach,
  indexOf: arrayIndexOf
};

var utils = Ember.EnumerableUtils = {
  map: function(obj, callback, thisArg) {
    return obj.map ? obj.map.call(obj, callback, thisArg) : arrayMap.call(obj, callback, thisArg);
  },

  forEach: function(obj, callback, thisArg) {
    return obj.forEach ? obj.forEach.call(obj, callback, thisArg) : arrayForEach.call(obj, callback, thisArg);
  },

  indexOf: function(obj, element, index) {
    return obj.indexOf ? obj.indexOf.call(obj, element, index) : arrayIndexOf.call(obj, element, index);
  },

  indexesOf: function(obj, elements) {
    return elements === undefined ? [] : utils.map(elements, function(item) {
      return utils.indexOf(obj, item);
    });
  },

  removeObject: function(array, item) {
    var index = utils.indexOf(array, item);
    if (index !== -1) { array.splice(index, 1); }
  }
};


if (Ember.SHIM_ES5) {
  if (!Array.prototype.map) {
    /** @private */
    Array.prototype.map = arrayMap;
  }

  if (!Array.prototype.forEach) {
    /** @private */
    Array.prototype.forEach = arrayForEach;
  }

  if (!Array.prototype.indexOf) {
    /** @private */
    Array.prototype.indexOf = arrayIndexOf;
  }
}

})();



(function() {
// ==========================================================================
// Project:  Ember Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Node */
/**
  @class

  Platform specific methods and feature detectors needed by the framework.

  @name Ember.platform
*/
var platform = Ember.platform = {};

/**
  Identical to Object.create().  Implements if not available natively.
  @memberOf Ember.platform
  @name create
*/
Ember.create = Object.create;

if (!Ember.create) {
  /** @private */
  var K = function() {};

  Ember.create = function(obj, props) {
    K.prototype = obj;
    obj = new K();
    if (props) {
      K.prototype = obj;
      for (var prop in props) {
        K.prototype[prop] = props[prop].value;
      }
      obj = new K();
    }
    K.prototype = null;

    return obj;
  };

  Ember.create.isSimulated = true;
}

/** @private */
var defineProperty = Object.defineProperty;
var canRedefineProperties, canDefinePropertyOnDOM;

// Catch IE8 where Object.defineProperty exists but only works on DOM elements
if (defineProperty) {
  try {
    defineProperty({}, 'a',{get:function(){}});
  } catch (e) {
    /** @private */
    defineProperty = null;
  }
}

if (defineProperty) {
  // Detects a bug in Android <3.2 where you cannot redefine a property using
  // Object.defineProperty once accessors have already been set.
  /** @private */
  canRedefineProperties = (function() {
    var obj = {};

    defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      get: function() { },
      set: function() { }
    });

    defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: true
    });

    return obj.a === true;
  })();

  // This is for Safari 5.0, which supports Object.defineProperty, but not
  // on DOM nodes.
  /** @private */
  canDefinePropertyOnDOM = (function(){
    try {
      defineProperty(document.createElement('div'), 'definePropertyOnDOM', {});
      return true;
    } catch(e) { }

    return false;
  })();

  if (!canRedefineProperties) {
    /** @private */
    defineProperty = null;
  } else if (!canDefinePropertyOnDOM) {
    /** @private */
    defineProperty = function(obj, keyName, desc){
      var isNode;

      if (typeof Node === "object") {
        isNode = obj instanceof Node;
      } else {
        isNode = typeof obj === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName === "string";
      }

      if (isNode) {
        // TODO: Should we have a warning here?
        return (obj[keyName] = desc.value);
      } else {
        return Object.defineProperty(obj, keyName, desc);
      }
    };
  }
}

/**
  Identical to Object.defineProperty().  Implements as much functionality
  as possible if not available natively.

  @memberOf Ember.platform
  @name defineProperty
  @param {Object} obj The object to modify
  @param {String} keyName property name to modify
  @param {Object} desc descriptor hash
  @returns {void}
*/
platform.defineProperty = defineProperty;

/**
  Set to true if the platform supports native getters and setters.

  @memberOf Ember.platform
  @name hasPropertyAccessors
*/
platform.hasPropertyAccessors = true;

if (!platform.defineProperty) {
  platform.hasPropertyAccessors = false;

  platform.defineProperty = function(obj, keyName, desc) {
    if (!desc.get) { obj[keyName] = desc.value; }
  };

  platform.defineProperty.isSimulated = true;
}

})();



(function() {
// ==========================================================================
// Project:  Ember Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var o_defineProperty = Ember.platform.defineProperty,
    o_create = Ember.create,
    // Used for guid generation...
    GUID_KEY = '__ember'+ (+ new Date()),
    uuid         = 0,
    numberCache  = [],
    stringCache  = {};

/**
  @private
  @static
  @type String
  @constant

  A unique key used to assign guids and other private metadata to objects.
  If you inspect an object in your browser debugger you will often see these.
  They can be safely ignored.

  On browsers that support it, these properties are added with enumeration
  disabled so they won't show up when you iterate over your properties.
*/
Ember.GUID_KEY = GUID_KEY;

/**
  @private

  Generates a new guid, optionally saving the guid to the object that you
  pass in.  You will rarely need to use this method.  Instead you should
  call Ember.guidFor(obj), which return an existing guid if available.

  @param {Object} obj
    Optional object the guid will be used for.  If passed in, the guid will
    be saved on the object and reused whenever you pass the same object
    again.

    If no object is passed, just generate a new guid.

  @param {String} prefix
    Optional prefix to place in front of the guid.  Useful when you want to
    separate the guid into separate namespaces.

  @returns {String} the guid
*/
Ember.generateGuid = function(obj, prefix) {
  if (!prefix) prefix = 'ember';
  var ret = (prefix + (uuid++));
  if (obj) {
    o_defineProperty(obj, GUID_KEY, {
      configurable: true,
      writable: true,
      value: ret
    });
  }

  return ret ;
};

/**
  @private

  Returns a unique id for the object.  If the object does not yet have
  a guid, one will be assigned to it.  You can call this on any object,
  Ember.Object-based or not, but be aware that it will add a _guid property.

  You can also use this method on DOM Element objects.

  @method
  @param obj {Object} any object, string, number, Element, or primitive
  @returns {String} the unique guid for this instance.
*/
Ember.guidFor = function(obj) {

  // special cases where we don't want to add a key to object
  if (obj === undefined) return "(undefined)";
  if (obj === null) return "(null)";

  var cache, ret;
  var type = typeof obj;

  // Don't allow prototype changes to String etc. to change the guidFor
  switch(type) {
    case 'number':
      ret = numberCache[obj];
      if (!ret) ret = numberCache[obj] = 'nu'+obj;
      return ret;

    case 'string':
      ret = stringCache[obj];
      if (!ret) ret = stringCache[obj] = 'st'+(uuid++);
      return ret;

    case 'boolean':
      return obj ? '(true)' : '(false)';

    default:
      if (obj[GUID_KEY]) return obj[GUID_KEY];
      if (obj === Object) return '(Object)';
      if (obj === Array)  return '(Array)';
      return Ember.generateGuid(obj, 'ember');
  }
};


// ..........................................................
// META
//

var META_DESC = {
  writable:    true,
  configurable: false,
  enumerable:  false,
  value: null
};

var META_KEY = Ember.GUID_KEY+'_meta';

/**
  The key used to store meta information on object for property observing.

  @static
  @type String
*/
Ember.META_KEY = META_KEY;

// Placeholder for non-writable metas.
var EMPTY_META = {
  descs: {},
  watching: {}
};

if (Object.freeze) Object.freeze(EMPTY_META);

var createMeta = Ember.platform.defineProperty.isSimulated ? o_create : (function(meta) { return meta; });

/**
  @private
  @function

  Retrieves the meta hash for an object.  If 'writable' is true ensures the
  hash is writable for this object as well.

  The meta object contains information about computed property descriptors as
  well as any watched properties and other information.  You generally will
  not access this information directly but instead work with higher level
  methods that manipulate this hash indirectly.

  @param {Object} obj
    The object to retrieve meta for

  @param {Boolean} writable
    Pass false if you do not intend to modify the meta hash, allowing the
    method to avoid making an unnecessary copy.

  @returns {Hash}
*/
Ember.meta = function meta(obj, writable) {

  var ret = obj[META_KEY];
  if (writable===false) return ret || EMPTY_META;

  if (!ret) {
    o_defineProperty(obj, META_KEY, META_DESC);
    ret = obj[META_KEY] = createMeta({
      descs: {},
      watching: {},
      values: {},
      cache:  {},
      source: obj
    });

    // make sure we don't accidentally try to create constructor like desc
    ret.descs.constructor = null;

  } else if (ret.source !== obj) {
    ret = o_create(ret);
    ret.descs    = o_create(ret.descs);
    ret.values   = o_create(ret.values);
    ret.watching = o_create(ret.watching);
    ret.cache    = {};
    ret.source   = obj;

    o_defineProperty(obj, META_KEY, META_DESC);
    ret = obj[META_KEY] = createMeta(ret);
  }
  return ret;
};

Ember.getMeta = function getMeta(obj, property) {
  var meta = Ember.meta(obj, false);
  return meta[property];
};

Ember.setMeta = function setMeta(obj, property, value) {
  var meta = Ember.meta(obj, true);
  meta[property] = value;
  return value;
};

/**
  @private

  In order to store defaults for a class, a prototype may need to create
  a default meta object, which will be inherited by any objects instantiated
  from the class's constructor.

  However, the properties of that meta object are only shallow-cloned,
  so if a property is a hash (like the event system's `listeners` hash),
  it will by default be shared across all instances of that class.

  This method allows extensions to deeply clone a series of nested hashes or
  other complex objects. For instance, the event system might pass
  ['listeners', 'foo:change', 'ember157'] to `prepareMetaPath`, which will
  walk down the keys provided.

  For each key, if the key does not exist, it is created. If it already
  exists and it was inherited from its constructor, the constructor's
  key is cloned.

  You can also pass false for `writable`, which will simply return
  undefined if `prepareMetaPath` discovers any part of the path that
  shared or undefined.

  @param {Object} obj The object whose meta we are examining
  @param {Array} path An array of keys to walk down
  @param {Boolean} writable whether or not to create a new meta
    (or meta property) if one does not already exist or if it's
    shared with its constructor
*/
Ember.metaPath = function(obj, path, writable) {
  var meta = Ember.meta(obj, writable), keyName, value;

  for (var i=0, l=path.length; i<l; i++) {
    keyName = path[i];
    value = meta[keyName];

    if (!value) {
      if (!writable) { return undefined; }
      value = meta[keyName] = { __ember_source__: obj };
    } else if (value.__ember_source__ !== obj) {
      if (!writable) { return undefined; }
      value = meta[keyName] = o_create(value);
      value.__ember_source__ = obj;
    }

    meta = value;
  }

  return value;
};

/**
  @private

  Wraps the passed function so that `this._super` will point to the superFunc
  when the function is invoked.  This is the primitive we use to implement
  calls to super.

  @param {Function} func
    The function to call

  @param {Function} superFunc
    The super function.

  @returns {Function} wrapped function.
*/
Ember.wrap = function(func, superFunc) {

  function K() {}

  var newFunc = function() {
    var ret, sup = this._super;
    this._super = superFunc || K;
    ret = func.apply(this, arguments);
    this._super = sup;
    return ret;
  };

  newFunc.base = func;
  return newFunc;
};

/**
  Returns true if the passed object is an array or Array-like.

  Ember Array Protocol:

    - the object has an objectAt property
    - the object is a native Array
    - the object is an Object, and has a length property

  Unlike Ember.typeOf this method returns true even if the passed object is
  not formally array but appears to be array-like (i.e. implements Ember.Array)

      Ember.isArray(); // false
      Ember.isArray([]); // true
      Ember.isArray( Ember.ArrayProxy.create({ content: [] }) ); // true

  @param {Object} obj The object to test
  @returns {Boolean}
*/
Ember.isArray = function(obj) {
  if (!obj || obj.setInterval) { return false; }
  if (Array.isArray && Array.isArray(obj)) { return true; }
  if (Ember.Array && Ember.Array.detect(obj)) { return true; }
  if ((obj.length !== undefined) && 'object'===typeof obj) { return true; }
  return false;
};

/**
  Forces the passed object to be part of an array.  If the object is already
  an array or array-like, returns the object.  Otherwise adds the object to
  an array.  If obj is null or undefined, returns an empty array.

      Ember.makeArray();          => []
      Ember.makeArray(null);      => []
      Ember.makeArray(undefined); => []
      Ember.makeArray('lindsay'); => ['lindsay']
      Ember.makeArray([1,2,42]);  => [1,2,42]

      var controller = Ember.ArrayProxy.create({ content: [] });
      Ember.makeArray(controller) === controller;   => true

  @param {Object} obj the object
  @returns {Array}
*/
Ember.makeArray = function(obj) {
  if (obj === null || obj === undefined) { return []; }
  return Ember.isArray(obj) ? obj : [obj];
};

})();



(function() {
/**
  JavaScript (before ES6) does not have a Map implementation. Objects,
  which are often used as dictionaries, may only have Strings as keys.

  Because Ember has a way to get a unique identifier for every object
  via `Ember.guidFor`, we can implement a performant Map with arbitrary
  keys. Because it is commonly used in low-level bookkeeping, Map is
  implemented as a pure JavaScript object for performance.

  This implementation follows the current iteration of the ES6 proposal
  for maps (http://wiki.ecmascript.org/doku.php?id=harmony:simple_maps_and_sets),
  with two exceptions. First, because we need our implementation to be
  pleasant on older browsers, we do not use the `delete` name (using
  `remove` instead). Second, as we do not have the luxury of in-VM
  iteration, we implement a forEach method for iteration.

  Map is mocked out to look like an Ember object, so you can do
  `Ember.Map.create()` for symmetry with other Ember classes.
*/
/** @private */
var guidFor = Ember.guidFor,
    indexOf = Ember.ArrayPolyfills.indexOf;

var copy = function(obj) {
  var output = {};

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) { output[prop] = obj[prop]; }
  }

  return output;
};

var copyMap = function(original, newObject) {
  var keys = original.keys.copy(),
      values = copy(original.values);

  newObject.keys = keys;
  newObject.values = values;

  return newObject;
};

// This class is used internally by Ember.js and Ember Data.
// Please do not use it at this time. We plan to clean it up
// and add many tests soon.
var OrderedSet = Ember.OrderedSet = function() {
  this.clear();
};

OrderedSet.create = function() {
  return new OrderedSet();
};

OrderedSet.prototype = {
  clear: function() {
    this.presenceSet = {};
    this.list = [];
  },

  add: function(obj) {
    var guid = guidFor(obj),
        presenceSet = this.presenceSet,
        list = this.list;

    if (guid in presenceSet) { return; }

    presenceSet[guid] = true;
    list.push(obj);
  },

  remove: function(obj) {
    var guid = guidFor(obj),
        presenceSet = this.presenceSet,
        list = this.list;

    delete presenceSet[guid];

    var index = indexOf.call(list, obj);
    if (index > -1) {
      list.splice(index, 1);
    }
  },

  isEmpty: function() {
    return this.list.length === 0;
  },

  forEach: function(fn, self) {
    // allow mutation during iteration
    var list = this.list.slice();

    for (var i = 0, j = list.length; i < j; i++) {
      fn.call(self, list[i]);
    }
  },

  toArray: function() {
    return this.list.slice();
  },

  copy: function() {
    var set = new OrderedSet();

    set.presenceSet = copy(this.presenceSet);
    set.list = this.list.slice();

    return set;
  }
};

/**
  A Map stores values indexed by keys. Unlike JavaScript's
  default Objects, the keys of a Map can be any JavaScript
  object.

  Internally, a Map has two data structures:

    `keys`: an OrderedSet of all of the existing keys
    `values`: a JavaScript Object indexed by the
      Ember.guidFor(key)

  When a key/value pair is added for the first time, we
  add the key to the `keys` OrderedSet, and create or
  replace an entry in `values`. When an entry is deleted,
  we delete its entry in `keys` and `values`.
*/

/** @private */
var Map = Ember.Map = function() {
  this.keys = Ember.OrderedSet.create();
  this.values = {};
};

Map.create = function() {
  return new Map();
};

Map.prototype = {
  /**
    Retrieve the value associated with a given key.

    @param {anything} key
    @return {anything} the value associated with the key, or undefined
  */
  get: function(key) {
    var values = this.values,
        guid = guidFor(key);

    return values[guid];
  },

  /**
    Adds a value to the map. If a value for the given key has already been
    provided, the new value will replace the old value.

    @param {anything} key
    @param {anything} value
  */
  set: function(key, value) {
    var keys = this.keys,
        values = this.values,
        guid = guidFor(key);

    keys.add(key);
    values[guid] = value;
  },

  /**
    Removes a value from the map for an associated key.

    @param {anything} key
    @returns {Boolean} true if an item was removed, false otherwise
  */
  remove: function(key) {
    // don't use ES6 "delete" because it will be annoying
    // to use in browsers that are not ES6 friendly;
    var keys = this.keys,
        values = this.values,
        guid = guidFor(key),
        value;

    if (values.hasOwnProperty(guid)) {
      keys.remove(key);
      value = values[guid];
      delete values[guid];
      return true;
    } else {
      return false;
    }
  },

  /**
    Check whether a key is present.

    @param {anything} key
    @returns {Boolean} true if the item was present, false otherwise
  */
  has: function(key) {
    var values = this.values,
        guid = guidFor(key);

    return values.hasOwnProperty(guid);
  },

  /**
    Iterate over all the keys and values. Calls the function once
    for each key, passing in the key and value, in that order.

    The keys are guaranteed to be iterated over in insertion order.

    @param {Function} callback
    @param {anything} self if passed, the `this` value inside the
      callback. By default, `this` is the map.
  */
  forEach: function(callback, self) {
    var keys = this.keys,
        values = this.values;

    keys.forEach(function(key) {
      var guid = guidFor(key);
      callback.call(self, key, values[guid]);
    });
  },

  copy: function() {
    return copyMap(this, new Map());
  }
};

var MapWithDefault = Ember.MapWithDefault = function(options) {
  Map.call(this);
  this.defaultValue = options.defaultValue;
};

MapWithDefault.create = function(options) {
  if (options) {
    return new MapWithDefault(options);
  } else {
    return new Map();
  }
};

MapWithDefault.prototype = Ember.create(Map.prototype);

MapWithDefault.prototype.get = function(key) {
  var hasValue = this.has(key);

  if (hasValue) {
    return Map.prototype.get.call(this, key);
  } else {
    var defaultValue = this.defaultValue(key);
    this.set(key, defaultValue);
    return defaultValue;
  }
};

MapWithDefault.prototype.copy = function() {
  return copyMap(this, new MapWithDefault({
    defaultValue: this.defaultValue
  }));
};

})();



(function() {
// ==========================================================================
// Project:  Ember Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var USE_ACCESSORS = Ember.platform.hasPropertyAccessors && Ember.ENV.USE_ACCESSORS;
Ember.USE_ACCESSORS = !!USE_ACCESSORS;

var meta = Ember.meta;

// ..........................................................
// GET AND SET
//
// If we are on a platform that supports accessors we can get use those.
// Otherwise simulate accessors by looking up the property directly on the
// object.

var get, set;

/** @private */
var basicGet = function get(obj, keyName) {
  var ret = obj[keyName];
  if (ret !== undefined) { return ret; }

  // if the property's value is undefined and the object defines
  // unknownProperty, invoke unknownProperty
  if ('function' === typeof obj.unknownProperty) {
    return obj.unknownProperty(keyName);
  }
};

/** @private */
var basicSet = function set(obj, keyName, value) {
  var isObject = 'object' === typeof obj;
  var hasProp = isObject && !(keyName in obj);

  // setUnknownProperty is called if `obj` is an object,
  // the property does not already exist, and the
  // `setUnknownProperty` method exists on the object
  var unknownProp = hasProp && 'function' === typeof obj.setUnknownProperty;

  if (unknownProp) {
    obj.setUnknownProperty(keyName, value);
  } else {
    obj[keyName] = value;
  }
};

/** @private */
get = function(obj, keyName) {
  Ember.assert("You need to provide an object and key to `get`.", !!obj && keyName);

  var desc = meta(obj, false).descs[keyName];
  if (desc) { return desc.get(obj, keyName); }
  else { return basicGet(obj, keyName); }
};

/** @private */
set = function(obj, keyName, value) {
  Ember.assert("You need to provide an object and key to `set`.", !!obj && keyName !== undefined);

  var desc = meta(obj, false).descs[keyName];
  if (desc) { desc.set(obj, keyName, value); }
  else { basicSet(obj, keyName, value); }
  return value;
};

/**
  @function

  Gets the value of a property on an object.  If the property is computed,
  the function will be invoked.  If the property is not defined but the
  object implements the unknownProperty() method then that will be invoked.

  If you plan to run on IE8 and older browsers then you should use this
  method anytime you want to retrieve a property on an object that you don't
  know for sure is private.  (My convention only properties beginning with
  an underscore '_' are considered private.)

  On all newer browsers, you only need to use this method to retrieve
  properties if the property might not be defined on the object and you want
  to respect the unknownProperty() handler.  Otherwise you can ignore this
  method.

  Note that if the obj itself is null, this method will simply return
  undefined.

  @param {Object} obj
    The object to retrieve from.

  @param {String} keyName
    The property key to retrieve

  @returns {Object} the property value or null.
*/
Ember.get = get;

/**
  @function

  Sets the value of a property on an object, respecting computed properties
  and notifying observers and other listeners of the change.  If the
  property is not defined but the object implements the unknownProperty()
  method then that will be invoked as well.

  If you plan to run on IE8 and older browsers then you should use this
  method anytime you want to set a property on an object that you don't
  know for sure is private.  (My convention only properties beginning with
  an underscore '_' are considered private.)

  On all newer browsers, you only need to use this method to set
  properties if the property might not be defined on the object and you want
  to respect the unknownProperty() handler.  Otherwise you can ignore this
  method.

  @param {Object} obj
    The object to modify.

  @param {String} keyName
    The property key to set

  @param {Object} value
    The value to set

  @returns {Object} the passed value.
*/
Ember.set = set;

if (Ember.config.overrideAccessors) {
  Ember.config.overrideAccessors();
  get = Ember.get;
  set = Ember.set;
}

// ..........................................................
// PATHS
//

/** @private */
function getPath(target, path) {
  var parts = path.split(".");
  for (var i=0, l=parts.length; target && i<l; i++) {
    target = get(target, parts[i]);
    if (target && target.isDestroyed) { return undefined; }
  }
  return target;
}

var TUPLE_RET = [];
var IS_GLOBAL = /^([A-Z$]|([0-9][A-Z$]))/;
var IS_GLOBAL_PATH = /^([A-Z$]|([0-9][A-Z$])).*[\.\*]/;
var HAS_THIS  = /^this[\.\*]/;
var FIRST_KEY = /^([^\.\*]+)/;

/** @private */
function firstKey(path) {
  return path.match(FIRST_KEY)[0];
}

// assumes path is already normalized
/** @private */
function normalizeTuple(target, path) {
  var hasThis  = HAS_THIS.test(path),
      isGlobal = !hasThis && IS_GLOBAL_PATH.test(path),
      key;

  if (!target || isGlobal) target = window;
  if (hasThis) path = path.slice(5);

  if (target === window) {
    key = firstKey(path);
    target = get(target, key);
    path   = path.slice(key.length+1);
  }

  // must return some kind of path to be valid else other things will break.
  if (!path || path.length===0) throw new Error('Invalid Path');

  TUPLE_RET[0] = target;
  TUPLE_RET[1] = path;
  return TUPLE_RET;
}

/** @private */
Ember.isGlobal = function(path) {
  return IS_GLOBAL.test(path);
};

/**
  @private

  Normalizes a target/path pair to reflect that actual target/path that should
  be observed, etc.  This takes into account passing in global property
  paths (i.e. a path beginning with a captial letter not defined on the
  target) and * separators.

  @param {Object} target
    The current target.  May be null.

  @param {String} path
    A path on the target or a global property path.

  @returns {Array} a temporary array with the normalized target/path pair.
*/
Ember.normalizeTuple = function(target, path) {
  return normalizeTuple(target, path);
};

Ember.normalizeTuple.primitive = normalizeTuple;

Ember.getWithDefault = function(root, key, defaultValue) {
  var value = Ember.get(root, key);

  if (value === undefined) { return defaultValue; }
  return value;
};

Ember.getPath = function(root, path) {
  var hasThis, isGlobal, ret;

  // Helpers that operate with 'this' within an #each
  if (path === '') {
    return root;
  }

  if (!path && 'string'===typeof root) {
    path = root;
    root = null;
  }

  // If there is no root and path is a key name, return that
  // property from the global object.
  // E.g. getPath('Ember') -> Ember
  if (root === null && path.indexOf('.') < 0) { return get(window, path); }

  // detect complicated paths and normalize them
  hasThis  = HAS_THIS.test(path);

  if (!root || hasThis) {
    var tuple = normalizeTuple(root, path);
    root = tuple[0];
    path = tuple[1];
    tuple.length = 0;
  }

  return getPath(root, path);
};

Ember.setPath = function(root, path, value, tolerant) {
  var keyName;

  if (typeof root === 'string' && IS_GLOBAL.test(root)) {
    value = path;
    path = root;
    root = null;
  }

  if (path.indexOf('.') > 0) {
    // get the last part of the path
    keyName = path.slice(path.lastIndexOf('.') + 1);

    // get the first part of the part
    path    = path.slice(0, path.length-(keyName.length+1));

    // unless the path is this, look up the first part to
    // get the root
    if (path !== 'this') {
      root = Ember.getPath(root, path);
    }
  } else {
    Ember.assert("A global path passed to setPath must have at least one period", !IS_GLOBAL.test(path) || path.indexOf(".") > -1);
    keyName = path;
  }

  if (!keyName || keyName.length === 0) {
    throw new Error('You passed an empty path');
  }

  if (!root) {
    if (tolerant) { return; }
    else { throw new Error('Object in path '+path+' could not be found or was destroyed.'); }
  }

  return Ember.set(root, keyName, value);
};

/**
  Error-tolerant form of Ember.setPath. Will not blow up if any part of the
  chain is undefined, null, or destroyed.

  This is primarily used when syncing bindings, which may try to update after
  an object has been destroyed.
*/
Ember.trySetPath = function(root, path, value) {
  return Ember.setPath(root, path, value, true);
};

/**
  Returns true if the provided path is global (e.g., "MyApp.fooController.bar")
  instead of local ("foo.bar.baz").

  @param {String} path
  @returns Boolean
*/
Ember.isGlobalPath = function(path) {
  return !HAS_THIS.test(path) && IS_GLOBAL.test(path);
};

})();



(function() {
// ==========================================================================
// Project:  Ember Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var USE_ACCESSORS = Ember.USE_ACCESSORS,
    GUID_KEY = Ember.GUID_KEY,
    META_KEY = Ember.META_KEY,
    meta = Ember.meta,
    objectDefineProperty = Ember.platform.defineProperty,
    SIMPLE_PROPERTY, WATCHED_PROPERTY;

// ..........................................................
// DESCRIPTOR
//

/**
  @private
  @constructor

  Objects of this type can implement an interface to responds requests to
  get and set.  The default implementation handles simple properties.

  You generally won't need to create or subclass this directly.
*/
var Descriptor = Ember.Descriptor = function() {};

var setup = Descriptor.setup = function(obj, keyName, value) {
  objectDefineProperty(obj, keyName, {
    writable: true,
    configurable: true,
    enumerable: true,
    value: value
  });
};

var DescriptorPrototype = Ember.Descriptor.prototype;

/**
  Called whenever we want to set the property value.  Should set the value
  and return the actual set value (which is usually the same but may be
  different in the case of computed properties.)

  @param {Object} obj
    The object to set the value on.

  @param {String} keyName
    The key to set.

  @param {Object} value
    The new value

  @returns {Object} value actual set value
*/
DescriptorPrototype.set = function(obj, keyName, value) {
  obj[keyName] = value;
  return value;
};

/**
  Called whenever we want to get the property value.  Should retrieve the
  current value.

  @param {Object} obj
    The object to get the value on.

  @param {String} keyName
    The key to retrieve

  @returns {Object} the current value
*/
DescriptorPrototype.get = function(obj, keyName) {
  return get(obj, keyName, obj);
};

/**
  This is called on the descriptor to set it up on the object.  The
  descriptor is responsible for actually defining the property on the object
  here.

  The passed `value` is the transferValue returned from any previous
  descriptor.

  @param {Object} obj
    The object to set the value on.

  @param {String} keyName
    The key to set.

  @param {Object} value
    The transfer value from any previous descriptor.

  @returns {void}
*/
DescriptorPrototype.setup = setup;

/**
  This is called on the descriptor just before another descriptor takes its
  place.  This method should at least return the 'transfer value' of the
  property - which is the value you want to passed as the input to the new
  descriptor's setup() method.

  It is not generally necessary to actually 'undefine' the property as a new
  property descriptor will redefine it immediately after this method returns.

  @param {Object} obj
    The object to set the value on.

  @param {String} keyName
    The key to set.

  @returns {Object} transfer value
*/
DescriptorPrototype.teardown = function(obj, keyName) {
  return obj[keyName];
};

DescriptorPrototype.val = function(obj, keyName) {
  return obj[keyName];
};

// ..........................................................
// SIMPLE AND WATCHED PROPERTIES
//

// The exception to this is that any objects managed by Ember but not a descendant
// of Ember.Object will not throw an exception, instead failing silently. This
// prevent errors with other libraries that may attempt to access special
// properties on standard objects like Array. Usually this happens when copying
// an object by looping over all properties.
//
// QUESTION: What is this scenario exactly?
var mandatorySetter = Ember.Descriptor.MUST_USE_SETTER = function() {
  if (this instanceof Ember.Object) {
    if (this.isDestroyed) {
      Ember.assert('You cannot set observed properties on destroyed objects', false);
    } else {
      Ember.assert('Must use Ember.set() to access this property', false);
    }
  }
};

var WATCHED_DESC = {
  configurable: true,
  enumerable:   true,
  set: mandatorySetter
};

/** @private */
function rawGet(obj, keyName, values) {
  var ret = values[keyName];
  if (ret === undefined && obj.unknownProperty) {
    ret = obj.unknownProperty(keyName);
  }
  return ret;
}

function get(obj, keyName) {
  return rawGet(obj, keyName, obj);
}

var emptyObject = {};

function watchedGet(obj, keyName) {
  return rawGet(obj, keyName, meta(obj, false).values || emptyObject);
}

var hasGetters = Ember.platform.hasPropertyAccessors, rawSet;

rawSet = function(obj, keyName, value, values) {
  values[keyName] = value;
};

// if there are no getters, keep the raw property up to date
if (!hasGetters) {
  rawSet = function(obj, keyName, value, values) {
    obj[keyName] = value;
    values[keyName] = value;
  };
}

/** @private */
function watchedSet(obj, keyName, value) {
  var m = meta(obj),
      values = m.values,
      changed = value !== values[keyName];

  if (changed) {
    Ember.propertyWillChange(obj, keyName);
    rawSet(obj, keyName, value, m.values);
    Ember.propertyDidChange(obj, keyName);
  }

  return value;
}

/** @private */
function makeWatchedGetter(keyName) {
  return function() {
    return watchedGet(this, keyName);
  };
}

/** @private */
function makeWatchedSetter(keyName) {
  return function(value) {
    return watchedSet(this, keyName, value);
  };
}

/**
  @private

  Private version of simple property that invokes property change callbacks.
*/
WATCHED_PROPERTY = new Ember.Descriptor();
WATCHED_PROPERTY.get = watchedGet ;
WATCHED_PROPERTY.set = watchedSet ;

WATCHED_PROPERTY.setup = function(obj, keyName, value) {
  objectDefineProperty(obj, keyName, {
    configurable: true,
    enumerable:   true,
    set: mandatorySetter,
    get: makeWatchedGetter(keyName)
  });

  meta(obj).values[keyName] = value;
};

WATCHED_PROPERTY.teardown = function(obj, keyName) {
  var ret = meta(obj).values[keyName];
  delete meta(obj).values[keyName];
  return ret;
};

/**
  The default descriptor for simple properties.  Pass as the third argument
  to Ember.defineProperty() along with a value to set a simple value.

  @static
  @default Ember.Descriptor
*/
Ember.SIMPLE_PROPERTY = new Ember.Descriptor();
SIMPLE_PROPERTY = Ember.SIMPLE_PROPERTY;

SIMPLE_PROPERTY.unwatched = WATCHED_PROPERTY.unwatched = SIMPLE_PROPERTY;
SIMPLE_PROPERTY.watched   = WATCHED_PROPERTY.watched   = WATCHED_PROPERTY;

// ..........................................................
// DEFINING PROPERTIES API
//

/** @private */
function hasDesc(descs, keyName) {
  if (keyName === 'toString') return 'function' !== typeof descs.toString;
  else return !!descs[keyName];
}

/**
  @private

  NOTE: This is a low-level method used by other parts of the API.  You almost
  never want to call this method directly.  Instead you should use Ember.mixin()
  to define new properties.

  Defines a property on an object.  This method works much like the ES5
  Object.defineProperty() method except that it can also accept computed
  properties and other special descriptors.

  Normally this method takes only three parameters.  However if you pass an
  instance of Ember.Descriptor as the third param then you can pass an optional
  value as the fourth parameter.  This is often more efficient than creating
  new descriptor hashes for each property.

  ## Examples

      // ES5 compatible mode
      Ember.defineProperty(contact, 'firstName', {
        writable: true,
        configurable: false,
        enumerable: true,
        value: 'Charles'
      });

      // define a simple property
      Ember.defineProperty(contact, 'lastName', Ember.SIMPLE_PROPERTY, 'Jolley');

      // define a computed property
      Ember.defineProperty(contact, 'fullName', Ember.computed(function() {
        return this.firstName+' '+this.lastName;
      }).property('firstName', 'lastName').cacheable());
*/
Ember.defineProperty = function(obj, keyName, desc, val) {
  var m = meta(obj, false),
      descs = m.descs,
      watching = m.watching[keyName]>0,
      override = true;

  if (val === undefined) {
    // if a value wasn't provided, the value is the old value
    // (which can be obtained by calling teardown on a property
    // with a descriptor).
    override = false;
    val = hasDesc(descs, keyName) ? descs[keyName].teardown(obj, keyName) : obj[keyName];
  } else if (hasDesc(descs, keyName)) {
    // otherwise, tear down the descriptor, but use the provided
    // value as the new value instead of the descriptor's current
    // value.
    descs[keyName].teardown(obj, keyName);
  }

  if (!desc) {
    desc = SIMPLE_PROPERTY;
  }

  if (desc instanceof Ember.Descriptor) {
    m = meta(obj, true);
    descs = m.descs;

    desc = (watching ? desc.watched : desc.unwatched) || desc;
    descs[keyName] = desc;
    desc.setup(obj, keyName, val, watching);

  // compatibility with ES5
  } else {
    if (descs[keyName]) meta(obj).descs[keyName] = null;
    objectDefineProperty(obj, keyName, desc);
  }

  // if key is being watched, override chains that
  // were initialized with the prototype
  if (override && watching) Ember.overrideChains(obj, keyName, m);

  return this;
};


})();



(function() {
// ==========================================================================
// Project:  Ember Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
Ember.warn("Computed properties will soon be cacheable by default. To enable this in your app, set `ENV.CP_DEFAULT_CACHEABLE = true`.", Ember.CP_DEFAULT_CACHEABLE);


var get = Ember.get,
    getPath = Ember.getPath,
    meta = Ember.meta,
    guidFor = Ember.guidFor,
    USE_ACCESSORS = Ember.USE_ACCESSORS,
    a_slice = [].slice,
    o_create = Ember.create,
    o_defineProperty = Ember.platform.defineProperty;

// ..........................................................
// DEPENDENT KEYS
//

// data structure:
//  meta.deps = {
//   'depKey': {
//     'keyName': count,
//     __emberproto__: SRC_OBJ [to detect clones]
//     },
//   __emberproto__: SRC_OBJ
//  }

/**
  @private

  This function returns a map of unique dependencies for a
  given object and key.
*/
function uniqDeps(obj, depKey) {
  var m = meta(obj), deps = m.deps, ret;

  // If the current object has no dependencies...
  if (!deps) {
    // initialize the dependencies with a pointer back to
    // the current object
    deps = m.deps = { __emberproto__: obj };
  } else if (deps.__emberproto__ !== obj) {
    // otherwise if the dependencies are inherited from the
    // object's superclass, clone the deps
    deps = m.deps = o_create(deps);
    deps.__emberproto__ = obj;
  }

  ret = deps[depKey];

  if (!ret) {
    // if there are no dependencies yet for a the given key
    // create a new empty list of dependencies for the key
    ret = deps[depKey] = { __emberproto__: obj };
  } else if (ret.__emberproto__ !== obj) {
    // otherwise if the dependency list is inherited from
    // a superclass, clone the hash
    ret = deps[depKey] = o_create(ret);
    ret.__emberproto__ = obj;
  }

  return ret;
}

/**
  @private

  This method allows us to register that a particular
  property depends on another property.
*/
function addDependentKey(obj, keyName, depKey) {
  var deps = uniqDeps(obj, depKey);

  // Increment the number of times depKey depends on
  // keyName.
  deps[keyName] = (deps[keyName] || 0) + 1;

  // Watch the depKey
  Ember.watch(obj, depKey);
}

/**
  @private

  This method removes a dependency.
*/
function removeDependentKey(obj, keyName, depKey) {
  var deps = uniqDeps(obj, depKey);

  // Decrement the number of times depKey depends
  // on keyName.
  deps[keyName] = (deps[keyName] || 0) - 1;

  // Unwatch the depKey
  Ember.unwatch(obj, depKey);
}

/** @private */
function addDependentKeys(desc, obj, keyName) {
  // the descriptor has a list of dependent keys, so
  // add all of its dependent keys.
  var keys = desc._dependentKeys,
      len  = keys ? keys.length : 0;

  for(var idx=0; idx<len; idx++) {
    addDependentKey(obj, keyName, keys[idx]);
  }
}

// ..........................................................
// COMPUTED PROPERTY
//

/** @private */
function ComputedProperty(func, opts) {
  this.func = func;
  this._cacheable = (opts && opts.cacheable !== undefined) ? opts.cacheable : Ember.CP_DEFAULT_CACHEABLE;
  this._dependentKeys = opts && opts.dependentKeys;
}

/**
  @constructor
*/
Ember.ComputedProperty = ComputedProperty;
ComputedProperty.prototype = new Ember.Descriptor();

var CP_DESC = {
  configurable: true,
  enumerable:   true,
  get: function() { return undefined; }, // for when use_accessors is false.
  set: Ember.Descriptor.MUST_USE_SETTER  // for when use_accessors is false
};

/** @private */
function mkCpGetter(keyName, desc) {
  var cacheable = desc._cacheable,
      func     = desc.func;

  if (cacheable) {
    return function() {
      var ret, cache = meta(this).cache;
      if (keyName in cache) { return cache[keyName]; }
      ret = cache[keyName] = func.call(this, keyName);
      return ret;
    };
  } else {
    return function() {
      return func.call(this, keyName);
    };
  }
}

/** @private */
function mkCpSetter(keyName, desc) {
  var cacheable = desc._cacheable,
      func      = desc.func;

  return function(value) {
    var m = meta(this, cacheable),
        watched = m.source === this && m.watching[keyName] > 0,
        oldSuspended = desc._suspended,
        ret;

    desc._suspended = this;

    if (watched) { Ember.propertyWillChange(this, keyName); }
    if (cacheable) delete m.cache[keyName];
    ret = func.call(this, keyName, value);
    if (cacheable) { m.cache[keyName] = ret; }
    if (watched) { Ember.propertyDidChange(this, keyName); }
    desc._suspended = oldSuspended;
    return ret;
  };
}

/**
  @extends Ember.ComputedProperty
  @private
*/
var ComputedPropertyPrototype = ComputedProperty.prototype;

/**
  Call on a computed property to set it into cacheable mode.  When in this
  mode the computed property will automatically cache the return value of
  your function until one of the dependent keys changes.

      MyApp.president = Ember.Object.create({
        fullName: function() {
          return this.get('firstName') + ' ' + this.get('lastName');

          // After calculating the value of this function, Ember.js will
          // return that value without re-executing this function until
          // one of the dependent properties change.
        }.property('firstName', 'lastName').cacheable()
      });

  Properties are cacheable by default.

  @name Ember.ComputedProperty.cacheable
  @param {Boolean} aFlag optional set to false to disable caching
  @returns {Ember.ComputedProperty} receiver
*/
ComputedPropertyPrototype.cacheable = function(aFlag) {
  this._cacheable = aFlag !== false;
  return this;
};

/**
  Call on a computed property to set it into non-cached mode.  When in this
  mode the computed property will not automatically cache the return value.

      MyApp.outsideService = Ember.Object.create({
        value: function() {
          return OutsideService.getValue();
        }.property().volatile()
      });

  @name Ember.ComputedProperty.volatile
  @returns {Ember.ComputedProperty} receiver
*/
ComputedPropertyPrototype.volatile = function() {
  return this.cacheable(false);
};

/**
  Sets the dependent keys on this computed property.  Pass any number of
  arguments containing key paths that this computed property depends on.

      MyApp.president = Ember.Object.create({
        fullName: Ember.computed(function() {
          return this.get('firstName') + ' ' + this.get('lastName');

          // Tell Ember.js that this computed property depends on firstName
          // and lastName
        }).property('firstName', 'lastName')
      });

  @name Ember.ComputedProperty.property
  @param {String} path... zero or more property paths
  @returns {Ember.ComputedProperty} receiver
*/
ComputedPropertyPrototype.property = function() {
  this._dependentKeys = a_slice.call(arguments);
  return this;
};

/**
  In some cases, you may want to annotate computed properties with additional
  metadata about how they function or what values they operate on. For example,
  computed property functions may close over variables that are then no longer
  available for introspection.

  You can pass a hash of these values to a computed property like this:

      person: function() {
        var personId = this.get('personId');
        return App.Person.create({ id: personId });
      }.property().meta({ type: App.Person })

  The hash that you pass to the `meta()` function will be saved on the
  computed property descriptor under the `_meta` key. Ember runtime
  exposes a public API for retrieving these values from classes,
  via the `metaForProperty()` function.

  @name Ember.ComputedProperty.meta
  @param {Hash} metadata
  @returns {Ember.ComputedProperty} property descriptor instance
*/

ComputedPropertyPrototype.meta = function(meta) {
  this._meta = meta;
  return this;
};

/** @private - impl descriptor API */
ComputedPropertyPrototype.setup = function(obj, keyName, value) {
  CP_DESC.get = mkCpGetter(keyName, this);
  CP_DESC.set = mkCpSetter(keyName, this);
  o_defineProperty(obj, keyName, CP_DESC);
  CP_DESC.get = CP_DESC.set = null;
  addDependentKeys(this, obj, keyName);
};

/** @private - impl descriptor API */
ComputedPropertyPrototype.teardown = function(obj, keyName) {
  var keys = this._dependentKeys,
      len  = keys ? keys.length : 0;

  for(var idx=0; idx < len; idx++) {
    removeDependentKey(obj, keyName, keys[idx]);
  }

  if (this._cacheable) { delete meta(obj).cache[keyName]; }

  return null; // no value to restore
};

/** @private - impl descriptor API */
ComputedPropertyPrototype.didChange = function(obj, keyName) {
  if (this._cacheable && this._suspended !== obj) {
    delete meta(obj).cache[keyName];
  }
};

/** @private - impl descriptor API */
ComputedPropertyPrototype.get = function(obj, keyName) {
  var ret, cache;

  if (this._cacheable) {
    cache = meta(obj).cache;
    if (keyName in cache) { return cache[keyName]; }
    ret = cache[keyName] = this.func.call(obj, keyName);
  } else {
    ret = this.func.call(obj, keyName);
  }
  return ret;
};

/** @private - impl descriptor API */
ComputedPropertyPrototype.set = function(obj, keyName, value) {
  var cacheable = this._cacheable,
      m = meta(obj, cacheable),
      watched = m.source === obj && m.watching[keyName] > 0,
      oldSuspended = this._suspended,
      ret;

  this._suspended = obj;

  if (watched) { Ember.propertyWillChange(obj, keyName); }
  if (cacheable) delete m.cache[keyName];
  ret = this.func.call(obj, keyName, value);
  if (cacheable) { m.cache[keyName] = ret; }
  if (watched) { Ember.propertyDidChange(obj, keyName); }
  this._suspended = oldSuspended;
  return ret;
};

ComputedPropertyPrototype.val = function(obj, keyName) {
  return meta(obj, false).values[keyName];
};

if (!Ember.platform.hasPropertyAccessors) {
  ComputedPropertyPrototype.setup = function(obj, keyName, value) {
    obj[keyName] = undefined; // so it shows up in key iteration
    addDependentKeys(this, obj, keyName);
  };

} else if (!USE_ACCESSORS) {
  ComputedPropertyPrototype.setup = function(obj, keyName) {
    // throw exception if not using Ember.get() and Ember.set() when supported
    o_defineProperty(obj, keyName, CP_DESC);
    addDependentKeys(this, obj, keyName);
  };
}

/**
  This helper returns a new property descriptor that wraps the passed
  computed property function.  You can use this helper to define properties
  with mixins or via Ember.defineProperty().

  The function you pass will be used to both get and set property values.
  The function should accept two parameters, key and value.  If value is not
  undefined you should set the value first.  In either case return the
  current value of the property.

  @param {Function} func
    The computed property function.

  @returns {Ember.ComputedProperty} property descriptor instance
*/
Ember.computed = function(func) {
  var args;

  if (arguments.length > 1) {
    args = a_slice.call(arguments, 0, -1);
    func = a_slice.call(arguments, -1)[0];
  }

  var cp = new ComputedProperty(func);

  if (args) {
    cp.property.apply(cp, args);
  }

  return cp;
};

/**
  Returns the cached value for a property, if one exists.
  This can be useful for peeking at the value of a computed
  property that is generated lazily, without accidentally causing
  it to be created.

  @param {Object} obj the object whose property you want to check
  @param {String} key the name of the property whose cached value you want
                      to return

*/
Ember.cacheFor = function(obj, key) {
  var cache = meta(obj, false).cache;

  if (cache && key in cache) {
    return cache[key];
  }
};

Ember.computed.not = function(dependentKey) {
  return Ember.computed(dependentKey, function(key) {
    return !getPath(this, dependentKey);
  }).cacheable();
};

Ember.computed.empty = function(dependentKey) {
  return Ember.computed(dependentKey, function(key) {
    var val = getPath(this, dependentKey);
    return val === undefined || val === null || val === '' || (Ember.isArray(val) && get(val, 'length') === 0);
  }).cacheable();
};

Ember.computed.bool = function(dependentKey) {
  return Ember.computed(dependentKey, function(key) {
    return !!getPath(this, dependentKey);
  }).cacheable();
};

})();



(function() {
// ==========================================================================
// Project:  Ember Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var AFTER_OBSERVERS = ':change';
var BEFORE_OBSERVERS = ':before';
var guidFor = Ember.guidFor;

var deferred = 0;
var array_Slice = [].slice;

/** @private */
var ObserverSet = function () {
  this.targetSet = {};
};
ObserverSet.prototype.add = function (target, path) {
  var targetSet = this.targetSet,
    targetGuid = Ember.guidFor(target),
    pathSet = targetSet[targetGuid];
  if (!pathSet) {
    targetSet[targetGuid] = pathSet = {};
  }
  if (pathSet[path]) {
    return false;
  } else {
    return pathSet[path] = true;
  }
};
ObserverSet.prototype.clear = function () {
  this.targetSet = {};
};

/** @private */
var DeferredEventQueue = function() {
  this.targetSet = {};
  this.queue = [];
};

DeferredEventQueue.prototype.push = function(target, eventName) {
  var targetSet = this.targetSet,
    queue = this.queue,
    targetGuid = Ember.guidFor(target),
    eventNameSet = targetSet[targetGuid],
    index;

  if (!eventNameSet) {
    targetSet[targetGuid] = eventNameSet = {};
  }
  index = eventNameSet[eventName];
  if (index === undefined) {
    eventNameSet[eventName] = queue.push(Ember.deferEvent(target, eventName)) - 1;
  } else {
    queue[index] = Ember.deferEvent(target, eventName);
  }
};

DeferredEventQueue.prototype.flush = function() {
  var queue = this.queue;
  this.queue = [];
  this.targetSet = {};
  for (var i=0, len=queue.length; i < len; ++i) {
    queue[i]();
  }
};

var queue = new DeferredEventQueue(), beforeObserverSet = new ObserverSet();

/** @private */
function notifyObservers(obj, eventName, forceNotification) {
  if (deferred && !forceNotification) {
    queue.push(obj, eventName);
  } else {
    Ember.sendEvent(obj, eventName);
  }
}

/** @private */
function flushObserverQueue() {
  beforeObserverSet.clear();

  queue.flush();
}

Ember.beginPropertyChanges = function() {
  deferred++;
  return this;
};

Ember.endPropertyChanges = function() {
  deferred--;
  if (deferred<=0) flushObserverQueue();
};

/**
  Make a series of property changes together in an
  exception-safe way.

      Ember.changeProperties(function() {
        obj1.set('foo', mayBlowUpWhenSet);
        obj2.set('bar', baz);
      });
*/
Ember.changeProperties = function(cb, binding){
  Ember.beginPropertyChanges();
  try {
    cb.call(binding);
  } finally {
    Ember.endPropertyChanges();
  }
};

/**
  Set a list of properties on an object. These properties are set inside
  a single `beginPropertyChanges` and `endPropertyChanges` batch, so
  observers will be buffered.
*/
Ember.setProperties = function(self, hash) {
  Ember.changeProperties(function(){
    for(var prop in hash) {
      if (hash.hasOwnProperty(prop)) Ember.set(self, prop, hash[prop]);
    }
  });
  return self;
};


/** @private */
function changeEvent(keyName) {
  return keyName+AFTER_OBSERVERS;
}

/** @private */
function beforeEvent(keyName) {
  return keyName+BEFORE_OBSERVERS;
}

/** @private */
function changeKey(eventName) {
  return eventName.slice(0, -7);
}

/** @private */
function beforeKey(eventName) {
  return eventName.slice(0, -7);
}

/** @private */
function xformForArgs(args) {
  return function (target, method, params) {
    var obj = params[0], keyName = changeKey(params[1]), val;
    var copy_args = args.slice();
    if (method.length>2) {
      val = Ember.getPath(Ember.isGlobalPath(keyName) ? window : obj, keyName);
    }
    copy_args.unshift(obj, keyName, val);
    method.apply(target, copy_args);
  };
}

var xformChange = xformForArgs([]);

/** @private */
function xformBefore(target, method, params) {
  var obj = params[0], keyName = beforeKey(params[1]), val;
  if (method.length>2) val = Ember.getPath(obj, keyName);
  method.call(target, obj, keyName, val);
}

Ember.addObserver = function(obj, path, target, method) {
  var xform;
  if (arguments.length > 4) {
    var args = array_Slice.call(arguments, 4);
    xform = xformForArgs(args);
  } else {
    xform = xformChange;
  }
  Ember.addListener(obj, changeEvent(path), target, method, xform);
  Ember.watch(obj, path);
  return this;
};

/** @private */
Ember.observersFor = function(obj, path) {
  return Ember.listenersFor(obj, changeEvent(path));
};

Ember.removeObserver = function(obj, path, target, method) {
  Ember.unwatch(obj, path);
  Ember.removeListener(obj, changeEvent(path), target, method);
  return this;
};

Ember.addBeforeObserver = function(obj, path, target, method) {
  Ember.addListener(obj, beforeEvent(path), target, method, xformBefore);
  Ember.watch(obj, path);
  return this;
};

// Suspend observer during callback.
//
// This should only be used by the target of the observer
// while it is setting the observed path.
/** @private */
Ember._suspendBeforeObserver = function(obj, path, target, method, callback) {
  return Ember._suspendListener(obj, beforeEvent(path), target, method, callback);
};

Ember._suspendObserver = function(obj, path, target, method, callback) {
  return Ember._suspendListener(obj, changeEvent(path), target, method, callback);
};

/** @private */
Ember.beforeObserversFor = function(obj, path) {
  return Ember.listenersFor(obj, beforeEvent(path));
};

Ember.removeBeforeObserver = function(obj, path, target, method) {
  Ember.unwatch(obj, path);
  Ember.removeListener(obj, beforeEvent(path), target, method);
  return this;
};

/** @private */
Ember.notifyObservers = function(obj, keyName) {
  if (obj.isDestroying) { return; }

  notifyObservers(obj, changeEvent(keyName));
};

/** @private */
Ember.notifyBeforeObservers = function(obj, keyName) {
  if (obj.isDestroying) { return; }

  var guid, set, forceNotification = false;

  if (deferred) {
    if (beforeObserverSet.add(obj, keyName)) {
      forceNotification = true;
    } else {
      return;
    }
  }

  notifyObservers(obj, beforeEvent(keyName), forceNotification);
};


})();



(function() {
// ==========================================================================
// Project:  Ember Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var guidFor = Ember.guidFor,
    meta = Ember.meta,
    get = Ember.get,
    set = Ember.set,
    normalizeTuple = Ember.normalizeTuple.primitive,
    SIMPLE_PROPERTY = Ember.SIMPLE_PROPERTY,
    GUID_KEY = Ember.GUID_KEY,
    META_KEY = Ember.META_KEY,
    notifyObservers = Ember.notifyObservers,
    forEach = Ember.ArrayPolyfills.forEach,
    FIRST_KEY = /^([^\.\*]+)/,
    IS_PATH = /[\.\*]/;

/** @private */
function firstKey(path) {
  return path.match(FIRST_KEY)[0];
}

// returns true if the passed path is just a keyName
/** @private */
function isKeyName(path) {
  return path==='*' || !IS_PATH.test(path);
}

// ..........................................................
// DEPENDENT KEYS
//

var DEP_SKIP = { __emberproto__: true }; // skip some keys and toString

/** @private */
function iterDeps(method, obj, depKey, seen, meta) {

  var guid = guidFor(obj);
  if (!seen[guid]) seen[guid] = {};
  if (seen[guid][depKey]) return;
  seen[guid][depKey] = true;

  var deps = meta.deps;
  deps = deps && deps[depKey];
  if (deps) {
    for(var key in deps) {
      if (DEP_SKIP[key]) continue;
      method(obj, key);
    }
  }
}


var WILL_SEEN, DID_SEEN;

// called whenever a property is about to change to clear the cache of any dependent keys (and notify those properties of changes, etc...)
/** @private */
function dependentKeysWillChange(obj, depKey, meta) {
  if (obj.isDestroying) { return; }

  var seen = WILL_SEEN, top = !seen;
  if (top) { seen = WILL_SEEN = {}; }
  iterDeps(propertyWillChange, obj, depKey, seen, meta);
  if (top) { WILL_SEEN = null; }
}

// called whenever a property has just changed to update dependent keys
/** @private */
function dependentKeysDidChange(obj, depKey, meta) {
  if (obj.isDestroying) { return; }

  var seen = DID_SEEN, top = !seen;
  if (top) { seen = DID_SEEN = {}; }
  iterDeps(propertyDidChange, obj, depKey, seen, meta);
  if (top) { DID_SEEN = null; }
}

// ..........................................................
// CHAIN
//

/** @private */
function addChainWatcher(obj, keyName, node) {
  if (!obj || ('object' !== typeof obj)) return; // nothing to do
  var m = meta(obj);
  var nodes = m.chainWatchers;
  if (!nodes || nodes.__emberproto__ !== obj) {
    nodes = m.chainWatchers = { __emberproto__: obj };
  }

  if (!nodes[keyName]) { nodes[keyName] = {}; }
  nodes[keyName][guidFor(node)] = node;
  Ember.watch(obj, keyName);
}

/** @private */
function removeChainWatcher(obj, keyName, node) {
  if (!obj || 'object' !== typeof obj) { return; } // nothing to do
  var m = meta(obj, false),
      nodes = m.chainWatchers;
  if (!nodes || nodes.__emberproto__ !== obj) { return; } //nothing to do
  if (nodes[keyName]) { delete nodes[keyName][guidFor(node)]; }
  Ember.unwatch(obj, keyName);
}

var pendingQueue = [];

// attempts to add the pendingQueue chains again.  If some of them end up
// back in the queue and reschedule is true, schedules a timeout to try
// again.
/** @private */
function flushPendingChains() {
  if (pendingQueue.length === 0) { return; } // nothing to do

  var queue = pendingQueue;
  pendingQueue = [];

  forEach.call(queue, function(q) { q[0].add(q[1]); });

  Ember.warn('Watching an undefined global, Ember expects watched globals to be setup by the time the run loop is flushed, check for typos', pendingQueue.length === 0);
}

/** @private */
function isProto(pvalue) {
  return meta(pvalue, false).proto === pvalue;
}

// A ChainNode watches a single key on an object.  If you provide a starting
// value for the key then the node won't actually watch it.  For a root node
// pass null for parent and key and object for value.
/** @private */
var ChainNode = function(parent, key, value, separator) {
  var obj;
  this._parent = parent;
  this._key    = key;

  // _watching is true when calling get(this._parent, this._key) will
  // return the value of this node.
  //
  // It is false for the root of a chain (because we have no parent)
  // and for global paths (because the parent node is the object with
  // the observer on it)
  this._watching = value===undefined;

  this._value  = value;
  this._separator = separator || '.';
  this._paths = {};
  if (this._watching) {
    this._object = parent.value();
    if (this._object) { addChainWatcher(this._object, this._key, this); }
  }

  // Special-case: the EachProxy relies on immediate evaluation to
  // establish its observers.
  //
  // TODO: Replace this with an efficient callback that the EachProxy
  // can implement.
  if (this._parent && this._parent._key === '@each') {
    this.value();
  }
};

var ChainNodePrototype = ChainNode.prototype;

ChainNodePrototype.value = function() {
  if (this._value === undefined && this._watching) {
    var obj = this._parent.value();
    this._value = (obj && !isProto(obj)) ? get(obj, this._key) : undefined;
  }
  return this._value;
};

ChainNodePrototype.destroy = function() {
  if (this._watching) {
    var obj = this._object;
    if (obj) { removeChainWatcher(obj, this._key, this); }
    this._watching = false; // so future calls do nothing
  }
};

// copies a top level object only
ChainNodePrototype.copy = function(obj) {
  var ret = new ChainNode(null, null, obj, this._separator),
      paths = this._paths, path;
  for (path in paths) {
    if (paths[path] <= 0) { continue; } // this check will also catch non-number vals.
    ret.add(path);
  }
  return ret;
};

// called on the root node of a chain to setup watchers on the specified
// path.
ChainNodePrototype.add = function(path) {
  var obj, tuple, key, src, separator, paths;

  paths = this._paths;
  paths[path] = (paths[path] || 0) + 1;

  obj = this.value();
  tuple = normalizeTuple(obj, path);

  // the path was a local path
  if (tuple[0] && tuple[0] === obj) {
    path = tuple[1];
    key  = firstKey(path);
    path = path.slice(key.length+1);

  // global path, but object does not exist yet.
  // put into a queue and try to connect later.
  } else if (!tuple[0]) {
    pendingQueue.push([this, path]);
    tuple.length = 0;
    return;

  // global path, and object already exists
  } else {
    src  = tuple[0];
    key  = path.slice(0, 0-(tuple[1].length+1));
    separator = path.slice(key.length, key.length+1);
    path = tuple[1];
  }

  tuple.length = 0;
  this.chain(key, path, src, separator);
};

// called on the root node of a chain to teardown watcher on the specified
// path
ChainNodePrototype.remove = function(path) {
  var obj, tuple, key, src, paths;

  paths = this._paths;
  if (paths[path] > 0) { paths[path]--; }

  obj = this.value();
  tuple = normalizeTuple(obj, path);
  if (tuple[0] === obj) {
    path = tuple[1];
    key  = firstKey(path);
    path = path.slice(key.length+1);
  } else {
    src  = tuple[0];
    key  = path.slice(0, 0-(tuple[1].length+1));
    path = tuple[1];
  }

  tuple.length = 0;
  this.unchain(key, path);
};

ChainNodePrototype.count = 0;

ChainNodePrototype.chain = function(key, path, src, separator) {
  var chains = this._chains, node;
  if (!chains) { chains = this._chains = {}; }

  node = chains[key];
  if (!node) { node = chains[key] = new ChainNode(this, key, src, separator); }
  node.count++; // count chains...

  // chain rest of path if there is one
  if (path && path.length>0) {
    key = firstKey(path);
    path = path.slice(key.length+1);
    node.chain(key, path); // NOTE: no src means it will observe changes...
  }
};

ChainNodePrototype.unchain = function(key, path) {
  var chains = this._chains, node = chains[key];

  // unchain rest of path first...
  if (path && path.length>1) {
    key  = firstKey(path);
    path = path.slice(key.length+1);
    node.unchain(key, path);
  }

  // delete node if needed.
  node.count--;
  if (node.count<=0) {
    delete chains[node._key];
    node.destroy();
  }

};

ChainNodePrototype.willChange = function() {
  var chains = this._chains;
  if (chains) {
    for(var key in chains) {
      if (!chains.hasOwnProperty(key)) { continue; }
      chains[key].willChange();
    }
  }

  if (this._parent) { this._parent.chainWillChange(this, this._key, 1); }
};

ChainNodePrototype.chainWillChange = function(chain, path, depth) {
  if (this._key) { path = this._key + this._separator + path; }

  if (this._parent) {
    this._parent.chainWillChange(this, path, depth+1);
  } else {
    if (depth > 1) { Ember.propertyWillChange(this.value(), path); }
    path = 'this.' + path;
    if (this._paths[path] > 0) { Ember.propertyWillChange(this.value(), path); }
  }
};

ChainNodePrototype.chainDidChange = function(chain, path, depth) {
  if (this._key) { path = this._key + this._separator + path; }
  if (this._parent) {
    this._parent.chainDidChange(this, path, depth+1);
  } else {
    if (depth > 1) { Ember.propertyDidChange(this.value(), path); }
    path = 'this.' + path;
    if (this._paths[path] > 0) { Ember.propertyDidChange(this.value(), path); }
  }
};

ChainNodePrototype.didChange = function(suppressEvent) {
  // invalidate my own value first.
  if (this._watching) {
    var obj = this._parent.value();
    if (obj !== this._object) {
      removeChainWatcher(this._object, this._key, this);
      this._object = obj;
      addChainWatcher(obj, this._key, this);
    }
    this._value  = undefined;

    // Special-case: the EachProxy relies on immediate evaluation to
    // establish its observers.
    if (this._parent && this._parent._key === '@each')
      this.value();
  }

  // then notify chains...
  var chains = this._chains;
  if (chains) {
    for(var key in chains) {
      if (!chains.hasOwnProperty(key)) { continue; }
      chains[key].didChange(suppressEvent);
    }
  }

  if (suppressEvent) { return; }

  // and finally tell parent about my path changing...
  if (this._parent) { this._parent.chainDidChange(this, this._key, 1); }
};

// get the chains for the current object.  If the current object has
// chains inherited from the proto they will be cloned and reconfigured for
// the current object.
/** @private */
function chainsFor(obj) {
  var m = meta(obj), ret = m.chains;
  if (!ret) {
    ret = m.chains = new ChainNode(null, null, obj);
  } else if (ret.value() !== obj) {
    ret = m.chains = ret.copy(obj);
  }
  return ret;
}

/** @private */
function notifyChains(obj, m, keyName, methodName, arg) {
  var nodes = m.chainWatchers;

  if (!nodes || nodes.__emberproto__ !== obj) { return; } // nothing to do

  nodes = nodes[keyName];
  if (!nodes) { return; }

  for(var key in nodes) {
    if (!nodes.hasOwnProperty(key)) { continue; }
    nodes[key][methodName](arg);
  }
}

Ember.overrideChains = function(obj, keyName, m) {
  notifyChains(obj, m, keyName, 'didChange', true);
};

/** @private */
function chainsWillChange(obj, keyName, m) {
  notifyChains(obj, m, keyName, 'willChange');
}

/** @private */
function chainsDidChange(obj, keyName, m) {
  notifyChains(obj, m, keyName, 'didChange');
}

// ..........................................................
// WATCH
//

var WATCHED_PROPERTY = Ember.SIMPLE_PROPERTY.watched;

/**
  @private

  Starts watching a property on an object.  Whenever the property changes,
  invokes Ember.propertyWillChange and Ember.propertyDidChange.  This is the
  primitive used by observers and dependent keys; usually you will never call
  this method directly but instead use higher level methods like
  Ember.addObserver().
*/
Ember.watch = function(obj, keyName) {
  // can't watch length on Array - it is special...
  if (keyName === 'length' && Ember.typeOf(obj) === 'array') { return this; }

  var m = meta(obj), watching = m.watching, desc;

  // activate watching first time
  if (!watching[keyName]) {
    watching[keyName] = 1;
    if (isKeyName(keyName)) {
      if ('function' === typeof obj.willWatchProperty) {
        obj.willWatchProperty(keyName);
      }

      desc = m.descs[keyName];
      desc = desc ? desc.watched : WATCHED_PROPERTY;
      if (desc) { Ember.defineProperty(obj, keyName, desc); }
    } else {
      chainsFor(obj).add(keyName);
    }

  }  else {
    watching[keyName] = (watching[keyName] || 0) + 1;
  }
  return this;
};

Ember.isWatching = function(obj, keyName) {
  return !!meta(obj).watching[keyName];
};

Ember.watch.flushPending = flushPendingChains;

/** @private */
Ember.unwatch = function(obj, keyName) {
  // can't watch length on Array - it is special...
  if (keyName === 'length' && Ember.typeOf(obj) === 'array') { return this; }

  var watching = meta(obj).watching, desc, descs;

  if (watching[keyName] === 1) {
    watching[keyName] = 0;
    if (isKeyName(keyName)) {
      desc = meta(obj).descs[keyName];
      desc = desc ? desc.unwatched : SIMPLE_PROPERTY;
      if (desc) { Ember.defineProperty(obj, keyName, desc); }

      if ('function' === typeof obj.didUnwatchProperty) {
        obj.didUnwatchProperty(keyName);
      }
    } else {
      chainsFor(obj).remove(keyName);
    }

  } else if (watching[keyName]>1) {
    watching[keyName]--;
  }

  return this;
};

/**
  @private

  Call on an object when you first beget it from another object.  This will
  setup any chained watchers on the object instance as needed.  This method is
  safe to call multiple times.
*/
Ember.rewatch = function(obj) {
  var m = meta(obj, false), chains = m.chains, bindings = m.bindings, key, b;

  // make sure the object has its own guid.
  if (GUID_KEY in obj && !obj.hasOwnProperty(GUID_KEY)) {
    Ember.generateGuid(obj, 'ember');
  }

  // make sure any chained watchers update.
  if (chains && chains.value() !== obj) { chainsFor(obj); }

  return this;
};

// ..........................................................
// PROPERTY CHANGES
//

/**
  This function is called just before an object property is about to change.
  It will notify any before observers and prepare caches among other things.

  Normally you will not need to call this method directly but if for some
  reason you can't directly watch a property you can invoke this method
  manually along with `Ember.propertyDidChange()` which you should call just
  after the property value changes.

  @memberOf Ember

  @param {Object} obj
    The object with the property that will change

  @param {String} keyName
    The property key (or path) that will change.

  @returns {void}
*/
function propertyWillChange(obj, keyName, value) {
  var m = meta(obj, false),
      watching = m.watching[keyName] > 0 || keyName === 'length',
      proto = m.proto,
      desc = m.descs[keyName];

  if (!watching) { return; }
  if (proto === obj) { return; }
  if (desc && desc.willChange) { desc.willChange(obj, keyName); }
  dependentKeysWillChange(obj, keyName, m);
  chainsWillChange(obj, keyName, m);
  Ember.notifyBeforeObservers(obj, keyName);
}

Ember.propertyWillChange = propertyWillChange;

/**
  This function is called just after an object property has changed.
  It will notify any observers and clear caches among other things.

  Normally you will not need to call this method directly but if for some
  reason you can't directly watch a property you can invoke this method
  manually along with `Ember.propertyWilLChange()` which you should call just
  before the property value changes.

  @memberOf Ember

  @param {Object} obj
    The object with the property that will change

  @param {String} keyName
    The property key (or path) that will change.

  @returns {void}
*/
function propertyDidChange(obj, keyName) {
  var m = meta(obj, false),
      watching = m.watching[keyName] > 0 || keyName === 'length',
      proto = m.proto,
      desc = m.descs[keyName];

  if (proto === obj) { return; }

  // shouldn't this mean that we're watching this key?
  if (desc && desc.didChange) { desc.didChange(obj, keyName); }
  if (!watching && keyName !== 'length') { return; }

  dependentKeysDidChange(obj, keyName, m);
  chainsDidChange(obj, keyName, m);
  Ember.notifyObservers(obj, keyName);
}

Ember.propertyDidChange = propertyDidChange;

var NODE_STACK = [];

/**
  Tears down the meta on an object so that it can be garbage collected.
  Multiple calls will have no effect.

  @param {Object} obj  the object to destroy
  @returns {void}
*/
Ember.destroy = function (obj) {
  var meta = obj[META_KEY], node, nodes, key, nodeObject;
  if (meta) {
    obj[META_KEY] = null;
    // remove chainWatchers to remove circular references that would prevent GC
    node = meta.chains;
    if (node) {
      NODE_STACK.push(node);
      // process tree
      while (NODE_STACK.length > 0) {
        node = NODE_STACK.pop();
        // push children
        nodes = node._chains;
        if (nodes) {
          for (key in nodes) {
            if (nodes.hasOwnProperty(key)) {
              NODE_STACK.push(nodes[key]);
            }
          }
        }
        // remove chainWatcher in node object
        if (node._watching) {
          nodeObject = node._object;
          if (nodeObject) {
            removeChainWatcher(nodeObject, node._key, node);
          }
        }
      }
    }
  }
};

})();



(function() {
// ==========================================================================
// Project:  Ember Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var o_create = Ember.create,
    meta = Ember.meta,
    metaPath = Ember.metaPath,
    guidFor = Ember.guidFor,
    a_slice = [].slice;

/**
  The event system uses a series of nested hashes to store listeners on an
  object. When a listener is registered, or when an event arrives, these
  hashes are consulted to determine which target and action pair to invoke.

  The hashes are stored in the object's meta hash, and look like this:

      // Object's meta hash
      {
        listeners: {               // variable name: `listenerSet`
          "foo:changed": {         // variable name: `targetSet`
            [targetGuid]: {        // variable name: `actionSet`
              [methodGuid]: {      // variable name: `action`
                target: [Object object],
                method: [Function function],
                xform: [Function function]
              }
            }
          }
        }
      }

*/

// Gets the set of all actions, keyed on the guid of each action's
// method property.
/** @private */
function actionSetFor(obj, eventName, target, writable) {
  return metaPath(obj, ['listeners', eventName, guidFor(target)], writable);
}

// Gets the set of all targets, keyed on the guid of each action's
// target property.
/** @private */
function targetSetFor(obj, eventName) {
  var listenerSet = meta(obj, false).listeners;
  if (!listenerSet) { return false; }

  return listenerSet[eventName] || false;
}

// TODO: This knowledge should really be a part of the
// meta system.
var SKIP_PROPERTIES = { __ember_source__: true };

/** @private */
function iterateSet(targetSet, callback, params) {
  if (!targetSet) { return false; }
  // Iterate through all elements of the target set
  for(var targetGuid in targetSet) {
    if (SKIP_PROPERTIES[targetGuid]) { continue; }

    var actionSet = targetSet[targetGuid];
    if (actionSet) {
      // Iterate through the elements of the action set
      for(var methodGuid in actionSet) {
        if (SKIP_PROPERTIES[methodGuid]) { continue; }

        var action = actionSet[methodGuid];
        if (action) {
          if (callback(action, params) === true) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

/** @private */
function invokeAction(action, params) {
  var method = action.method, target = action.target, xform = action.xform;
  // If there is no target, the target is the object
  // on which the event was fired.
  if (!target) { target = params[0]; }
  if ('string' === typeof method) { method = target[method]; }

  // Listeners can provide an `xform` function, which can perform
  // arbitrary transformations, such as changing the order of
  // parameters.
  //
  // This is primarily used by ember-runtime's observer system, which
  // provides a higher level abstraction on top of events, including
  // dynamically looking up current values and passing them into the
  // registered listener.
  if (xform) {
    xform(target, method, params);
  } else {
    method.apply(target, params);
  }
}

/**
  The parameters passed to an event listener are not exactly the
  parameters passed to an observer. if you pass an xform function, it will
  be invoked and is able to translate event listener parameters into the form
  that observers are expecting.

  @memberOf Ember
*/
function addListener(obj, eventName, target, method, xform) {
  Ember.assert("You must pass at least an object and event name to Ember.addListener", !!obj && !!eventName);

  if (!method && 'function' === typeof target) {
    method = target;
    target = null;
  }

  var actionSet = actionSetFor(obj, eventName, target, true),
      methodGuid = guidFor(method);

  if (!actionSet[methodGuid]) {
    actionSet[methodGuid] = { target: target, method: method, xform: xform };
  } else {
    actionSet[methodGuid].xform = xform; // used by observers etc to map params
  }

  if ('function' === typeof obj.didAddListener) {
    obj.didAddListener(eventName, target, method);
  }
}

/** @memberOf Ember */
function removeListener(obj, eventName, target, method) {
  if (!method && 'function' === typeof target) {
    method = target;
    target = null;
  }

  var actionSet = actionSetFor(obj, eventName, target, true),
      methodGuid = guidFor(method);

  // we can't simply delete this parameter, because if we do, we might
  // re-expose the property from the prototype chain.
  if (actionSet && actionSet[methodGuid]) { actionSet[methodGuid] = null; }

  if (obj && 'function'===typeof obj.didRemoveListener) {
    obj.didRemoveListener(eventName, target, method);
  }
}

// Suspend listener during callback.
//
// This should only be used by the target of the event listener
// when it is taking an action that would cause the event, e.g.
// an object might suspend its property change listener while it is
// setting that property.
/** @private */
function suspendListener(obj, eventName, target, method, callback) {
  if (!method && 'function' === typeof target) {
    method = target;
    target = null;
  }

  var actionSet = actionSetFor(obj, eventName, target, true),
      methodGuid = guidFor(method),
      action = actionSet && actionSet[methodGuid];

  actionSet[methodGuid] = null;
  try {
    return callback.call(target);
  } finally {
    actionSet[methodGuid] = action;
  }
}

// returns a list of currently watched events
/** @memberOf Ember */
function watchedEvents(obj) {
  var listeners = meta(obj, false).listeners, ret = [];

  if (listeners) {
    for(var eventName in listeners) {
      if (!SKIP_PROPERTIES[eventName] && listeners[eventName]) {
        ret.push(eventName);
      }
    }
  }
  return ret;
}

/** @memberOf Ember */
function sendEvent(obj, eventName) {
  // first give object a chance to handle it
  if (obj !== Ember && 'function' === typeof obj.sendEvent) {
    obj.sendEvent.apply(obj, a_slice.call(arguments, 1));
  }

  iterateSet(targetSetFor(obj, eventName), invokeAction, arguments);
  return true;
}

/** @memberOf Ember */
function deferEvent(obj, eventName) {
  var targetSet = targetSetFor(obj, eventName), actions = [], params = arguments;
  iterateSet(targetSet, function (action) {
    actions.push(action);
  });

  return function() {
    if (obj.isDestroyed) { return; }

    if (obj !== Ember && 'function' === typeof obj.sendEvent) {
      obj.sendEvent.apply(obj, a_slice.call(params, 1));
    }

    for (var i=0, len=actions.length; i < len; ++i) {
      invokeAction(actions[i], params);
    }
  };
}

/** @memberOf Ember */
function hasListeners(obj, eventName) {
  var targetSet = targetSetFor(obj, eventName);
  if (iterateSet(targetSet, function() { return true; })) {
    return true;
  }

  // no listeners!  might as well clean this up so it is faster later.
  var set = metaPath(obj, ['listeners'], true);
  set[eventName] = null;

  return false;
}

/** @memberOf Ember */
function listenersFor(obj, eventName) {
  var targetSet = targetSetFor(obj, eventName), ret = [];
  iterateSet(targetSet, function (action) {
    ret.push([action.target, action.method]);
  });
  return ret;
}

Ember.addListener = addListener;
Ember.removeListener = removeListener;
Ember._suspendListener = suspendListener;
Ember.sendEvent = sendEvent;
Ember.hasListeners = hasListeners;
Ember.watchedEvents = watchedEvents;
Ember.listenersFor = listenersFor;
Ember.deferEvent = deferEvent;

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// Ember.Logger
// Ember.watch.flushPending
// Ember.beginPropertyChanges, Ember.endPropertyChanges
// Ember.guidFor

// ..........................................................
// HELPERS
//

var slice = [].slice,
    forEach = Ember.ArrayPolyfills.forEach;

// invokes passed params - normalizing so you can pass target/func,
// target/string or just func
/** @private */
function invoke(target, method, args, ignore) {

  if (method === undefined) {
    method = target;
    target = undefined;
  }

  if ('string' === typeof method) { method = target[method]; }
  if (args && ignore > 0) {
    args = args.length > ignore ? slice.call(args, ignore) : null;
  }

  // Unfortunately in some browsers we lose the backtrace if we rethrow the existing error,
  // so in the event that we don't have an `onerror` handler we don't wrap in a try/catch
  if ('function' === typeof Ember.onerror) {
    try {
      // IE8's Function.prototype.apply doesn't accept undefined/null arguments.
      return method.apply(target || this, args || []);
    } catch (error) {
      Ember.onerror(error);
    }
  } else {
    // IE8's Function.prototype.apply doesn't accept undefined/null arguments.
    return method.apply(target || this, args || []);
  }
}


// ..........................................................
// RUNLOOP
//

var timerMark; // used by timers...

/** @private */
var RunLoop = function(prev) {
  this._prev = prev || null;
  this.onceTimers = {};
};

RunLoop.prototype = {
  end: function() {
    this.flush();
  },

  prev: function() {
    return this._prev;
  },

  // ..........................................................
  // Delayed Actions
  //

  schedule: function(queueName, target, method) {
    var queues = this._queues, queue;
    if (!queues) { queues = this._queues = {}; }
    queue = queues[queueName];
    if (!queue) { queue = queues[queueName] = []; }

    var args = arguments.length > 3 ? slice.call(arguments, 3) : null;
    queue.push({ target: target, method: method, args: args });
    return this;
  },

  flush: function(queueName) {
    var queueNames, idx, len, queue, log;

    if (!this._queues) { return this; } // nothing to do

    function iter(item) {
      invoke(item.target, item.method, item.args);
    }

    Ember.watch.flushPending(); // make sure all chained watchers are setup

    if (queueName) {
      while (this._queues && (queue = this._queues[queueName])) {
        this._queues[queueName] = null;

        // the sync phase is to allow property changes to propagate.  don't
        // invoke observers until that is finished.
        if (queueName === 'sync') {
          log = Ember.LOG_BINDINGS;
          if (log) { Ember.Logger.log('Begin: Flush Sync Queue'); }

          Ember.beginPropertyChanges();
          try {
            forEach.call(queue, iter);
          } finally {
            Ember.endPropertyChanges();
          }

          if (log) { Ember.Logger.log('End: Flush Sync Queue'); }

        } else {
          forEach.call(queue, iter);
        }
      }

    } else {
      queueNames = Ember.run.queues;
      len = queueNames.length;
      idx = 0;

      outerloop:
      while (idx < len) {
        queueName = queueNames[idx];
        queue = this._queues && this._queues[queueName];
        delete this._queues[queueName];

        if (queue) {
          // the sync phase is to allow property changes to propagate.  don't
          // invoke observers until that is finished.
          if (queueName === 'sync') {
            log = Ember.LOG_BINDINGS;
            if (log) { Ember.Logger.log('Begin: Flush Sync Queue'); }

            Ember.beginPropertyChanges();
            try {
              forEach.call(queue, iter);
            } finally {
              Ember.endPropertyChanges();
            }

            if (log) { Ember.Logger.log('End: Flush Sync Queue'); }
          } else {
            forEach.call(queue, iter);
          }
        }

        // Loop through prior queues
        for (var i = 0; i <= idx; i++) {
          if (this._queues && this._queues[queueNames[i]]) {
            // Start over at the first queue with contents
            idx = i;
            continue outerloop;
          }
        }

        idx++;
      }
    }

    timerMark = null;

    return this;
  }

};

Ember.RunLoop = RunLoop;

// ..........................................................
// Ember.run - this is ideally the only public API the dev sees
//
/**
* @namespace Ember.run is both a function and a namespace for
* RunLoop-related functions.
* @name Ember.run
*/

/**
  Runs the passed target and method inside of a RunLoop, ensuring any
  deferred actions including bindings and views updates are flushed at the
  end.

  Normally you should not need to invoke this method yourself.  However if
  you are implementing raw event handlers when interfacing with other
  libraries or plugins, you should probably wrap all of your code inside this
  call.

      Ember.run(function(){
        // code to be execute within a RunLoop
      });

  @name run
  @methodOf Ember.run
  @param {Object} target
    (Optional) target of method to call

  @param {Function|String} method
    Method to invoke.  May be a function or a string.  If you pass a string
    then it will be looked up on the passed target.

  @param {Object...} args
    Any additional arguments you wish to pass to the method.

  @returns {Object} return value from invoking the passed function.
*/
Ember.run = function(target, method) {
  var ret, loop;
  run.begin();
  try {
    if (target || method) { ret = invoke(target, method, arguments, 2); }
  } finally {
    run.end();
  }
  return ret;
};

/** @private */
var run = Ember.run;


/**
  Begins a new RunLoop.  Any deferred actions invoked after the begin will
  be buffered until you invoke a matching call to Ember.run.end().  This is
  an lower-level way to use a RunLoop instead of using Ember.run().

      Ember.run.begin();
      // code to be execute within a RunLoop
      Ember.run.end();


  @returns {void}
*/
Ember.run.begin = function() {
  run.currentRunLoop = new RunLoop(run.currentRunLoop);
};

/**
  Ends a RunLoop.  This must be called sometime after you call Ember.run.begin()
  to flush any deferred actions.  This is a lower-level way to use a RunLoop
  instead of using Ember.run().

      Ember.run.begin();
      // code to be execute within a RunLoop
      Ember.run.end();

  @returns {void}
*/
Ember.run.end = function() {
  Ember.assert('must have a current run loop', run.currentRunLoop);
  try {
    run.currentRunLoop.end();
  }
  finally {
    run.currentRunLoop = run.currentRunLoop.prev();
  }
};

/**
  Array of named queues.  This array determines the order in which queues
  are flushed at the end of the RunLoop.  You can define your own queues by
  simply adding the queue name to this array.  Normally you should not need
  to inspect or modify this property.

  @type Array
  @default ['sync', 'actions', 'destroy', 'timers']
*/
Ember.run.queues = ['sync', 'actions', 'destroy', 'timers'];

/**
  Adds the passed target/method and any optional arguments to the named
  queue to be executed at the end of the RunLoop.  If you have not already
  started a RunLoop when calling this method one will be started for you
  automatically.

  At the end of a RunLoop, any methods scheduled in this way will be invoked.
  Methods will be invoked in an order matching the named queues defined in
  the run.queues property.

      Ember.run.schedule('timers', this, function(){
        // this will be executed at the end of the RunLoop, when timers are run
        console.log("scheduled on timers queue");
      });
      Ember.run.schedule('sync', this, function(){
        // this will be executed at the end of the RunLoop, when bindings are synced
        console.log("scheduled on sync queue");
      });
      // Note the functions will be run in order based on the run queues order. Output would be:
      //   scheduled on sync queue
      //   scheduled on timers queue

  @param {String} queue
    The name of the queue to schedule against.  Default queues are 'sync' and
    'actions'

  @param {Object} target
    (Optional) target object to use as the context when invoking a method.

  @param {String|Function} method
    The method to invoke.  If you pass a string it will be resolved on the
    target object at the time the scheduled item is invoked allowing you to
    change the target function.

  @param {Object} arguments...
    Optional arguments to be passed to the queued method.

  @returns {void}
*/
Ember.run.schedule = function(queue, target, method) {
  var loop = run.autorun();
  loop.schedule.apply(loop, arguments);
};

var scheduledAutorun;
/** @private */
function autorun() {
  scheduledAutorun = null;
  if (run.currentRunLoop) { run.end(); }
}

// Used by global test teardown
/** @private */
Ember.run.hasScheduledTimers = function() {
  return !!(scheduledAutorun || scheduledLater || scheduledNext);
};

// Used by global test teardown
/** @private */
Ember.run.cancelTimers = function () {
  if (scheduledAutorun) {
    clearTimeout(scheduledAutorun);
    scheduledAutorun = null;
  }
  if (scheduledLater) {
    clearTimeout(scheduledLater);
    scheduledLater = null;
  }
  if (scheduledNext) {
    clearTimeout(scheduledNext);
    scheduledNext = null;
  }
  timers = {};
};

/**
  Begins a new RunLoop if necessary and schedules a timer to flush the
  RunLoop at a later time.  This method is used by parts of Ember to
  ensure the RunLoop always finishes.  You normally do not need to call this
  method directly.  Instead use Ember.run().

      Ember.run.autorun();

  @returns {Ember.RunLoop} the new current RunLoop
*/
Ember.run.autorun = function() {
  if (!run.currentRunLoop) {
    run.begin();

    if (!scheduledAutorun) {
      scheduledAutorun = setTimeout(autorun, 1);
    }
  }

  return run.currentRunLoop;
};

/**
  Immediately flushes any events scheduled in the 'sync' queue.  Bindings
  use this queue so this method is a useful way to immediately force all
  bindings in the application to sync.

  You should call this method anytime you need any changed state to propagate
  throughout the app immediately without repainting the UI.

      Ember.run.sync();

  @returns {void}
*/
Ember.run.sync = function() {
  run.autorun();
  run.currentRunLoop.flush('sync');
};

// ..........................................................
// TIMERS
//

var timers = {}; // active timers...

var scheduledLater;
/** @private */
function invokeLaterTimers() {
  scheduledLater = null;
  var now = (+ new Date()), earliest = -1;
  for (var key in timers) {
    if (!timers.hasOwnProperty(key)) { continue; }
    var timer = timers[key];
    if (timer && timer.expires) {
      if (now >= timer.expires) {
        delete timers[key];
        invoke(timer.target, timer.method, timer.args, 2);
      } else {
        if (earliest<0 || (timer.expires < earliest)) earliest=timer.expires;
      }
    }
  }

  // schedule next timeout to fire...
  if (earliest > 0) { scheduledLater = setTimeout(invokeLaterTimers, earliest-(+ new Date())); }
}

/**
  Invokes the passed target/method and optional arguments after a specified
  period if time.  The last parameter of this method must always be a number
  of milliseconds.

  You should use this method whenever you need to run some action after a
  period of time instead of using setTimeout().  This method will ensure that
  items that expire during the same script execution cycle all execute
  together, which is often more efficient than using a real setTimeout.

      Ember.run.later(myContext, function(){
        // code here will execute within a RunLoop in about 500ms with this == myContext
      }, 500);

  @param {Object} target
    (optional) target of method to invoke

  @param {Function|String} method
    The method to invoke.  If you pass a string it will be resolved on the
    target at the time the method is invoked.

  @param {Object...} args
    Optional arguments to pass to the timeout.

  @param {Number} wait
    Number of milliseconds to wait.

  @returns {String} a string you can use to cancel the timer in Ember.run.cancel() later.
*/
Ember.run.later = function(target, method) {
  var args, expires, timer, guid, wait;

  // setTimeout compatibility...
  if (arguments.length===2 && 'function' === typeof target) {
    wait   = method;
    method = target;
    target = undefined;
    args   = [target, method];
  } else {
    args = slice.call(arguments);
    wait = args.pop();
  }

  expires = (+ new Date()) + wait;
  timer   = { target: target, method: method, expires: expires, args: args };
  guid    = Ember.guidFor(timer);
  timers[guid] = timer;
  run.once(timers, invokeLaterTimers);
  return guid;
};

/** @private */
function invokeOnceTimer(guid, onceTimers) {
  if (onceTimers[this.tguid]) { delete onceTimers[this.tguid][this.mguid]; }
  if (timers[guid]) { invoke(this.target, this.method, this.args, 2); }
  delete timers[guid];
}

/**
  Schedules an item to run one time during the current RunLoop.  Calling
  this method with the same target/method combination will have no effect.

  Note that although you can pass optional arguments these will not be
  considered when looking for duplicates.  New arguments will replace previous
  calls.

      Ember.run(function(){
        var doFoo = function() { foo(); }
        Ember.run.once(myContext, doFoo);
        Ember.run.once(myContext, doFoo);
        // doFoo will only be executed once at the end of the RunLoop
      });

  @param {Object} target
    (optional) target of method to invoke

  @param {Function|String} method
    The method to invoke.  If you pass a string it will be resolved on the
    target at the time the method is invoked.

  @param {Object...} args
    Optional arguments to pass to the timeout.


  @returns {Object} timer
*/
Ember.run.once = function(target, method) {
  var tguid = Ember.guidFor(target),
      mguid = Ember.guidFor(method),
      onceTimers = run.autorun().onceTimers,
      guid = onceTimers[tguid] && onceTimers[tguid][mguid],
      timer;

  if (guid && timers[guid]) {
    timers[guid].args = slice.call(arguments); // replace args
  } else {
    timer = {
      target: target,
      method: method,
      args:   slice.call(arguments),
      tguid:  tguid,
      mguid:  mguid
    };

    guid  = Ember.guidFor(timer);
    timers[guid] = timer;
    if (!onceTimers[tguid]) { onceTimers[tguid] = {}; }
    onceTimers[tguid][mguid] = guid; // so it isn't scheduled more than once

    run.schedule('actions', timer, invokeOnceTimer, guid, onceTimers);
  }

  return guid;
};

var scheduledNext;
/** @private */
function invokeNextTimers() {
  scheduledNext = null;
  for(var key in timers) {
    if (!timers.hasOwnProperty(key)) { continue; }
    var timer = timers[key];
    if (timer.next) {
      delete timers[key];
      invoke(timer.target, timer.method, timer.args, 2);
    }
  }
}

/**
  Schedules an item to run after control has been returned to the system.
  This is often equivalent to calling setTimeout(function...,1).

      Ember.run.next(myContext, function(){
        // code to be executed in the next RunLoop, which will be scheduled after the current one
      });

  @param {Object} target
    (optional) target of method to invoke

  @param {Function|String} method
    The method to invoke.  If you pass a string it will be resolved on the
    target at the time the method is invoked.

  @param {Object...} args
    Optional arguments to pass to the timeout.

  @returns {Object} timer
*/
Ember.run.next = function(target, method) {
  var guid,
      timer = {
        target: target,
        method: method,
        args: slice.call(arguments),
        next: true
      };

  guid = Ember.guidFor(timer);
  timers[guid] = timer;

  if (!scheduledNext) { scheduledNext = setTimeout(invokeNextTimers, 1); }
  return guid;
};

/**
  Cancels a scheduled item.  Must be a value returned by `Ember.run.later()`,
  `Ember.run.once()`, or `Ember.run.next()`.

      var runNext = Ember.run.next(myContext, function(){
        // will not be executed
      });
      Ember.run.cancel(runNext);

      var runLater = Ember.run.later(myContext, function(){
        // will not be executed
      }, 500);
      Ember.run.cancel(runLater);

      var runOnce = Ember.run.once(myContext, function(){
        // will not be executed
      });
      Ember.run.cancel(runOnce);

  @param {Object} timer
    Timer object to cancel

  @returns {void}
*/
Ember.run.cancel = function(timer) {
  delete timers[timer];
};

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// Ember.Logger
// get, getPath, setPath, trySetPath
// guidFor, isArray, meta
// addObserver, removeObserver
// Ember.run.schedule
// ..........................................................
// CONSTANTS
//

/**
  @static

  Debug parameter you can turn on. This will log all bindings that fire to
  the console. This should be disabled in production code. Note that you
  can also enable this from the console or temporarily.

  @type Boolean
  @default false
*/
Ember.LOG_BINDINGS = false || !!Ember.ENV.LOG_BINDINGS;

var get     = Ember.get,
    getPath = Ember.getPath,
    setPath = Ember.setPath,
    guidFor = Ember.guidFor,
    isGlobalPath = Ember.isGlobalPath;


/** @private */
function getPathWithGlobals(obj, path) {
  return getPath(isGlobalPath(path) ? window : obj, path);
}

// ..........................................................
// BINDING
//

/** @private */
var Binding = function(toPath, fromPath) {
  this._direction = 'fwd';
  this._from = fromPath;
  this._to   = toPath;
  this._directionMap = Ember.Map.create();
};

Binding.prototype = /** @scope Ember.Binding.prototype */ {
  /**
    This copies the Binding so it can be connected to another object.
    @returns {Ember.Binding}
  */
  copy: function () {
    var copy = new Binding(this._to, this._from);
    if (this._oneWay) { copy._oneWay = true; }
    return copy;
  },

  // ..........................................................
  // CONFIG
  //

  /**
    This will set "from" property path to the specified value. It will not
    attempt to resolve this property path to an actual object until you
    connect the binding.

    The binding will search for the property path starting at the root object
    you pass when you connect() the binding.  It follows the same rules as
    `getPath()` - see that method for more information.

    @param {String} propertyPath the property path to connect to
    @returns {Ember.Binding} receiver
  */
  from: function(path) {
    this._from = path;
    return this;
  },

  /**
    This will set the "to" property path to the specified value. It will not
    attempt to resolve this property path to an actual object until you
    connect the binding.

    The binding will search for the property path starting at the root object
    you pass when you connect() the binding.  It follows the same rules as
    `getPath()` - see that method for more information.

    @param {String|Tuple} propertyPath A property path or tuple
    @returns {Ember.Binding} this
  */
  to: function(path) {
    this._to = path;
    return this;
  },

  /**
    Configures the binding as one way. A one-way binding will relay changes
    on the "from" side to the "to" side, but not the other way around. This
    means that if you change the "to" side directly, the "from" side may have
    a different value.

    @returns {Ember.Binding} receiver
  */
  oneWay: function() {
    this._oneWay = true;
    return this;
  },

  /** @private */
  toString: function() {
    var oneWay = this._oneWay ? '[oneWay]' : '';
    return "Ember.Binding<" + guidFor(this) + ">(" + this._from + " -> " + this._to + ")" + oneWay;
  },

  // ..........................................................
  // CONNECT AND SYNC
  //

  /**
    Attempts to connect this binding instance so that it can receive and relay
    changes. This method will raise an exception if you have not set the
    from/to properties yet.

    @param {Object} obj The root object for this binding.
    @returns {Ember.Binding} this
  */
  connect: function(obj) {
    Ember.assert('Must pass a valid object to Ember.Binding.connect()', !!obj);

    var twoWay = !this._oneWay;

    // add an observer on the object to be notified when the binding should be updated
    Ember.addObserver(obj, this._from, this, this.fromDidChange);

    // if the binding is a two-way binding, also set up an observer on the target
    // object.
    if (twoWay) { Ember.addObserver(obj, this._to, this, this.toDidChange); }

    // Don't schedule a sync if we're connecting an item on a prototype
    if (Ember.meta(obj, false).proto !== obj) { this._scheduleSync(obj, 'fwd'); }

    this._readyToSync = true;
    return this;
  },

  /**
    Disconnects the binding instance. Changes will no longer be relayed. You
    will not usually need to call this method.

    @param {Object} obj
      The root object you passed when connecting the binding.

    @returns {Ember.Binding} this
  */
  disconnect: function(obj) {
    Ember.assert('Must pass a valid object to Ember.Binding.disconnect()', !!obj);

    var twoWay = !this._oneWay;

    // remove an observer on the object so we're no longer notified of
    // changes that should update bindings.
    Ember.removeObserver(obj, this._from, this, this.fromDidChange);

    // if the binding is two-way, remove the observer from the target as well
    if (twoWay) { Ember.removeObserver(obj, this._to, this, this.toDidChange); }

    this._readyToSync = false; // disable scheduled syncs...
    return this;
  },

  // ..........................................................
  // PRIVATE
  //

  /** @private - called when the from side changes */
  fromDidChange: function(target) {
    this._scheduleSync(target, 'fwd');
  },

  /** @private - called when the to side changes */
  toDidChange: function(target) {
    this._scheduleSync(target, 'back');
  },

  /** @private */
  _scheduleSync: function(obj, dir) {
    var directionMap = this._directionMap;
    var existingDir = directionMap.get(obj);

    // if we haven't scheduled the binding yet, schedule it
    if (!existingDir) {
      Ember.run.schedule('sync', this, this._sync, obj);
      directionMap.set(obj, dir);
    }

    // If both a 'back' and 'fwd' sync have been scheduled on the same object,
    // default to a 'fwd' sync so that it remains deterministic.
    if (existingDir === 'back' && dir === 'fwd') {
      directionMap.set(obj, 'fwd');
    }
  },

  /** @private */
  _sync: function(obj) {
    var log = Ember.LOG_BINDINGS;

    // don't synchronize destroyed objects or disconnected bindings
    if (obj.isDestroyed || !this._readyToSync) { return; }

    // get the direction of the binding for the object we are
    // synchronizing from
    var directionMap = this._directionMap;
    var direction = directionMap.get(obj);

    var fromPath = this._from, toPath = this._to;

    directionMap.remove(obj);

    // if we're synchronizing from the remote object...
    if (direction === 'fwd') {
      var fromValue = getPathWithGlobals(obj, this._from);
      if (log) {
        Ember.Logger.log(' ', this.toString(), '->', fromValue, obj);
      }
      if (this._oneWay) {
        Ember.trySetPath(Ember.isGlobalPath(toPath) ? window : obj, toPath, fromValue);
      } else {
        Ember._suspendObserver(obj, toPath, this, this.toDidChange, function () {
          Ember.trySetPath(Ember.isGlobalPath(toPath) ? window : obj, toPath, fromValue);
        });
      }
    // if we're synchronizing *to* the remote object
    } else if (direction === 'back') {
      var toValue = getPath(obj, this._to);
      if (log) {
        Ember.Logger.log(' ', this.toString(), '<-', toValue, obj);
      }
      Ember._suspendObserver(obj, fromPath, this, this.fromDidChange, function () {
        Ember.trySetPath(Ember.isGlobalPath(fromPath) ? window : obj, fromPath, toValue);
      });
    }
  }

};

/** @private */
function mixinProperties(to, from) {
  for (var key in from) {
    if (from.hasOwnProperty(key)) {
      to[key] = from[key];
    }
  }
}

mixinProperties(Binding,
/** @scope Ember.Binding */ {

  /**
    @see Ember.Binding.prototype.from
  */
  from: function() {
    var C = this, binding = new C();
    return binding.from.apply(binding, arguments);
  },

  /**
    @see Ember.Binding.prototype.to
  */
  to: function() {
    var C = this, binding = new C();
    return binding.to.apply(binding, arguments);
  },

  /**
    Creates a new Binding instance and makes it apply in a single direction.
    A one-way binding will relay changes on the "from" side object (supplies
    as the `from` argument) the "to" side, but not the other way around.
    This means that if you change the "to" side directly, the "from" side may have
    a different value.

    @param {String} from from path.
    @param {Boolean} [flag] (Optional) passing nothing here will make the binding oneWay.  You can
    instead pass false to disable oneWay, making the binding two way again.

    @see Ember.Binding.prototype.oneWay
  */
  oneWay: function(from, flag) {
    var C = this, binding = new C(null, from);
    return binding.oneWay(flag);
  }

});

/**
  @class

  An Ember.Binding connects the properties of two objects so that whenever the
  value of one property changes, the other property will be changed also.

  ## Automatic Creation of Bindings with `/^*Binding/`-named Properties
  You do not usually create Binding objects directly but instead describe
  bindings in your class or object definition using automatic binding detection.

  Properties ending in a `Binding` suffix will be converted to Ember.Binding instances.
  The value of this property should be a string representing a path to another object or
  a custom binding instanced created using Binding helpers (see "Customizing Your Bindings"):

        valueBinding: "MyApp.someController.title"

  This will create a binding from `MyApp.someController.title` to the `value`
  property of your object instance automatically. Now the two values will be
  kept in sync.

  ## One Way Bindings

  One especially useful binding customization you can use is the `oneWay()`
  helper. This helper tells Ember that you are only interested in
  receiving changes on the object you are binding from. For example, if you
  are binding to a preference and you want to be notified if the preference
  has changed, but your object will not be changing the preference itself, you
  could do:

        bigTitlesBinding: Ember.Binding.oneWay("MyApp.preferencesController.bigTitles")

  This way if the value of MyApp.preferencesController.bigTitles changes the
  "bigTitles" property of your object will change also. However, if you
  change the value of your "bigTitles" property, it will not update the
  preferencesController.

  One way bindings are almost twice as fast to setup and twice as fast to
  execute because the binding only has to worry about changes to one side.

  You should consider using one way bindings anytime you have an object that
  may be created frequently and you do not intend to change a property; only
  to monitor it for changes. (such as in the example above).

  ## How to Manually Add Binding

  All of the examples above show you how to configure a custom binding, but
  the result of these customizations will be a binding template, not a fully
  active Binding instance. The binding will actually become active only when you
  instantiate the object the binding belongs to. It is useful however, to
  understand what actually happens when the binding is activated.

  For a binding to function it must have at least a "from" property and a "to"
  property. The from property path points to the object/key that you want to
  bind from while the to path points to the object/key you want to bind to.

  When you define a custom binding, you are usually describing the property
  you want to bind from (such as "MyApp.someController.value" in the examples
  above). When your object is created, it will automatically assign the value
  you want to bind "to" based on the name of your binding key. In the
  examples above, during init, Ember objects will effectively call
  something like this on your binding:

        binding = Ember.Binding.from(this.valueBinding).to("value");

  This creates a new binding instance based on the template you provide, and
  sets the to path to the "value" property of the new object. Now that the
  binding is fully configured with a "from" and a "to", it simply needs to be
  connected to become active. This is done through the connect() method:

        binding.connect(this);

  Note that when you connect a binding you pass the object you want it to be
  connected to.  This object will be used as the root for both the from and
  to side of the binding when inspecting relative paths.  This allows the
  binding to be automatically inherited by subclassed objects as well.

  Now that the binding is connected, it will observe both the from and to side
  and relay changes.

  If you ever needed to do so (you almost never will, but it is useful to
  understand this anyway), you could manually create an active binding by
  using the Ember.bind() helper method. (This is the same method used by
  to setup your bindings on objects):

        Ember.bind(MyApp.anotherObject, "value", "MyApp.someController.value");

  Both of these code fragments have the same effect as doing the most friendly
  form of binding creation like so:

        MyApp.anotherObject = Ember.Object.create({
          valueBinding: "MyApp.someController.value",

          // OTHER CODE FOR THIS OBJECT...

        });

  Ember's built in binding creation method makes it easy to automatically
  create bindings for you. You should always use the highest-level APIs
  available, even if you understand how it works underneath.

  @since Ember 0.9
*/
Ember.Binding = Binding;

/**
  Global helper method to create a new binding.  Just pass the root object
  along with a to and from path to create and connect the binding.

  @param {Object} obj
    The root object of the transform.

  @param {String} to
    The path to the 'to' side of the binding.  Must be relative to obj.

  @param {String} from
    The path to the 'from' side of the binding.  Must be relative to obj or
    a global path.

  @returns {Ember.Binding} binding instance
*/
Ember.bind = function(obj, to, from) {
  return new Ember.Binding(to, from).connect(obj);
};

Ember.oneWay = function(obj, to, from) {
  return new Ember.Binding(to, from).oneWay().connect(obj);
};

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var Mixin, REQUIRED, Alias,
    classToString, superClassString,
    a_map = Ember.ArrayPolyfills.map,
    a_indexOf = Ember.ArrayPolyfills.indexOf,
    a_forEach = Ember.ArrayPolyfills.forEach,
    a_slice = [].slice,
    EMPTY_META = {}, // dummy for non-writable meta
    META_SKIP = { __emberproto__: true, __ember_count__: true },
    o_create = Ember.create,
    guidFor = Ember.guidFor;

/** @private */
function meta(obj, writable) {
  var m = Ember.meta(obj, writable!==false), ret = m.mixins;
  if (writable===false) return ret || EMPTY_META;

  if (!ret) {
    ret = m.mixins = { __emberproto__: obj };
  } else if (ret.__emberproto__ !== obj) {
    ret = m.mixins = o_create(ret);
    ret.__emberproto__ = obj;
  }
  return ret;
}

/** @private */
function initMixin(mixin, args) {
  if (args && args.length > 0) {
    mixin.mixins = a_map.call(args, function(x) {
      if (x instanceof Mixin) { return x; }

      // Note: Manually setup a primitive mixin here.  This is the only
      // way to actually get a primitive mixin.  This way normal creation
      // of mixins will give you combined mixins...
      var mixin = new Mixin();
      mixin.properties = x;
      return mixin;
    });
  }
  return mixin;
}

var NATIVES = [Boolean, Object, Number, Array, Date, String];
/** @private */
function isMethod(obj) {
  if ('function' !== typeof obj || obj.isMethod === false) { return false; }
  return a_indexOf.call(NATIVES, obj) < 0;
}

/** @private */
function mergeMixins(mixins, m, descs, values, base) {
  var len = mixins.length, idx, mixin, guid, props, value, key, ovalue, concats;

  /** @private */
  function removeKeys(keyName) {
    delete descs[keyName];
    delete values[keyName];
  }

  for(idx=0; idx < len; idx++) {
    mixin = mixins[idx];
    Ember.assert('Expected hash or Mixin instance, got ' + Object.prototype.toString.call(mixin), typeof mixin === 'object' && mixin !== null && Object.prototype.toString.call(mixin) !== '[object Array]');

    if (mixin instanceof Mixin) {
      guid = guidFor(mixin);
      if (m[guid]) { continue; }
      m[guid] = mixin;
      props = mixin.properties;
    } else {
      props = mixin; // apply anonymous mixin properties
    }

    if (props) {
      // reset before adding each new mixin to pickup concats from previous
      concats = values.concatenatedProperties || base.concatenatedProperties;
      if (props.concatenatedProperties) {
        concats = concats ? concats.concat(props.concatenatedProperties) : props.concatenatedProperties;
      }

      for (key in props) {
        if (!props.hasOwnProperty(key)) { continue; }
        value = props[key];
        if (value instanceof Ember.Descriptor) {
          if (value === REQUIRED && descs[key]) { continue; }

          descs[key]  = value;
          values[key] = undefined;
        } else {
          // impl super if needed...
          if (isMethod(value)) {
            ovalue = descs[key] === Ember.SIMPLE_PROPERTY && values[key];
            if (!ovalue) { ovalue = base[key]; }
            if ('function' !== typeof ovalue) { ovalue = null; }
            if (ovalue) {
              var o = value.__ember_observes__, ob = value.__ember_observesBefore__;
              value = Ember.wrap(value, ovalue);
              value.__ember_observes__ = o;
              value.__ember_observesBefore__ = ob;
            }
          } else if ((concats && a_indexOf.call(concats, key) >= 0) || key === 'concatenatedProperties') {
            var baseValue = values[key] || base[key];
            value = baseValue ? baseValue.concat(value) : Ember.makeArray(value);
          }

          descs[key]  = Ember.SIMPLE_PROPERTY;
          values[key] = value;
        }
      }

      // manually copy toString() because some JS engines do not enumerate it
      if (props.hasOwnProperty('toString')) {
        base.toString = props.toString;
      }

    } else if (mixin.mixins) {
      mergeMixins(mixin.mixins, m, descs, values, base);
      if (mixin._without) { a_forEach.call(mixin._without, removeKeys); }
    }
  }
}

/** @private */
function writableReq(obj) {
  var m = Ember.meta(obj), req = m.required;
  if (!req || req.__emberproto__ !== obj) {
    req = m.required = req ? o_create(req) : { __ember_count__: 0 };
    req.__emberproto__ = obj;
  }
  return req;
}

/** @private */
function getObserverPaths(value) {
  return 'function' === typeof value && value.__ember_observes__;
}

/** @private */
function getBeforeObserverPaths(value) {
  return 'function' === typeof value && value.__ember_observesBefore__;
}

var IS_BINDING = Ember.IS_BINDING = /^.+Binding$/;


/** @private */
function detectBinding(obj, key, m) {
  if (IS_BINDING.test(key)) {
    var bindings = m.bindings;
    if (!bindings) {
      bindings = m.bindings = { __emberproto__: obj };
    } else if (bindings.__emberproto__ !== obj) {
      bindings = m.bindings = o_create(m.bindings);
      bindings.__emberproto__ = obj;
    }
    bindings[key] = true;
  }
}

/** @private */
function connectBindings(obj, m) {
  var bindings = (m || Ember.meta(obj)).bindings, key, binding;
  if (bindings) {
    for (key in bindings) {
      binding = key !== '__emberproto__' && obj[key];
      if (binding) {
        if (binding instanceof Ember.Binding) {
          binding = binding.copy(); // copy prototypes' instance
          binding.to(key.slice(0, -7));
        } else {
          binding = new Ember.Binding(key.slice(0, -7), binding);
        }
        binding.connect(obj);
        obj[key] = binding;
      }
    }
  }
}

/** @private */
function applyMixin(obj, mixins, partial) {
  var descs = {}, values = {}, m = Ember.meta(obj), req = m.required,
      key, willApply, didApply, value, desc;

  // Go through all mixins and hashes passed in, and:
  //
  // * Handle concatenated properties
  // * Set up _super wrapping if necessary
  // * Set up descriptors (simple, watched or computed properties)
  // * Copying `toString` in broken browsers
  mergeMixins(mixins, meta(obj), descs, values, obj);

  if (Ember.MixinDelegate.detect(obj)) {
    willApply = values.willApplyProperty || obj.willApplyProperty;
    didApply  = values.didApplyProperty || obj.didApplyProperty;
  }

  for(key in descs) {
    if (!descs.hasOwnProperty(key)) { continue; }

    desc = descs[key];
    value = values[key];

    if (desc === REQUIRED) {
      if (!(key in obj)) {
        Ember.assert('Required property not defined: '+key, !!partial);

        // for partial applies add to hash of required keys
        req = writableReq(obj);
        req.__ember_count__++;
        req[key] = true;
      }
    } else {
      while (desc instanceof Alias) {
        var altKey = desc.methodName;
        if (descs[altKey]) {
          value = values[altKey];
          desc  = descs[altKey];
        } else if (m.descs[altKey]) {
          desc  = m.descs[altKey];
          value = desc.val(obj, altKey);
        } else {
          value = obj[altKey];
          desc  = Ember.SIMPLE_PROPERTY;
        }
      }

      if (willApply) { willApply.call(obj, key); }

      var observerPaths = getObserverPaths(value),
          curObserverPaths = observerPaths && getObserverPaths(obj[key]),
          beforeObserverPaths = getBeforeObserverPaths(value),
          curBeforeObserverPaths = beforeObserverPaths && getBeforeObserverPaths(obj[key]),
          len, idx;

      if (curObserverPaths) {
        len = curObserverPaths.length;
        for (idx=0; idx < len; idx++) {
          Ember.removeObserver(obj, curObserverPaths[idx], null, key);
        }
      }

      if (curBeforeObserverPaths) {
        len = curBeforeObserverPaths.length;
        for (idx=0; idx < len; idx++) {
          Ember.removeBeforeObserver(obj, curBeforeObserverPaths[idx], null, key);
        }
      }

      detectBinding(obj, key, m);

      Ember.defineProperty(obj, key, desc, value);

      if (observerPaths) {
        len = observerPaths.length;
        for(idx=0; idx < len; idx++) {
          Ember.addObserver(obj, observerPaths[idx], null, key);
        }
      }

      if (beforeObserverPaths) {
        len = beforeObserverPaths.length;
        for(idx=0; idx < len; idx++) {
          Ember.addBeforeObserver(obj, beforeObserverPaths[idx], null, key);
        }
      }

      if (req && req[key]) {
        req = writableReq(obj);
        req.__ember_count__--;
        req[key] = false;
      }

      if (didApply) { didApply.call(obj, key); }
    }
  }

  if (!partial) { // don't apply to prototype
    value = connectBindings(obj, m);
  }

  // Make sure no required attrs remain
  if (!partial && req && req.__ember_count__>0) {
    var keys = [];
    for (key in req) {
      if (META_SKIP[key]) { continue; }
      keys.push(key);
    }
    // TODO: Remove surrounding if clause from production build
    Ember.assert('Required properties not defined: '+keys.join(','));
  }
  return obj;
}

Ember.mixin = function(obj) {
  var args = a_slice.call(arguments, 1);
  return applyMixin(obj, args, false);
};

/**
  @class

  The `Ember.Mixin` class allows you to create mixins, whose properties can be
  added to other classes. For instance,

      App.Editable = Ember.Mixin.create({
        edit: function() {
          console.log('starting to edit');
          this.set('isEditing', true);
        },
        isEditing: false
      });

      // Mix mixins into classes by passing them as the first arguments to
      // .extend or .create.
      App.CommentView = Ember.View.extend(App.Editable, {
        template: Ember.Handlebars.compile('{{#if isEditing}}...{{else}}...{{/if}}')
      });

      commentView = App.CommentView.create();
      commentView.edit(); // => outputs 'starting to edit'

  Note that Mixins are created with `Ember.Mixin.create`, not
  `Ember.Mixin.extend`.
*/
Ember.Mixin = function() { return initMixin(this, arguments); };

/** @private */
Mixin = Ember.Mixin;

/** @private */
Mixin._apply = applyMixin;

Mixin.applyPartial = function(obj) {
  var args = a_slice.call(arguments, 1);
  return applyMixin(obj, args, true);
};

Mixin.finishPartial = function(obj) {
  connectBindings(obj);
  return obj;
};

Mixin.create = function() {
  classToString.processed = false;
  var M = this;
  return initMixin(new M(), arguments);
};

var MixinPrototype = Mixin.prototype;

MixinPrototype.reopen = function() {
  var mixin, tmp;

  if (this.properties) {
    mixin = Mixin.create();
    mixin.properties = this.properties;
    delete this.properties;
    this.mixins = [mixin];
  } else if (!this.mixins) {
    this.mixins = [];
  }

  var len = arguments.length, mixins = this.mixins, idx;

  for(idx=0; idx < len; idx++) {
    mixin = arguments[idx];
    Ember.assert('Expected hash or Mixin instance, got ' + Object.prototype.toString.call(mixin), typeof mixin === 'object' && mixin !== null && Object.prototype.toString.call(mixin) !== '[object Array]');

    if (mixin instanceof Mixin) {
      mixins.push(mixin);
    } else {
      tmp = Mixin.create();
      tmp.properties = mixin;
      mixins.push(tmp);
    }
  }

  return this;
};

var TMP_ARRAY = [];
MixinPrototype.apply = function(obj) {
  TMP_ARRAY[0] = this;
  var ret = applyMixin(obj, TMP_ARRAY, false);
  TMP_ARRAY.length=0;
  return ret;
};

MixinPrototype.applyPartial = function(obj) {
  TMP_ARRAY[0] = this;
  var ret = applyMixin(obj, TMP_ARRAY, true);
  TMP_ARRAY.length=0;
  return ret;
};

/** @private */
function _detect(curMixin, targetMixin, seen) {
  var guid = guidFor(curMixin);

  if (seen[guid]) { return false; }
  seen[guid] = true;

  if (curMixin === targetMixin) { return true; }
  var mixins = curMixin.mixins, loc = mixins ? mixins.length : 0;
  while (--loc >= 0) {
    if (_detect(mixins[loc], targetMixin, seen)) { return true; }
  }
  return false;
}

MixinPrototype.detect = function(obj) {
  if (!obj) { return false; }
  if (obj instanceof Mixin) { return _detect(obj, this, {}); }
  return !!meta(obj, false)[guidFor(this)];
};

MixinPrototype.without = function() {
  var ret = new Mixin(this);
  ret._without = a_slice.call(arguments);
  return ret;
};

/** @private */
function _keys(ret, mixin, seen) {
  if (seen[guidFor(mixin)]) { return; }
  seen[guidFor(mixin)] = true;

  if (mixin.properties) {
    var props = mixin.properties;
    for (var key in props) {
      if (props.hasOwnProperty(key)) { ret[key] = true; }
    }
  } else if (mixin.mixins) {
    a_forEach.call(mixin.mixins, function(x) { _keys(ret, x, seen); });
  }
}

MixinPrototype.keys = function() {
  var keys = {}, seen = {}, ret = [];
  _keys(keys, this, seen);
  for(var key in keys) {
    if (keys.hasOwnProperty(key)) { ret.push(key); }
  }
  return ret;
};

/** @private - make Mixin's have nice displayNames */

var NAME_KEY = Ember.GUID_KEY+'_name';
var get = Ember.get;

/** @private */
function processNames(paths, root, seen) {
  var idx = paths.length;
  for(var key in root) {
    if (!root.hasOwnProperty || !root.hasOwnProperty(key)) { continue; }
    var obj = root[key];
    paths[idx] = key;

    if (obj && obj.toString === classToString) {
      obj[NAME_KEY] = paths.join('.');
    } else if (obj && get(obj, 'isNamespace')) {
      if (seen[guidFor(obj)]) { continue; }
      seen[guidFor(obj)] = true;
      processNames(paths, obj, seen);
    }
  }
  paths.length = idx; // cut out last item
}

/** @private */
function findNamespaces() {
  var Namespace = Ember.Namespace, obj, isNamespace;

  if (Namespace.PROCESSED) { return; }

  for (var prop in window) {
    //  get(window.globalStorage, 'isNamespace') would try to read the storage for domain isNamespace and cause exception in Firefox.
    // globalStorage is a storage obsoleted by the WhatWG storage specification. See https://developer.mozilla.org/en/DOM/Storage#globalStorage
    if (prop === "globalStorage" && window.StorageList && window.globalStorage instanceof window.StorageList) { continue; }
    // Unfortunately, some versions of IE don't support window.hasOwnProperty
    if (window.hasOwnProperty && !window.hasOwnProperty(prop)) { continue; }

    // At times we are not allowed to access certain properties for security reasons.
    // There are also times where even if we can access them, we are not allowed to access their properties.
    try {
      obj = window[prop];
      isNamespace = obj && get(obj, 'isNamespace');
    } catch (e) {
      continue;
    }

    if (isNamespace) {
      Ember.deprecate("Namespaces should not begin with lowercase.", /^[A-Z]/.test(prop));
      obj[NAME_KEY] = prop;
    }
  }
}

Ember.identifyNamespaces = findNamespaces;

/** @private */
superClassString = function(mixin) {
  var superclass = mixin.superclass;
  if (superclass) {
    if (superclass[NAME_KEY]) { return superclass[NAME_KEY]; }
    else { return superClassString(superclass); }
  } else {
    return;
  }
};

/** @private */
classToString = function() {
  var Namespace = Ember.Namespace, namespace;

  // TODO: Namespace should really be in Metal
  if (Namespace) {
    if (!this[NAME_KEY] && !classToString.processed) {
      if (!Namespace.PROCESSED) {
        findNamespaces();
        Namespace.PROCESSED = true;
      }

      classToString.processed = true;

      var namespaces = Namespace.NAMESPACES;
      for (var i=0, l=namespaces.length; i<l; i++) {
        namespace = namespaces[i];
        processNames([namespace.toString()], namespace, {});
      }
    }
  }

  if (this[NAME_KEY]) {
    return this[NAME_KEY];
  } else {
    var str = superClassString(this);
    if (str) {
      return "(subclass of " + str + ")";
    } else {
      return "(unknown mixin)";
    }
  }
};

MixinPrototype.toString = classToString;

// returns the mixins currently applied to the specified object
// TODO: Make Ember.mixin
Mixin.mixins = function(obj) {
  var ret = [], mixins = meta(obj, false), key, mixin;
  for(key in mixins) {
    if (META_SKIP[key]) { continue; }
    mixin = mixins[key];

    // skip primitive mixins since these are always anonymous
    if (!mixin.properties) { ret.push(mixins[key]); }
  }
  return ret;
};

REQUIRED = new Ember.Descriptor();
REQUIRED.toString = function() { return '(Required Property)'; };

Ember.required = function() {
  return REQUIRED;
};

/** @private */
Alias = function(methodName) {
  this.methodName = methodName;
};
Alias.prototype = new Ember.Descriptor();

Ember.alias = function(methodName) {
  return new Alias(methodName);
};

Ember.MixinDelegate = Mixin.create({
  willApplyProperty: Ember.required(),
  didApplyProperty:  Ember.required()
});

// ..........................................................
// OBSERVER HELPER
//

Ember.observer = function(func) {
  var paths = a_slice.call(arguments, 1);
  func.__ember_observes__ = paths;
  return func;
};

Ember.beforeObserver = function(func) {
  var paths = a_slice.call(arguments, 1);
  func.__ember_observesBefore__ = paths;
  return func;
};

})();



(function() {
// ==========================================================================
// Project:  Ember Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();

(function() {
/**
 * @license
 * ==========================================================================
 * Ember
 * Copyright ©2006-2011, Strobe Inc. and contributors.
 * Portions copyright ©2008-2011 Apple Inc. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * For more information about Ember, visit http://www.emberjs.com
 *
 * ==========================================================================
 */

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ENV */
var indexOf = Ember.EnumerableUtils.indexOf;

// ........................................
// TYPING & ARRAY MESSAGING
//

var TYPE_MAP = {};
var t = "Boolean Number String Function Array Date RegExp Object".split(" ");
Ember.ArrayPolyfills.forEach.call(t, function(name) {
  TYPE_MAP[ "[object " + name + "]" ] = name.toLowerCase();
});

var toString = Object.prototype.toString;

/**
  Returns a consistent type for the passed item.

  Use this instead of the built-in Ember.typeOf() to get the type of an item.
  It will return the same result across all browsers and includes a bit
  more detail.  Here is what will be returned:

      | Return Value  | Meaning                                              |
      |---------------|------------------------------------------------------|
      | 'string'      | String primitive                                     |
      | 'number'      | Number primitive                                     |
      | 'boolean'     | Boolean primitive                                    |
      | 'null'        | Null value                                           |
      | 'undefined'   | Undefined value                                      |
      | 'function'    | A function                                           |
      | 'array'       | An instance of Array                                 |
      | 'class'       | A Ember class (created using Ember.Object.extend())  |
      | 'instance'    | A Ember object instance                              |
      | 'error'       | An instance of the Error object                      |
      | 'object'      | A JavaScript object not inheriting from Ember.Object |

  Examples:

      Ember.typeOf();                      => 'undefined'
      Ember.typeOf(null);                  => 'null'
      Ember.typeOf(undefined);             => 'undefined'
      Ember.typeOf('michael');             => 'string'
      Ember.typeOf(101);                   => 'number'
      Ember.typeOf(true);                  => 'boolean'
      Ember.typeOf(Ember.makeArray);       => 'function'
      Ember.typeOf([1,2,90]);              => 'array'
      Ember.typeOf(Ember.Object.extend()); => 'class'
      Ember.typeOf(Ember.Object.create()); => 'instance'
      Ember.typeOf(new Error('teamocil')); => 'error'

      // "normal" JavaScript object
      Ember.typeOf({a: 'b'});              => 'object'

  @param item {Object} the item to check
  @returns {String} the type
*/
Ember.typeOf = function(item) {
  var ret;

  ret = (item === null || item === undefined) ? String(item) : TYPE_MAP[toString.call(item)] || 'object';

  if (ret === 'function') {
    if (Ember.Object && Ember.Object.detect(item)) ret = 'class';
  } else if (ret === 'object') {
    if (item instanceof Error) ret = 'error';
    else if (Ember.Object && item instanceof Ember.Object) ret = 'instance';
    else ret = 'object';
  }

  return ret;
};

/**
  Returns true if the passed value is null or undefined.  This avoids errors
  from JSLint complaining about use of ==, which can be technically
  confusing.

      Ember.none();             => true
      Ember.none(null);         => true
      Ember.none(undefined);    => true
      Ember.none('');           => false
      Ember.none([]);           => false
      Ember.none(function(){}); => false

  @param {Object} obj Value to test
  @returns {Boolean}
*/
Ember.none = function(obj) {
  return obj === null || obj === undefined;
};

/**
  Verifies that a value is null or an empty string | array | function.

  Constrains the rules on `Ember.none` by returning false for empty
  string and empty arrays.

      Ember.empty();               => true
      Ember.empty(null);           => true
      Ember.empty(undefined);      => true
      Ember.empty('');             => true
      Ember.empty([]);             => true
      Ember.empty('tobias fünke'); => false
      Ember.empty([0,1,2]);        => false

  @param {Object} obj Value to test
  @returns {Boolean}
*/
Ember.empty = function(obj) {
  return obj === null || obj === undefined || (obj.length === 0 && typeof obj !== 'function');
};

/**
 This will compare two javascript values of possibly different types.
 It will tell you which one is greater than the other by returning:

  - -1 if the first is smaller than the second,
  - 0 if both are equal,
  - 1 if the first is greater than the second.

 The order is calculated based on Ember.ORDER_DEFINITION, if types are different.
 In case they have the same type an appropriate comparison for this type is made.

    Ember.compare('hello', 'hello');  => 0
    Ember.compare('abc', 'dfg');      => -1
    Ember.compare(2, 1);              => 1

 @param {Object} v First value to compare
 @param {Object} w Second value to compare
 @returns {Number} -1 if v < w, 0 if v = w and 1 if v > w.
*/
Ember.compare = function compare(v, w) {
  if (v === w) { return 0; }

  var type1 = Ember.typeOf(v);
  var type2 = Ember.typeOf(w);

  var Comparable = Ember.Comparable;
  if (Comparable) {
    if (type1==='instance' && Comparable.detect(v.constructor)) {
      return v.constructor.compare(v, w);
    }

    if (type2 === 'instance' && Comparable.detect(w.constructor)) {
      return 1-w.constructor.compare(w, v);
    }
  }

  // If we haven't yet generated a reverse-mapping of Ember.ORDER_DEFINITION,
  // do so now.
  var mapping = Ember.ORDER_DEFINITION_MAPPING;
  if (!mapping) {
    var order = Ember.ORDER_DEFINITION;
    mapping = Ember.ORDER_DEFINITION_MAPPING = {};
    var idx, len;
    for (idx = 0, len = order.length; idx < len;  ++idx) {
      mapping[order[idx]] = idx;
    }

    // We no longer need Ember.ORDER_DEFINITION.
    delete Ember.ORDER_DEFINITION;
  }

  var type1Index = mapping[type1];
  var type2Index = mapping[type2];

  if (type1Index < type2Index) { return -1; }
  if (type1Index > type2Index) { return 1; }

  // types are equal - so we have to check values now
  switch (type1) {
    case 'boolean':
    case 'number':
      if (v < w) { return -1; }
      if (v > w) { return 1; }
      return 0;

    case 'string':
      var comp = v.localeCompare(w);
      if (comp < 0) { return -1; }
      if (comp > 0) { return 1; }
      return 0;

    case 'array':
      var vLen = v.length;
      var wLen = w.length;
      var l = Math.min(vLen, wLen);
      var r = 0;
      var i = 0;
      while (r === 0 && i < l) {
        r = compare(v[i],w[i]);
        i++;
      }
      if (r !== 0) { return r; }

      // all elements are equal now
      // shorter array should be ordered first
      if (vLen < wLen) { return -1; }
      if (vLen > wLen) { return 1; }
      // arrays are equal now
      return 0;

    case 'instance':
      if (Ember.Comparable && Ember.Comparable.detect(v)) {
        return v.compare(v, w);
      }
      return 0;

    default:
      return 0;
  }
};

/** @private */
function _copy(obj, deep, seen, copies) {
  var ret, loc, key;

  // primitive data types are immutable, just return them.
  if ('object' !== typeof obj || obj===null) return obj;

  // avoid cyclical loops
  if (deep && (loc=indexOf(seen, obj))>=0) return copies[loc];

  Ember.assert('Cannot clone an Ember.Object that does not implement Ember.Copyable', !(obj instanceof Ember.Object) || (Ember.Copyable && Ember.Copyable.detect(obj)));

  // IMPORTANT: this specific test will detect a native array only.  Any other
  // object will need to implement Copyable.
  if (Ember.typeOf(obj) === 'array') {
    ret = obj.slice();
    if (deep) {
      loc = ret.length;
      while(--loc>=0) ret[loc] = _copy(ret[loc], deep, seen, copies);
    }
  } else if (Ember.Copyable && Ember.Copyable.detect(obj)) {
    ret = obj.copy(deep, seen, copies);
  } else {
    ret = {};
    for(key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      ret[key] = deep ? _copy(obj[key], deep, seen, copies) : obj[key];
    }
  }

  if (deep) {
    seen.push(obj);
    copies.push(ret);
  }

  return ret;
}

/**
  Creates a clone of the passed object. This function can take just about
  any type of object and create a clone of it, including primitive values
  (which are not actually cloned because they are immutable).

  If the passed object implements the clone() method, then this function
  will simply call that method and return the result.

  @param {Object} object The object to clone
  @param {Boolean} deep If true, a deep copy of the object is made
  @returns {Object} The cloned object
*/
Ember.copy = function(obj, deep) {
  // fast paths
  if ('object' !== typeof obj || obj===null) return obj; // can't copy primitives
  if (Ember.Copyable && Ember.Copyable.detect(obj)) return obj.copy(deep);
  return _copy(obj, deep, deep ? [] : null, deep ? [] : null);
};

/**
  Convenience method to inspect an object. This method will attempt to
  convert the object into a useful string description.

  @param {Object} obj The object you want to inspect.
  @returns {String} A description of the object
*/
Ember.inspect = function(obj) {
  var v, ret = [];
  for(var key in obj) {
    if (obj.hasOwnProperty(key)) {
      v = obj[key];
      if (v === 'toString') { continue; } // ignore useless items
      if (Ember.typeOf(v) === 'function') { v = "function() { ... }"; }
      ret.push(key + ": " + v);
    }
  }
  return "{" + ret.join(" , ") + "}";
};

/**
  Compares two objects, returning true if they are logically equal.  This is
  a deeper comparison than a simple triple equal. For sets it will compare the
  internal objects.  For any other object that implements `isEqual()` it will
  respect that method.

      Ember.isEqual('hello', 'hello');  => true
      Ember.isEqual(1, 2);              => false
      Ember.isEqual([4,2], [4,2]);      => false

  @param {Object} a first object to compare
  @param {Object} b second object to compare
  @returns {Boolean}
*/
Ember.isEqual = function(a, b) {
  if (a && 'function'===typeof a.isEqual) return a.isEqual(b);
  return a === b;
};

/**
  @private
  Used by Ember.compare
*/
Ember.ORDER_DEFINITION = Ember.ENV.ORDER_DEFINITION || [
  'undefined',
  'null',
  'boolean',
  'number',
  'string',
  'array',
  'object',
  'instance',
  'function',
  'class'
];

/**
  Returns all of the keys defined on an object or hash. This is useful
  when inspecting objects for debugging.  On browsers that support it, this
  uses the native Object.keys implementation.

  @function
  @param {Object} obj
  @returns {Array} Array containing keys of obj
*/
Ember.keys = Object.keys;

if (!Ember.keys) {
  Ember.keys = function(obj) {
    var ret = [];
    for(var key in obj) {
      if (obj.hasOwnProperty(key)) { ret.push(key); }
    }
    return ret;
  };
}

// ..........................................................
// ERROR
//

/**
  @class

  A subclass of the JavaScript Error object for use in Ember.
*/
Ember.Error = function() {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  for (var p in tmp) {
    if (tmp.hasOwnProperty(p)) { this[p] = tmp[p]; }
  }
  this.message = tmp.message;
};

Ember.Error.prototype = Ember.create(Error.prototype);

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/** @private **/
var STRING_DASHERIZE_REGEXP = (/[ _]/g);
var STRING_DASHERIZE_CACHE = {};
var STRING_DECAMELIZE_REGEXP = (/([a-z])([A-Z])/g);
var STRING_CAMELIZE_REGEXP = (/(\-|_|\s)+(.)?/g);
var STRING_UNDERSCORE_REGEXP_1 = (/([a-z\d])([A-Z]+)/g);
var STRING_UNDERSCORE_REGEXP_2 = (/\-|\s+/g);

/**
  Defines the hash of localized strings for the current language.  Used by
  the `Ember.String.loc()` helper.  To localize, add string values to this
  hash.

  @type Hash
*/
Ember.STRINGS = {};

/**
  Defines string helper methods including string formatting and localization.
  Unless Ember.EXTEND_PROTOTYPES = false these methods will also be added to the
  String.prototype as well.

  @namespace
*/
Ember.String = {

  /**
    Apply formatting options to the string.  This will look for occurrences
    of %@ in your string and substitute them with the arguments you pass into
    this method.  If you want to control the specific order of replacement,
    you can add a number after the key as well to indicate which argument
    you want to insert.

    Ordered insertions are most useful when building loc strings where values
    you need to insert may appear in different orders.

        "Hello %@ %@".fmt('John', 'Doe') => "Hello John Doe"
        "Hello %@2, %@1".fmt('John', 'Doe') => "Hello Doe, John"

    @param {Object...} [args]
    @returns {String} formatted string
  */
  fmt: function(str, formats) {
    // first, replace any ORDERED replacements.
    var idx  = 0; // the current index for non-numerical replacements
    return str.replace(/%@([0-9]+)?/g, function(s, argIndex) {
      argIndex = (argIndex) ? parseInt(argIndex,0) - 1 : idx++ ;
      s = formats[argIndex];
      return ((s === null) ? '(null)' : (s === undefined) ? '' : s).toString();
    }) ;
  },

  /**
    Formats the passed string, but first looks up the string in the localized
    strings hash.  This is a convenient way to localize text.  See
    `Ember.String.fmt()` for more information on formatting.

    Note that it is traditional but not required to prefix localized string
    keys with an underscore or other character so you can easily identify
    localized strings.

        Ember.STRINGS = {
          '_Hello World': 'Bonjour le monde',
          '_Hello %@ %@': 'Bonjour %@ %@'
        };

        Ember.String.loc("_Hello World");
        => 'Bonjour le monde';

        Ember.String.loc("_Hello %@ %@", ["John", "Smith"]);
        => "Bonjour John Smith";

    @param {String} str
      The string to format

    @param {Array} formats
      Optional array of parameters to interpolate into string.

    @returns {String} formatted string
  */
  loc: function(str, formats) {
    str = Ember.STRINGS[str] || str;
    return Ember.String.fmt(str, formats) ;
  },

  /**
    Splits a string into separate units separated by spaces, eliminating any
    empty strings in the process.  This is a convenience method for split that
    is mostly useful when applied to the String.prototype.

        Ember.String.w("alpha beta gamma").forEach(function(key) {
          console.log(key);
        });
        > alpha
        > beta
        > gamma

    @param {String} str
      The string to split

    @returns {String} split string
  */
  w: function(str) { return str.split(/\s+/); },

  /**
    Converts a camelized string into all lower case separated by underscores.

        'innerHTML'.decamelize()         => 'inner_html'
        'action_name'.decamelize()       => 'action_name'
        'css-class-name'.decamelize()    => 'css-class-name'
        'my favorite items'.decamelize() => 'my favorite items'

    @param {String} str
      The string to decamelize.

    @returns {String} the decamelized string.
  */
  decamelize: function(str) {
    return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
  },

  /**
    Replaces underscores or spaces with dashes.

        'innerHTML'.dasherize()         => 'inner-html'
        'action_name'.dasherize()       => 'action-name'
        'css-class-name'.dasherize()    => 'css-class-name'
        'my favorite items'.dasherize() => 'my-favorite-items'

    @param {String} str
      The string to dasherize.

    @returns {String} the dasherized string.
  */
  dasherize: function(str) {
    var cache = STRING_DASHERIZE_CACHE,
        ret   = cache[str];

    if (ret) {
      return ret;
    } else {
      ret = Ember.String.decamelize(str).replace(STRING_DASHERIZE_REGEXP,'-');
      cache[str] = ret;
    }

    return ret;
  },

  /**
    Returns the lowerCaseCamel form of a string.

        'innerHTML'.camelize()         => 'innerHTML'
        'action_name'.camelize()       => 'actionName'
        'css-class-name'.camelize()    => 'cssClassName'
        'my favorite items'.camelize() => 'myFavoriteItems'

    @param {String} str
      The string to camelize.

    @returns {String} the camelized string.
  */
  camelize: function(str) {
    return str.replace(STRING_CAMELIZE_REGEXP, function(match, separator, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  },

  /**
    Returns the UpperCamelCase form of a string.

        'innerHTML'.classify()         => 'InnerHTML'
        'action_name'.classify()       => 'ActionName'
        'css-class-name'.classify()    => 'CssClassName'
        'my favorite items'.classift() => 'MyFavoriteItems'
  */
  classify: function(str) {
    var camelized = Ember.String.camelize(str);
    return camelized.charAt(0).toUpperCase() + camelized.substr(1);
  },

  /**
    More general than decamelize. Returns the lower_case_and_underscored
    form of a string.

        'innerHTML'.underscore()         => 'inner_html'
        'action_name'.underscore()       => 'action_name'
        'css-class-name'.underscore()    => 'css_class_name'
        'my favorite items'.underscore() => 'my_favorite_items'

    @param {String} str
      The string to underscore.

    @returns {String} the underscored string.
  */
  underscore: function(str) {
    return str.replace(STRING_UNDERSCORE_REGEXP_1, '$1_$2').
      replace(STRING_UNDERSCORE_REGEXP_2, '_').toLowerCase();
  }
};

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var fmt = Ember.String.fmt,
    w   = Ember.String.w,
    loc = Ember.String.loc,
    camelize = Ember.String.camelize,
    decamelize = Ember.String.decamelize,
    dasherize = Ember.String.dasherize,
    underscore = Ember.String.underscore;

if (Ember.EXTEND_PROTOTYPES) {

  /**
    @see Ember.String.fmt
  */
  String.prototype.fmt = function() {
    return fmt(this, arguments);
  };

  /**
    @see Ember.String.w
  */
  String.prototype.w = function() {
    return w(this);
  };

  /**
    @see Ember.String.loc
  */
  String.prototype.loc = function() {
    return loc(this, arguments);
  };

  /**
    @see Ember.String.camelize
  */
  String.prototype.camelize = function() {
    return camelize(this);
  };

  /**
    @see Ember.String.decamelize
  */
  String.prototype.decamelize = function() {
    return decamelize(this);
  };

  /**
    @see Ember.String.dasherize
  */
  String.prototype.dasherize = function() {
    return dasherize(this);
  };

  /**
    @see Ember.String.underscore
  */
  String.prototype.underscore = function() {
    return underscore(this);
  };

}


})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var a_slice = Array.prototype.slice;

if (Ember.EXTEND_PROTOTYPES) {

  /**
    The `property` extension of Javascript's Function prototype is available
    when Ember.EXTEND_PROTOTYPES is true, which is the default.

    Computed properties allow you to treat a function like a property:

        MyApp.president = Ember.Object.create({
          firstName: "Barack",
          lastName: "Obama",

          fullName: function() {
            return this.get('firstName') + ' ' + this.get('lastName');

            // Call this flag to mark the function as a property
          }.property()
        });

        MyApp.president.get('fullName');    => "Barack Obama"

    Treating a function like a property is useful because they can work with
    bindings, just like any other property.

    Many computed properties have dependencies on other properties. For
    example, in the above example, the `fullName` property depends on
    `firstName` and `lastName` to determine its value. You can tell Ember.js
    about these dependencies like this:

        MyApp.president = Ember.Object.create({
          firstName: "Barack",
          lastName: "Obama",

          fullName: function() {
            return this.get('firstName') + ' ' + this.get('lastName');

            // Tell Ember.js that this computed property depends on firstName
            // and lastName
          }.property('firstName', 'lastName')
        });

    Make sure you list these dependencies so Ember.js knows when to update
    bindings that connect to a computed property. Changing a dependency
    will not immediately trigger an update of the computed property, but
    will instead clear the cache so that it is updated when the next `get`
    is called on the property.

    Note: you will usually want to use `property(...)` with `cacheable()`.

    @see Ember.ComputedProperty
    @see Ember.computed
  */
  Function.prototype.property = function() {
    var ret = Ember.computed(this);
    return ret.property.apply(ret, arguments);
  };

  /**
    The `observes` extension of Javascript's Function prototype is available
    when Ember.EXTEND_PROTOTYPES is true, which is the default.

    You can observe property changes simply by adding the `observes`
    call to the end of your method declarations in classes that you write.
    For example:

        Ember.Object.create({
          valueObserver: function() {
            // Executes whenever the "value" property changes
          }.observes('value')
        });

    @see Ember.Observable
  */
  Function.prototype.observes = function() {
    this.__ember_observes__ = a_slice.call(arguments);
    return this;
  };

  /**
    The `observesBefore` extension of Javascript's Function prototype is
    available when Ember.EXTEND_PROTOTYPES is true, which is the default.

    You can get notified when a property changes is about to happen by
    by adding the `observesBefore` call to the end of your method
    declarations in classes that you write. For example:

        Ember.Object.create({
          valueObserver: function() {
            // Executes whenever the "value" property is about to change
          }.observesBefore('value')
        });

    @see Ember.Observable
  */
  Function.prototype.observesBefore = function() {
    this.__ember_observesBefore__ = a_slice.call(arguments);
    return this;
  };

}


})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================





// ..........................................................
// HELPERS
//

var get = Ember.get, set = Ember.set;
var a_slice = Array.prototype.slice;
var a_indexOf = Ember.EnumerableUtils.indexOf;

var contexts = [];
/** @private */
function popCtx() {
  return contexts.length===0 ? {} : contexts.pop();
}

/** @private */
function pushCtx(ctx) {
  contexts.push(ctx);
  return null;
}

/** @private */
function iter(key, value) {
  var valueProvided = arguments.length === 2;

  function i(item) {
    var cur = get(item, key);
    return valueProvided ? value===cur : !!cur;
  }
  return i ;
}

/** @private */
function xform(target, method, params) {
  method.call(target, params[0], params[2], params[3]);
}

/**
  @class

  This mixin defines the common interface implemented by enumerable objects
  in Ember.  Most of these methods follow the standard Array iteration
  API defined up to JavaScript 1.8 (excluding language-specific features that
  cannot be emulated in older versions of JavaScript).

  This mixin is applied automatically to the Array class on page load, so you
  can use any of these methods on simple arrays.  If Array already implements
  one of these methods, the mixin will not override them.

  h3. Writing Your Own Enumerable

  To make your own custom class enumerable, you need two items:

  1. You must have a length property.  This property should change whenever
     the number of items in your enumerable object changes.  If you using this
     with an Ember.Object subclass, you should be sure to change the length
     property using set().

  2. If you must implement nextObject().  See documentation.

  Once you have these two methods implement, apply the Ember.Enumerable mixin
  to your class and you will be able to enumerate the contents of your object
  like any other collection.

  h3. Using Ember Enumeration with Other Libraries

  Many other libraries provide some kind of iterator or enumeration like
  facility.  This is often where the most common API conflicts occur.
  Ember's API is designed to be as friendly as possible with other
  libraries by implementing only methods that mostly correspond to the
  JavaScript 1.8 API.

  @since Ember 0.9
*/
Ember.Enumerable = Ember.Mixin.create( /** @lends Ember.Enumerable */ {

  /** @private - compatibility */
  isEnumerable: true,

  /**
    Implement this method to make your class enumerable.

    This method will be call repeatedly during enumeration.  The index value
    will always begin with 0 and increment monotonically.  You don't have to
    rely on the index value to determine what object to return, but you should
    always check the value and start from the beginning when you see the
    requested index is 0.

    The previousObject is the object that was returned from the last call
    to nextObject for the current iteration.  This is a useful way to
    manage iteration if you are tracing a linked list, for example.

    Finally the context parameter will always contain a hash you can use as
    a "scratchpad" to maintain any other state you need in order to iterate
    properly.  The context object is reused and is not reset between
    iterations so make sure you setup the context with a fresh state whenever
    the index parameter is 0.

    Generally iterators will continue to call nextObject until the index
    reaches the your current length-1.  If you run out of data before this
    time for some reason, you should simply return undefined.

    The default implementation of this method simply looks up the index.
    This works great on any Array-like objects.

    @param index {Number} the current index of the iteration
    @param previousObject {Object} the value returned by the last call to nextObject.
    @param context {Object} a context object you can use to maintain state.
    @returns {Object} the next object in the iteration or undefined
  */
  nextObject: Ember.required(Function),

  /**
    Helper method returns the first object from a collection.  This is usually
    used by bindings and other parts of the framework to extract a single
    object if the enumerable contains only one item.

    If you override this method, you should implement it so that it will
    always return the same value each time it is called.  If your enumerable
    contains only one object, this method should always return that object.
    If your enumerable is empty, this method should return undefined.

        var arr = ["a", "b", "c"];
        arr.firstObject(); => "a"

        var arr = [];
        arr.firstObject(); => undefined

    @returns {Object} the object or undefined
  */
  firstObject: Ember.computed(function() {
    if (get(this, 'length')===0) return undefined ;

    // handle generic enumerables
    var context = popCtx(), ret;
    ret = this.nextObject(0, null, context);
    pushCtx(context);
    return ret ;
  }).property('[]').cacheable(),

  /**
    Helper method returns the last object from a collection. If your enumerable
    contains only one object, this method should always return that object.
    If your enumerable is empty, this method should return undefined.

        var arr = ["a", "b", "c"];
        arr.lastObject(); => "c"

        var arr = [];
        arr.lastObject(); => undefined

    @returns {Object} the last object or undefined
  */
  lastObject: Ember.computed(function() {
    var len = get(this, 'length');
    if (len===0) return undefined ;
    var context = popCtx(), idx=0, cur, last = null;
    do {
      last = cur;
      cur = this.nextObject(idx++, last, context);
    } while (cur !== undefined);
    pushCtx(context);
    return last;
  }).property('[]').cacheable(),

  /**
    Returns true if the passed object can be found in the receiver.  The
    default version will iterate through the enumerable until the object
    is found.  You may want to override this with a more efficient version.

        var arr = ["a", "b", "c"];
        arr.contains("a"); => true
        arr.contains("z"); => false

    @param {Object} obj
      The object to search for.

    @returns {Boolean} true if object is found in enumerable.
  */
  contains: function(obj) {
    return this.find(function(item) { return item===obj; }) !== undefined;
  },

  /**
    Iterates through the enumerable, calling the passed function on each
    item. This method corresponds to the forEach() method defined in
    JavaScript 1.6.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Object} receiver
  */
  forEach: function(callback, target) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = get(this, 'length'), last = null, context = popCtx();

    if (target === undefined) target = null;

    for(var idx=0;idx<len;idx++) {
      var next = this.nextObject(idx, last, context) ;
      callback.call(target, next, idx, this);
      last = next ;
    }
    last = null ;
    context = pushCtx(context);
    return this ;
  },

  /**
    Alias for mapProperty

    @params key {String} name of the property
    @returns {Array} The mapped array.
  */
  getEach: function(key) {
    return this.mapProperty(key);
  },

  /**
    Sets the value on the named property for each member. This is more
    efficient than using other methods defined on this helper. If the object
    implements Ember.Observable, the value will be changed to set(), otherwise
    it will be set directly. null objects are skipped.

    @param {String} key The key to set
    @param {Object} value The object to set
    @returns {Object} receiver
  */
  setEach: function(key, value) {
    return this.forEach(function(item) {
      set(item, key, value);
    });
  },

  /**
    Maps all of the items in the enumeration to another value, returning
    a new array. This method corresponds to map() defined in JavaScript 1.6.

    The callback method you provide should have the following signature (all
    parameters are optional):

        function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    It should return the mapped value.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Array} The mapped array.
  */
  map: function(callback, target) {
    var ret = [];
    this.forEach(function(x, idx, i) {
      ret[idx] = callback.call(target, x, idx,i);
    });
    return ret ;
  },

  /**
    Similar to map, this specialized function returns the value of the named
    property on all items in the enumeration.

    @params key {String} name of the property
    @returns {Array} The mapped array.
  */
  mapProperty: function(key) {
    return this.map(function(next) {
      return get(next, key);
    });
  },

  /**
    Returns an array with all of the items in the enumeration that the passed
    function returns true for. This method corresponds to filter() defined in
    JavaScript 1.6.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    It should return the true to include the item in the results, false otherwise.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Array} A filtered array.
  */
  filter: function(callback, target) {
    var ret = [];
    this.forEach(function(x, idx, i) {
      if (callback.call(target, x, idx, i)) ret.push(x);
    });
    return ret ;
  },

  /**
    Returns an array with just the items with the matched property.  You
    can pass an optional second argument with the target value.  Otherwise
    this will match any property that evaluates to true.

    @params key {String} the property to test
    @param value {String} optional value to test against.
    @returns {Array} filtered array
  */
  filterProperty: function(key, value) {
    return this.filter(iter.apply(this, arguments));
  },

  /**
    Returns the first item in the array for which the callback returns true.
    This method works similar to the filter() method defined in JavaScript 1.6
    except that it will stop working on the array once a match is found.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    It should return the true to include the item in the results, false otherwise.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Object} Found item or null.
  */
  find: function(callback, target) {
    var len = get(this, 'length') ;
    if (target === undefined) target = null;

    var last = null, next, found = false, ret ;
    var context = popCtx();
    for(var idx=0;idx<len && !found;idx++) {
      next = this.nextObject(idx, last, context) ;
      if (found = callback.call(target, next, idx, this)) ret = next ;
      last = next ;
    }
    next = last = null ;
    context = pushCtx(context);
    return ret ;
  },

  /**
    Returns an the first item with a property matching the passed value.  You
    can pass an optional second argument with the target value.  Otherwise
    this will match any property that evaluates to true.

    This method works much like the more generic find() method.

    @params key {String} the property to test
    @param value {String} optional value to test against.
    @returns {Object} found item or null
  */
  findProperty: function(key, value) {
    return this.find(iter.apply(this, arguments));
  },

  /**
    Returns true if the passed function returns true for every item in the
    enumeration. This corresponds with the every() method in JavaScript 1.6.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    It should return the true or false.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    Example Usage:

          if (people.every(isEngineer)) { Paychecks.addBigBonus(); }

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Boolean}
  */
  every: function(callback, target) {
    return !this.find(function(x, idx, i) {
      return !callback.call(target, x, idx, i);
    });
  },

  /**
    Returns true if the passed property resolves to true for all items in the
    enumerable.  This method is often simpler/faster than using a callback.

    @params key {String} the property to test
    @param value {String} optional value to test against.
    @returns {Array} filtered array
  */
  everyProperty: function(key, value) {
    return this.every(iter.apply(this, arguments));
  },


  /**
    Returns true if the passed function returns true for any item in the
    enumeration. This corresponds with the every() method in JavaScript 1.6.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    It should return the true to include the item in the results, false otherwise.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    Usage Example:

          if (people.some(isManager)) { Paychecks.addBiggerBonus(); }

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Array} A filtered array.
  */
  some: function(callback, target) {
    return !!this.find(function(x, idx, i) {
      return !!callback.call(target, x, idx, i);
    });
  },

  /**
    Returns true if the passed property resolves to true for any item in the
    enumerable.  This method is often simpler/faster than using a callback.

    @params key {String} the property to test
    @param value {String} optional value to test against.
    @returns {Boolean} true
  */
  someProperty: function(key, value) {
    return this.some(iter.apply(this, arguments));
  },

  /**
    This will combine the values of the enumerator into a single value. It
    is a useful way to collect a summary value from an enumeration. This
    corresponds to the reduce() method defined in JavaScript 1.8.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(previousValue, item, index, enumerable);

    - *previousValue* is the value returned by the last call to the iterator.
    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    Return the new cumulative value.

    In addition to the callback you can also pass an initialValue. An error
    will be raised if you do not pass an initial value and the enumerator is
    empty.

    Note that unlike the other methods, this method does not allow you to
    pass a target object to set as this for the callback. It's part of the
    spec. Sorry.

    @param {Function} callback The callback to execute
    @param {Object} initialValue Initial value for the reduce
    @param {String} reducerProperty internal use only.
    @returns {Object} The reduced value.
  */
  reduce: function(callback, initialValue, reducerProperty) {
    if (typeof callback !== "function") { throw new TypeError(); }

    var ret = initialValue;

    this.forEach(function(item, i) {
      ret = callback.call(null, ret, item, i, this, reducerProperty);
    }, this);

    return ret;
  },

  /**
    Invokes the named method on every object in the receiver that
    implements it.  This method corresponds to the implementation in
    Prototype 1.6.

    @param methodName {String} the name of the method
    @param args {Object...} optional arguments to pass as well.
    @returns {Array} return values from calling invoke.
  */
  invoke: function(methodName) {
    var args, ret = [];
    if (arguments.length>1) args = a_slice.call(arguments, 1);

    this.forEach(function(x, idx) {
      var method = x && x[methodName];
      if ('function' === typeof method) {
        ret[idx] = args ? method.apply(x, args) : method.call(x);
      }
    }, this);

    return ret;
  },

  /**
    Simply converts the enumerable into a genuine array.  The order is not
    guaranteed.  Corresponds to the method implemented by Prototype.

    @returns {Array} the enumerable as an array.
  */
  toArray: function() {
    var ret = [];
    this.forEach(function(o, idx) { ret[idx] = o; });
    return ret ;
  },

  /**
    Returns a copy of the array with all null elements removed.

        var arr = ["a", null, "c", null];
        arr.compact(); => ["a", "c"]

    @returns {Array} the array without null elements.
  */
  compact: function() { return this.without(null); },

  /**
    Returns a new enumerable that excludes the passed value.  The default
    implementation returns an array regardless of the receiver type unless
    the receiver does not contain the value.

        var arr = ["a", "b", "a", "c"];
        arr.without("a"); => ["b", "c"]

    @param {Object} value
    @returns {Ember.Enumerable}
  */
  without: function(value) {
    if (!this.contains(value)) return this; // nothing to do
    var ret = [] ;
    this.forEach(function(k) {
      if (k !== value) ret[ret.length] = k;
    }) ;
    return ret ;
  },

  /**
    Returns a new enumerable that contains only unique values.  The default
    implementation returns an array regardless of the receiver type.

        var arr = ["a", "a", "b", "b"];
        arr.uniq(); => ["a", "b"]

    @returns {Ember.Enumerable}
  */
  uniq: function() {
    var ret = [];
    this.forEach(function(k){
      if (a_indexOf(ret, k)<0) ret.push(k);
    });
    return ret;
  },

  /**
    This property will trigger anytime the enumerable's content changes.
    You can observe this property to be notified of changes to the enumerables
    content.

    For plain enumerables, this property is read only.  Ember.Array overrides
    this method.

    @type Ember.Array
  */
  '[]': Ember.computed(function(key, value) {
    return this;
  }).property().cacheable(),

  // ..........................................................
  // ENUMERABLE OBSERVERS
  //

  /**
    Registers an enumerable observer.   Must implement Ember.EnumerableObserver
    mixin.
  */
  addEnumerableObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'enumerableWillChange',
        didChange  = (opts && opts.didChange) || 'enumerableDidChange';

    var hasObservers = get(this, 'hasEnumerableObservers');
    if (!hasObservers) Ember.propertyWillChange(this, 'hasEnumerableObservers');
    Ember.addListener(this, '@enumerable:before', target, willChange, xform);
    Ember.addListener(this, '@enumerable:change', target, didChange, xform);
    if (!hasObservers) Ember.propertyDidChange(this, 'hasEnumerableObservers');
    return this;
  },

  /**
    Removes a registered enumerable observer.
  */
  removeEnumerableObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'enumerableWillChange',
        didChange  = (opts && opts.didChange) || 'enumerableDidChange';

    var hasObservers = get(this, 'hasEnumerableObservers');
    if (hasObservers) Ember.propertyWillChange(this, 'hasEnumerableObservers');
    Ember.removeListener(this, '@enumerable:before', target, willChange);
    Ember.removeListener(this, '@enumerable:change', target, didChange);
    if (hasObservers) Ember.propertyDidChange(this, 'hasEnumerableObservers');
    return this;
  },

  /**
    Becomes true whenever the array currently has observers watching changes
    on the array.

    @type Boolean
  */
  hasEnumerableObservers: Ember.computed(function() {
    return Ember.hasListeners(this, '@enumerable:change') || Ember.hasListeners(this, '@enumerable:before');
  }).property().cacheable(),


  /**
    Invoke this method just before the contents of your enumerable will
    change.  You can either omit the parameters completely or pass the objects
    to be removed or added if available or just a count.

    @param {Ember.Enumerable|Number} removing
      An enumerable of the objects to be removed or the number of items to
      be removed.

    @param {Ember.Enumerable|Number} adding
      An enumerable of the objects to be added or the number of items to be
      added.

    @returns {Ember.Enumerable} receiver
  */
  enumerableContentWillChange: function(removing, adding) {

    var removeCnt, addCnt, hasDelta;

    if ('number' === typeof removing) removeCnt = removing;
    else if (removing) removeCnt = get(removing, 'length');
    else removeCnt = removing = -1;

    if ('number' === typeof adding) addCnt = adding;
    else if (adding) addCnt = get(adding,'length');
    else addCnt = adding = -1;

    hasDelta = addCnt<0 || removeCnt<0 || addCnt-removeCnt!==0;

    if (removing === -1) removing = null;
    if (adding   === -1) adding   = null;

    Ember.propertyWillChange(this, '[]');
    if (hasDelta) Ember.propertyWillChange(this, 'length');
    Ember.sendEvent(this, '@enumerable:before', removing, adding);

    return this;
  },

  /**
    Invoke this method when the contents of your enumerable has changed.
    This will notify any observers watching for content changes.  If your are
    implementing an ordered enumerable (such as an array), also pass the
    start and end values where the content changed so that it can be used to
    notify range observers.

    @param {Number} start
      optional start offset for the content change.  For unordered
      enumerables, you should always pass -1.

    @param {Ember.Enumerable|Number} removing
      An enumerable of the objects to be removed or the number of items to
      be removed.

    @param {Ember.Enumerable|Numbe} adding
      An enumerable of the objects to be added or the number of items to be
      added.

    @returns {Object} receiver
  */
  enumerableContentDidChange: function(removing, adding) {
    var notify = this.propertyDidChange, removeCnt, addCnt, hasDelta;

    if ('number' === typeof removing) removeCnt = removing;
    else if (removing) removeCnt = get(removing, 'length');
    else removeCnt = removing = -1;

    if ('number' === typeof adding) addCnt = adding;
    else if (adding) addCnt = get(adding, 'length');
    else addCnt = adding = -1;

    hasDelta = addCnt<0 || removeCnt<0 || addCnt-removeCnt!==0;

    if (removing === -1) removing = null;
    if (adding   === -1) adding   = null;

    Ember.sendEvent(this, '@enumerable:change', removing, adding);
    if (hasDelta) Ember.propertyDidChange(this, 'length');
    Ember.propertyDidChange(this, '[]');

    return this ;
  }

}) ;




})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ..........................................................
// HELPERS
//

var get = Ember.get, set = Ember.set, meta = Ember.meta, map = Ember.EnumerableUtils.map, cacheFor = Ember.cacheFor;

/** @private */
function none(obj) { return obj===null || obj===undefined; }

/** @private */
function xform(target, method, params) {
  method.call(target, params[0], params[2], params[3], params[4]);
}

// ..........................................................
// ARRAY
//
/**
  @namespace

  This module implements Observer-friendly Array-like behavior.  This mixin is
  picked up by the Array class as well as other controllers, etc. that want to
  appear to be arrays.

  Unlike Ember.Enumerable, this mixin defines methods specifically for
  collections that provide index-ordered access to their contents.  When you
  are designing code that needs to accept any kind of Array-like object, you
  should use these methods instead of Array primitives because these will
  properly notify observers of changes to the array.

  Although these methods are efficient, they do add a layer of indirection to
  your application so it is a good idea to use them only when you need the
  flexibility of using both true JavaScript arrays and "virtual" arrays such
  as controllers and collections.

  You can use the methods defined in this module to access and modify array
  contents in a KVO-friendly way.  You can also be notified whenever the
  membership if an array changes by changing the syntax of the property to
  .observes('*myProperty.[]') .

  To support Ember.Array in your own class, you must override two
  primitives to use it: replace() and objectAt().

  Note that the Ember.Array mixin also incorporates the Ember.Enumerable mixin.  All
  Ember.Array-like objects are also enumerable.

  @extends Ember.Enumerable
  @since Ember 0.9.0
*/
Ember.Array = Ember.Mixin.create(Ember.Enumerable, /** @scope Ember.Array.prototype */ {

  /** @private - compatibility */
  isSCArray: true,

  /**
    @field {Number} length

    Your array must support the length property. Your replace methods should
    set this property whenever it changes.
  */
  length: Ember.required(),

  /**
    Returns the object at the given index. If the given index is negative or
    is greater or equal than the array length, returns `undefined`.

    This is one of the primitives you must implement to support `Ember.Array`.
    If your object supports retrieving the value of an array item using `get()`
    (i.e. `myArray.get(0)`), then you do not need to implement this method
    yourself.

        var arr = ['a', 'b', 'c', 'd'];
        arr.objectAt(0);  => "a"
        arr.objectAt(3);  => "d"
        arr.objectAt(-1); => undefined
        arr.objectAt(4);  => undefined
        arr.objectAt(5);  => undefined

    @param {Number} idx
      The index of the item to return.
  */
  objectAt: function(idx) {
    if ((idx < 0) || (idx>=get(this, 'length'))) return undefined ;
    return get(this, idx);
  },

  /**
    This returns the objects at the specified indexes, using `objectAt`.

        var arr = ['a', 'b', 'c', 'd'];
        arr.objectsAt([0, 1, 2]) => ["a", "b", "c"]
        arr.objectsAt([2, 3, 4]) => ["c", "d", undefined]

    @param {Array} indexes
      An array of indexes of items to return.
   */
  objectsAt: function(indexes) {
    var self = this;
    return map(indexes, function(idx){ return self.objectAt(idx); });
  },

  /** @private (nodoc) - overrides Ember.Enumerable version */
  nextObject: function(idx) {
    return this.objectAt(idx);
  },

  /**
    @field []

    This is the handler for the special array content property.  If you get
    this property, it will return this.  If you set this property it a new
    array, it will replace the current content.

    This property overrides the default property defined in Ember.Enumerable.
  */
  '[]': Ember.computed(function(key, value) {
    if (value !== undefined) this.replace(0, get(this, 'length'), value) ;
    return this ;
  }).property().cacheable(),

  firstObject: Ember.computed(function() {
    return this.objectAt(0);
  }).property().cacheable(),

  lastObject: Ember.computed(function() {
    return this.objectAt(get(this, 'length')-1);
  }).property().cacheable(),

  /** @private (nodoc) - optimized version from Enumerable */
  contains: function(obj){
    return this.indexOf(obj) >= 0;
  },

  // Add any extra methods to Ember.Array that are native to the built-in Array.
  /**
    Returns a new array that is a slice of the receiver. This implementation
    uses the observable array methods to retrieve the objects for the new
    slice.

        var arr = ['red', 'green', 'blue'];
        arr.slice(0);      => ['red', 'green', 'blue']
        arr.slice(0, 2);   => ['red', 'green']
        arr.slice(1, 100); => ['green', 'blue']

    @param beginIndex {Integer} (Optional) index to begin slicing from.
    @param endIndex {Integer} (Optional) index to end the slice at.
    @returns {Array} New array with specified slice
  */
  slice: function(beginIndex, endIndex) {
    var ret = [];
    var length = get(this, 'length') ;
    if (none(beginIndex)) beginIndex = 0 ;
    if (none(endIndex) || (endIndex > length)) endIndex = length ;
    while(beginIndex < endIndex) {
      ret[ret.length] = this.objectAt(beginIndex++) ;
    }
    return ret ;
  },

  /**
    Returns the index of the given object's first occurrence.
    If no startAt argument is given, the starting location to
    search is 0. If it's negative, will count backward from
    the end of the array. Returns -1 if no match is found.

        var arr = ["a", "b", "c", "d", "a"];
        arr.indexOf("a");      =>  0
        arr.indexOf("z");      => -1
        arr.indexOf("a", 2);   =>  4
        arr.indexOf("a", -1);  =>  4
        arr.indexOf("b", 3);   => -1
        arr.indexOf("a", 100); => -1

    @param {Object} object the item to search for
    @param {Number} startAt optional starting location to search, default 0
    @returns {Number} index or -1 if not found
  */
  indexOf: function(object, startAt) {
    var idx, len = get(this, 'length');

    if (startAt === undefined) startAt = 0;
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx<len;idx++) {
      if (this.objectAt(idx, true) === object) return idx ;
    }
    return -1;
  },

  /**
    Returns the index of the given object's last occurrence.
    If no startAt argument is given, the search starts from
    the last position. If it's negative, will count backward
    from the end of the array. Returns -1 if no match is found.

        var arr = ["a", "b", "c", "d", "a"];
        arr.lastIndexOf("a");      =>  4
        arr.lastIndexOf("z");      => -1
        arr.lastIndexOf("a", 2);   =>  0
        arr.lastIndexOf("a", -1);  =>  4
        arr.lastIndexOf("b", 3);   =>  1
        arr.lastIndexOf("a", 100); =>  4

    @param {Object} object the item to search for
    @param {Number} startAt optional starting location to search, default 0
    @returns {Number} index or -1 if not found
  */
  lastIndexOf: function(object, startAt) {
    var idx, len = get(this, 'length');

    if (startAt === undefined || startAt >= len) startAt = len-1;
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx>=0;idx--) {
      if (this.objectAt(idx) === object) return idx ;
    }
    return -1;
  },

  // ..........................................................
  // ARRAY OBSERVERS
  //

  /**
    Adds an array observer to the receiving array.  The array observer object
    normally must implement two methods:

    * `arrayWillChange(start, removeCount, addCount)` - This method will be
      called just before the array is modified.
    * `arrayDidChange(start, removeCount, addCount)` - This method will be
      called just after the array is modified.

    Both callbacks will be passed the starting index of the change as well a
    a count of the items to be removed and added.  You can use these callbacks
    to optionally inspect the array during the change, clear caches, or do
    any other bookkeeping necessary.

    In addition to passing a target, you can also include an options hash
    which you can use to override the method names that will be invoked on the
    target.

    @param {Object} target
      The observer object.

    @param {Hash} opts
      Optional hash of configuration options including willChange, didChange,
      and a context option.

    @returns {Ember.Array} receiver
  */
  addArrayObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'arrayWillChange',
        didChange  = (opts && opts.didChange) || 'arrayDidChange';

    var hasObservers = get(this, 'hasArrayObservers');
    if (!hasObservers) Ember.propertyWillChange(this, 'hasArrayObservers');
    Ember.addListener(this, '@array:before', target, willChange, xform);
    Ember.addListener(this, '@array:change', target, didChange, xform);
    if (!hasObservers) Ember.propertyDidChange(this, 'hasArrayObservers');
    return this;
  },

  /**
    Removes an array observer from the object if the observer is current
    registered.  Calling this method multiple times with the same object will
    have no effect.

    @param {Object} target
      The object observing the array.

    @returns {Ember.Array} receiver
  */
  removeArrayObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'arrayWillChange',
        didChange  = (opts && opts.didChange) || 'arrayDidChange';

    var hasObservers = get(this, 'hasArrayObservers');
    if (hasObservers) Ember.propertyWillChange(this, 'hasArrayObservers');
    Ember.removeListener(this, '@array:before', target, willChange, xform);
    Ember.removeListener(this, '@array:change', target, didChange, xform);
    if (hasObservers) Ember.propertyDidChange(this, 'hasArrayObservers');
    return this;
  },

  /**
    Becomes true whenever the array currently has observers watching changes
    on the array.

    @type Boolean
  */
  hasArrayObservers: Ember.computed(function() {
    return Ember.hasListeners(this, '@array:change') || Ember.hasListeners(this, '@array:before');
  }).property().cacheable(),

  /**
    If you are implementing an object that supports Ember.Array, call this
    method just before the array content changes to notify any observers and
    invalidate any related properties.  Pass the starting index of the change
    as well as a delta of the amounts to change.

    @param {Number} startIdx
      The starting index in the array that will change.

    @param {Number} removeAmt
      The number of items that will be removed.  If you pass null assumes 0

    @param {Number} addAmt
      The number of items that will be added.  If you pass null assumes 0.

    @returns {Ember.Array} receiver
  */
  arrayContentWillChange: function(startIdx, removeAmt, addAmt) {

    // if no args are passed assume everything changes
    if (startIdx===undefined) {
      startIdx = 0;
      removeAmt = addAmt = -1;
    } else {
      if (removeAmt === undefined) removeAmt=-1;
      if (addAmt    === undefined) addAmt=-1;
    }

    // Make sure the @each proxy is set up if anyone is observing @each
    if (Ember.isWatching(this, '@each')) { get(this, '@each'); }

    Ember.sendEvent(this, '@array:before', startIdx, removeAmt, addAmt);

    var removing, lim;
    if (startIdx>=0 && removeAmt>=0 && get(this, 'hasEnumerableObservers')) {
      removing = [];
      lim = startIdx+removeAmt;
      for(var idx=startIdx;idx<lim;idx++) removing.push(this.objectAt(idx));
    } else {
      removing = removeAmt;
    }

    this.enumerableContentWillChange(removing, addAmt);

    return this;
  },

  arrayContentDidChange: function(startIdx, removeAmt, addAmt) {

    // if no args are passed assume everything changes
    if (startIdx===undefined) {
      startIdx = 0;
      removeAmt = addAmt = -1;
    } else {
      if (removeAmt === undefined) removeAmt=-1;
      if (addAmt    === undefined) addAmt=-1;
    }

    var adding, lim;
    if (startIdx>=0 && addAmt>=0 && get(this, 'hasEnumerableObservers')) {
      adding = [];
      lim = startIdx+addAmt;
      for(var idx=startIdx;idx<lim;idx++) adding.push(this.objectAt(idx));
    } else {
      adding = addAmt;
    }

    this.enumerableContentDidChange(removeAmt, adding);
    Ember.sendEvent(this, '@array:change', startIdx, removeAmt, addAmt);

    var length      = get(this, 'length'),
        cachedFirst = cacheFor(this, 'firstObject'),
        cachedLast  = cacheFor(this, 'lastObject');
    if (this.objectAt(0) !== cachedFirst) {
      Ember.propertyWillChange(this, 'firstObject');
      Ember.propertyDidChange(this, 'firstObject');
    }
    if (this.objectAt(length-1) !== cachedLast) {
      Ember.propertyWillChange(this, 'lastObject');
      Ember.propertyDidChange(this, 'lastObject');
    }

    return this;
  },

  // ..........................................................
  // ENUMERATED PROPERTIES
  //

  /**
    Returns a special object that can be used to observe individual properties
    on the array.  Just get an equivalent property on this object and it will
    return an enumerable that maps automatically to the named key on the
    member objects.
  */
  '@each': Ember.computed(function() {
    if (!this.__each) this.__each = new Ember.EachProxy(this);
    return this.__each;
  }).property().cacheable()

}) ;

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/**
  @namespace

  Implements some standard methods for comparing objects. Add this mixin to
  any class you create that can compare its instances.

  You should implement the compare() method.

  @since Ember 0.9
*/
Ember.Comparable = Ember.Mixin.create( /** @scope Ember.Comparable.prototype */{

  /**
    walk like a duck. Indicates that the object can be compared.

    @type Boolean
    @default true
    @constant
  */
  isComparable: true,

  /**
    Override to return the result of the comparison of the two parameters. The
    compare method should return:

      - `-1` if `a < b`
      - `0` if `a == b`
      - `1` if `a > b`

    Default implementation raises an exception.

    @param a {Object} the first object to compare
    @param b {Object} the second object to compare
    @returns {Integer} the result of the comparison
  */
  compare: Ember.required(Function)

});


})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

/**
  @namespace

  Implements some standard methods for copying an object.  Add this mixin to
  any object you create that can create a copy of itself.  This mixin is
  added automatically to the built-in array.

  You should generally implement the copy() method to return a copy of the
  receiver.

  Note that frozenCopy() will only work if you also implement Ember.Freezable.

  @since Ember 0.9
*/
Ember.Copyable = Ember.Mixin.create(
/** @scope Ember.Copyable.prototype */ {

  /**
    Override to return a copy of the receiver.  Default implementation raises
    an exception.

    @param deep {Boolean} if true, a deep copy of the object should be made
    @returns {Object} copy of receiver
  */
  copy: Ember.required(Function),

  /**
    If the object implements Ember.Freezable, then this will return a new copy
    if the object is not frozen and the receiver if the object is frozen.

    Raises an exception if you try to call this method on a object that does
    not support freezing.

    You should use this method whenever you want a copy of a freezable object
    since a freezable object can simply return itself without actually
    consuming more memory.

    @returns {Object} copy of receiver or receiver
  */
  frozenCopy: function() {
    if (Ember.Freezable && Ember.Freezable.detect(this)) {
      return get(this, 'isFrozen') ? this : this.copy().freeze();
    } else {
      throw new Error(Ember.String.fmt("%@ does not support freezing", [this]));
    }
  }
});




})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================





var get = Ember.get, set = Ember.set;

/**
  @namespace

  The Ember.Freezable mixin implements some basic methods for marking an object
  as frozen. Once an object is frozen it should be read only. No changes
  may be made the internal state of the object.

  ## Enforcement

  To fully support freezing in your subclass, you must include this mixin and
  override any method that might alter any property on the object to instead
  raise an exception. You can check the state of an object by checking the
  isFrozen property.

  Although future versions of JavaScript may support language-level freezing
  object objects, that is not the case today. Even if an object is freezable,
  it is still technically possible to modify the object, even though it could
  break other parts of your application that do not expect a frozen object to
  change. It is, therefore, very important that you always respect the
  isFrozen property on all freezable objects.

  ## Example Usage

  The example below shows a simple object that implement the Ember.Freezable
  protocol.

        Contact = Ember.Object.extend(Ember.Freezable, {

          firstName: null,

          lastName: null,

          // swaps the names
          swapNames: function() {
            if (this.get('isFrozen')) throw Ember.FROZEN_ERROR;
            var tmp = this.get('firstName');
            this.set('firstName', this.get('lastName'));
            this.set('lastName', tmp);
            return this;
          }

        });

        c = Context.create({ firstName: "John", lastName: "Doe" });
        c.swapNames();  => returns c
        c.freeze();
        c.swapNames();  => EXCEPTION

  ## Copying

  Usually the Ember.Freezable protocol is implemented in cooperation with the
  Ember.Copyable protocol, which defines a frozenCopy() method that will return
  a frozen object, if the object implements this method as well.

  @since Ember 0.9
*/
Ember.Freezable = Ember.Mixin.create(
/** @scope Ember.Freezable.prototype */ {

  /**
    Set to true when the object is frozen.  Use this property to detect whether
    your object is frozen or not.

    @type Boolean
  */
  isFrozen: false,

  /**
    Freezes the object.  Once this method has been called the object should
    no longer allow any properties to be edited.

    @returns {Object} receiver
  */
  freeze: function() {
    if (get(this, 'isFrozen')) return this;
    set(this, 'isFrozen', true);
    return this;
  }

});

Ember.FROZEN_ERROR = "Frozen object cannot be modified.";




})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var forEach = Ember.EnumerableUtils.forEach;

/**
  @class

  This mixin defines the API for modifying generic enumerables.  These methods
  can be applied to an object regardless of whether it is ordered or
  unordered.

  Note that an Enumerable can change even if it does not implement this mixin.
  For example, a MappedEnumerable cannot be directly modified but if its
  underlying enumerable changes, it will change also.

  ## Adding Objects

  To add an object to an enumerable, use the addObject() method.  This
  method will only add the object to the enumerable if the object is not
  already present and the object if of a type supported by the enumerable.

      set.addObject(contact);

  ## Removing Objects

  To remove an object form an enumerable, use the removeObject() method.  This
  will only remove the object if it is already in the enumerable, otherwise
  this method has no effect.

      set.removeObject(contact);

  ## Implementing In Your Own Code

  If you are implementing an object and want to support this API, just include
  this mixin in your class and implement the required methods.  In your unit
  tests, be sure to apply the Ember.MutableEnumerableTests to your object.

  @extends Ember.Mixin
  @extends Ember.Enumerable
*/
Ember.MutableEnumerable = Ember.Mixin.create(Ember.Enumerable,
  /** @scope Ember.MutableEnumerable.prototype */ {

  /**
    __Required.__ You must implement this method to apply this mixin.

    Attempts to add the passed object to the receiver if the object is not
    already present in the collection. If the object is present, this method
    has no effect.

    If the passed object is of a type not supported by the receiver
    then this method should raise an exception.

    @param {Object} object
      The object to add to the enumerable.

    @returns {Object} the passed object
  */
  addObject: Ember.required(Function),

  /**
    Adds each object in the passed enumerable to the receiver.

    @param {Ember.Enumerable} objects the objects to add.
    @returns {Object} receiver
  */
  addObjects: function(objects) {
    Ember.beginPropertyChanges(this);
    forEach(objects, function(obj) { this.addObject(obj); }, this);
    Ember.endPropertyChanges(this);
    return this;
  },

  /**
    __Required.__ You must implement this method to apply this mixin.

    Attempts to remove the passed object from the receiver collection if the
    object is in present in the collection.  If the object is not present,
    this method has no effect.

    If the passed object is of a type not supported by the receiver
    then this method should raise an exception.

    @param {Object} object
      The object to remove from the enumerable.

    @returns {Object} the passed object
  */
  removeObject: Ember.required(Function),


  /**
    Removes each objects in the passed enumerable from the receiver.

    @param {Ember.Enumerable} objects the objects to remove
    @returns {Object} receiver
  */
  removeObjects: function(objects) {
    Ember.beginPropertyChanges(this);
    forEach(objects, function(obj) { this.removeObject(obj); }, this);
    Ember.endPropertyChanges(this);
    return this;
  }

});

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ..........................................................
// CONSTANTS
//

var OUT_OF_RANGE_EXCEPTION = "Index out of range" ;
var EMPTY = [];

// ..........................................................
// HELPERS
//

var get = Ember.get, set = Ember.set, forEach = Ember.EnumerableUtils.forEach;

/**
  @class

  This mixin defines the API for modifying array-like objects.  These methods
  can be applied only to a collection that keeps its items in an ordered set.

  Note that an Array can change even if it does not implement this mixin.
  For example, one might implement a SparseArray that cannot be directly
  modified, but if its underlying enumerable changes, it will change also.

  @extends Ember.Mixin
  @extends Ember.Array
  @extends Ember.MutableEnumerable
*/
Ember.MutableArray = Ember.Mixin.create(Ember.Array, Ember.MutableEnumerable,
  /** @scope Ember.MutableArray.prototype */ {

  /**
    __Required.__ You must implement this method to apply this mixin.

    This is one of the primitives you must implement to support Ember.Array.  You
    should replace amt objects started at idx with the objects in the passed
    array.  You should also call this.enumerableContentDidChange() ;

    @param {Number} idx
      Starting index in the array to replace.  If idx >= length, then append
      to the end of the array.

    @param {Number} amt
      Number of elements that should be removed from the array, starting at
      *idx*.

    @param {Array} objects
      An array of zero or more objects that should be inserted into the array
      at *idx*
  */
  replace: Ember.required(),

  /**
    Remove all elements from self. This is useful if you
    want to reuse an existing array without having to recreate it.

        var colors = ["red", "green", "blue"];
        color.length();  => 3
        colors.clear();  => []
        colors.length(); => 0

    @returns {Ember.Array} An empty Array.
  */
  clear: function () {
    var len = get(this, 'length');
    if (len === 0) return this;
    this.replace(0, len, EMPTY);
    return this;
  },

  /**
    This will use the primitive replace() method to insert an object at the
    specified index.

        var colors = ["red", "green", "blue"];
        colors.insertAt(2, "yellow"); => ["red", "green", "yellow", "blue"]
        colors.insertAt(5, "orange"); => Error: Index out of range

    @param {Number} idx index of insert the object at.
    @param {Object} object object to insert
  */
  insertAt: function(idx, object) {
    if (idx > get(this, 'length')) throw new Error(OUT_OF_RANGE_EXCEPTION) ;
    this.replace(idx, 0, [object]) ;
    return this ;
  },

  /**
    Remove an object at the specified index using the replace() primitive
    method.  You can pass either a single index, or a start and a length.

    If you pass a start and length that is beyond the
    length this method will throw an Ember.OUT_OF_RANGE_EXCEPTION

        var colors = ["red", "green", "blue", "yellow", "orange"];
        colors.removeAt(0); => ["green", "blue", "yellow", "orange"]
        colors.removeAt(2, 2); => ["green", "blue"]
        colors.removeAt(4, 2); => Error: Index out of range

    @param {Number} start index, start of range
    @param {Number} len length of passing range
    @returns {Object} receiver
  */
  removeAt: function(start, len) {

    var delta = 0;

    if ('number' === typeof start) {

      if ((start < 0) || (start >= get(this, 'length'))) {
        throw new Error(OUT_OF_RANGE_EXCEPTION);
      }

      // fast case
      if (len === undefined) len = 1;
      this.replace(start, len, EMPTY);
    }

    return this ;
  },

  /**
    Push the object onto the end of the array.  Works just like push() but it
    is KVO-compliant.

        var colors = ["red", "green", "blue"];
        colors.pushObject("black"); => ["red", "green", "blue", "black"]
        colors.pushObject(["yellow", "orange"]); => ["red", "green", "blue", "black", ["yellow", "orange"]]

  */
  pushObject: function(obj) {
    this.insertAt(get(this, 'length'), obj) ;
    return obj ;
  },

  /**
    Add the objects in the passed numerable to the end of the array.  Defers
    notifying observers of the change until all objects are added.

        var colors = ["red", "green", "blue"];
        colors.pushObjects("black"); => ["red", "green", "blue", "black"]
        colors.pushObjects(["yellow", "orange"]); => ["red", "green", "blue", "black", "yellow", "orange"]

    @param {Ember.Enumerable} objects the objects to add
    @returns {Ember.Array} receiver
  */
  pushObjects: function(objects) {
    this.replace(get(this, 'length'), 0, objects);
    return this;
  },

  /**
    Pop object from array or nil if none are left.  Works just like pop() but
    it is KVO-compliant.

        var colors = ["red", "green", "blue"];
        colors.popObject(); => "blue"
        console.log(colors); => ["red", "green"]

  */
  popObject: function() {
    var len = get(this, 'length') ;
    if (len === 0) return null ;

    var ret = this.objectAt(len-1) ;
    this.removeAt(len-1, 1) ;
    return ret ;
  },

  /**
    Shift an object from start of array or nil if none are left.  Works just
    like shift() but it is KVO-compliant.

        var colors = ["red", "green", "blue"];
        colors.shiftObject(); => "red"
        console.log(colors); => ["green", "blue"]

  */
  shiftObject: function() {
    if (get(this, 'length') === 0) return null ;
    var ret = this.objectAt(0) ;
    this.removeAt(0) ;
    return ret ;
  },

  /**
    Unshift an object to start of array.  Works just like unshift() but it is
    KVO-compliant.

        var colors = ["red", "green", "blue"];
        colors.unshiftObject("yellow"); => ["yellow", "red", "green", "blue"]
        colors.unshiftObject(["black", "white"]); => [["black", "white"], "yellow", "red", "green", "blue"]

  */
  unshiftObject: function(obj) {
    this.insertAt(0, obj) ;
    return obj ;
  },

  /**
    Adds the named objects to the beginning of the array.  Defers notifying
    observers until all objects have been added.

        var colors = ["red", "green", "blue"];
        colors.unshiftObjects(["black", "white"]); => ["black", "white", "red", "green", "blue"]
        colors.unshiftObjects("yellow"); => Type Error: 'undefined' is not a function

    @param {Ember.Enumerable} objects the objects to add
    @returns {Ember.Array} receiver
  */
  unshiftObjects: function(objects) {
    this.replace(0, 0, objects);
    return this;
  },

  // ..........................................................
  // IMPLEMENT Ember.MutableEnumerable
  //

  /** @private (nodoc) */
  removeObject: function(obj) {
    var loc = get(this, 'length') || 0;
    while(--loc >= 0) {
      var curObject = this.objectAt(loc) ;
      if (curObject === obj) this.removeAt(loc) ;
    }
    return this ;
  },

  /** @private (nodoc) */
  addObject: function(obj) {
    if (!this.contains(obj)) this.pushObject(obj);
    return this ;
  }

});


})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = Ember.get, set = Ember.set;

/**
  @class

  ## Overview

  This mixin provides properties and property observing functionality, core
  features of the Ember object model.

  Properties and observers allow one object to observe changes to a
  property on another object. This is one of the fundamental ways that
  models, controllers and views communicate with each other in an Ember
  application.

  Any object that has this mixin applied can be used in observer
  operations. That includes Ember.Object and most objects you will
  interact with as you write your Ember application.

  Note that you will not generally apply this mixin to classes yourself,
  but you will use the features provided by this module frequently, so it
  is important to understand how to use it.

  ## Using get() and set()

  Because of Ember's support for bindings and observers, you will always
  access properties using the get method, and set properties using the
  set method. This allows the observing objects to be notified and
  computed properties to be handled properly.

  More documentation about `get` and `set` are below.

  ## Observing Property Changes

  You typically observe property changes simply by adding the `observes`
  call to the end of your method declarations in classes that you write.
  For example:

      Ember.Object.create({
        valueObserver: function() {
          // Executes whenever the "value" property changes
        }.observes('value')
      });

  Although this is the most common way to add an observer, this capability
  is actually built into the Ember.Object class on top of two methods
  defined in this mixin: `addObserver` and `removeObserver`. You can use
  these two methods to add and remove observers yourself if you need to
  do so at runtime.

  To add an observer for a property, call:

      object.addObserver('propertyKey', targetObject, targetAction)

  This will call the `targetAction` method on the `targetObject` to be called
  whenever the value of the `propertyKey` changes.

  Note that if `propertyKey` is a computed property, the observer will be
  called when any of the property dependencies are changed, even if the
  resulting value of the computed property is unchanged. This is necessary
  because computed properties are not computed until `get` is called.

  @extends Ember.Mixin
*/
Ember.Observable = Ember.Mixin.create(/** @scope Ember.Observable.prototype */ {

  /** @private - compatibility */
  isObserverable: true,

  /**
    Retrieves the value of a property from the object.

    This method is usually similar to using object[keyName] or object.keyName,
    however it supports both computed properties and the unknownProperty
    handler.

    Because `get` unifies the syntax for accessing all these kinds
    of properties, it can make many refactorings easier, such as replacing a
    simple property with a computed property, or vice versa.

    ### Computed Properties

    Computed properties are methods defined with the `property` modifier
    declared at the end, such as:

          fullName: function() {
            return this.getEach('firstName', 'lastName').compact().join(' ');
          }.property('firstName', 'lastName')

    When you call `get` on a computed property, the function will be
    called and the return value will be returned instead of the function
    itself.

    ### Unknown Properties

    Likewise, if you try to call `get` on a property whose value is
    undefined, the unknownProperty() method will be called on the object.
    If this method returns any value other than undefined, it will be returned
    instead. This allows you to implement "virtual" properties that are
    not defined upfront.

    @param {String} key The property to retrieve
    @returns {Object} The property value or undefined.
  */
  get: function(keyName) {
    return get(this, keyName);
  },

  /**
    To get multiple properties at once, call getProperties
    with a list of strings or an array:

          record.getProperties('firstName', 'lastName', 'zipCode'); // => { firstName: 'John', lastName: 'Doe', zipCode: '10011' }

   is equivalent to:

          record.getProperties(['firstName', 'lastName', 'zipCode']); // => { firstName: 'John', lastName: 'Doe', zipCode: '10011' }

    @param {String...|Array} list of keys to get
    @returns {Hash}
  */
  getProperties: function() {
    var ret = {};
    var propertyNames = arguments;
    if (arguments.length === 1 && Ember.typeOf(arguments[0]) === 'array') {
      propertyNames = arguments[0];
    }
    for(var i = 0; i < propertyNames.length; i++) {
      ret[propertyNames[i]] = get(this, propertyNames[i]);
    }
    return ret;
  },

  /**
    Sets the key equal to value.

    This method is generally very similar to calling object[key] = value or
    object.key = value, except that it provides support for computed
    properties, the unknownProperty() method and property observers.

    ### Computed Properties

    If you try to set a value on a key that has a computed property handler
    defined (see the get() method for an example), then set() will call
    that method, passing both the value and key instead of simply changing
    the value itself. This is useful for those times when you need to
    implement a property that is composed of one or more member
    properties.

    ### Unknown Properties

    If you try to set a value on a key that is undefined in the target
    object, then the unknownProperty() handler will be called instead. This
    gives you an opportunity to implement complex "virtual" properties that
    are not predefined on the object. If unknownProperty() returns
    undefined, then set() will simply set the value on the object.

    ### Property Observers

    In addition to changing the property, set() will also register a
    property change with the object. Unless you have placed this call
    inside of a beginPropertyChanges() and endPropertyChanges(), any "local"
    observers (i.e. observer methods declared on the same object), will be
    called immediately. Any "remote" observers (i.e. observer methods
    declared on another object) will be placed in a queue and called at a
    later time in a coalesced manner.

    ### Chaining

    In addition to property changes, set() returns the value of the object
    itself so you can do chaining like this:

          record.set('firstName', 'Charles').set('lastName', 'Jolley');

    @param {String} key The property to set
    @param {Object} value The value to set or null.
    @returns {Ember.Observable}
  */
  set: function(keyName, value) {
    set(this, keyName, value);
    return this;
  },

  /**
    To set multiple properties at once, call setProperties
    with a Hash:

          record.setProperties({ firstName: 'Charles', lastName: 'Jolley' });

    @param {Hash} hash the hash of keys and values to set
    @returns {Ember.Observable}
  */
  setProperties: function(hash) {
    return Ember.setProperties(this, hash);
  },

  /**
    Begins a grouping of property changes.

    You can use this method to group property changes so that notifications
    will not be sent until the changes are finished. If you plan to make a
    large number of changes to an object at one time, you should call this
    method at the beginning of the changes to begin deferring change
    notifications. When you are done making changes, call endPropertyChanges()
    to deliver the deferred change notifications and end deferring.

    @returns {Ember.Observable}
  */
  beginPropertyChanges: function() {
    Ember.beginPropertyChanges();
    return this;
  },

  /**
    Ends a grouping of property changes.

    You can use this method to group property changes so that notifications
    will not be sent until the changes are finished. If you plan to make a
    large number of changes to an object at one time, you should call
    beginPropertyChanges() at the beginning of the changes to defer change
    notifications. When you are done making changes, call this method to
    deliver the deferred change notifications and end deferring.

    @returns {Ember.Observable}
  */
  endPropertyChanges: function() {
    Ember.endPropertyChanges();
    return this;
  },

  /**
    Notify the observer system that a property is about to change.

    Sometimes you need to change a value directly or indirectly without
    actually calling get() or set() on it. In this case, you can use this
    method and propertyDidChange() instead. Calling these two methods
    together will notify all observers that the property has potentially
    changed value.

    Note that you must always call propertyWillChange and propertyDidChange as
    a pair. If you do not, it may get the property change groups out of order
    and cause notifications to be delivered more often than you would like.

    @param {String} key The property key that is about to change.
    @returns {Ember.Observable}
  */
  propertyWillChange: function(keyName){
    Ember.propertyWillChange(this, keyName);
    return this;
  },

  /**
    Notify the observer system that a property has just changed.

    Sometimes you need to change a value directly or indirectly without
    actually calling get() or set() on it. In this case, you can use this
    method and propertyWillChange() instead. Calling these two methods
    together will notify all observers that the property has potentially
    changed value.

    Note that you must always call propertyWillChange and propertyDidChange as
    a pair. If you do not, it may get the property change groups out of order
    and cause notifications to be delivered more often than you would like.

    @param {String} keyName The property key that has just changed.
    @returns {Ember.Observable}
  */
  propertyDidChange: function(keyName) {
    Ember.propertyDidChange(this, keyName);
    return this;
  },

  /**
    Convenience method to call `propertyWillChange` and `propertyDidChange` in
    succession.

    @param {String} keyName The property key to be notified about.
    @returns {Ember.Observable}
  */
  notifyPropertyChange: function(keyName) {
    this.propertyWillChange(keyName);
    this.propertyDidChange(keyName);
    return this;
  },

  addBeforeObserver: function(key, target, method) {
    Ember.addBeforeObserver(this, key, target, method);
  },

  /**
    Adds an observer on a property.

    This is the core method used to register an observer for a property.

    Once you call this method, anytime the key's value is set, your observer
    will be notified. Note that the observers are triggered anytime the
    value is set, regardless of whether it has actually changed. Your
    observer should be prepared to handle that.

    You can also pass an optional context parameter to this method. The
    context will be passed to your observer method whenever it is triggered.
    Note that if you add the same target/method pair on a key multiple times
    with different context parameters, your observer will only be called once
    with the last context you passed.

    ### Observer Methods

    Observer methods you pass should generally have the following signature if
    you do not pass a "context" parameter:

          fooDidChange: function(sender, key, value, rev);

    The sender is the object that changed. The key is the property that
    changes. The value property is currently reserved and unused. The rev
    is the last property revision of the object when it changed, which you can
    use to detect if the key value has really changed or not.

    If you pass a "context" parameter, the context will be passed before the
    revision like so:

          fooDidChange: function(sender, key, value, context, rev);

    Usually you will not need the value, context or revision parameters at
    the end. In this case, it is common to write observer methods that take
    only a sender and key value as parameters or, if you aren't interested in
    any of these values, to write an observer that has no parameters at all.

    @param {String} key The key to observer
    @param {Object} target The target object to invoke
    @param {String|Function} method The method to invoke.
    @returns {Ember.Object} self
  */
  addObserver: function(key, target, method) {
    Ember.addObserver(this, key, target, method);
  },

  /**
    Remove an observer you have previously registered on this object. Pass
    the same key, target, and method you passed to addObserver() and your
    target will no longer receive notifications.

    @param {String} key The key to observer
    @param {Object} target The target object to invoke
    @param {String|Function} method The method to invoke.
    @returns {Ember.Observable} receiver
  */
  removeObserver: function(key, target, method) {
    Ember.removeObserver(this, key, target, method);
  },

  /**
    Returns true if the object currently has observers registered for a
    particular key. You can use this method to potentially defer performing
    an expensive action until someone begins observing a particular property
    on the object.

    @param {String} key Key to check
    @returns {Boolean}
  */
  hasObserverFor: function(key) {
    return Ember.hasListeners(this, key+':change');
  },

  /**
    This method will be called when a client attempts to get the value of a
    property that has not been defined in one of the typical ways. Override
    this method to create "virtual" properties.

    @param {String} key The name of the unknown property that was requested.
    @returns {Object} The property value or undefined. Default is undefined.
  */
  unknownProperty: function(key) {
    return undefined;
  },

  /**
    This method will be called when a client attempts to set the value of a
    property that has not been defined in one of the typical ways. Override
    this method to create "virtual" properties.

    @param {String} key The name of the unknown property to be set.
    @param {Object} value The value the unknown property is to be set to.
  */
  setUnknownProperty: function(key, value) {
    this[key] = value;
  },

  /**
    This is like `get`, but allows you to pass in a dot-separated property
    path.

        person.getPath('address.zip'); // return the zip
        person.getPath('children.firstObject.age'); // return the first kid's age

    This reads much better than chained `get` calls.

    @param {String} path The property path to retrieve
    @returns {Object} The property value or undefined.
  */
  getPath: function(path) {
    return Ember.getPath(this, path);
  },

  /**
    This is like `set`, but allows you to specify the property you want to
    set as a dot-separated property path.

        person.setPath('address.zip', 10011); // set the zip to 10011
        person.setPath('children.firstObject.age', 6); // set the first kid's age to 6

    This is not as commonly used as `getPath`, but it can be useful.

    @param {String} path The path to the property that will be set
    @param {Object} value The value to set or null.
    @returns {Ember.Observable}
  */
  setPath: function(path, value) {
    Ember.setPath(this, path, value);
    return this;
  },

  /**
    Retrieves the value of a property, or a default value in the case that the property
    returns undefined.

        person.getWithDefault('lastName', 'Doe');

    @param {String} keyName The name of the property to retrieve
    @param {Object} defaultValue The value to return if the property value is undefined
    @returns {Object} The property value or the defaultValue.
  */
  getWithDefault: function(keyName, defaultValue) {
    return Ember.getWithDefault(this, keyName, defaultValue);
  },

  /**
    Set the value of a property to the current value plus some amount.

        person.incrementProperty('age');
        team.incrementProperty('score', 2);

    @param {String} keyName The name of the property to increment
    @param {Object} increment The amount to increment by. Defaults to 1
    @returns {Object} The new property value
  */
  incrementProperty: function(keyName, increment) {
    if (!increment) { increment = 1; }
    set(this, keyName, (get(this, keyName) || 0)+increment);
    return get(this, keyName);
  },

  /**
    Set the value of a property to the current value minus some amount.

        player.decrementProperty('lives');
        orc.decrementProperty('health', 5);

    @param {String} keyName The name of the property to decrement
    @param {Object} increment The amount to decrement by. Defaults to 1
    @returns {Object} The new property value
  */
  decrementProperty: function(keyName, increment) {
    if (!increment) { increment = 1; }
    set(this, keyName, (get(this, keyName) || 0)-increment);
    return get(this, keyName);
  },

  /**
    Set the value of a boolean property to the opposite of it's
    current value.

        starship.toggleProperty('warpDriveEnaged');

    @param {String} keyName The name of the property to toggle
    @returns {Object} The new property value
  */
  toggleProperty: function(keyName) {
    set(this, keyName, !get(this, keyName));
    return get(this, keyName);
  },

  /**
    Returns the cached value of a computed property, if it exists.
    This allows you to inspect the value of a computed property
    without accidentally invoking it if it is intended to be
    generated lazily.

    @param {String} keyName
    @returns {Object} The cached value of the computed property, if any
  */
  cacheFor: function(keyName) {
    return Ember.cacheFor(this, keyName);
  },

  /** @private - intended for debugging purposes */
  observersForKey: function(keyName) {
    return Ember.observersFor(this, keyName);
  }
});




})();



(function() {
var get = Ember.get, set = Ember.set, getPath = Ember.getPath;

Ember.TargetActionSupport = Ember.Mixin.create({
  target: null,
  action: null,

  targetObject: Ember.computed(function() {
    var target = get(this, 'target');

    if (Ember.typeOf(target) === "string") {
      var value = getPath(this, target);
      if (value === undefined) { value = getPath(window, target); }
      return value;
    } else {
      return target;
    }
  }).property('target').cacheable(),

  triggerAction: function() {
    var action = get(this, 'action'),
        target = get(this, 'targetObject');

    if (target && action) {
      var ret;

      if (typeof target.send === 'function') {
        ret = target.send(action, this);
      } else {
        if (typeof action === 'string') {
          action = target[action];
        }
        ret = action.call(target, this);
      }
      if (ret !== false) ret = true;

      return ret;
    } else {
      return false;
    }
  }
});

})();



(function() {
var get = Ember.get, set = Ember.set, a_slice = Array.prototype.slice;

/** @private */
function xform(target, method, params) {
  var args = a_slice.call(params, 2);
  method.apply(target, args);
}

Ember.Evented = Ember.Mixin.create({
  on: function(name, target, method) {
    if (!method) {
      method = target;
      target = null;
    }

    Ember.addListener(this, name, target, method, xform);
  },

  one: function(name, target, method) {
    if (!method) {
      method = target;
      target = null;
    }

    var wrapped = function() {
      Ember.removeListener(this, name, target, wrapped);

      // Internally, a `null` target means that the target is
      // the first parameter to addListener. That means that
      // the `this` passed into this function is the target
      // determined by the event system.
      method.apply(this, arguments);
    };

    this.on(name, target, wrapped);
  },

  trigger: function(name) {
   Ember.sendEvent.apply(null, [this, name].concat(a_slice.call(arguments, 1)));
  },

  fire: function(name) {
    Ember.deprecate("Ember.Evented#fire() has been deprecated in favor of trigger() for compatibility with jQuery. It will be removed in 1.0. Please update your code to call trigger() instead.");
    this.trigger.apply(this, arguments);
  },

  off: function(name, target, method) {
    Ember.removeListener(this, name, target, method);
  },

  has: function(name) {
    return Ember.hasListeners(this, name);
  }
});

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



// NOTE: this object should never be included directly.  Instead use Ember.
// Ember.Object.  We only define this separately so that Ember.Set can depend on it



var rewatch = Ember.rewatch;
var classToString = Ember.Mixin.prototype.toString;
var set = Ember.set, get = Ember.get;
var o_create = Ember.create,
    o_defineProperty = Ember.platform.defineProperty,
    a_slice = Array.prototype.slice,
    meta = Ember.meta;

var undefinedDescriptor = {
  configurable: true,
  writable: true,
  enumerable: false,
  value: undefined
};

/** @private */
function makeCtor() {

  // Note: avoid accessing any properties on the object since it makes the
  // method a lot faster.  This is glue code so we want it to be as fast as
  // possible.

  var wasApplied = false, initMixins, init = false, hasChains = false;

  var Class = function() {
    if (!wasApplied) { Class.proto(); } // prepare prototype...
    if (initMixins) {
      this.reopen.apply(this, initMixins);
      initMixins = null;
      rewatch(this); // always rewatch just in case
      Ember.Mixin.finishPartial(this);
      this.init.apply(this, arguments);
    } else {
      if (hasChains) {
        rewatch(this);
      } else {
        o_defineProperty(this, Ember.GUID_KEY, undefinedDescriptor);
      }
      if (init===false) { init = this.init; } // cache for later instantiations
      o_defineProperty(this, '_super', undefinedDescriptor);
      Ember.Mixin.finishPartial(this);
      init.apply(this, arguments);
    }
  };

  Class.toString = classToString;
  Class.willReopen = function() {
    if (wasApplied) {
      Class.PrototypeMixin = Ember.Mixin.create(Class.PrototypeMixin);
    }

    wasApplied = false;
  };
  Class._initMixins = function(args) { initMixins = args; };

  Class.proto = function() {
    var superclass = Class.superclass;
    if (superclass) { superclass.proto(); }

    if (!wasApplied) {
      wasApplied = true;
      Class.PrototypeMixin.applyPartial(Class.prototype);
      Ember.rewatch(Class.prototype); // setup watch chains if needed.
      hasChains = !!meta(Class.prototype, false).chains; // avoid rewatch
    }

    return this.prototype;
  };

  return Class;

}

var CoreObject = makeCtor();

CoreObject.PrototypeMixin = Ember.Mixin.create(
/** @scope Ember.CoreObject.prototype */ {

  reopen: function() {
    Ember.Mixin._apply(this, arguments, true);
    return this;
  },

  isInstance: true,

  /** @private */
  init: function() {},

  /** @field */
  isDestroyed: false,

  /** @field */
  isDestroying: false,

  /**
    Destroys an object by setting the isDestroyed flag and removing its
    metadata, which effectively destroys observers and bindings.

    If you try to set a property on a destroyed object, an exception will be
    raised.

    Note that destruction is scheduled for the end of the run loop and does not
    happen immediately.

    @returns {Ember.Object} receiver
  */
  destroy: function() {
    if (this.isDestroying) { return; }

    this.isDestroying = true;

    if (this.willDestroy) { this.willDestroy(); }

    set(this, 'isDestroyed', true);
    Ember.run.schedule('destroy', this, this._scheduledDestroy);
    return this;
  },

  /**
    Invoked by the run loop to actually destroy the object. This is
    scheduled for execution by the `destroy` method.

    @private
  */
  _scheduledDestroy: function() {
    Ember.destroy(this);
    if (this.didDestroy) { this.didDestroy(); }
  },

  bind: function(to, from) {
    if (!(from instanceof Ember.Binding)) { from = Ember.Binding.from(from); }
    from.to(to).connect(this);
    return from;
  },

  toString: function() {
    return '<'+this.constructor.toString()+':'+Ember.guidFor(this)+'>';
  }
});

if (Ember.config.overridePrototypeMixin) {
  Ember.config.overridePrototypeMixin(CoreObject.PrototypeMixin);
}

CoreObject.__super__ = null;

var ClassMixin = Ember.Mixin.create(
/** @scope Ember.CoreObject */ {

  ClassMixin: Ember.required(),

  PrototypeMixin: Ember.required(),

  isClass: true,

  isMethod: false,

  extend: function() {
    var Class = makeCtor(), proto;
    Class.ClassMixin = Ember.Mixin.create(this.ClassMixin);
    Class.PrototypeMixin = Ember.Mixin.create(this.PrototypeMixin);

    Class.ClassMixin.ownerConstructor = Class;
    Class.PrototypeMixin.ownerConstructor = Class;

    var PrototypeMixin = Class.PrototypeMixin;
    PrototypeMixin.reopen.apply(PrototypeMixin, arguments);

    Class.superclass = this;
    Class.__super__  = this.prototype;

    proto = Class.prototype = o_create(this.prototype);
    proto.constructor = Class;
    Ember.generateGuid(proto, 'ember');
    meta(proto).proto = proto; // this will disable observers on prototype

    Class.ClassMixin.apply(Class);
    return Class;
  },

  create: function() {
    var C = this;
    if (arguments.length>0) { this._initMixins(arguments); }
    return new C();
  },

  reopen: function() {
    this.willReopen();
    var PrototypeMixin = this.PrototypeMixin;
    PrototypeMixin.reopen.apply(PrototypeMixin, arguments);
    return this;
  },

  reopenClass: function() {
    var ClassMixin = this.ClassMixin;
    ClassMixin.reopen.apply(ClassMixin, arguments);
    Ember.Mixin._apply(this, arguments, false);
    return this;
  },

  detect: function(obj) {
    if ('function' !== typeof obj) { return false; }
    while(obj) {
      if (obj===this) { return true; }
      obj = obj.superclass;
    }
    return false;
  },

  detectInstance: function(obj) {
    return obj instanceof this;
  },

  /**
    In some cases, you may want to annotate computed properties with additional
    metadata about how they function or what values they operate on. For example,
    computed property functions may close over variables that are then no longer
    available for introspection.

    You can pass a hash of these values to a computed property like this:

        person: function() {
          var personId = this.get('personId');
          return App.Person.create({ id: personId });
        }.property().meta({ type: App.Person })

    Once you've done this, you can retrieve the values saved to the computed
    property from your class like this:

        MyClass.metaForProperty('person');

    This will return the original hash that was passed to `meta()`.
  */
  metaForProperty: function(key) {
    var desc = meta(this.proto(), false).descs[key];

    Ember.assert("metaForProperty() could not find a computed property with key '"+key+"'.", !!desc && desc instanceof Ember.ComputedProperty);
    return desc._meta || {};
  },

  /**
    Iterate over each computed property for the class, passing its name
    and any associated metadata (see `metaForProperty`) to the callback.
  */
  eachComputedProperty: function(callback, binding) {
    var proto = this.proto(),
        descs = meta(proto).descs,
        empty = {},
        property;

    for (var name in descs) {
      property = descs[name];

      if (property instanceof Ember.ComputedProperty) {
        callback.call(binding || this, name, property._meta || empty);
      }
    }
  }

});

if (Ember.config.overrideClassMixin) {
  Ember.config.overrideClassMixin(ClassMixin);
}

CoreObject.ClassMixin = ClassMixin;
ClassMixin.apply(CoreObject);

/**
  @class
*/
Ember.CoreObject = CoreObject;




})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, guidFor = Ember.guidFor, none = Ember.none;

/**
  @class

  An unordered collection of objects.

  A Set works a bit like an array except that its items are not ordered.
  You can create a set to efficiently test for membership for an object. You
  can also iterate through a set just like an array, even accessing objects
  by index, however there is no guarantee as to their order.

  All Sets are observable via the Enumerable Observer API - which works
  on any enumerable object including both Sets and Arrays.

  ## Creating a Set

  You can create a set like you would most objects using
  `new Ember.Set()`.  Most new sets you create will be empty, but you can
  also initialize the set with some content by passing an array or other
  enumerable of objects to the constructor.

  Finally, you can pass in an existing set and the set will be copied. You
  can also create a copy of a set by calling `Ember.Set#copy()`.

      #js
      // creates a new empty set
      var foundNames = new Ember.Set();

      // creates a set with four names in it.
      var names = new Ember.Set(["Charles", "Tom", "Juan", "Alex"]); // :P

      // creates a copy of the names set.
      var namesCopy = new Ember.Set(names);

      // same as above.
      var anotherNamesCopy = names.copy();

  ## Adding/Removing Objects

  You generally add or remove objects from a set using `add()` or
  `remove()`. You can add any type of object including primitives such as
  numbers, strings, and booleans.

  Unlike arrays, objects can only exist one time in a set. If you call `add()`
  on a set with the same object multiple times, the object will only be added
  once. Likewise, calling `remove()` with the same object multiple times will
  remove the object the first time and have no effect on future calls until
  you add the object to the set again.

  NOTE: You cannot add/remove null or undefined to a set. Any attempt to do so
  will be ignored.

  In addition to add/remove you can also call `push()`/`pop()`. Push behaves
  just like `add()` but `pop()`, unlike `remove()` will pick an arbitrary
  object, remove it and return it. This is a good way to use a set as a job
  queue when you don't care which order the jobs are executed in.

  ## Testing for an Object

  To test for an object's presence in a set you simply call
  `Ember.Set#contains()`.

  ## Observing changes

  When using `Ember.Set`, you can observe the `"[]"` property to be
  alerted whenever the content changes.  You can also add an enumerable
  observer to the set to be notified of specific objects that are added and
  removed from the set.  See `Ember.Enumerable` for more information on
  enumerables.

  This is often unhelpful. If you are filtering sets of objects, for instance,
  it is very inefficient to re-filter all of the items each time the set
  changes. It would be better if you could just adjust the filtered set based
  on what was changed on the original set. The same issue applies to merging
  sets, as well.

  ## Other Methods

  `Ember.Set` primary implements other mixin APIs.  For a complete reference
  on the methods you will use with `Ember.Set`, please consult these mixins.
  The most useful ones will be `Ember.Enumerable` and
  `Ember.MutableEnumerable` which implement most of the common iterator
  methods you are used to on Array.

  Note that you can also use the `Ember.Copyable` and `Ember.Freezable`
  APIs on `Ember.Set` as well.  Once a set is frozen it can no longer be
  modified.  The benefit of this is that when you call frozenCopy() on it,
  Ember will avoid making copies of the set.  This allows you to write
  code that can know with certainty when the underlying set data will or
  will not be modified.

  @extends Ember.Enumerable
  @extends Ember.MutableEnumerable
  @extends Ember.Copyable
  @extends Ember.Freezable

  @since Ember 0.9
*/
Ember.Set = Ember.CoreObject.extend(Ember.MutableEnumerable, Ember.Copyable, Ember.Freezable,
  /** @scope Ember.Set.prototype */ {

  // ..........................................................
  // IMPLEMENT ENUMERABLE APIS
  //

  /**
    This property will change as the number of objects in the set changes.

    @type number
    @default 0
  */
  length: 0,

  /**
    Clears the set. This is useful if you want to reuse an existing set
    without having to recreate it.

        var colors = new Ember.Set(["red", "green", "blue"]);
        colors.length;  => 3
        colors.clear();
        colors.length;  => 0

    @returns {Ember.Set} An empty Set
  */
  clear: function() {
    if (this.isFrozen) { throw new Error(Ember.FROZEN_ERROR); }

    var len = get(this, 'length');
    if (len === 0) { return this; }

    var guid;

    this.enumerableContentWillChange(len, 0);
    Ember.propertyWillChange(this, 'firstObject');
    Ember.propertyWillChange(this, 'lastObject');

    for (var i=0; i < len; i++){
      guid = guidFor(this[i]);
      delete this[guid];
      delete this[i];
    }

    set(this, 'length', 0);

    Ember.propertyDidChange(this, 'firstObject');
    Ember.propertyDidChange(this, 'lastObject');
    this.enumerableContentDidChange(len, 0);

    return this;
  },

  /**
    Returns true if the passed object is also an enumerable that contains the
    same objects as the receiver.

        var colors = ["red", "green", "blue"],
            same_colors = new Ember.Set(colors);
        same_colors.isEqual(colors); => true
        same_colors.isEqual(["purple", "brown"]); => false

    @param {Ember.Set} obj the other object.
    @returns {Boolean}
  */
  isEqual: function(obj) {
    // fail fast
    if (!Ember.Enumerable.detect(obj)) return false;

    var loc = get(this, 'length');
    if (get(obj, 'length') !== loc) return false;

    while(--loc >= 0) {
      if (!obj.contains(this[loc])) return false;
    }

    return true;
  },

  /**
    Adds an object to the set. Only non-null objects can be added to a set
    and those can only be added once. If the object is already in the set or
    the passed value is null this method will have no effect.

    This is an alias for `Ember.MutableEnumerable.addObject()`.

        var colors = new Ember.Set();
        colors.add("blue");    => ["blue"]
        colors.add("blue");    => ["blue"]
        colors.add("red");     => ["blue", "red"]
        colors.add(null);      => ["blue", "red"]
        colors.add(undefined); => ["blue", "red"]

    @function
    @param {Object} obj The object to add.
    @returns {Ember.Set} The set itself.
  */
  add: Ember.alias('addObject'),

  /**
    Removes the object from the set if it is found.  If you pass a null value
    or an object that is already not in the set, this method will have no
    effect. This is an alias for `Ember.MutableEnumerable.removeObject()`.

        var colors = new Ember.Set(["red", "green", "blue"]);
        colors.remove("red");    => ["blue", "green"]
        colors.remove("purple"); => ["blue", "green"]
        colors.remove(null);     => ["blue", "green"]

    @function
    @param {Object} obj The object to remove
    @returns {Ember.Set} The set itself.
  */
  remove: Ember.alias('removeObject'),

  /**
    Removes the last element from the set and returns it, or null if it's empty.

        var colors = new Ember.Set(["green", "blue"]);
        colors.pop(); => "blue"
        colors.pop(); => "green"
        colors.pop(); => null

    @returns {Object} The removed object from the set or null.
  */
  pop: function() {
    if (get(this, 'isFrozen')) throw new Error(Ember.FROZEN_ERROR);
    var obj = this.length > 0 ? this[this.length-1] : null;
    this.remove(obj);
    return obj;
  },

  /**
    Inserts the given object on to the end of the set. It returns
    the set itself.

    This is an alias for `Ember.MutableEnumerable.addObject()`.

        var colors = new Ember.Set();
        colors.push("red");   => ["red"]
        colors.push("green"); => ["red", "green"]
        colors.push("blue");  => ["red", "green", "blue"]

    @function
    @returns {Ember.Set} The set itself.
  */
  push: Ember.alias('addObject'),

  /**
    Removes the last element from the set and returns it, or null if it's empty.

    This is an alias for `Ember.Set.pop()`.

        var colors = new Ember.Set(["green", "blue"]);
        colors.shift(); => "blue"
        colors.shift(); => "green"
        colors.shift(); => null

    @function
    @returns {Object} The removed object from the set or null.
  */
  shift: Ember.alias('pop'),

  /**
    Inserts the given object on to the end of the set. It returns
    the set itself.

    This is an alias of `Ember.Set.push()`

        var colors = new Ember.Set();
        colors.unshift("red");   => ["red"]
        colors.unshift("green"); => ["red", "green"]
        colors.unshift("blue");  => ["red", "green", "blue"]

    @function
    @returns {Ember.Set} The set itself.
  */
  unshift: Ember.alias('push'),

  /**
    Adds each object in the passed enumerable to the set.

    This is an alias of `Ember.MutableEnumerable.addObjects()`

        var colors = new Ember.Set();
        colors.addEach(["red", "green", "blue"]); => ["red", "green", "blue"]

    @function
    @param {Ember.Enumerable} objects the objects to add.
    @returns {Ember.Set} The set itself.
  */
  addEach: Ember.alias('addObjects'),

  /**
    Removes each object in the passed enumerable to the set.

    This is an alias of `Ember.MutableEnumerable.removeObjects()`

        var colors = new Ember.Set(["red", "green", "blue"]);
        colors.removeEach(["red", "blue"]); => ["green"]

    @function
    @param {Ember.Enumerable} objects the objects to remove.
    @returns {Ember.Set} The set itself.
  */
  removeEach: Ember.alias('removeObjects'),

  // ..........................................................
  // PRIVATE ENUMERABLE SUPPORT
  //

  /** @private */
  init: function(items) {
    this._super();
    if (items) this.addObjects(items);
  },

  /** @private (nodoc) - implement Ember.Enumerable */
  nextObject: function(idx) {
    return this[idx];
  },

  /** @private - more optimized version */
  firstObject: Ember.computed(function() {
    return this.length > 0 ? this[0] : undefined;
  }).property().cacheable(),

  /** @private - more optimized version */
  lastObject: Ember.computed(function() {
    return this.length > 0 ? this[this.length-1] : undefined;
  }).property().cacheable(),

  /** @private (nodoc) - implements Ember.MutableEnumerable */
  addObject: function(obj) {
    if (get(this, 'isFrozen')) throw new Error(Ember.FROZEN_ERROR);
    if (none(obj)) return this; // nothing to do

    var guid = guidFor(obj),
        idx  = this[guid],
        len  = get(this, 'length'),
        added ;

    if (idx>=0 && idx<len && (this[idx] === obj)) return this; // added

    added = [obj];

    this.enumerableContentWillChange(null, added);
    Ember.propertyWillChange(this, 'lastObject');

    len = get(this, 'length');
    this[guid] = len;
    this[len] = obj;
    set(this, 'length', len+1);

    Ember.propertyDidChange(this, 'lastObject');
    this.enumerableContentDidChange(null, added);

    return this;
  },

  /** @private (nodoc) - implements Ember.MutableEnumerable */
  removeObject: function(obj) {
    if (get(this, 'isFrozen')) throw new Error(Ember.FROZEN_ERROR);
    if (none(obj)) return this; // nothing to do

    var guid = guidFor(obj),
        idx  = this[guid],
        len = get(this, 'length'),
        isFirst = idx === 0,
        isLast = idx === len-1,
        last, removed;


    if (idx>=0 && idx<len && (this[idx] === obj)) {
      removed = [obj];

      this.enumerableContentWillChange(removed, null);
      if (isFirst) { Ember.propertyWillChange(this, 'firstObject'); }
      if (isLast)  { Ember.propertyWillChange(this, 'lastObject'); }

      // swap items - basically move the item to the end so it can be removed
      if (idx < len-1) {
        last = this[len-1];
        this[idx] = last;
        this[guidFor(last)] = idx;
      }

      delete this[guid];
      delete this[len-1];
      set(this, 'length', len-1);

      if (isFirst) { Ember.propertyDidChange(this, 'firstObject'); }
      if (isLast)  { Ember.propertyDidChange(this, 'lastObject'); }
      this.enumerableContentDidChange(removed, null);
    }

    return this;
  },

  /** @private (nodoc) - optimized version */
  contains: function(obj) {
    return this[guidFor(obj)]>=0;
  },

  /** @private (nodoc) */
  copy: function() {
    var C = this.constructor, ret = new C(), loc = get(this, 'length');
    set(ret, 'length', loc);
    while(--loc>=0) {
      ret[loc] = this[loc];
      ret[guidFor(this[loc])] = loc;
    }
    return ret;
  },

  /** @private */
  toString: function() {
    var len = this.length, idx, array = [];
    for(idx = 0; idx < len; idx++) {
      array[idx] = this[idx];
    }
    return "Ember.Set<%@>".fmt(array.join(','));
  }

});

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/**
  @class

  `Ember.Object` is the main base class for all Ember objects. It is a subclass
  of `Ember.CoreObject` with the `Ember.Observable` mixin applied. For details,
  see the documentation for each of these.

  @extends Ember.CoreObject
  @extends Ember.Observable
*/
Ember.Object = Ember.CoreObject.extend(Ember.Observable);

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var indexOf = Ember.ArrayPolyfills.indexOf;

/**
  @private
  A Namespace is an object usually used to contain other objects or methods
  such as an application or framework.  Create a namespace anytime you want
  to define one of these new containers.

  # Example Usage

      MyFramework = Ember.Namespace.create({
        VERSION: '1.0.0'
      });

*/
Ember.Namespace = Ember.Object.extend({
  isNamespace: true,

  init: function() {
    Ember.Namespace.NAMESPACES.push(this);
    Ember.Namespace.PROCESSED = false;
  },

  toString: function() {
    Ember.identifyNamespaces();
    return this[Ember.GUID_KEY+'_name'];
  },

  destroy: function() {
    var namespaces = Ember.Namespace.NAMESPACES;
    window[this.toString()] = undefined;
    namespaces.splice(indexOf.call(namespaces, this), 1);
    this._super();
  }
});

Ember.Namespace.NAMESPACES = [Ember];
Ember.Namespace.PROCESSED = false;

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/**
  @private

  Defines a namespace that will contain an executable application.  This is
  very similar to a normal namespace except that it is expected to include at
  least a 'ready' function which can be run to initialize the application.

  Currently Ember.Application is very similar to Ember.Namespace.  However, this
  class may be augmented by additional frameworks so it is important to use
  this instance when building new applications.

  # Example Usage

      MyApp = Ember.Application.create({
        VERSION: '1.0.0',
        store: Ember.Store.create().from(Ember.fixtures)
      });

      MyApp.ready = function() {
        //..init code goes here...
      }

*/
Ember.Application = Ember.Namespace.extend();


})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

/**
  @class

  An ArrayProxy wraps any other object that implements Ember.Array and/or
  Ember.MutableArray, forwarding all requests. This makes it very useful for
  a number of binding use cases or other cases where being able to swap
  out the underlying array is useful.

  A simple example of usage:

      var pets = ['dog', 'cat', 'fish'];
      var ap = Ember.ArrayProxy.create({ content: Ember.A(pets) });
      ap.get('firstObject'); // => 'dog'
      ap.set('content', ['amoeba', 'paramecium']);
      ap.get('firstObject'); // => 'amoeba'

  This class can also be useful as a layer to transform the contents of
  an array, as they are accessed. This can be done by overriding
  `objectAtContent`:

      var pets = ['dog', 'cat', 'fish'];
      var ap = Ember.ArrayProxy.create({
          content: Ember.A(pets),
          objectAtContent: function(idx) {
              return this.get('content').objectAt(idx).toUpperCase();
          }
      });
      ap.get('firstObject'); // => 'DOG'


  @extends Ember.Object
  @extends Ember.Array
  @extends Ember.MutableArray
*/
Ember.ArrayProxy = Ember.Object.extend(Ember.MutableArray,
/** @scope Ember.ArrayProxy.prototype */ {

  /**
    The content array.  Must be an object that implements Ember.Array and/or
    Ember.MutableArray.

    @type Ember.Array
  */
  content: null,

  /**
   The array that the proxy pretends to be. In the default `ArrayProxy`
   implementation, this and `content` are the same. Subclasses of `ArrayProxy`
   can override this property to provide things like sorting and filtering.
  */
  arrangedContent: Ember.computed('content', function() {
    return get(this, 'content');
  }).cacheable(),

  /**
    Should actually retrieve the object at the specified index from the
    content. You can override this method in subclasses to transform the
    content item to something new.

    This method will only be called if content is non-null.

    @param {Number} idx
      The index to retrieve.

    @returns {Object} the value or undefined if none found
  */
  objectAtContent: function(idx) {
    return get(this, 'arrangedContent').objectAt(idx);
  },

  /**
    Should actually replace the specified objects on the content array.
    You can override this method in subclasses to transform the content item
    into something new.

    This method will only be called if content is non-null.

    @param {Number} idx
      The starting index

    @param {Number} amt
      The number of items to remove from the content.

    @param {Array} objects
      Optional array of objects to insert or null if no objects.

    @returns {void}
  */
  replaceContent: function(idx, amt, objects) {
    get(this, 'arrangedContent').replace(idx, amt, objects);
  },

  /**
    Invoked when the content property is about to change. Notifies observers that the
    entire array content will change.
  */
  _contentWillChange: Ember.beforeObserver(function() {
    var content = get(this, 'content');

    if (content) {
      content.removeArrayObserver(this, {
        willChange: 'contentArrayWillChange',
        didChange: 'contentArrayDidChange'
      });
    }
  }, 'content'),


  contentArrayWillChange: Ember.K,
  contentArrayDidChange: Ember.K,

  /**
    Invoked when the content property changes.  Notifies observers that the
    entire array content has changed.
  */
  _contentDidChange: Ember.observer(function() {
    var content = get(this, 'content'),
        len     = content ? get(content, 'length') : 0;

    if (content) {
      content.addArrayObserver(this, {
        willChange: 'contentArrayWillChange',
        didChange: 'contentArrayDidChange'
      });
    }
  }, 'content'),

  _arrangedContentWillChange: Ember.beforeObserver(function() {
    var arrangedContent = get(this, 'arrangedContent'),
        len = arrangedContent ? get(arrangedContent, 'length') : 0;

    this.arrangedContentArrayWillChange(this, 0, len, undefined);

    if (arrangedContent) {
      arrangedContent.removeArrayObserver(this, {
        willChange: 'arrangedContentArrayWillChange',
        didChange: 'arrangedContentArrayDidChange'
      });
    }
  }, 'arrangedContent'),

  _arrangedContentDidChange: Ember.observer(function() {
    var arrangedContent = get(this, 'arrangedContent'),
        len = arrangedContent ? get(arrangedContent, 'length') : 0;

    if (arrangedContent) {
      arrangedContent.addArrayObserver(this, {
        willChange: 'arrangedContentArrayWillChange',
        didChange: 'arrangedContentArrayDidChange'
      });
    }

    this.arrangedContentArrayDidChange(this, 0, undefined, len);
  }, 'arrangedContent'),

  /** @private (nodoc) */
  objectAt: function(idx) {
    return get(this, 'content') && this.objectAtContent(idx);
  },

  /** @private (nodoc) */
  length: Ember.computed(function() {
    var arrangedContent = get(this, 'arrangedContent');
    return arrangedContent ? get(arrangedContent, 'length') : 0;
    // No dependencies since Enumerable notifies length of change
  }).property().cacheable(),

  /** @private (nodoc) */
  replace: function(idx, amt, objects) {
    if (get(this, 'content')) this.replaceContent(idx, amt, objects);
    return this;
  },

  /** @private (nodoc) */
  arrangedContentArrayWillChange: function(item, idx, removedCnt, addedCnt) {
    this.arrayContentWillChange(idx, removedCnt, addedCnt);
  },

  /** @private (nodoc) */
  arrangedContentArrayDidChange: function(item, idx, removedCnt, addedCnt) {
    this.arrayContentDidChange(idx, removedCnt, addedCnt);
  },

  /** @private (nodoc) */
  init: function() {
    this._super();
    this._contentWillChange();
    this._contentDidChange();
    this._arrangedContentWillChange();
    this._arrangedContentDidChange();
  }

});




})();



(function() {
var get = Ember.get,
    set = Ember.set,
    defineProperty = Ember.defineProperty,
    addBeforeObserver = Ember.addBeforeObserver,
    addObserver = Ember.addObserver,
    removeBeforeObserver = Ember.removeBeforeObserver,
    removeObserver = Ember.removeObserver,
    suspendBeforeObserver = Ember._suspendBeforeObserver,
    suspendObserver = Ember._suspendObserver,
    propertyWillChange = Ember.propertyWillChange,
    propertyDidChange = Ember.propertyDidChange,
    getMeta = Ember.getMeta,
    delegateDesc;

function addDelegateObservers(proxy, key) {
  var delegateKey = 'content.' + key,
      willChangeKey = key + 'WillChange',
      didChangeKey = key + 'DidChange';
  proxy[willChangeKey] = function () {
    propertyWillChange(this, key);
  };
  proxy[didChangeKey] = function () {
    propertyDidChange(this, key);
  };
  // have to use target=null method=string so if
  // willWatchProperty is call with prototype it will still work
  addBeforeObserver(proxy, delegateKey, null, willChangeKey);
  addObserver(proxy, delegateKey, null, didChangeKey);
}

function removeDelegateObservers(proxy, key) {
  var delegateKey = 'content.' + key,
      willChangeKey = key + 'WillChange',
      didChangeKey = key + 'DidChange';
  removeBeforeObserver(proxy, delegateKey, null, willChangeKey);
  removeObserver(proxy, delegateKey, null, didChangeKey);
  delete proxy[willChangeKey];
  delete proxy[didChangeKey];
}

function suspendDelegateObservers(proxy, key, fn) {
  var delegateKey = 'content.' + key,
      willChangeKey = key + 'WillChange',
      didChangeKey = key + 'DidChange';
  suspendBeforeObserver(proxy, delegateKey, null, willChangeKey, function () {
    suspendObserver(proxy, delegateKey, null, didChangeKey, function () {
      fn.call(proxy);
    });
  });
}

function isDelegateDesc(proxy, key) {
  var descs = getMeta(proxy, 'descs');
  return descs[key] === delegateDesc;
}

function undefineProperty(proxy, key) {
  var descs = getMeta(proxy, 'descs');
  descs[key].teardown(proxy, key);
  delete descs[key];
  delete proxy[key];
}

function delegate(key, value) {
  if (arguments.length === 1) {
    return this.delegateGet(key);
  } else {
    // CP set notifies, so if we don't suspend
    // will be notified again
    suspendDelegateObservers(this, key, function () {
      this.delegateSet(key, value);
    });
  }
}

delegateDesc = Ember.computed(delegate).volatile();

/**
  @class

  `Ember.ObjectProxy` forwards all properties not defined by the proxy itself
  to a proxied `content` object.

      object = Ember.Object.create({
        name: 'Foo'
      });
      proxy = Ember.ObjectProxy.create({
        content: object
      });

      // Access and change existing properties
      proxy.get('name') // => 'Foo'
      proxy.set('name', 'Bar');
      object.get('name') // => 'Bar'

      // Create new 'description' property on `object`
      proxy.set('description', 'Foo is a whizboo baz');
      object.get('description') // => 'Foo is a whizboo baz'

  While `content` is unset, setting a property to be delegated will throw an Error.

      proxy = Ember.ObjectProxy.create({
        content: null,
        flag: null
      });
      proxy.set('flag', true);
      proxy.get('flag'); // => true
      proxy.get('foo'); // => undefined
      proxy.set('foo', 'data'); // throws Error

  Delegated properties can be bound to and will change when content is updated.

  Computed properties on the proxy itself can depend on delegated properties.

      ProxyWithComputedProperty = Ember.ObjectProxy.extend({
        fullName: function () {
          var firstName = this.get('firstName'),
              lastName = this.get('lastName');
          if (firstName && lastName) {
            return firstName + ' ' + lastName;
          }
          return firstName || lastName;
        }.property('firstName', 'lastName')
      });
      proxy = ProxyWithComputedProperty.create();
      proxy.get('fullName'); => undefined
      proxy.set('content', {
        firstName: 'Tom', lastName: 'Dale'
      }); // triggers property change for fullName on proxy
      proxy.get('fullName'); => 'Tom Dale'
*/
Ember.ObjectProxy = Ember.Object.extend(
/** @scope Ember.ObjectProxy.prototype */ {
  /**
    The object whose properties will be forwarded.

    @type Ember.Object
    @default null
  */
  content: null,
  /** @private */
  delegateGet: function (key) {
    var content = get(this, 'content');
    if (content) {
      return get(content, key);
    }
  },
  /** @private */
  delegateSet: function (key, value) {
    var content = get(this, 'content');
    if (!content) {
      throw new Error('Unable to delegate set without content for property: ' + key);
    }
    return set(content, key, value);
  },
  /** @private */
  willWatchProperty: function (key) {
    if (key in this) return;
    defineProperty(this, key, delegateDesc);
    addDelegateObservers(this, key);
  },
  /** @private */
  didUnwatchProperty: function (key) {
    if (isDelegateDesc(this, key)) {
      removeDelegateObservers(this, key);
      undefineProperty(this, key);
    }
  },
  /** @private */
  unknownProperty: function (key) {
    return this.delegateGet(key);
  },
  /** @private */
  setUnknownProperty: function (key, value) {
    this.delegateSet(key, value);
  }
});

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var set = Ember.set, get = Ember.get, guidFor = Ember.guidFor;
var forEach = Ember.EnumerableUtils.forEach;

var EachArray = Ember.Object.extend(Ember.Array, {

  init: function(content, keyName, owner) {
    this._super();
    this._keyName = keyName;
    this._owner   = owner;
    this._content = content;
  },

  objectAt: function(idx) {
    var item = this._content.objectAt(idx);
    return item && get(item, this._keyName);
  },

  length: Ember.computed(function() {
    var content = this._content;
    return content ? get(content, 'length') : 0;
  }).property().cacheable()

});

var IS_OBSERVER = /^.+:(before|change)$/;

/** @private */
function addObserverForContentKey(content, keyName, proxy, idx, loc) {
  var objects = proxy._objects, guid;
  if (!objects) objects = proxy._objects = {};

  while(--loc>=idx) {
    var item = content.objectAt(loc);
    if (item) {
      Ember.addBeforeObserver(item, keyName, proxy, 'contentKeyWillChange');
      Ember.addObserver(item, keyName, proxy, 'contentKeyDidChange');

      // keep track of the indicies each item was found at so we can map
      // it back when the obj changes.
      guid = guidFor(item);
      if (!objects[guid]) objects[guid] = [];
      objects[guid].push(loc);
    }
  }
}

/** @private */
function removeObserverForContentKey(content, keyName, proxy, idx, loc) {
  var objects = proxy._objects;
  if (!objects) objects = proxy._objects = {};
  var indicies, guid;

  while(--loc>=idx) {
    var item = content.objectAt(loc);
    if (item) {
      Ember.removeBeforeObserver(item, keyName, proxy, 'contentKeyWillChange');
      Ember.removeObserver(item, keyName, proxy, 'contentKeyDidChange');

      guid = guidFor(item);
      indicies = objects[guid];
      indicies[indicies.indexOf(loc)] = null;
    }
  }
}

/**
  @private
  @class

  This is the object instance returned when you get the @each property on an
  array.  It uses the unknownProperty handler to automatically create
  EachArray instances for property names.

  @extends Ember.Object
*/
Ember.EachProxy = Ember.Object.extend({

  init: function(content) {
    this._super();
    this._content = content;
    content.addArrayObserver(this);

    // in case someone is already observing some keys make sure they are
    // added
    forEach(Ember.watchedEvents(this), function(eventName) {
      this.didAddListener(eventName);
    }, this);
  },

  /**
    You can directly access mapped properties by simply requesting them.
    The unknownProperty handler will generate an EachArray of each item.
  */
  unknownProperty: function(keyName, value) {
    var ret;
    ret = new EachArray(this._content, keyName, this);
    new Ember.Descriptor().setup(this, keyName, ret);
    this.beginObservingContentKey(keyName);
    return ret;
  },

  // ..........................................................
  // ARRAY CHANGES
  // Invokes whenever the content array itself changes.

  arrayWillChange: function(content, idx, removedCnt, addedCnt) {
    var keys = this._keys, key, array, lim;

    lim = removedCnt>0 ? idx+removedCnt : -1;
    Ember.beginPropertyChanges(this);

    for(key in keys) {
      if (!keys.hasOwnProperty(key)) { continue; }

      if (lim>0) removeObserverForContentKey(content, key, this, idx, lim);

      Ember.propertyWillChange(this, key);
    }

    Ember.propertyWillChange(this._content, '@each');
    Ember.endPropertyChanges(this);
  },

  arrayDidChange: function(content, idx, removedCnt, addedCnt) {
    var keys = this._keys, key, array, lim;

    lim = addedCnt>0 ? idx+addedCnt : -1;
    Ember.beginPropertyChanges(this);

    for(key in keys) {
      if (!keys.hasOwnProperty(key)) { continue; }

      if (lim>0) addObserverForContentKey(content, key, this, idx, lim);

      Ember.propertyDidChange(this, key);
    }

    Ember.propertyDidChange(this._content, '@each');
    Ember.endPropertyChanges(this);
  },

  // ..........................................................
  // LISTEN FOR NEW OBSERVERS AND OTHER EVENT LISTENERS
  // Start monitoring keys based on who is listening...

  didAddListener: function(eventName) {
    if (IS_OBSERVER.test(eventName)) {
      this.beginObservingContentKey(eventName.slice(0, -7));
    }
  },

  didRemoveListener: function(eventName) {
    if (IS_OBSERVER.test(eventName)) {
      this.stopObservingContentKey(eventName.slice(0, -7));
    }
  },

  // ..........................................................
  // CONTENT KEY OBSERVING
  // Actual watch keys on the source content.

  beginObservingContentKey: function(keyName) {
    var keys = this._keys;
    if (!keys) keys = this._keys = {};
    if (!keys[keyName]) {
      keys[keyName] = 1;
      var content = this._content,
          len = get(content, 'length');
      addObserverForContentKey(content, keyName, this, 0, len);
    } else {
      keys[keyName]++;
    }
  },

  stopObservingContentKey: function(keyName) {
    var keys = this._keys;
    if (keys && (keys[keyName]>0) && (--keys[keyName]<=0)) {
      var content = this._content,
          len     = get(content, 'length');
      removeObserverForContentKey(content, keyName, this, 0, len);
    }
  },

  contentKeyWillChange: function(obj, keyName) {
    Ember.propertyWillChange(this, keyName);
  },

  contentKeyDidChange: function(obj, keyName) {
    Ember.propertyDidChange(this, keyName);
  }

});



})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

// Add Ember.Array to Array.prototype.  Remove methods with native
// implementations and supply some more optimized versions of generic methods
// because they are so common.
var NativeArray = Ember.Mixin.create(Ember.MutableArray, Ember.Observable, Ember.Copyable, {

  // because length is a built-in property we need to know to just get the
  // original property.
  get: function(key) {
    if (key==='length') return this.length;
    else if ('number' === typeof key) return this[key];
    else return this._super(key);
  },

  objectAt: function(idx) {
    return this[idx];
  },

  // primitive for array support.
  replace: function(idx, amt, objects) {

    if (this.isFrozen) throw Ember.FROZEN_ERROR ;

    // if we replaced exactly the same number of items, then pass only the
    // replaced range.  Otherwise, pass the full remaining array length
    // since everything has shifted
    var len = objects ? get(objects, 'length') : 0;
    this.arrayContentWillChange(idx, amt, len);

    if (!objects || objects.length === 0) {
      this.splice(idx, amt) ;
    } else {
      var args = [idx, amt].concat(objects) ;
      this.splice.apply(this,args) ;
    }

    this.arrayContentDidChange(idx, amt, len);
    return this ;
  },

  // If you ask for an unknown property, then try to collect the value
  // from member items.
  unknownProperty: function(key, value) {
    var ret;// = this.reducedProperty(key, value) ;
    if ((value !== undefined) && ret === undefined) {
      ret = this[key] = value;
    }
    return ret ;
  },

  // If browser did not implement indexOf natively, then override with
  // specialized version
  indexOf: function(object, startAt) {
    var idx, len = this.length;

    if (startAt === undefined) startAt = 0;
    else startAt = (startAt < 0) ? Math.ceil(startAt) : Math.floor(startAt);
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx<len;idx++) {
      if (this[idx] === object) return idx ;
    }
    return -1;
  },

  lastIndexOf: function(object, startAt) {
    var idx, len = this.length;

    if (startAt === undefined) startAt = len-1;
    else startAt = (startAt < 0) ? Math.ceil(startAt) : Math.floor(startAt);
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx>=0;idx--) {
      if (this[idx] === object) return idx ;
    }
    return -1;
  },

  copy: function() {
    return this.slice();
  }
});

// Remove any methods implemented natively so we don't override them
var ignore = ['length'];
Ember.EnumerableUtils.forEach(NativeArray.keys(), function(methodName) {
  if (Array.prototype[methodName]) ignore.push(methodName);
});

if (ignore.length>0) {
  NativeArray = NativeArray.without.apply(NativeArray, ignore);
}

/**
  The NativeArray mixin contains the properties needed to to make the native
  Array support Ember.MutableArray and all of its dependent APIs.  Unless you
  have Ember.EXTEND_PROTOTYPES set to false, this will be applied automatically.
  Otherwise you can apply the mixin at anytime by calling
  `Ember.NativeArray.activate`.

  @namespace
  @extends Ember.MutableArray
  @extends Ember.Array
  @extends Ember.Enumerable
  @extends Ember.MutableEnumerable
  @extends Ember.Copyable
  @extends Ember.Freezable
*/
Ember.NativeArray = NativeArray;

/**
  Creates an Ember.NativeArray from an Array like object.
  Does not modify the original object.

  @returns {Ember.NativeArray}
*/
Ember.A = function(arr){
  if (arr === undefined) { arr = []; }
  return Ember.NativeArray.apply(arr);
};

/**
  Activates the mixin on the Array.prototype if not already applied.  Calling
  this method more than once is safe.

  @returns {void}
*/
Ember.NativeArray.activate = function() {
  NativeArray.apply(Array.prototype);

  Ember.A = function(arr) { return arr || []; };
};

if (Ember.EXTEND_PROTOTYPES) Ember.NativeArray.activate();



})();



(function() {
var loadHooks = {};
var loaded = {};

Ember.onLoad = function(name, callback) {
  var object;

  loadHooks[name] = loadHooks[name] || Ember.A();
  loadHooks[name].pushObject(callback);

  if (object = loaded[name]) {
    callback(object);
  }
};

Ember.runLoadHooks = function(name, object) {
  var hooks;

  loaded[name] = object;

  if (hooks = loadHooks[name]) {
    loadHooks[name].forEach(function(callback) {
      callback(object);
    });
  }
};

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();



(function() {
Ember.ControllerMixin = Ember.Mixin.create({
  /**
    The object to which events from the view should be sent.

    For example, when a Handlebars template uses the `{{action}}` helper,
    it will attempt to send the event to the view's controller's `target`.

    By default, a controller's `target` is set to the router after it is
    instantiated by `Ember.Application#initialize`.
  */
  target: null,
  store: null
});

Ember.Controller = Ember.Object.extend(Ember.ControllerMixin);

})();



(function() {
var get = Ember.get, set = Ember.set, forEach = Ember.EnumerableUtils.forEach;

Ember.SortableMixin = Ember.Mixin.create(Ember.MutableEnumerable, {
  sortProperties: null,
  sortAscending: true,

  addObject: function(obj) {
    var content = get(this, 'content');
    content.pushObject(obj);
  },

  removeObject: function(obj) {
    var content = get(this, 'content');
    content.removeObject(obj);
  },

  orderBy: function(item1, item2) {
    var result = 0,
        sortProperties = get(this, 'sortProperties'),
        sortAscending = get(this, 'sortAscending');

    Ember.assert("you need to define `sortProperties`", !!sortProperties);

    forEach(sortProperties, function(propertyName) {
      if (result === 0) {
        result = Ember.compare(get(item1, propertyName), get(item2, propertyName));
        if ((result !== 0) && !sortAscending) {
          result = (-1) * result;
        }
      }
    });

    return result;
  },

  destroy: function() {
    var content = get(this, 'content'),
        sortProperties = get(this, 'sortProperties');

    if (content && sortProperties) {
      forEach(content, function(item) {
        forEach(sortProperties, function(sortProperty) {
          Ember.removeObserver(item, sortProperty, this, 'contentItemSortPropertyDidChange');
        }, this);
      }, this);
    }

    return this._super();
  },

  isSorted: Ember.computed('sortProperties', function() {
    return !!get(this, 'sortProperties');
  }),

  arrangedContent: Ember.computed('content', 'sortProperties.@each', function(key, value) {
    var content = get(this, 'content'),
        isSorted = get(this, 'isSorted'),
        sortProperties = get(this, 'sortProperties'),
        self = this;

    if (content && isSorted) {
      content = content.slice();
      content.sort(function(item1, item2) {
        return self.orderBy(item1, item2);
      });
      forEach(content, function(item) {
        forEach(sortProperties, function(sortProperty) {
          Ember.addObserver(item, sortProperty, this, 'contentItemSortPropertyDidChange');
        }, this);
      }, this);
      return Ember.A(content);
    }

    return content;
  }).cacheable(),

  _contentWillChange: Ember.beforeObserver(function() {
    var content = get(this, 'content'),
        sortProperties = get(this, 'sortProperties');

    if (content && sortProperties) {
      forEach(content, function(item) {
        forEach(sortProperties, function(sortProperty) {
          Ember.removeObserver(item, sortProperty, this, 'contentItemSortPropertyDidChange');
        }, this);
      }, this);
    }

    this._super();
  }, 'content'),

  sortAscendingWillChange: Ember.beforeObserver(function() {
    this._lastSortAscending = get(this, 'sortAscending');
  }, 'sortAscending'),

  sortAscendingDidChange: Ember.observer(function() {
    if (get(this, 'sortAscending') !== this._lastSortAscending) {
      var arrangedContent = get(this, 'arrangedContent');
      arrangedContent.reverse();
    }
  }, 'sortAscending'),

  contentArrayWillChange: function(array, idx, removedCount, addedCount) {
    var isSorted = get(this, 'isSorted');

    if (isSorted) {
      var arrangedContent = get(this, 'arrangedContent');
      var removedObjects = array.slice(idx, idx+removedCount);
      var sortProperties = get(this, 'sortProperties');

      forEach(removedObjects, function(item) {
        arrangedContent.removeObject(item);

        forEach(sortProperties, function(sortProperty) {
          Ember.removeObserver(item, sortProperty, this, 'contentItemSortPropertyDidChange');
        }, this);
      });
    }

    return this._super(array, idx, removedCount, addedCount);
  },

  contentArrayDidChange: function(array, idx, removedCount, addedCount) {
    var isSorted = get(this, 'isSorted'),
        sortProperties = get(this, 'sortProperties');

    if (isSorted) {
      var addedObjects = array.slice(idx, idx+addedCount);
      var arrangedContent = get(this, 'arrangedContent');

      forEach(addedObjects, function(item) {
        this.insertItemSorted(item);

        forEach(sortProperties, function(sortProperty) {
          Ember.addObserver(item, sortProperty, this, 'contentItemSortPropertyDidChange');
        }, this);
        this.arrayContentDidChange(idx, 0, 1);
      }, this);
    }

    return this._super(array, idx, removedCount, addedCount);
  },

  insertItemSorted: function(item) {
    var arrangedContent = get(this, 'arrangedContent');
    var length = get(arrangedContent, 'length');

    var idx = this._binarySearch(item, 0, length);
    arrangedContent.insertAt(idx, item);
  },

  contentItemSortPropertyDidChange: function(item) {
    var arrangedContent = get(this, 'arrangedContent'),
        index = arrangedContent.indexOf(item);

    arrangedContent.removeObject(item);
    this.insertItemSorted(item);
  },

  _binarySearch: function(item, low, high) {
    var mid, midItem, res, arrangedContent;

    if (low === high) {
      return low;
    }

    arrangedContent = get(this, 'arrangedContent');

    mid = low + Math.floor((high - low) / 2);
    midItem = arrangedContent.objectAt(mid);

    res = this.orderBy(midItem, item);

    if (res < 0) {
      return this._binarySearch(item, mid+1, high);
    } else if (res > 0) {
      return this._binarySearch(item, low, mid);
    }

    return mid;
  }
});

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

/**
  @class

  Ember.ArrayController provides a way for you to publish a collection of objects
  so that you can easily bind to the collection from a Handlebars #each helper,
  an Ember.CollectionView, or other controllers.

  The advantage of using an ArrayController is that you only have to set up
  your view bindings once; to change what's displayed, simply swap out the
  `content` property on the controller.

  For example, imagine you wanted to display a list of items fetched via an XHR
  request. Create an Ember.ArrayController and set its `content` property:

      MyApp.listController = Ember.ArrayController.create();

      $.get('people.json', function(data) {
        MyApp.listController.set('content', data);
      });

  Then, create a view that binds to your new controller:

      {{#each MyApp.listController}}
        {{firstName}} {{lastName}}
      {{/each}}

  Although you are binding to the controller, the behavior of this controller
  is to pass through any methods or properties to the underlying array. This
  capability comes from `Ember.ArrayProxy`, which this class inherits from.

  Note: As of this writing, `ArrayController` does not add any functionality
  to its superclass, `ArrayProxy`. The Ember team plans to add additional
  controller-specific functionality in the future, e.g. single or multiple
  selection support. If you are creating something that is conceptually a
  controller, use this class.

  @extends Ember.ArrayProxy
*/

Ember.ArrayController = Ember.ArrayProxy.extend(Ember.ControllerMixin,
  Ember.SortableMixin);

})();



(function() {
Ember.ObjectController = Ember.ObjectProxy.extend(Ember.ControllerMixin);

})();



(function() {

})();



(function() {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();

(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = Ember.get, set = Ember.set;

/**
  @class

  An Ember.Application instance serves as the namespace in which you define your
  application's classes. You can also override the configuration of your
  application.

  By default, Ember.Application will begin listening for events on the document.
  If your application is embedded inside a page, instead of controlling the
  entire document, you can specify which DOM element to attach to by setting
  the `rootElement` property:

      MyApp = Ember.Application.create({
        rootElement: $('#my-app')
      });

  The root of an Ember.Application must not be removed during the course of the
  page's lifetime. If you have only a single conceptual application for the
  entire page, and are not embedding any third-party Ember applications
  in your page, use the default document root for your application.

  You only need to specify the root if your page contains multiple instances
  of Ember.Application.

  @extends Ember.Object
*/
Ember.Application = Ember.Namespace.extend(
/** @scope Ember.Application.prototype */{

  /**
    The root DOM element of the Application.

    Can be specified as DOMElement or a selector string.

    @type DOMElement
    @default 'body'
  */
  rootElement: 'body',

  /**
    @type Ember.EventDispatcher
    @default null
  */
  eventDispatcher: null,

  /**
    @type Object
    @default null
  */
  customEvents: null,

  /** @private */
  init: function() {
    var eventDispatcher,
        rootElement = get(this, 'rootElement');
    this._super();

    eventDispatcher = Ember.EventDispatcher.create({
      rootElement: rootElement
    });

    set(this, 'eventDispatcher', eventDispatcher);

    // jQuery 1.7 doesn't call the ready callback if already ready
    if (Ember.$.isReady) {
      Ember.run.once(this, this.didBecomeReady);
    } else {
      var self = this;
      Ember.$(document).ready(function() {
        Ember.run.once(self, self.didBecomeReady);
      });
    }
  },

  /**
    Instantiate all controllers currently available on the namespace
    and inject them onto a router.

    Example:

        App.PostsController = Ember.ArrayController.extend();
        App.CommentsController = Ember.ArrayController.extend();

        var router = Ember.Router.create({
          ...
        });

        App.initialize(router);

        router.get('postsController')     // <App.PostsController:ember1234>
        router.get('commentsController')  // <App.CommentsController:ember1235>

        router.getPath('postsController.router') // router
  */
  initialize: function(router) {
    var properties = Ember.A(Ember.keys(this)),
        injections = get(this.constructor, 'injections'),
        namespace = this, controller, name;

    if (!router && Ember.Router.detect(namespace['Router'])) {
      router = namespace['Router'].create();
      this._createdRouter = router;
    }

    if (router) {
      set(this, 'router', router);

      // By default, the router's namespace is the current application.
      //
      // This allows it to find model classes when a state has a
      // route like `/posts/:post_id`. In that case, it would first
      // convert `post_id` into `Post`, and then look it up on its
      // namespace.
      set(router, 'namespace', this);
    }

    Ember.runLoadHooks('application', this);

    injections.forEach(function(injection) {
      properties.forEach(function(property) {
        injection[1](namespace, router, property);
      });
    });

    if (router && router instanceof Ember.Router) {
      this.startRouting(router);
    }
  },

  /** @private */
  didBecomeReady: function() {
    var eventDispatcher = get(this, 'eventDispatcher'),
        customEvents    = get(this, 'customEvents');

    eventDispatcher.setup(customEvents);

    this.ready();
  },

  /**
    @private

    If the application has a router, use it to route to the current URL, and
    trigger a new call to `route` whenever the URL changes.
  */
  startRouting: function(router) {
    var location = get(router, 'location'),
        rootElement = get(this, 'rootElement'),
        applicationController = get(router, 'applicationController');

    if (this.ApplicationView && applicationController) {
      var applicationView = this.ApplicationView.create({
        controller: applicationController
      });
      this._createdApplicationView = applicationView;

      applicationView.appendTo(rootElement);
    }

    router.route(location.getURL());
    location.onUpdateURL(function(url) {
      router.route(url);
    });
  },

  /**
    Called when the Application has become ready.
    The call will be delayed until the DOM has become ready.
  */
  ready: Ember.K,

  /** @private */
  willDestroy: function() {
    get(this, 'eventDispatcher').destroy();
    if (this._createdRouter)          { this._createdRouter.destroy(); }
    if (this._createdApplicationView) { this._createdApplicationView.destroy(); }
  },

  registerInjection: function(options) {
    this.constructor.registerInjection(options);
  }
});

Ember.Application.reopenClass({
  concatenatedProperties: ['injections'],
  injections: Ember.A(),
  registerInjection: function(options) {
    var injections = get(this, 'injections'),
        before = options.before,
        name = options.name,
        injection = options.injection,
        location;

    if (before) {
      location = injections.find(function(item) {
        if (item[0] === before) { return true; }
      });
      location = injections.indexOf(location);
    } else {
      location = get(injections, 'length');
    }

    injections.splice(location, 0, [name, injection]);
  }
});

Ember.Application.registerInjection({
  name: 'controllers',
  injection: function(app, router, property) {
    if (!/^[A-Z].*Controller$/.test(property)) { return; }

    var name = property[0].toLowerCase() + property.substr(1),
        controller = app[property].create();

    router.set(name, controller);

    controller.setProperties({
      target: router,
      controllers: router,
      namespace: app
    });
  }
});

})();



(function() {
var get = Ember.get, set = Ember.set;

/**
  This file implements the `location` API used by Ember's router.

  That API is:

  getURL: returns the current URL
  setURL(path): sets the current URL
  onUpdateURL(callback): triggers the callback when the URL changes
  formatURL(url): formats `url` to be placed into `href` attribute

  Calling setURL will not trigger onUpdateURL callbacks.

  TODO: This, as well as the Ember.Location documentation below, should
  perhaps be moved so that it's visible in the JsDoc output.
*/
/**
  Ember.Location returns an instance of the correct implementation of
  the `location` API.

  You can pass it a `implementation` ('hash', 'history', 'none') to force a
  particular implementation.
*/
Ember.Location = {
  create: function(options) {
    var implementation = options && options.implementation;
    Ember.assert("Ember.Location.create: you must specify a 'implementation' option", !!implementation);

    var implementationClass = this.implementations[implementation];
    Ember.assert("Ember.Location.create: " + implementation + " is not a valid implementation", !!implementationClass);

    return implementationClass.create.apply(implementationClass, arguments);
  },

  registerImplementation: function(name, implementation) {
    this.implementations[name] = implementation;
  },

  implementations: {}
};

})();



(function() {
var get = Ember.get, set = Ember.set;

/**
  Ember.HashLocation implements the location API using the browser's
  hash. At present, it relies on a hashchange event existing in the
  browser.
*/
Ember.HashLocation = Ember.Object.extend({
  init: function() {
    set(this, 'location', get(this, 'location') || window.location);
    set(this, 'callbacks', Ember.A());
  },

  /**
    @private

    Returns the current `location.hash`, minus the '#' at the front.
  */
  getURL: function() {
    return get(this, 'location').hash.substr(1);
  },

  /**
    @private

    Set the `location.hash` and remembers what was set. This prevents
    `onUpdateURL` callbacks from triggering when the hash was set by
    `HashLocation`.
  */
  setURL: function(path) {
    get(this, 'location').hash = path;
    set(this, 'lastSetURL', path);
  },

  /**
    @private

    Register a callback to be invoked when the hash changes. These
    callbacks will execute when the user presses the back or forward
    button, but not after `setURL` is invoked.
  */
  onUpdateURL: function(callback) {
    var self = this;

    var hashchange = function() {
      var path = location.hash.substr(1);
      if (get(self, 'lastSetURL') === path) { return; }

      set(self, 'lastSetURL', null);

      callback(location.hash.substr(1));
    };

    get(this, 'callbacks').pushObject(hashchange);

    // This won't work on old browsers anyway, but this check prevents errors
    if (window.addEventListener) {
      window.addEventListener('hashchange', hashchange, false);
    }
  },

  /**
    @private

    Given a URL, formats it to be placed into the page as part
    of an element's `href` attribute.

    This is used, for example, when using the {{action}} helper
    to generate a URL based on an event.
  */
  formatURL: function(url) {
    return '#'+url;
  },

  willDestroy: function() {
    get(this, 'callbacks').forEach(function(callback) {
      window.removeEventListener('hashchange', callback, false);
    });
    set(this, 'callbacks', null);
  }
});

Ember.Location.registerImplementation('hash', Ember.HashLocation);

})();



(function() {
var get = Ember.get, set = Ember.set;

/**
  Ember.HistoryLocation implements the location API using the browser's
  history.pushState API.
*/
Ember.HistoryLocation = Ember.Object.extend({
  init: function() {
    set(this, 'location', get(this, 'location') || window.location);
    set(this, 'callbacks', Ember.A());
  },

  /**
    @private

    Returns the current `location.pathname`.
  */
  getURL: function() {
    return get(this, 'location').pathname;
  },

  /**
    @private

    Uses `history.pushState` to update the url without a page reload.
  */
  setURL: function(path) {
    var state = window.history.state;
    if (path === "") { path = '/'; }
    // We only want pushState to be executed if we are passing
    // in a new path, otherwise a new state will be inserted
    // for the same path.
    if (!state || (state && state.path !== path)) {
      window.history.pushState({ path: path }, null, path);
    }
  },

  /**
    @private

    Register a callback to be invoked whenever the browser
    history changes, including using forward and back buttons.
  */
  onUpdateURL: function(callback) {
    var self = this;

    var popstate = function(e) {
      callback(location.pathname);
    };

    get(this, 'callbacks').pushObject(popstate);

    // This won't work on old browsers anyway, but this check prevents errors
    if (window.addEventListener) {
      window.addEventListener('popstate', popstate, false);
    }
  },

  /**
    @private

    Used when using {{action}} helper.  Since no formatting
    is required we just return the url given.
  */
  formatURL: function(url) {
    return url;
  },

  willDestroy: function() {
    get(this, 'callbacks').forEach(function(callback) {
      window.removeEventListener('popstate', callback, false);
    });
    set(this, 'callbacks', null);
  }
});

Ember.Location.registerImplementation('history', Ember.HistoryLocation);

})();



(function() {
var get = Ember.get, set = Ember.set;

/**
  Ember.NoneLocation does not interact with the browser. It is useful for
  testing, or when you need to manage state with your Router, but temporarily
  don't want it to muck with the URL (for example when you embed your
  application in a larger page).
*/
Ember.NoneLocation = Ember.Object.extend({
  path: '',

  getURL: function() {
    return get(this, 'path');
  },

  setURL: function(path) {
    set(this, 'path', path);
  },

  onUpdateURL: function(callback) {
    // We are not wired up to the browser, so we'll never trigger the callback.
  },

  formatURL: function(url) {
    // The return value is not overly meaningful, but we do not want to throw
    // errors when test code renders templates containing {{action href=true}}
    // helpers.
    return url;
  }
});

Ember.Location.registerImplementation('none', Ember.NoneLocation);

})();



(function() {

})();



(function() {

})();

(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

Ember.assert("Ember Views require jQuery 1.6 or 1.7", window.jQuery && (window.jQuery().jquery.match(/^1\.[67](\.\d+)?(pre|rc\d?)?/) || Ember.ENV.FORCE_JQUERY));
Ember.$ = window.jQuery;

})();



(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = Ember.get, set = Ember.set;
var indexOf = Ember.ArrayPolyfills.indexOf;

/** @private */
var ClassSet = function() {
  this.seen = {};
  this.list = [];
};

ClassSet.prototype = {
  add: function(string) {
    if (string in this.seen) { return; }
    this.seen[string] = true;

    this.list.push(string);
  },

  toDOM: function() {
    return this.list.join(" ");
  }
};

/**
  @class

  Ember.RenderBuffer gathers information regarding the a view and generates the
  final representation. Ember.RenderBuffer will generate HTML which can be pushed
  to the DOM.

  @extends Ember.Object
*/
Ember.RenderBuffer = function(tagName) {
  return new Ember._RenderBuffer(tagName);
};

Ember._RenderBuffer = function(tagName) {
  this.elementTag = tagName;
  this.childBuffers = [];
};

Ember._RenderBuffer.prototype =
/** @scope Ember.RenderBuffer.prototype */ {

  /**
    Array of class-names which will be applied in the class="" attribute

    You should not maintain this array yourself, rather, you should use
    the addClass() method of Ember.RenderBuffer.

    @type Array
    @default []
  */
  elementClasses: null,

  /**
    The id in of the element, to be applied in the id="" attribute

    You should not set this property yourself, rather, you should use
    the id() method of Ember.RenderBuffer.

    @type String
    @default null
  */
  elementId: null,

  /**
    A hash keyed on the name of the attribute and whose value will be
    applied to that attribute. For example, if you wanted to apply a
    data-view="Foo.bar" property to an element, you would set the
    elementAttributes hash to {'data-view':'Foo.bar'}

    You should not maintain this hash yourself, rather, you should use
    the attr() method of Ember.RenderBuffer.

    @type Hash
    @default {}
  */
  elementAttributes: null,

  /**
    The tagname of the element an instance of Ember.RenderBuffer represents.

    Usually, this gets set as the first parameter to Ember.RenderBuffer. For
    example, if you wanted to create a `p` tag, then you would call

      Ember.RenderBuffer('p')

    @type String
    @default null
  */
  elementTag: null,

  /**
    A hash keyed on the name of the style attribute and whose value will
    be applied to that attribute. For example, if you wanted to apply a
    background-color:black;" style to an element, you would set the
    elementStyle hash to {'background-color':'black'}

    You should not maintain this hash yourself, rather, you should use
    the style() method of Ember.RenderBuffer.

    @type Hash
    @default {}
  */
  elementStyle: null,

  /**
    Nested RenderBuffers will set this to their parent RenderBuffer
    instance.

    @type Ember._RenderBuffer
  */
  parentBuffer: null,

  /**
    Adds a string of HTML to the RenderBuffer.

    @param {String} string HTML to push into the buffer
    @returns {Ember.RenderBuffer} this
  */
  push: function(string) {
    this.childBuffers.push(String(string));
    return this;
  },

  /**
    Adds a class to the buffer, which will be rendered to the class attribute.

    @param {String} className Class name to add to the buffer
    @returns {Ember.RenderBuffer} this
  */
  addClass: function(className) {
    // lazily create elementClasses
    var elementClasses = this.elementClasses = (this.elementClasses || new ClassSet());
    this.elementClasses.add(className);

    return this;
  },

  /**
    Sets the elementID to be used for the element.

    @param {String} id
    @returns {Ember.RenderBuffer} this
  */
  id: function(id) {
    this.elementId = id;
    return this;
  },

  // duck type attribute functionality like jQuery so a render buffer
  // can be used like a jQuery object in attribute binding scenarios.

  /**
    Adds an attribute which will be rendered to the element.

    @param {String} name The name of the attribute
    @param {String} value The value to add to the attribute
    @returns {Ember.RenderBuffer|String} this or the current attribute value
  */
  attr: function(name, value) {
    var attributes = this.elementAttributes = (this.elementAttributes || {});

    if (arguments.length === 1) {
      return attributes[name];
    } else {
      attributes[name] = value;
    }

    return this;
  },

  /**
    Remove an attribute from the list of attributes to render.

    @param {String} name The name of the attribute
    @returns {Ember.RenderBuffer} this
  */
  removeAttr: function(name) {
    var attributes = this.elementAttributes;
    if (attributes) { delete attributes[name]; }

    return this;
  },

  /**
    Adds a style to the style attribute which will be rendered to the element.

    @param {String} name Name of the style
    @param {String} value
    @returns {Ember.RenderBuffer} this
  */
  style: function(name, value) {
    var style = this.elementStyle = (this.elementStyle || {});

    this.elementStyle[name] = value;
    return this;
  },

  /**
    Create a new child render buffer from a parent buffer. Optionally set
    additional properties on the buffer. Optionally invoke a callback
    with the newly created buffer.

    This is a primitive method used by other public methods: `begin`,
    `prepend`, `replaceWith`, `insertAfter`.

    @private
    @param {String} tagName Tag name to use for the child buffer's element
    @param {Ember._RenderBuffer} parent The parent render buffer that this
      buffer should be appended to.
    @param {Function} fn A callback to invoke with the newly created buffer.
    @param {Object} other Additional properties to add to the newly created
      buffer.
  */
  newBuffer: function(tagName, parent, fn, other) {
    var buffer = new Ember._RenderBuffer(tagName);
    buffer.parentBuffer = parent;

    if (other) { Ember.$.extend(buffer, other); }
    if (fn) { fn.call(this, buffer); }

    return buffer;
  },

  /**
    Replace the current buffer with a new buffer. This is a primitive
    used by `remove`, which passes `null` for `newBuffer`, and `replaceWith`,
    which passes the new buffer it created.

    @private
    @param {Ember._RenderBuffer} buffer The buffer to insert in place of
      the existing buffer.
  */
  replaceWithBuffer: function(newBuffer) {
    var parent = this.parentBuffer;
    if (!parent) { return; }

    var childBuffers = parent.childBuffers;

    var index = indexOf.call(childBuffers, this);

    if (newBuffer) {
      childBuffers.splice(index, 1, newBuffer);
    } else {
      childBuffers.splice(index, 1);
    }
  },

  /**
    Creates a new Ember.RenderBuffer object with the provided tagName as
    the element tag and with its parentBuffer property set to the current
    Ember.RenderBuffer.

    @param {String} tagName Tag name to use for the child buffer's element
    @returns {Ember.RenderBuffer} A new RenderBuffer object
  */
  begin: function(tagName) {
    return this.newBuffer(tagName, this, function(buffer) {
      this.childBuffers.push(buffer);
    });
  },

  /**
    Prepend a new child buffer to the current render buffer.

    @param {String} tagName Tag name to use for the child buffer's element
  */
  prepend: function(tagName) {
    return this.newBuffer(tagName, this, function(buffer) {
      this.childBuffers.splice(0, 0, buffer);
    });
  },

  /**
    Replace the current buffer with a new render buffer.

    @param {String} tagName Tag name to use for the new buffer's element
  */
  replaceWith: function(tagName) {
    var parentBuffer = this.parentBuffer;

    return this.newBuffer(tagName, parentBuffer, function(buffer) {
      this.replaceWithBuffer(buffer);
    });
  },

  /**
    Insert a new render buffer after the current render buffer.

    @param {String} tagName Tag name to use for the new buffer's element
  */
  insertAfter: function(tagName) {
    var parentBuffer = get(this, 'parentBuffer');

    return this.newBuffer(tagName, parentBuffer, function(buffer) {
      var siblings = parentBuffer.childBuffers;
      var index = indexOf.call(siblings, this);
      siblings.splice(index + 1, 0, buffer);
    });
  },

  /**
    Closes the current buffer and adds its content to the parentBuffer.

    @returns {Ember.RenderBuffer} The parentBuffer, if one exists. Otherwise, this
  */
  end: function() {
    var parent = this.parentBuffer;
    return parent || this;
  },

  remove: function() {
    this.replaceWithBuffer(null);
  },

  /**
    @returns {DOMElement} The element corresponding to the generated HTML
      of this buffer
  */
  element: function() {
    return Ember.$(this.string())[0];
  },

  /**
    Generates the HTML content for this buffer.

    @returns {String} The generated HTMl
  */
  string: function() {
    var content = '', tag = this.elementTag, openTag;

    if (tag) {
      var id = this.elementId,
          classes = this.elementClasses,
          attrs = this.elementAttributes,
          style = this.elementStyle,
          styleBuffer = '', prop;

      openTag = ["<" + tag];

      if (id) { openTag.push('id="' + this._escapeAttribute(id) + '"'); }
      if (classes) { openTag.push('class="' + this._escapeAttribute(classes.toDOM()) + '"'); }

      if (style) {
        for (prop in style) {
          if (style.hasOwnProperty(prop)) {
            styleBuffer += (prop + ':' + this._escapeAttribute(style[prop]) + ';');
          }
        }

        openTag.push('style="' + styleBuffer + '"');
      }

      if (attrs) {
        for (prop in attrs) {
          if (attrs.hasOwnProperty(prop)) {
            openTag.push(prop + '="' + this._escapeAttribute(attrs[prop]) + '"');
          }
        }
      }

      openTag = openTag.join(" ") + '>';
    }

    var childBuffers = this.childBuffers;

    Ember.ArrayPolyfills.forEach.call(childBuffers, function(buffer) {
      var stringy = typeof buffer === 'string';
      content += (stringy ? buffer : buffer.string());
    });

    if (tag) {
      return openTag + content + "</" + tag + ">";
    } else {
      return content;
    }
  },

  _escapeAttribute: function(value) {
    // Stolen shamelessly from Handlebars

    var escape = {
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "`": "&#x60;"
    };

    var badChars = /&(?!\w+;)|[<>"'`]/g;
    var possible = /[&<>"'`]/;

    var escapeChar = function(chr) {
      return escape[chr] || "&amp;";
    };

    var string = value.toString();

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  }

};

})();



(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt;

/**
  @ignore

  Ember.EventDispatcher handles delegating browser events to their corresponding
  Ember.Views. For example, when you click on a view, Ember.EventDispatcher ensures
  that that view's `mouseDown` method gets called.
*/
Ember.EventDispatcher = Ember.Object.extend(
/** @scope Ember.EventDispatcher.prototype */{

  /**
    @private

    The root DOM element to which event listeners should be attached. Event
    listeners will be attached to the document unless this is overridden.

    Can be specified as a DOMElement or a selector string.

    The default body is a string since this may be evaluated before document.body
    exists in the DOM.

    @type DOMElement
    @default 'body'
  */
  rootElement: 'body',

  /**
    @private

    Sets up event listeners for standard browser events.

    This will be called after the browser sends a DOMContentReady event. By
    default, it will set up all of the listeners on the document body. If you
    would like to register the listeners on a different element, set the event
    dispatcher's `root` property.
  */
  setup: function(addedEvents) {
    var event, events = {
      touchstart  : 'touchStart',
      touchmove   : 'touchMove',
      touchend    : 'touchEnd',
      touchcancel : 'touchCancel',
      keydown     : 'keyDown',
      keyup       : 'keyUp',
      keypress    : 'keyPress',
      mousedown   : 'mouseDown',
      mouseup     : 'mouseUp',
      contextmenu : 'contextMenu',
      click       : 'click',
      dblclick    : 'doubleClick',
      mousemove   : 'mouseMove',
      focusin     : 'focusIn',
      focusout    : 'focusOut',
      mouseenter  : 'mouseEnter',
      mouseleave  : 'mouseLeave',
      submit      : 'submit',
      input       : 'input',
      change      : 'change',
      dragstart   : 'dragStart',
      drag        : 'drag',
      dragenter   : 'dragEnter',
      dragleave   : 'dragLeave',
      dragover    : 'dragOver',
      drop        : 'drop',
      dragend     : 'dragEnd'
    };

    Ember.$.extend(events, addedEvents || {});

    var rootElement = Ember.$(get(this, 'rootElement'));

    Ember.assert(fmt('You cannot use the same root element (%@) multiple times in an Ember.Application', [rootElement.selector || rootElement[0].tagName]), !rootElement.is('.ember-application'));
    Ember.assert('You cannot make a new Ember.Application using a root element that is a descendent of an existing Ember.Application', !rootElement.closest('.ember-application').length);
    Ember.assert('You cannot make a new Ember.Application using a root element that is an ancestor of an existing Ember.Application', !rootElement.find('.ember-application').length);

    rootElement.addClass('ember-application');

    Ember.assert('Unable to add "ember-application" class to rootElement. Make sure you set rootElement to the body or an element in the body.', rootElement.is('.ember-application'));

    for (event in events) {
      if (events.hasOwnProperty(event)) {
        this.setupHandler(rootElement, event, events[event]);
      }
    }
  },

  /**
    @private

    Registers an event listener on the document. If the given event is
    triggered, the provided event handler will be triggered on the target
    view.

    If the target view does not implement the event handler, or if the handler
    returns false, the parent view will be called. The event will continue to
    bubble to each successive parent view until it reaches the top.

    For example, to have the `mouseDown` method called on the target view when
    a `mousedown` event is received from the browser, do the following:

        setupHandler('mousedown', 'mouseDown');

    @param {String} event the browser-originated event to listen to
    @param {String} eventName the name of the method to call on the view
  */
  setupHandler: function(rootElement, event, eventName) {
    var self = this;

    rootElement.delegate('.ember-view', event + '.ember', function(evt, triggeringManager) {

      var view = Ember.View.views[this.id],
          result = true, manager = null;

      manager = self._findNearestEventManager(view,eventName);

      if (manager && manager !== triggeringManager) {
        result = self._dispatchEvent(manager, evt, eventName, view);
      } else if (view) {
        result = self._bubbleEvent(view,evt,eventName);
      } else {
        evt.stopPropagation();
      }

      return result;
    });

    rootElement.delegate('[data-ember-action]', event + '.ember', function(evt) {
      var actionId = Ember.$(evt.currentTarget).attr('data-ember-action'),
          action   = Ember.Handlebars.ActionHelper.registeredActions[actionId],
          handler  = action.handler;

      if (action.eventName === eventName) {
        evt.preventDefault();
        return handler(evt);
      }
    });
  },

  /** @private */
  _findNearestEventManager: function(view, eventName) {
    var manager = null;

    while (view) {
      manager = get(view, 'eventManager');
      if (manager && manager[eventName]) { break; }

      view = get(view, 'parentView');
    }

    return manager;
  },

  /** @private */
  _dispatchEvent: function(object, evt, eventName, view) {
    var result = true;

    var handler = object[eventName];
    if (Ember.typeOf(handler) === 'function') {
      result = handler.call(object, evt, view);
      // Do not preventDefault in eventManagers.
      evt.stopPropagation();
    }
    else {
      result = this._bubbleEvent(view, evt, eventName);
    }

    return result;
  },

  /** @private */
  _bubbleEvent: function(view, evt, eventName) {
    return Ember.run(function() {
      return view.handleEvent(eventName, evt);
    });
  },

  /** @private */
  destroy: function() {
    var rootElement = get(this, 'rootElement');
    Ember.$(rootElement).undelegate('.ember').removeClass('ember-application');
    return this._super();
  }
});

})();



(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// Add a new named queue for rendering views that happens
// after bindings have synced.
var queues = Ember.run.queues;
queues.splice(Ember.$.inArray('actions', queues)+1, 0, 'render');

})();



(function() {
var get = Ember.get, set = Ember.set;

Ember.ControllerMixin.reopen({

  target: null,
  controllers: null,
  namespace: null,
  view: null,

  /**
    `connectOutlet` creates a new instance of a provided view
    class, wires it up to its associated controller, and
    assigns the new view to a property on the current controller.

    The purpose of this method is to enable views that use
    outlets to quickly assign new views for a given outlet.

    For example, an application view's template may look like
    this:

        <h1>My Blog</h1>
        {{outlet}}

    The view for this outlet is specified by assigning a
    `view` property to the application's controller. The
    following code will assign a new `App.PostsView` to
    that outlet:

        applicationController.connectOutlet('posts');

    In general, you will also want to assign a controller
    to the newly created view. By convention, a controller
    named `postsController` will be assigned as the view's
    controller.

    In an application initialized using `app.initialize(router)`,
    `connectOutlet` will look for `postsController` on the
    router. The initialization process will automatically
    create an instance of `App.PostsController` called
    `postsController`, so you don't need to do anything
    beyond `connectOutlet` to assign your view and wire it
    up to its associated controller.

    You can supply a `content` for the controller by supplying
    a final argument after the view class:

        applicationController.connectOutlet('posts', App.Post.find());

    You can specify a particular outlet to use. For example, if your main
    template looks like:

        <h1>My Blog</h1>
        {{outlet master}}
        {{outlet detail}}

    You can assign an `App.PostsView` to the master outlet:

        applicationController.connectOutlet({
          name: 'posts',
          outletName: 'master',
          context: App.Post.find()
        });

    @param {Class} name a view class to instantiate
    @param {Object} context a context object to assign to the
      controller's `content` property, if a controller can be
      found (optional)
  */
  connectOutlet: function(name, context) {
    // Normalize arguments. Supported arguments:
    //
    // name
    // name, context
    // options
    //
    // The options hash has the following keys:
    //
    //   name: the name of the controller and view
    //     to use. If this is passed, the name
    //     determines the view and controller.
    //   outletName: the name of the outlet to
    //     fill in. default: 'view'
    //   viewClass: the class of the view to instantiate
    //   controller: the controller instance to pass
    //     to the view
    //   context: an object that should become the
    //     controller's `content` and thus the
    //     template's context.

    var outletName, viewClass, view, controller, options;

    if (arguments.length === 1) {
      if (Ember.typeOf(name) === 'object') {
        options = name;
        outletName = options.outletName;
        name = options.name;
        viewClass = options.viewClass;
        controller = options.controller;
        context = options.context;
      }
    } else {
      options = {};
    }

    outletName = outletName || 'view';

    Ember.assert("You must supply a name or a view class to connectOutlets, but not both", (!!name && !viewClass && !controller) || (!name && !!viewClass));

    if (name) {
      var namespace = get(this, 'namespace'),
          controllers = get(this, 'controllers');

      var viewClassName = name.charAt(0).toUpperCase() + name.substr(1) + "View";
      viewClass = get(namespace, viewClassName);
      controller = get(controllers, name + 'Controller');

      Ember.assert("The name you supplied " + name + " did not resolve to a view " + viewClassName, !!viewClass);
      Ember.assert("The name you supplied " + name + " did not resolve to a controller " + name + 'Controller', (!!controller && !!context) || !context);
    }

    if (controller && context) { controller.set('content', context); }
    view = viewClass.create();
    if (controller) { set(view, 'controller', controller); }
    set(this, outletName, view);

    return view;
  }
});


})();



(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();



(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, addObserver = Ember.addObserver;
var getPath = Ember.getPath, meta = Ember.meta, fmt = Ember.String.fmt;
var a_slice = [].slice;
var a_forEach = Ember.EnumerableUtils.forEach;

var childViewsProperty = Ember.computed(function() {
  var childViews = get(this, '_childViews');

  var ret = Ember.A();

  a_forEach(childViews, function(view) {
    if (view.isVirtual) {
      ret.pushObjects(get(view, 'childViews'));
    } else {
      ret.push(view);
    }
  });

  return ret;
}).property().cacheable();

var VIEW_PRESERVES_CONTEXT = Ember.VIEW_PRESERVES_CONTEXT;
Ember.warn("The way that the {{view}} helper affects templates is about to change. Previously, templates inside child views would use the new view as the context. Soon, views will preserve their parent context when rendering their template. You can opt-in early to the new behavior by setting `ENV.VIEW_PRESERVES_CONTEXT = true`. For more information, see https://gist.github.com/2494968. You should update your templates as soon as possible; this default will change soon, and the option will be eliminated entirely before the 1.0 release.", VIEW_PRESERVES_CONTEXT);

/**
  @static

  Global hash of shared templates. This will automatically be populated
  by the build tools so that you can store your Handlebars templates in
  separate files that get loaded into JavaScript at buildtime.

  @type Hash
*/
Ember.TEMPLATES = {};

var invokeForState = {
  preRender: {},
  inBuffer: {},
  hasElement: {},
  inDOM: {},
  destroyed: {}
};

/**
  @class

  `Ember.View` is the class in Ember responsible for encapsulating templates of HTML
  content, combining templates with data to render as sections of a page's DOM, and
  registering and responding to user-initiated events.

  ## HTML Tag
  The default HTML tag name used for a view's DOM representation is `div`. This can be
  customized by setting the `tagName` property. The following view class:

      ParagraphView = Ember.View.extend({
        tagName: 'em'
      })

  Would result in instances with the following HTML:

      <em id="ember1" class="ember-view"></em>

  ## HTML `class` Attribute
  The HTML `class` attribute of a view's tag can be set by providing a `classNames` property
  that is set to an array of strings:

      MyView = Ember.View.extend({
        classNames: ['my-class', 'my-other-class']
      })

  Will result in view instances with an HTML representation of:

      <div id="ember1" class="ember-view my-class my-other-class"></div>

  `class` attribute values can also be set by providing a `classNameBindings` property
  set to an array of properties names for the view. The return value of these properties
  will be added as part of the value for the view's `class` attribute. These properties
  can be computed properties:

      MyView = Ember.View.extend({
        classNameBindings: ['propertyA', 'propertyB'],
        propertyA: 'from-a',
        propertyB: function(){
          if(someLogic){ return 'from-b'; }
        }.property()
      })

  Will result in view instances with an HTML representation of:

      <div id="ember1" class="ember-view from-a from-b"></div>

  If the value of a class name binding returns a boolean the property name itself
  will be used as the class name if the property is true. The class name will
  not be added if the value is `false` or `undefined`.

      MyView = Ember.View.extend({
        classNameBindings: ['hovered'],
        hovered: true
      })

  Will result in view instances with an HTML representation of:

      <div id="ember1" class="ember-view hovered"></div>

  When using boolean class name bindings you can supply a string value other than the
  property name for use as the `class` HTML attribute by appending the preferred value after
  a ":" character when defining the binding:

      MyView = Ember.View.extend({
        classNameBindings: ['awesome:so-very-cool'],
        awesome: true
      })

  Will result in view instances with an HTML representation of:

      <div id="ember1" class="ember-view so-very-cool"></div>


  Boolean value class name bindings whose property names are in a camelCase-style
  format will be converted to a dasherized format:

      MyView = Ember.View.extend({
        classNameBindings: ['isUrgent'],
        isUrgent: true
      })

  Will result in view instances with an HTML representation of:

      <div id="ember1" class="ember-view is-urgent"></div>


  Class name bindings can also refer to object values that are found by
  traversing a path relative to the view itself:

      MyView = Ember.View.extend({
        classNameBindings: ['messages.empty']
        messages: Ember.Object.create({
          empty: true
        })
      })

  Will result in view instances with an HTML representation of:

      <div id="ember1" class="ember-view empty"></div>

  Updates to the the value of a class name binding will result in automatic update
  of the  HTML `class` attribute in the view's rendered HTML representation.
  If the value becomes  `false` or `undefined` the class name will be removed.

  Both `classNames` and `classNameBindings` are concatenated properties.
  See `Ember.Object` documentation for more information about concatenated properties.

  ## HTML Attributes
  The HTML attribute section of a view's tag can be set by providing an `attributeBindings`
  property set to an array of property names on the view. The return value of these properties
  will be used as the value of the view's HTML associated attribute:

      AnchorView = Ember.View.extend({
        tagName: 'a',
        attributeBindings: ['href'],
        href: 'http://google.com'
      })

  Will result in view instances with an HTML representation of:

      <a id="ember1" class="ember-view" href="http://google.com"></a>

  If the return value of an `attributeBindings` monitored property is a boolean
  the property will follow HTML's pattern of repeating the attribute's name as
  its value:

      MyTextInput = Ember.View.extend({
        tagName: 'input',
        attributeBindings: ['disabled'],
        disabled: true
      })

  Will result in view instances with an HTML representation of:

      <input id="ember1" class="ember-view" disabled="disabled" />

  `attributeBindings` can refer to computed properties:

      MyTextInput = Ember.View.extend({
        tagName: 'input',
        attributeBindings: ['disabled'],
        disabled: function(){
          if (someLogic) {
            return true;
          } else {
            return false;
          }
        }.property()
      })

  Updates to the the property of an attribute binding will result in automatic update
  of the  HTML attribute in the view's rendered HTML representation.

  `attributeBindings` is a concatenated property. See `Ember.Object` documentation
  for more information about concatenated properties.

  ## Templates
  The HTML contents of a view's rendered representation are determined by its template.
  Templates can be any function that accepts an optional context parameter and returns
  a string of HTML that will be inserted within the view's tag. Most
  typically in Ember this function will be a compiled Ember.Handlebars template.

      AView = Ember.View.extend({
        template: Ember.Handlebars.compile('I am the template')
      })

  Will result in view instances with an HTML representation of:

      <div id="ember1" class="ember-view">I am the template</div>

  The default context of the compiled template will be the view instance itself:

      AView = Ember.View.extend({
        template: Ember.Handlebars.compile('Hello {{excitedGreeting}}')
      })

      aView = AView.create({
        content: Ember.Object.create({
          firstName: 'Barry'
        })
        excitedGreeting: function(){
          return this.getPath("content.firstName") + "!!!"
        }
      })

  Will result in an HTML representation of:

      <div id="ember1" class="ember-view">Hello Barry!!!</div>

  Within an Ember application is more common to define a Handlebars templates as
  part of a page:

      <script type='text/x-handlebars' data-template-name='some-template'>
        Hello
      </script>

  And associate it by name using a view's `templateName` property:

      AView = Ember.View.extend({
        templateName: 'some-template'
      })

  Using a value for `templateName` that does not have a Handlebars template with a
  matching `data-template-name` attribute will throw an error.

  Assigning a value to both `template` and `templateName` properties will throw an error.

  For views classes that may have a template later defined (e.g. as the block portion of a `{{view}}`
  Handlebars helper call in another template or in a subclass), you can provide a `defaultTemplate`
  property set to compiled template function. If a template is not later provided for the view
  instance the `defaultTemplate` value will be used:

      AView = Ember.View.extend({
        defaultTemplate: Ember.Handlebars.compile('I was the default'),
        template: null,
        templateName: null
      })

  Will result in instances with an HTML representation of:

      <div id="ember1" class="ember-view">I was the default</div>

  If a `template` or `templateName` is provided it will take precedence over `defaultTemplate`:

      AView = Ember.View.extend({
        defaultTemplate: Ember.Handlebars.compile('I was the default')
      })

      aView = AView.create({
        template: Ember.Handlebars.compile('I was the template, not default')
      })

  Will result in the following HTML representation when rendered:

      <div id="ember1" class="ember-view">I was the template, not default</div>

  ## Layouts
  Views can have a secondary template that wraps their main template. Like
  primary templates, layouts can be any function that  accepts an optional context
  parameter and returns a string of HTML that will be inserted inside view's tag. Views whose HTML
  element is self closing (e.g. `<input />`) cannot have a layout and this property will be ignored.

  Most typically in Ember a layout will be a compiled Ember.Handlebars template.

  A view's layout can be set directly with the `layout` property or reference an
  existing Handlebars template by name with the `layoutName` property.

  A template used as a layout must contain a single use of the Handlebars `{{yield}}`
  helper. The HTML contents of a view's rendered `template` will be inserted at this location:

      AViewWithLayout = Ember.View.extend({
        layout: Ember.Handlebars.compile("<div class='my-decorative-class'>{{yield}}</div>")
        template: Ember.Handlebars.compile("I got wrapped"),
      })

  Will result in view instances with an HTML representation of:

      <div id="ember1" class="ember-view">
        <div class="my-decorative-class">
          I got wrapped
        </div>
      </div>

  See `Handlebars.helpers.yield` for more information.

  ## Responding to Browser Events
  Views can respond to user-initiated events in one of three ways: method implementation,
  through an event manager, and through `{{action}}` helper use in their template or layout.

  ### Method Implementation
  Views can respond to user-initiated events by implementing a method that matches the
  event name. A `jQuery.Event` object will be passed as the argument to this method.

      AView = Ember.View.extend({
        click: function(event){
          // will be called when when an instance's
          // rendered element is clicked
        }
      })

  ### Event Managers
  Views can define an object as their `eventManager` property. This object can then
  implement methods that match the desired event names. Matching events that occur
  on the view's rendered HTML or the rendered HTML of any of its DOM descendants
  will trigger this method.  A `jQuery.Event` object will be passed as the first
  argument to the method and an  `Ember.View` object as the second. The `Ember.View`
  will be the view whose rendered HTML was interacted with. This may be the view with
  the `eventManager` property or one of its descendent views.

      AView = Ember.View.extend({
        eventManager: Ember.Object.create({
          doubleClick: function(event, view){
            // will be called when when an instance's
            // rendered element or any rendering
            // of this views's descendent
            // elements is clicked
          }
        })
      })


  An event defined for an event manager takes precedence over events of the same
  name handled through methods on the view.


      AView = Ember.View.extend({
        mouseEnter: function(event){
          // will never trigger.
        },
        eventManager: Ember.Object.create({
          mouseEnter: function(event, view){
            // takes presedence over AView#mouseEnter
          }
        })
      })

  Similarly a view's event manager will take precedence for events of any views
  rendered as a descendent. A method name that matches an event name will not be called
  if the view instance was rendered inside the HTML representation of a view that has
  an `eventManager` property defined that handles events of the name.  Events not handled
  by the event manager will still trigger method calls on the descendent.

      OuterView = Ember.View.extend({
        template: Ember.Handlebars.compile("outer {{#view InnerView}}inner{{/view}} outer"),
        eventManager: Ember.Object.create({
          mouseEnter: function(event, view){
            // view might be instance of either
            // OutsideView or InnerView depending on
            // where on the page the user interaction occured
          }
        })
      })

      InnerView = Ember.View.extend({
        click: function(event){
          // will be called if rendered inside
          // an OuterView because OuterView's
          // eventManager doesn't handle click events
        },
        mouseEnter: function(event){
          // will never be called if rendered inside
          // an OuterView.
        }
      })

  ### Handlebars `{{action}}` Helper
  See `Handlebars.helpers.action`.

  ### Event Names
  Possible events names for any of the responding approaches described above are:

  Touch events: 'touchStart', 'touchMove', 'touchEnd', 'touchCancel'

  Keyboard events: 'keyDown', 'keyUp', 'keyPress'

  Mouse events: 'mouseDown', 'mouseUp', 'contextMenu', 'click', 'doubleClick', 'mouseMove',
  'focusIn', 'focusOut', 'mouseEnter', 'mouseLeave'

  Form events: 'submit', 'change', 'focusIn', 'focusOut', 'input'

  HTML5 drag and drop events: 'dragStart', 'drag', 'dragEnter', 'dragLeave', 'drop', 'dragEnd'

  ## Handlebars `{{view}}` Helper
  Other `Ember.View` instances can be included as part of a view's template by using the `{{view}}`
  Handlebars helper. See `Handlebars.helpers.view` for additional information.

  @extends Ember.Object
*/
Ember.View = Ember.Object.extend(Ember.Evented,
/** @scope Ember.View.prototype */ {

  /** @private */
  concatenatedProperties: ['classNames', 'classNameBindings', 'attributeBindings'],

  /**
    @type Boolean
    @default true
    @constant
  */
  isView: true,

  // ..........................................................
  // TEMPLATE SUPPORT
  //

  /**
    The name of the template to lookup if no template is provided.

    Ember.View will look for a template with this name in this view's
    `templates` object. By default, this will be a global object
    shared in `Ember.TEMPLATES`.

    @type String
    @default null
  */
  templateName: null,

  /**
    The name of the layout to lookup if no layout is provided.

    Ember.View will look for a template with this name in this view's
    `templates` object. By default, this will be a global object
    shared in `Ember.TEMPLATES`.

    @type String
    @default null
  */
  layoutName: null,

  /**
    The hash in which to look for `templateName`.

    @type Ember.Object
    @default Ember.TEMPLATES
  */
  templates: Ember.TEMPLATES,

  /**
    The template used to render the view. This should be a function that
    accepts an optional context parameter and returns a string of HTML that
    will be inserted into the DOM relative to its parent view.

    In general, you should set the `templateName` property instead of setting
    the template yourself.

    @field
    @type Function
  */
  template: Ember.computed(function(key, value) {
    if (value !== undefined) { return value; }

    var templateName = get(this, 'templateName'),
        template = this.templateForName(templateName, 'template');

    return template || get(this, 'defaultTemplate');
  }).property('templateName').cacheable(),

  /**
    The controller managing this view. If this property is set, it will be
    made available for use by the template.

    @type Object
  */
  controller: Ember.computed(function(key, value) {
    var parentView;

    if (arguments.length === 2) {
      return value;
    } else {
      parentView = get(this, 'parentView');
      return parentView ? get(parentView, 'controller') : null;
    }
  }).property().cacheable(),

  /**
    A view may contain a layout. A layout is a regular template but
    supersedes the `template` property during rendering. It is the
    responsibility of the layout template to retrieve the `template`
    property from the view (or alternatively, call `Handlebars.helpers.yield`,
    `{{yield}}`) to render it in the correct location.

    This is useful for a view that has a shared wrapper, but which delegates
    the rendering of the contents of the wrapper to the `template` property
    on a subclass.

    @field
    @type Function
  */
  layout: Ember.computed(function(key, value) {
    if (arguments.length === 2) { return value; }

    var layoutName = get(this, 'layoutName'),
        layout = this.templateForName(layoutName, 'layout');

    return layout || get(this, 'defaultLayout');
  }).property('layoutName').cacheable(),

  templateForName: function(name, type) {
    if (!name) { return; }

    var templates = get(this, 'templates'),
        template = get(templates, name);

    if (!template) {
     throw new Ember.Error(fmt('%@ - Unable to find %@ "%@".', [this, type, name]));
    }

    return template;
  },

  /**
    The object from which templates should access properties.

    This object will be passed to the template function each time the render
    method is called, but it is up to the individual function to decide what
    to do with it.

    By default, this will be the view itself.

    @type Object
  */
  context: Ember.computed(function(key, value) {
    if (arguments.length === 2) {
      set(this, '_context', value);
      return value;
    } else {
      return get(this, '_context');
    }
  }).cacheable(),

  /**
    @private

    Private copy of the view's template context. This can be set directly
    by Handlebars without triggering the observer that causes the view
    to be re-rendered.
  */
  _context: Ember.computed(function(key, value) {
    var parentView, controller;

    if (arguments.length === 2) {
      return value;
    }

    if (VIEW_PRESERVES_CONTEXT) {
      if (controller = get(this, 'controller')) {
        return controller;
      }

      parentView = get(this, '_parentView');
      if (parentView) {
        return get(parentView, '_context');
      }
    }

    return this;
  }).cacheable(),

  /**
    If a value that affects template rendering changes, the view should be
    re-rendered to reflect the new value.

    @private
  */
  _displayPropertyDidChange: Ember.observer(function() {
    this.rerender();
  }, 'context', 'controller'),

  /**
    If the view is currently inserted into the DOM of a parent view, this
    property will point to the parent of the view.

    @type Ember.View
    @default null
  */
  parentView: Ember.computed(function() {
    var parent = get(this, '_parentView');

    if (parent && parent.isVirtual) {
      return get(parent, 'parentView');
    } else {
      return parent;
    }
  }).property('_parentView').volatile(),

  _parentView: null,

  // return the current view, not including virtual views
  concreteView: Ember.computed(function() {
    if (!this.isVirtual) { return this; }
    else { return get(this, 'parentView'); }
  }).property('_parentView').volatile(),

  /**
    If false, the view will appear hidden in DOM.

    @type Boolean
    @default null
  */
  isVisible: true,

  /**
    Array of child views. You should never edit this array directly.
    Instead, use appendChild and removeFromParent.

    @private
    @type Array
    @default []
  */
  childViews: childViewsProperty,

  _childViews: [],

  /**
    When it's a virtual view, we need to notify the parent that their
    childViews will change.
  */
  _childViewsWillChange: Ember.beforeObserver(function() {
    if (this.isVirtual) {
      var parentView = get(this, 'parentView');
      if (parentView) { Ember.propertyWillChange(parentView, 'childViews'); }
    }
  }, 'childViews'),

  /**
    When it's a virtual view, we need to notify the parent that their
    childViews did change.
  */
  _childViewsDidChange: Ember.observer(function() {
    if (this.isVirtual) {
      var parentView = get(this, 'parentView');
      if (parentView) { Ember.propertyDidChange(parentView, 'childViews'); }
    }
  }, 'childViews'),

  /**
    Return the nearest ancestor that is an instance of the provided
    class.

    @param {Class} klass Subclass of Ember.View (or Ember.View itself)
    @returns Ember.View
  */
  nearestInstanceOf: function(klass) {
    var view = get(this, 'parentView');

    while (view) {
      if(view instanceof klass) { return view; }
      view = get(view, 'parentView');
    }
  },

  /**
    Return the nearest ancestor that has a given property.

    @param {String} property A property name
    @returns Ember.View
  */
  nearestWithProperty: function(property) {
    var view = get(this, 'parentView');

    while (view) {
      if (property in view) { return view; }
      view = get(view, 'parentView');
    }
  },

  /**
    Return the nearest ancestor whose parent is an instance of
    `klass`.

    @param {Class} klass Subclass of Ember.View (or Ember.View itself)
    @returns Ember.View
  */
  nearestChildOf: function(klass) {
    var view = get(this, 'parentView');

    while (view) {
      if(get(view, 'parentView') instanceof klass) { return view; }
      view = get(view, 'parentView');
    }
  },

  /**
    Return the nearest ancestor that is an Ember.CollectionView

    @returns Ember.CollectionView
  */
  collectionView: Ember.computed(function() {
    return this.nearestInstanceOf(Ember.CollectionView);
  }).cacheable(),

  /**
    Return the nearest ancestor that is a direct child of
    an Ember.CollectionView

    @returns Ember.View
  */
  itemView: Ember.computed(function() {
    return this.nearestChildOf(Ember.CollectionView);
  }).cacheable(),

  /**
    Return the nearest ancestor that has the property
    `content`.

    @returns Ember.View
  */
  contentView: Ember.computed(function() {
    return this.nearestWithProperty('content');
  }).cacheable(),

  /**
    @private

    When the parent view changes, recursively invalidate
    collectionView, itemView, and contentView
  */
  _parentViewDidChange: Ember.observer(function() {
    if (this.isDestroying) { return; }

    this.invokeRecursively(function(view) {
      view.propertyDidChange('collectionView');
      view.propertyDidChange('itemView');
      view.propertyDidChange('contentView');
    });

    if (getPath(this, 'parentView.controller') && !get(this, 'controller')) {
      this.notifyPropertyChange('controller');
    }
  }, '_parentView'),

  _controllerDidChange: Ember.observer(function() {
    if (this.isDestroying) { return; }

    this.forEachChildView(function(view) {
      view.propertyDidChange('controller');
    });
  }, 'controller'),

  cloneKeywords: function() {
    var templateData = get(this, 'templateData');

    var keywords = templateData ? Ember.copy(templateData.keywords) : {};
    keywords.view = get(this, 'concreteView');
    keywords.controller = get(this, 'controller');

    return keywords;
  },

  /**
    Called on your view when it should push strings of HTML into a
    Ember.RenderBuffer. Most users will want to override the `template`
    or `templateName` properties instead of this method.

    By default, Ember.View will look for a function in the `template`
    property and invoke it with the value of `context`. The value of
    `context` will be the view's controller unless you override it.

    @param {Ember.RenderBuffer} buffer The render buffer
  */
  render: function(buffer) {
    // If this view has a layout, it is the responsibility of the
    // the layout to render the view's template. Otherwise, render the template
    // directly.
    var template = get(this, 'layout') || get(this, 'template');

    if (template) {
      var context = get(this, '_context');
      var keywords = this.cloneKeywords();

      var data = {
        view: this,
        buffer: buffer,
        isRenderData: true,
        keywords: keywords
      };

      // Invoke the template with the provided template context, which
      // is the view by default. A hash of data is also passed that provides
      // the template with access to the view and render buffer.

      Ember.assert('template must be a function. Did you mean to call Ember.Handlebars.compile("...") or specify templateName instead?', typeof template === 'function');
      // The template should write directly to the render buffer instead
      // of returning a string.
      var output = template(context, { data: data });

      // If the template returned a string instead of writing to the buffer,
      // push the string onto the buffer.
      if (output !== undefined) { buffer.push(output); }
    }
  },

  invokeForState: function(name) {
    var stateName = this.state, args, fn;

    // try to find the function for the state in the cache
    if (fn = invokeForState[stateName][name]) {
      args = a_slice.call(arguments);
      args[0] = this;

      return fn.apply(this, args);
    }

    // otherwise, find and cache the function for this state
    var parent = this, states = parent.states, state;

    while (states) {
      state = states[stateName];

      while (state) {
        fn = state[name];

        if (fn) {
          invokeForState[stateName][name] = fn;

          args = a_slice.call(arguments, 1);
          args.unshift(this);

          return fn.apply(this, args);
        }

        state = state.parentState;
      }

      states = states.parent;
    }
  },

  /**
    Renders the view again. This will work regardless of whether the
    view is already in the DOM or not. If the view is in the DOM, the
    rendering process will be deferred to give bindings a chance
    to synchronize.

    If children were added during the rendering process using `appendChild`,
    `rerender` will remove them, because they will be added again
    if needed by the next `render`.

    In general, if the display of your view changes, you should modify
    the DOM element directly instead of manually calling `rerender`, which can
    be slow.
  */
  rerender: function() {
    return this.invokeForState('rerender');
  },

  clearRenderedChildren: function() {
    var lengthBefore = this.lengthBeforeRender,
        lengthAfter  = this.lengthAfterRender;

    // If there were child views created during the last call to render(),
    // remove them under the assumption that they will be re-created when
    // we re-render.

    // VIEW-TODO: Unit test this path.
    var childViews = get(this, '_childViews');
    for (var i=lengthAfter-1; i>=lengthBefore; i--) {
      if (childViews[i]) { childViews[i].destroy(); }
    }
  },

  /**
    @private

    Iterates over the view's `classNameBindings` array, inserts the value
    of the specified property into the `classNames` array, then creates an
    observer to update the view's element if the bound property ever changes
    in the future.
  */
  _applyClassNameBindings: function() {
    var classBindings = get(this, 'classNameBindings'),
        classNames = get(this, 'classNames'),
        elem, newClass, dasherizedClass;

    if (!classBindings) { return; }

    // Loop through all of the configured bindings. These will be either
    // property names ('isUrgent') or property paths relative to the view
    // ('content.isUrgent')
    a_forEach(classBindings, function(binding) {

      // Variable in which the old class value is saved. The observer function
      // closes over this variable, so it knows which string to remove when
      // the property changes.
      var oldClass, property;

      // Set up an observer on the context. If the property changes, toggle the
      // class name.
      var observer = function() {
        // Get the current value of the property
        newClass = this._classStringForProperty(binding);
        elem = this.$();

        // If we had previously added a class to the element, remove it.
        if (oldClass) {
          elem.removeClass(oldClass);
          // Also remove from classNames so that if the view gets rerendered,
          // the class doesn't get added back to the DOM.
          classNames.removeObject(oldClass);
        }

        // If necessary, add a new class. Make sure we keep track of it so
        // it can be removed in the future.
        if (newClass) {
          elem.addClass(newClass);
          oldClass = newClass;
        } else {
          oldClass = null;
        }
      };

      // Get the class name for the property at its current value
      dasherizedClass = this._classStringForProperty(binding);

      if (dasherizedClass) {
        // Ensure that it gets into the classNames array
        // so it is displayed when we render.
        classNames.push(dasherizedClass);

        // Save a reference to the class name so we can remove it
        // if the observer fires. Remember that this variable has
        // been closed over by the observer.
        oldClass = dasherizedClass;
      }

      // Extract just the property name from bindings like 'foo:bar'
      property = binding.split(':')[0];
      addObserver(this, property, observer);
    }, this);
  },

  /**
    Iterates through the view's attribute bindings, sets up observers for each,
    then applies the current value of the attributes to the passed render buffer.

    @param {Ember.RenderBuffer} buffer
  */
  _applyAttributeBindings: function(buffer) {
    var attributeBindings = get(this, 'attributeBindings'),
        attributeValue, elem, type;

    if (!attributeBindings) { return; }

    a_forEach(attributeBindings, function(binding) {
      var split = binding.split(':'),
          property = split[0],
          attributeName = split[1] || property;

      // Create an observer to add/remove/change the attribute if the
      // JavaScript property changes.
      var observer = function() {
        elem = this.$();
        attributeValue = get(this, property);

        Ember.View.applyAttributeBindings(elem, attributeName, attributeValue);
      };

      addObserver(this, property, observer);

      // Determine the current value and add it to the render buffer
      // if necessary.
      attributeValue = get(this, property);
      Ember.View.applyAttributeBindings(buffer, attributeName, attributeValue);
    }, this);
  },

  /**
    @private

    Given a property name, returns a dasherized version of that
    property name if the property evaluates to a non-falsy value.

    For example, if the view has property `isUrgent` that evaluates to true,
    passing `isUrgent` to this method will return `"is-urgent"`.
  */
  _classStringForProperty: function(property) {
    var split = property.split(':'),
        className = split[1];

    property = split[0];

    // TODO: Remove this `false` when the `getPath` globals support is removed
    var val = Ember.getPath(this, property, false);
    if (val === undefined && Ember.isGlobalPath(property)) {
      val = Ember.getPath(window, property);
    }

    // If the value is truthy and we're using the colon syntax,
    // we should return the className directly
    if (!!val && className) {
      return className;

    // If value is a Boolean and true, return the dasherized property
    // name.
    } else if (val === true) {
      // Normalize property path to be suitable for use
      // as a class name. For exaple, content.foo.barBaz
      // becomes bar-baz.
      var parts = property.split('.');
      return Ember.String.dasherize(parts[parts.length-1]);

    // If the value is not false, undefined, or null, return the current
    // value of the property.
    } else if (val !== false && val !== undefined && val !== null) {
      return val;

    // Nothing to display. Return null so that the old class is removed
    // but no new class is added.
    } else {
      return null;
    }
  },

  // ..........................................................
  // ELEMENT SUPPORT
  //

  /**
    Returns the current DOM element for the view.

    @field
    @type DOMElement
  */
  element: Ember.computed(function(key, value) {
    if (value !== undefined) {
      return this.invokeForState('setElement', value);
    } else {
      return this.invokeForState('getElement');
    }
  }).property('_parentView').cacheable(),

  /**
    Returns a jQuery object for this view's element. If you pass in a selector
    string, this method will return a jQuery object, using the current element
    as its buffer.

    For example, calling `view.$('li')` will return a jQuery object containing
    all of the `li` elements inside the DOM element of this view.

    @param {String} [selector] a jQuery-compatible selector string
    @returns {Ember.CoreQuery} the CoreQuery object for the DOM node
  */
  $: function(sel) {
    return this.invokeForState('$', sel);
  },

  /** @private */
  mutateChildViews: function(callback) {
    var childViews = get(this, '_childViews'),
        idx = get(childViews, 'length'),
        view;

    while(--idx >= 0) {
      view = childViews[idx];
      callback.call(this, view, idx);
    }

    return this;
  },

  /** @private */
  forEachChildView: function(callback) {
    var childViews = get(this, '_childViews');

    if (!childViews) { return this; }

    var len = get(childViews, 'length'),
        view, idx;

    for(idx = 0; idx < len; idx++) {
      view = childViews[idx];
      callback.call(this, view);
    }

    return this;
  },

  /**
    Appends the view's element to the specified parent element.

    If the view does not have an HTML representation yet, `createElement()`
    will be called automatically.

    Note that this method just schedules the view to be appended; the DOM
    element will not be appended to the given element until all bindings have
    finished synchronizing.

    This is not typically a function that you will need to call directly
    when building your application. You might consider using Ember.ContainerView
    instead. If you do need to use appendTo, be sure that the target element you
    are providing is associated with an Ember.Application and does not have an
    ancestor element that is associated with an Ember view.

    @param {String|DOMElement|jQuery} A selector, element, HTML string, or jQuery object
    @returns {Ember.View} receiver
  */
  appendTo: function(target) {
    Ember.assert("You cannot append to an existing Ember.View. Consider using Ember.ContainerView instead.", !Ember.$(target).is('.ember-view') && !Ember.$(target).parents().is('.ember-view'));

    // Schedule the DOM element to be created and appended to the given
    // element after bindings have synchronized.
    this._insertElementLater(function() {
      this.$().appendTo(target);
    });

    return this;
  },

  /**
    Replaces the content of the specified parent element with this view's element.
    If the view does not have an HTML representation yet, `createElement()`
    will be called automatically.

    Note that this method just schedules the view to be appended; the DOM
    element will not be appended to the given element until all bindings have
    finished synchronizing

    @param {String|DOMElement|jQuery} A selector, element, HTML string, or jQuery object
    @returns {Ember.View} received
  */
  replaceIn: function(target) {
    Ember.assert("You cannot replace an existing Ember.View. Consider using Ember.ContainerView instead.", !Ember.$(target).is('.ember-view') && !Ember.$(target).parents().is('.ember-view'));

    this._insertElementLater(function() {
      Ember.$(target).empty();
      this.$().appendTo(target);
    });

    return this;
  },

  /**
    @private

    Schedules a DOM operation to occur during the next render phase. This
    ensures that all bindings have finished synchronizing before the view is
    rendered.

    To use, pass a function that performs a DOM operation..

    Before your function is called, this view and all child views will receive
    the `willInsertElement` event. After your function is invoked, this view
    and all of its child views will receive the `didInsertElement` event.

        view._insertElementLater(function() {
          this.createElement();
          this.$().appendTo('body');
        });

    @param {Function} fn the function that inserts the element into the DOM
  */
  _insertElementLater: function(fn) {
    this._lastInsert = Ember.guidFor(fn);
    Ember.run.schedule('render', this, this.invokeForState, 'insertElement', fn);
  },

  /**
    Appends the view's element to the document body. If the view does
    not have an HTML representation yet, `createElement()` will be called
    automatically.

    Note that this method just schedules the view to be appended; the DOM
    element will not be appended to the document body until all bindings have
    finished synchronizing.

    @returns {Ember.View} receiver
  */
  append: function() {
    return this.appendTo(document.body);
  },

  /**
    Removes the view's element from the element to which it is attached.

    @returns {Ember.View} receiver
  */
  remove: function() {
    // What we should really do here is wait until the end of the run loop
    // to determine if the element has been re-appended to a different
    // element.
    // In the interim, we will just re-render if that happens. It is more
    // important than elements get garbage collected.
    this.destroyElement();
    this.invokeRecursively(function(view) {
      view.clearRenderedChildren();
    });
  },

  /**
    The ID to use when trying to locate the element in the DOM. If you do not
    set the elementId explicitly, then the view's GUID will be used instead.
    This ID must be set at the time the view is created.

    @type String
    @readOnly
  */
  elementId: Ember.computed(function(key, value) {
    return value !== undefined ? value : Ember.guidFor(this);
  }).cacheable(),

  /**
    @private

    TODO: Perhaps this should be removed from the production build somehow.
  */
  _elementIdDidChange: Ember.beforeObserver(function() {
    throw "Changing a view's elementId after creation is not allowed.";
  }, 'elementId'),

  /**
    Attempts to discover the element in the parent element. The default
    implementation looks for an element with an ID of elementId (or the view's
    guid if elementId is null). You can override this method to provide your
    own form of lookup. For example, if you want to discover your element
    using a CSS class name instead of an ID.

    @param {DOMElement} parentElement The parent's DOM element
    @returns {DOMElement} The discovered element
  */
  findElementInParentElement: function(parentElem) {
    var id = "#" + get(this, 'elementId');
    return Ember.$(id)[0] || Ember.$(id, parentElem)[0];
  },

  /**
    Creates a new renderBuffer with the passed tagName. You can override this
    method to provide further customization to the buffer if needed. Normally
    you will not need to call or override this method.

    @returns {Ember.RenderBuffer}
  */
  renderBuffer: function(tagName) {
    tagName = tagName || get(this, 'tagName');

    // Explicitly check for null or undefined, as tagName
    // may be an empty string, which would evaluate to false.
    if (tagName === null || tagName === undefined) {
      tagName = 'div';
    }

    return Ember.RenderBuffer(tagName);
  },

  /**
    Creates a DOM representation of the view and all of its
    child views by recursively calling the `render()` method.

    After the element has been created, `didInsertElement` will
    be called on this view and all of its child views.

    @returns {Ember.View} receiver
  */
  createElement: function() {
    if (get(this, 'element')) { return this; }

    var buffer = this.renderToBuffer();
    set(this, 'element', buffer.element());

    return this;
  },

  /**
    Called when a view is going to insert an element into the DOM.
  */
  willInsertElement: Ember.K,

  /**
    Called when the element of the view has been inserted into the DOM.
    Override this function to do any set up that requires an element in the
    document body.
  */
  didInsertElement: Ember.K,

  /**
    Called when the view is about to rerender, but before anything has
    been torn down. This is a good opportunity to tear down any manual
    observers you have installed based on the DOM state
  */
  willRerender: Ember.K,

  /**
    Run this callback on the current view and recursively on child views.

    @private
  */
  invokeRecursively: function(fn) {
    fn.call(this, this);

    this.forEachChildView(function(view) {
      view.invokeRecursively(fn);
    });
  },

  /**
    Invalidates the cache for a property on all child views.
  */
  invalidateRecursively: function(key) {
    this.forEachChildView(function(view) {
      view.propertyDidChange(key);
    });
  },

  /**
    @private

    Invokes the receiver's willInsertElement() method if it exists and then
    invokes the same on all child views.

    NOTE: In some cases this was called when the element existed. This no longer
    works so we let people know. We can remove this warning code later.
  */
  _notifyWillInsertElement: function() {
    this.invokeRecursively(function(view) {
      view.trigger('willInsertElement');
    });
  },

  /**
    @private

    Invokes the receiver's didInsertElement() method if it exists and then
    invokes the same on all child views.
  */
  _notifyDidInsertElement: function() {
    this.invokeRecursively(function(view) {
      view.trigger('didInsertElement');
    });
  },

  /**
    @private

    Invokes the receiver's willRerender() method if it exists and then
    invokes the same on all child views.
  */
  _notifyWillRerender: function() {
    this.invokeRecursively(function(view) {
      view.trigger('willRerender');
    });
  },

  /**
    Destroys any existing element along with the element for any child views
    as well. If the view does not currently have a element, then this method
    will do nothing.

    If you implement willDestroyElement() on your view, then this method will
    be invoked on your view before your element is destroyed to give you a
    chance to clean up any event handlers, etc.

    If you write a willDestroyElement() handler, you can assume that your
    didInsertElement() handler was called earlier for the same element.

    Normally you will not call or override this method yourself, but you may
    want to implement the above callbacks when it is run.

    @returns {Ember.View} receiver
  */
  destroyElement: function() {
    return this.invokeForState('destroyElement');
  },

  /**
    Called when the element of the view is going to be destroyed. Override
    this function to do any teardown that requires an element, like removing
    event listeners.
  */
  willDestroyElement: function() {},

  /**
    @private

    Invokes the `willDestroyElement` callback on the view and child views.
  */
  _notifyWillDestroyElement: function() {
    this.invokeRecursively(function(view) {
      view.trigger('willDestroyElement');
    });
  },

  /** @private (nodoc) */
  _elementWillChange: Ember.beforeObserver(function() {
    this.forEachChildView(function(view) {
      Ember.propertyWillChange(view, 'element');
    });
  }, 'element'),

  /**
    @private

    If this view's element changes, we need to invalidate the caches of our
    child views so that we do not retain references to DOM elements that are
    no longer needed.

    @observes element
  */
  _elementDidChange: Ember.observer(function() {
    this.forEachChildView(function(view) {
      Ember.propertyDidChange(view, 'element');
    });
  }, 'element'),

  /**
    Called when the parentView property has changed.

    @function
  */
  parentViewDidChange: Ember.K,

  /**
    @private

    Invoked by the view system when this view needs to produce an HTML
    representation. This method will create a new render buffer, if needed,
    then apply any default attributes, such as class names and visibility.
    Finally, the `render()` method is invoked, which is responsible for
    doing the bulk of the rendering.

    You should not need to override this method; instead, implement the
    `template` property, or if you need more control, override the `render`
    method.

    @param {Ember.RenderBuffer} buffer the render buffer. If no buffer is
      passed, a default buffer, using the current view's `tagName`, will
      be used.
  */
  renderToBuffer: function(parentBuffer, bufferOperation) {
    var buffer;

    Ember.run.sync();

    // Determine where in the parent buffer to start the new buffer.
    // By default, a new buffer will be appended to the parent buffer.
    // The buffer operation may be changed if the child views array is
    // mutated by Ember.ContainerView.
    bufferOperation = bufferOperation || 'begin';

    // If this is the top-most view, start a new buffer. Otherwise,
    // create a new buffer relative to the original using the
    // provided buffer operation (for example, `insertAfter` will
    // insert a new buffer after the "parent buffer").
    if (parentBuffer) {
      var tagName = get(this, 'tagName');
      if (tagName === null || tagName === undefined) {
        tagName = 'div';
      }

      buffer = parentBuffer[bufferOperation](tagName);
    } else {
      buffer = this.renderBuffer();
    }

    this.buffer = buffer;
    this.transitionTo('inBuffer', false);

    this.lengthBeforeRender = get(get(this, '_childViews'), 'length');

    this.beforeRender(buffer);
    this.render(buffer);
    this.afterRender(buffer);

    this.lengthAfterRender = get(get(this, '_childViews'), 'length');

    return buffer;
  },

  beforeRender: function(buffer) {
    this.applyAttributesToBuffer(buffer);
  },

  afterRender: Ember.K,

  /**
    @private
  */
  applyAttributesToBuffer: function(buffer) {
    // Creates observers for all registered class name and attribute bindings,
    // then adds them to the element.
    this._applyClassNameBindings();

    // Pass the render buffer so the method can apply attributes directly.
    // This isn't needed for class name bindings because they use the
    // existing classNames infrastructure.
    this._applyAttributeBindings(buffer);


    a_forEach(get(this, 'classNames'), function(name){ buffer.addClass(name); });
    buffer.id(get(this, 'elementId'));

    var role = get(this, 'ariaRole');
    if (role) {
      buffer.attr('role', role);
    }

    if (get(this, 'isVisible') === false) {
      buffer.style('display', 'none');
    }
  },

  // ..........................................................
  // STANDARD RENDER PROPERTIES
  //

  /**
    Tag name for the view's outer element. The tag name is only used when
    an element is first created. If you change the tagName for an element, you
    must destroy and recreate the view element.

    By default, the render buffer will use a `<div>` tag for views.

    @type String
    @default null
  */

  // We leave this null by default so we can tell the difference between
  // the default case and a user-specified tag.
  tagName: null,

  /**
    The WAI-ARIA role of the control represented by this view. For example, a
    button may have a role of type 'button', or a pane may have a role of
    type 'alertdialog'. This property is used by assistive software to help
    visually challenged users navigate rich web applications.

    The full list of valid WAI-ARIA roles is available at:
    http://www.w3.org/TR/wai-aria/roles#roles_categorization

    @type String
    @default null
  */
  ariaRole: null,

  /**
    Standard CSS class names to apply to the view's outer element. This
    property automatically inherits any class names defined by the view's
    superclasses as well.

    @type Array
    @default ['ember-view']
  */
  classNames: ['ember-view'],

  /**
    A list of properties of the view to apply as class names. If the property
    is a string value, the value of that string will be applied as a class
    name.

        // Applies the 'high' class to the view element
        Ember.View.create({
          classNameBindings: ['priority']
          priority: 'high'
        });

    If the value of the property is a Boolean, the name of that property is
    added as a dasherized class name.

        // Applies the 'is-urgent' class to the view element
        Ember.View.create({
          classNameBindings: ['isUrgent']
          isUrgent: true
        });

    If you would prefer to use a custom value instead of the dasherized
    property name, you can pass a binding like this:

        // Applies the 'urgent' class to the view element
        Ember.View.create({
          classNameBindings: ['isUrgent:urgent']
          isUrgent: true
        });

    This list of properties is inherited from the view's superclasses as well.

    @type Array
    @default []
  */
  classNameBindings: [],

  /**
    A list of properties of the view to apply as attributes. If the property is
    a string value, the value of that string will be applied as the attribute.

        // Applies the type attribute to the element
        // with the value "button", like <div type="button">
        Ember.View.create({
          attributeBindings: ['type'],
          type: 'button'
        });

    If the value of the property is a Boolean, the name of that property is
    added as an attribute.

        // Renders something like <div enabled="enabled">
        Ember.View.create({
          attributeBindings: ['enabled'],
          enabled: true
        });
  */
  attributeBindings: [],

  state: 'preRender',

  // .......................................................
  // CORE DISPLAY METHODS
  //

  /**
    @private

    Setup a view, but do not finish waking it up.
    - configure childViews
    - register the view with the global views hash, which is used for event
      dispatch
  */
  init: function() {
    this._super();

    // Register the view for event handling. This hash is used by
    // Ember.EventDispatcher to dispatch incoming events.
    Ember.View.views[get(this, 'elementId')] = this;

    var childViews = get(this, '_childViews').slice();

    // setup child views. be sure to clone the child views array first
    set(this, '_childViews', childViews);

    Ember.assert("Only arrays are allowed for 'classNameBindings'", Ember.typeOf(this.classNameBindings) === 'array');
    this.classNameBindings = Ember.A(this.classNameBindings.slice());

    Ember.assert("Only arrays are allowed for 'classNames'", Ember.typeOf(this.classNames) === 'array');
    this.classNames = Ember.A(this.classNames.slice());

    var viewController = get(this, 'viewController');
    if (viewController) {
      viewController = Ember.getPath(viewController);
      if (viewController) {
        set(viewController, 'view', this);
      }
    }
  },

  appendChild: function(view, options) {
    return this.invokeForState('appendChild', view, options);
  },

  /**
    Removes the child view from the parent view.

    @param {Ember.View} view
    @returns {Ember.View} receiver
  */
  removeChild: function(view) {
    // If we're destroying, the entire subtree will be
    // freed, and the DOM will be handled separately,
    // so no need to mess with childViews.
    if (this.isDestroying) { return; }

    // update parent node
    set(view, '_parentView', null);

    // remove view from childViews array.
    var childViews = get(this, '_childViews');
    Ember.EnumerableUtils.removeObject(childViews, view);

    this.propertyDidChange('childViews');

    return this;
  },

  /**
    Removes all children from the parentView.

    @returns {Ember.View} receiver
  */
  removeAllChildren: function() {
    return this.mutateChildViews(function(view) {
      this.removeChild(view);
    });
  },

  destroyAllChildren: function() {
    return this.mutateChildViews(function(view) {
      view.destroy();
    });
  },

  /**
    Removes the view from its parentView, if one is found. Otherwise
    does nothing.

    @returns {Ember.View} receiver
  */
  removeFromParent: function() {
    var parent = get(this, '_parentView');

    // Remove DOM element from parent
    this.remove();

    if (parent) { parent.removeChild(this); }
    return this;
  },

  /**
    You must call `destroy` on a view to destroy the view (and all of its
    child views). This will remove the view from any parent node, then make
    sure that the DOM element managed by the view can be released by the
    memory manager.
  */
  willDestroy: function() {
    // calling this._super() will nuke computed properties and observers,
    // so collect any information we need before calling super.
    var childViews = get(this, '_childViews'),
        parent     = get(this, '_parentView'),
        elementId  = get(this, 'elementId'),
        childLen;

    // destroy the element -- this will avoid each child view destroying
    // the element over and over again...
    if (!this.removedFromDOM) { this.destroyElement(); }

    // remove from non-virtual parent view if viewName was specified
    if (this.viewName) {
      var nonVirtualParentView = get(this, 'parentView');
      if (nonVirtualParentView) {
        set(nonVirtualParentView, this.viewName, null);
      }
    }

    // remove from parent if found. Don't call removeFromParent,
    // as removeFromParent will try to remove the element from
    // the DOM again.
    if (parent) { parent.removeChild(this); }

    this.state = 'destroyed';

    childLen = get(childViews, 'length');
    for (var i=childLen-1; i>=0; i--) {
      childViews[i].removedFromDOM = true;
      childViews[i].destroy();
    }

    // next remove view from global hash
    delete Ember.View.views[get(this, 'elementId')];
  },

  /**
    Instantiates a view to be added to the childViews array during view
    initialization. You generally will not call this method directly unless
    you are overriding createChildViews(). Note that this method will
    automatically configure the correct settings on the new view instance to
    act as a child of the parent.

    @param {Class} viewClass
    @param {Hash} [attrs] Attributes to add
    @returns {Ember.View} new instance
    @test in createChildViews
  */
  createChildView: function(view, attrs) {
    if (Ember.View.detect(view)) {
      attrs = attrs || {};
      attrs._parentView = this;
      attrs.templateData = attrs.templateData || get(this, 'templateData');

      view = view.create(attrs);

      // don't set the property on a virtual view, as they are invisible to
      // consumers of the view API
      if (view.viewName) { set(get(this, 'concreteView'), view.viewName, view); }
    } else {
      Ember.assert('You must pass instance or subclass of View', view instanceof Ember.View);
      Ember.assert("You can only pass attributes when a class is provided", !attrs);

      if (!get(view, 'templateData')) {
        set(view, 'templateData', get(this, 'templateData'));
      }

      set(view, '_parentView', this);
    }

    return view;
  },

  becameVisible: Ember.K,
  becameHidden: Ember.K,

  /**
    @private

    When the view's `isVisible` property changes, toggle the visibility
    element of the actual DOM element.
  */
  _isVisibleDidChange: Ember.observer(function() {
    var isVisible = get(this, 'isVisible');

    this.$().toggle(isVisible);

    if (this._isAncestorHidden()) { return; }

    if (isVisible) {
      this._notifyBecameVisible();
    } else {
      this._notifyBecameHidden();
    }
  }, 'isVisible'),

  _notifyBecameVisible: function() {
    this.trigger('becameVisible');

    this.forEachChildView(function(view) {
      var isVisible = get(view, 'isVisible');

      if (isVisible || isVisible === null) {
        view._notifyBecameVisible();
      }
    });
  },

  _notifyBecameHidden: function() {
    this.trigger('becameHidden');
    this.forEachChildView(function(view) {
      var isVisible = get(view, 'isVisible');

      if (isVisible || isVisible === null) {
        view._notifyBecameHidden();
      }
    });
  },

  _isAncestorHidden: function() {
    var parent = get(this, 'parentView');

    while (parent) {
      if (get(parent, 'isVisible') === false) { return true; }

      parent = get(parent, 'parentView');
    }

    return false;
  },

  clearBuffer: function() {
    this.invokeRecursively(function(view) {
      this.buffer = null;
    });
  },

  transitionTo: function(state, children) {
    this.state = state;

    if (children !== false) {
      this.forEachChildView(function(view) {
        view.transitionTo(state);
      });
    }
  },

  /**
    @private

    Override the default event firing from Ember.Evented to
    also call methods with the given name.
  */
  trigger: function(name) {
    this._super.apply(this, arguments);
    if (this[name]) {
      return this[name].apply(this, [].slice.call(arguments, 1));
    }
  },

  has: function(name) {
    return Ember.typeOf(this[name]) === 'function' || this._super(name);
  },

  // .......................................................
  // EVENT HANDLING
  //

  /**
    @private

    Handle events from `Ember.EventDispatcher`
  */
  handleEvent: function(eventName, evt) {
    return this.invokeForState('handleEvent', eventName, evt);
  }

});

/**
  Describe how the specified actions should behave in the various
  states that a view can exist in. Possible states:

  * preRender: when a view is first instantiated, and after its
    element was destroyed, it is in the preRender state
  * inBuffer: once a view has been rendered, but before it has
    been inserted into the DOM, it is in the inBuffer state
  * inDOM: once a view has been inserted into the DOM it is in
    the inDOM state. A view spends the vast majority of its
    existence in this state.
  * destroyed: once a view has been destroyed (using the destroy
    method), it is in this state. No further actions can be invoked
    on a destroyed view.
*/

  // in the destroyed state, everything is illegal

  // before rendering has begun, all legal manipulations are noops.

  // inside the buffer, legal manipulations are done on the buffer

  // once the view has been inserted into the DOM, legal manipulations
  // are done on the DOM element.

/** @private */
var DOMManager = {
  prepend: function(view, childView) {
    childView._insertElementLater(function() {
      var element = view.$();
      element.prepend(childView.$());
    });
  },

  after: function(view, nextView) {
    nextView._insertElementLater(function() {
      var element = view.$();
      element.after(nextView.$());
    });
  },

  replace: function(view) {
    var element = get(view, 'element');

    set(view, 'element', null);

    view._insertElementLater(function() {
      Ember.$(element).replaceWith(get(view, 'element'));
    });
  },

  remove: function(view) {
    var elem = get(view, 'element');

    set(view, 'element', null);
    view._lastInsert = null;

    Ember.$(elem).remove();
  },

  empty: function(view) {
    view.$().empty();
  }
};

Ember.View.reopen({
  states: Ember.View.states,
  domManager: DOMManager
});

// Create a global view hash.
Ember.View.views = {};

// If someone overrides the child views computed property when
// defining their class, we want to be able to process the user's
// supplied childViews and then restore the original computed property
// at view initialization time. This happens in Ember.ContainerView's init
// method.
Ember.View.childViewsProperty = childViewsProperty;

Ember.View.applyAttributeBindings = function(elem, name, value) {
  var type = Ember.typeOf(value);
  var currentValue = elem.attr(name);

  // if this changes, also change the logic in ember-handlebars/lib/helpers/binding.js
  if ((type === 'string' || (type === 'number' && !isNaN(value))) && value !== currentValue) {
    elem.attr(name, value);
  } else if (value && type === 'boolean') {
    elem.attr(name, name);
  } else if (!value) {
    elem.removeAttr(name);
  }
};

})();



(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

Ember.View.states = {
  _default: {
    // appendChild is only legal while rendering the buffer.
    appendChild: function() {
      throw "You can't use appendChild outside of the rendering process";
    },

    $: function() {
      return Ember.$();
    },

    getElement: function() {
      return null;
    },

    // Handle events from `Ember.EventDispatcher`
    handleEvent: function() {
      return true; // continue event propagation
    },

    destroyElement: function(view) {
      set(view, 'element', null);
      view._lastInsert = null;
      return view;
    }
  }
};

Ember.View.reopen({
  states: Ember.View.states
});

})();



(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
Ember.View.states.preRender = {
  parentState: Ember.View.states._default,

  // a view leaves the preRender state once its element has been
  // created (createElement).
  insertElement: function(view, fn) {
    if (view._lastInsert !== Ember.guidFor(fn)){
      return;
    }
    view.createElement();
    view._notifyWillInsertElement();
    // after createElement, the view will be in the hasElement state.
    fn.call(view);
    view.transitionTo('inDOM');
    view._notifyDidInsertElement();
  },

  empty: Ember.K,

  setElement: function(view, value) {
    view.beginPropertyChanges();
    view.invalidateRecursively('element');

    if (value !== null) {
      view.transitionTo('hasElement');
    }

    view.endPropertyChanges();

    return value;
  }
};

})();



(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, meta = Ember.meta;

Ember.View.states.inBuffer = {
  parentState: Ember.View.states._default,

  $: function(view, sel) {
    // if we don't have an element yet, someone calling this.$() is
    // trying to update an element that isn't in the DOM. Instead,
    // rerender the view to allow the render method to reflect the
    // changes.
    view.rerender();
    return Ember.$();
  },

  // when a view is rendered in a buffer, rerendering it simply
  // replaces the existing buffer with a new one
  rerender: function(view) {
    Ember.deprecate("Something you did caused a view to re-render after it rendered but before it was inserted into the DOM. Because this is avoidable and the cause of significant performance issues in applications, this behavior is deprecated. If you want to use the debugger to find out what caused this, you can set ENV.RAISE_ON_DEPRECATION to true.");

    view._notifyWillRerender();

    view.clearRenderedChildren();
    view.renderToBuffer(view.buffer, 'replaceWith');
  },

  // when a view is rendered in a buffer, appending a child
  // view will render that view and append the resulting
  // buffer into its buffer.
  appendChild: function(view, childView, options) {
    var buffer = view.buffer;

    childView = this.createChildView(childView, options);
    get(view, '_childViews').push(childView);

    childView.renderToBuffer(buffer);

    view.propertyDidChange('childViews');

    return childView;
  },

  // when a view is rendered in a buffer, destroying the
  // element will simply destroy the buffer and put the
  // state back into the preRender state.
  destroyElement: function(view) {
    view.clearBuffer();
    view._notifyWillDestroyElement();
    view.transitionTo('preRender');

    return view;
  },

  empty: function() {
    Ember.assert("Emptying a view in the inBuffer state is not allowed and should not happen under normal circumstances. Most likely there is a bug in your application. This may be due to excessive property change notifications.");
  },

  // It should be impossible for a rendered view to be scheduled for
  // insertion.
  insertElement: function() {
    throw "You can't insert an element that has already been rendered";
  },

  setElement: function(view, value) {
    view.invalidateRecursively('element');

    if (value === null) {
      view.transitionTo('preRender');
    } else {
      view.clearBuffer();
      view.transitionTo('hasElement');
    }

    return value;
  }
};


})();



(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, meta = Ember.meta;

Ember.View.states.hasElement = {
  parentState: Ember.View.states._default,

  $: function(view, sel) {
    var elem = get(view, 'element');
    return sel ? Ember.$(sel, elem) : Ember.$(elem);
  },

  getElement: function(view) {
    var parent = get(view, 'parentView');
    if (parent) { parent = get(parent, 'element'); }
    if (parent) { return view.findElementInParentElement(parent); }
    return Ember.$("#" + get(view, 'elementId'))[0];
  },

  setElement: function(view, value) {
    if (value === null) {
      view.invalidateRecursively('element');

      view.transitionTo('preRender');
    } else {
      throw "You cannot set an element to a non-null value when the element is already in the DOM.";
    }

    return value;
  },

  // once the view has been inserted into the DOM, rerendering is
  // deferred to allow bindings to synchronize.
  rerender: function(view) {
    view._notifyWillRerender();

    view.clearRenderedChildren();

    view.domManager.replace(view);
    return view;
  },

  // once the view is already in the DOM, destroying it removes it
  // from the DOM, nukes its element, and puts it back into the
  // preRender state if inDOM.

  destroyElement: function(view) {
    view._notifyWillDestroyElement();
    view.domManager.remove(view);
    return view;
  },

  empty: function(view) {
    var _childViews = get(view, '_childViews'), len, idx;
    if (_childViews) {
      len = get(_childViews, 'length');
      for (idx = 0; idx < len; idx++) {
        _childViews[idx]._notifyWillDestroyElement();
      }
    }
    view.domManager.empty(view);
  },

  // Handle events from `Ember.EventDispatcher`
  handleEvent: function(view, eventName, evt) {
    if (view.has(eventName)) {
      // Handler should be able to re-dispatch events, so we don't
      // preventDefault or stopPropagation.
      return view.trigger(eventName, evt);
    } else {
      return true; // continue event propagation
    }
  }
};

Ember.View.states.inDOM = {
  parentState: Ember.View.states.hasElement,

  insertElement: function(view, fn) {
    if (view._lastInsert !== Ember.guidFor(fn)){
      return;
    }
    throw "You can't insert an element into the DOM that has already been inserted";
  }
};

})();



(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var destroyedError = "You can't call %@ on a destroyed view", fmt = Ember.String.fmt;

Ember.View.states.destroyed = {
  parentState: Ember.View.states._default,

  appendChild: function() {
    throw fmt(destroyedError, ['appendChild']);
  },
  rerender: function() {
    throw fmt(destroyedError, ['rerender']);
  },
  destroyElement: function() {
    throw fmt(destroyedError, ['destroyElement']);
  },
  empty: function() {
    throw fmt(destroyedError, ['empty']);
  },

  setElement: function() {
    throw fmt(destroyedError, ["set('element', ...)"]);
  },

  // Since element insertion is scheduled, don't do anything if
  // the view has been destroyed between scheduling and execution
  insertElement: Ember.K
};


})();



(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();



(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, meta = Ember.meta;
var forEach = Ember.EnumerableUtils.forEach;

var childViewsProperty = Ember.computed(function() {
  return get(this, '_childViews');
}).property('_childViews').cacheable();

/**
  @class

  A `ContainerView` is an `Ember.View` subclass that allows for manual or programatic
  management of a view's `childViews` array that will correctly update the `ContainerView`
  instance's rendered DOM representation.

  ## Setting Initial Child Views
  The initial array of child views can be set in one of two ways. You can provide
  a `childViews` property at creation time that contains instance of `Ember.View`:


        aContainer = Ember.ContainerView.create({
          childViews: [Ember.View.create(), Ember.View.create()]
        })

  You can also provide a list of property names whose values are instances of `Ember.View`:

        aContainer = Ember.ContainerView.create({
          childViews: ['aView', 'bView', 'cView'],
          aView: Ember.View.create(),
          bView: Ember.View.create()
          cView: Ember.View.create()
        })

  The two strategies can be combined:

        aContainer = Ember.ContainerView.create({
          childViews: ['aView', Ember.View.create()],
          aView: Ember.View.create()
        })

  Each child view's rendering will be inserted into the container's rendered HTML in the same
  order as its position in the `childViews` property.

  ## Adding and Removing Child Views
  The views in a container's `childViews` array should be added and removed by manipulating
  the `childViews` property directly.

  To remove a view pass that view into a `removeObject` call on the container's `childViews` property.

  Given an empty `<body>` the following code

        aContainer = Ember.ContainerView.create({
          classNames: ['the-container'],
          childViews: ['aView', 'bView'],
          aView: Ember.View.create({
            template: Ember.Handlebars.compile("A")
          }),
          bView: Ember.View.create({
            template: Ember.Handlebars.compile("B")
          })
        })

        aContainer.appendTo('body')

  Results in the HTML

        <div class="ember-view the-container">
          <div class="ember-view">A</div>
          <div class="ember-view">B</div>
        </div>

  Removing a view

        aContainer.get('childViews') // [aContainer.aView, aContainer.bView]
        aContainer.get('childViews').removeObject(aContainer.get('bView'))
        aContainer.get('childViews') // [aContainer.aView]

  Will result in the following HTML

        <div class="ember-view the-container">
          <div class="ember-view">A</div>
        </div>


  Similarly, adding a child view is accomplished by adding `Ember.View` instances to the
  container's `childViews` property.

  Given an empty `<body>` the following code

        aContainer = Ember.ContainerView.create({
          classNames: ['the-container'],
          childViews: ['aView', 'bView'],
          aView: Ember.View.create({
            template: Ember.Handlebars.compile("A")
          }),
          bView: Ember.View.create({
            template: Ember.Handlebars.compile("B")
          })
        })

        aContainer.appendTo('body')

  Results in the HTML

        <div class="ember-view the-container">
          <div class="ember-view">A</div>
          <div class="ember-view">B</div>
        </div>

  Adding a view

        AnotherViewClass = Ember.View.extend({
          template: Ember.Handlebars.compile("Another view")
        })

        aContainer.get('childViews') // [aContainer.aView, aContainer.bView]
        aContainer.get('childViews').pushObject(AnotherViewClass.create())
        aContainer.get('childViews') // [aContainer.aView, aContainer.bView, <AnotherViewClass instance>]

  Will result in the following HTML

        <div class="ember-view the-container">
          <div class="ember-view">A</div>
          <div class="ember-view">B</div>
          <div class="ember-view">Another view</div>
        </div>


  Direct manipulation of childViews presence or absence in the DOM via calls to
  `remove` or `removeFromParent` or calls to a container's `removeChild` may not behave
  correctly.

  Calling `remove()` on a child view will remove the view's HTML, but it will remain as part of its
  container's `childView`s property.

  Calling `removeChild()` on the container will remove the passed view instance from the container's
  `childView`s but keep its HTML within the container's rendered view.

  Calling `removeFromParent()` behaves as expected but should be avoided in favor of direct
  manipulation of a container's `childViews` property.

        aContainer = Ember.ContainerView.create({
          classNames: ['the-container'],
          childViews: ['aView', 'bView'],
          aView: Ember.View.create({
            template: Ember.Handlebars.compile("A")
          }),
          bView: Ember.View.create({
            template: Ember.Handlebars.compile("B")
          })
        })

        aContainer.appendTo('body')

  Results in the HTML

        <div class="ember-view the-container">
          <div class="ember-view">A</div>
          <div class="ember-view">B</div>
        </div>

  Calling `aContainer.get('aView').removeFromParent()` will result in the following HTML

        <div class="ember-view the-container">
          <div class="ember-view">B</div>
        </div>

  And the `Ember.View` instance stored in `aContainer.aView` will be removed from `aContainer`'s
  `childViews` array.

  ## Templates and Layout
  A `template`, `templateName`, `defaultTemplate`, `layout`, `layoutName` or `defaultLayout`
  property on a container view will not result in the template or layout being rendered.
  The HTML contents of a `Ember.ContainerView`'s DOM representation will only be the rendered HTML
  of its child views.

  ## Binding a View to Display

  If you would like to display a single view in your ContainerView, you can set its `currentView`
  property. When the `currentView` property is set to a view instance, it will be added to the
  ContainerView's `childViews` array. If the `currentView` property is later changed to a
  different view, the new view will replace the old view. If `currentView` is set to `null`, the
  last `currentView` will be removed.

  This functionality is useful for cases where you want to bind the display of a ContainerView to
  a controller or state manager. For example, you can bind the `currentView` of a container to
  a controller like this:

      // Controller
      App.appController = Ember.Object.create({
        view: Ember.View.create({
          templateName: 'person_template'
        })
      });

      // Handlebars template
      {{view Ember.ContainerView currentViewBinding="App.appController.view"}}

  @extends Ember.View
*/

Ember.ContainerView = Ember.View.extend({

  init: function() {
    var childViews = get(this, 'childViews');
    Ember.defineProperty(this, 'childViews', childViewsProperty);

    this._super();

    var _childViews = get(this, '_childViews');

    forEach(childViews, function(viewName, idx) {
      var view;

      if ('string' === typeof viewName) {
        view = get(this, viewName);
        view = this.createChildView(view);
        set(this, viewName, view);
      } else {
        view = this.createChildView(viewName);
      }

      _childViews[idx] = view;
    }, this);

    // Make the _childViews array observable
    Ember.A(_childViews);

    // Sets up an array observer on the child views array. This
    // observer will detect when child views are added or removed
    // and update the DOM to reflect the mutation.
    get(this, 'childViews').addArrayObserver(this, {
      willChange: 'childViewsWillChange',
      didChange: 'childViewsDidChange'
    });
  },

  /**
    Instructs each child view to render to the passed render buffer.

    @param {Ember.RenderBuffer} buffer the buffer to render to
    @private
  */
  render: function(buffer) {
    this.forEachChildView(function(view) {
      view.renderToBuffer(buffer);
    });
  },

  /**
    When the container view is destroyed, tear down the child views
    array observer.

    @private
  */
  willDestroy: function() {
    get(this, 'childViews').removeArrayObserver(this, {
      willChange: 'childViewsWillChange',
      didChange: 'childViewsDidChange'
    });

    this._super();
  },

  /**
    When a child view is removed, destroy its element so that
    it is removed from the DOM.

    The array observer that triggers this action is set up in the
    `renderToBuffer` method.

    @private
    @param {Ember.Array} views the child views array before mutation
    @param {Number} start the start position of the mutation
    @param {Number} removed the number of child views removed
  **/
  childViewsWillChange: function(views, start, removed) {
    if (removed === 0) { return; }

    var changedViews = views.slice(start, start+removed);
    this.initializeViews(changedViews, null, null);

    this.invokeForState('childViewsWillChange', views, start, removed);
  },

  /**
    When a child view is added, make sure the DOM gets updated appropriately.

    If the view has already rendered an element, we tell the child view to
    create an element and insert it into the DOM. If the enclosing container view
    has already written to a buffer, but not yet converted that buffer into an
    element, we insert the string representation of the child into the appropriate
    place in the buffer.

    @private
    @param {Ember.Array} views the array of child views afte the mutation has occurred
    @param {Number} start the start position of the mutation
    @param {Number} removed the number of child views removed
    @param {Number} the number of child views added
  */
  childViewsDidChange: function(views, start, removed, added) {
    var len = get(views, 'length');

    // No new child views were added; bail out.
    if (added === 0) return;

    var changedViews = views.slice(start, start+added);
    this.initializeViews(changedViews, this, get(this, 'templateData'));

    // Let the current state handle the changes
    this.invokeForState('childViewsDidChange', views, start, added);
  },

  initializeViews: function(views, parentView, templateData) {
    forEach(views, function(view) {
      set(view, '_parentView', parentView);

      if (!get(view, 'templateData')) {
        set(view, 'templateData', templateData);
      }
    });
  },

  /**
    Schedules a child view to be inserted into the DOM after bindings have
    finished syncing for this run loop.

    @param {Ember.View} view the child view to insert
    @param {Ember.View} prev the child view after which the specified view should
                     be inserted
    @private
  */
  _scheduleInsertion: function(view, prev) {
    if (prev) {
      prev.domManager.after(prev, view);
    } else {
      this.domManager.prepend(this, view);
    }
  },

  currentView: null,

  _currentViewWillChange: Ember.beforeObserver(function() {
    var childViews = get(this, 'childViews'),
        currentView = get(this, 'currentView');

    if (currentView) {
      childViews.removeObject(currentView);
    }
  }, 'currentView'),

  _currentViewDidChange: Ember.observer(function() {
    var childViews = get(this, 'childViews'),
        currentView = get(this, 'currentView');

    if (currentView) {
      childViews.pushObject(currentView);
    }
  }, 'currentView')
});

// Ember.ContainerView extends the default view states to provide different
// behavior for childViewsWillChange and childViewsDidChange.
Ember.ContainerView.states = {
  parent: Ember.View.states,

  inBuffer: {
    childViewsDidChange: function(parentView, views, start, added) {
      var buffer = parentView.buffer,
          startWith, prev, prevBuffer, view;

      // Determine where to begin inserting the child view(s) in the
      // render buffer.
      if (start === 0) {
        // If views were inserted at the beginning, prepend the first
        // view to the render buffer, then begin inserting any
        // additional views at the beginning.
        view = views[start];
        startWith = start + 1;
        view.renderToBuffer(buffer, 'prepend');
      } else {
        // Otherwise, just insert them at the same place as the child
        // views mutation.
        view = views[start - 1];
        startWith = start;
      }

      for (var i=startWith; i<start+added; i++) {
        prev = view;
        view = views[i];
        prevBuffer = prev.buffer;
        view.renderToBuffer(prevBuffer, 'insertAfter');
      }
    }
  },

  hasElement: {
    childViewsWillChange: function(view, views, start, removed) {
      for (var i=start; i<start+removed; i++) {
        views[i].remove();
      }
    },

    childViewsDidChange: function(view, views, start, added) {
      // If the DOM element for this container view already exists,
      // schedule each child view to insert its DOM representation after
      // bindings have finished syncing.
      var prev = start === 0 ? null : views[start-1];

      for (var i=start; i<start+added; i++) {
        view = views[i];
        this._scheduleInsertion(view, prev);
        prev = view;
      }
    }
  }
};

Ember.ContainerView.states.inDOM = {
  parentState: Ember.ContainerView.states.hasElement
};

Ember.ContainerView.reopen({
  states: Ember.ContainerView.states
});

})();



(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt;

/**
  @class

  `Ember.CollectionView` is an `Ember.View` descendent responsible for managing a
  collection (an array or array-like object) by maintaing a child view object and
  associated DOM representation for each item in the array and ensuring that child
  views and their associated rendered HTML are updated when items in the array
  are added, removed, or replaced.

  ## Setting content
  The managed collection of objects is referenced as the `Ember.CollectionView` instance's
  `content` property.

      someItemsView = Ember.CollectionView.create({
        content: ['A', 'B','C']
      })

  The view for each item in the collection will have its `content` property set
  to the item.

  ## Specifying itemViewClass
  By default the view class for each item in the managed collection will be an instance
  of `Ember.View`. You can supply a different class by setting the `CollectionView`'s
  `itemViewClass` property.

  Given an empty `<body>` and the following code:


        someItemsView = Ember.CollectionView.create({
          classNames: ['a-collection'],
          content: ['A','B','C'],
          itemViewClass: Ember.View.extend({
            template: Ember.Handlebars.compile("the letter: {{view.content}}")
          })
        })

        someItemsView.appendTo('body')

  Will result in the following HTML structure

        <div class="ember-view a-collection">
          <div class="ember-view">the letter: A</div>
          <div class="ember-view">the letter: B</div>
          <div class="ember-view">the letter: C</div>
        </div>

  ## Automatic matching of parent/child tagNames

  Setting the `tagName` property of a `CollectionView` to any of
  "ul", "ol", "table", "thead", "tbody", "tfoot", "tr", or "select" will result
  in the item views receiving an appropriately matched `tagName` property.


  Given an empty `<body>` and the following code:

        anUndorderedListView = Ember.CollectionView.create({
          tagName: 'ul',
          content: ['A','B','C'],
          itemViewClass: Ember.View.extend({
            template: Ember.Handlebars.compile("the letter: {{view.content}}")
          })
        })

        anUndorderedListView.appendTo('body')

  Will result in the following HTML structure

        <ul class="ember-view a-collection">
          <li class="ember-view">the letter: A</li>
          <li class="ember-view">the letter: B</li>
          <li class="ember-view">the letter: C</li>
        </ul>

  Additional tagName pairs can be provided by adding to `Ember.CollectionView.CONTAINER_MAP `

        Ember.CollectionView.CONTAINER_MAP['article'] = 'section'


  ## Empty View
  You can provide an `Ember.View` subclass to the `Ember.CollectionView` instance as its
  `emptyView` property. If the `content` property of a `CollectionView` is set to `null`
  or an empty array, an instance of this view will be the `CollectionView`s only child.

        aListWithNothing = Ember.CollectionView.create({
          classNames: ['nothing']
          content: null,
          emptyView: Ember.View.extend({
            template: Ember.Handlebars.compile("The collection is empty")
          })
        })

        aListWithNothing.appendTo('body')

  Will result in the following HTML structure

        <div class="ember-view nothing">
          <div class="ember-view">
            The collection is empty
          </div>
        </div>

  ## Adding and Removing items
  The `childViews` property of a `CollectionView` should not be directly manipulated. Instead,
  add, remove, replace items from its `content` property. This will trigger
  appropriate changes to its rendered HTML.

  ## Use in templates via the `{{collection}}` Ember.Handlebars helper
  Ember.Handlebars provides a helper specifically for adding `CollectionView`s to templates.
  See `Ember.Handlebars.collection` for more details

  @since Ember 0.9
  @extends Ember.ContainerView
*/
Ember.CollectionView = Ember.ContainerView.extend(
/** @scope Ember.CollectionView.prototype */ {

  /**
    A list of items to be displayed by the Ember.CollectionView.

    @type Ember.Array
    @default null
  */
  content: null,

  /**
    @private

    This provides metadata about what kind of empty view class this
    collection would like if it is being instantiated from another
    system (like Handlebars)
  */
  emptyViewClass: Ember.View,

  /**
    An optional view to display if content is set to an empty array.

    @type Ember.View
    @default null
  */
  emptyView: null,

  /**
    @type Ember.View
    @default Ember.View
  */
  itemViewClass: Ember.View,

  /** @private */
  init: function() {
    var ret = this._super();
    this._contentDidChange();
    return ret;
  },

  _contentWillChange: Ember.beforeObserver(function() {
    var content = this.get('content');

    if (content) { content.removeArrayObserver(this); }
    var len = content ? get(content, 'length') : 0;
    this.arrayWillChange(content, 0, len);
  }, 'content'),

  /**
    @private

    Check to make sure that the content has changed, and if so,
    update the children directly. This is always scheduled
    asynchronously, to allow the element to be created before
    bindings have synchronized and vice versa.
  */
  _contentDidChange: Ember.observer(function() {
    var content = get(this, 'content');

    if (content) {
      Ember.assert(fmt("an Ember.CollectionView's content must implement Ember.Array. You passed %@", [content]), Ember.Array.detect(content));
      content.addArrayObserver(this);
    }

    var len = content ? get(content, 'length') : 0;
    this.arrayDidChange(content, 0, null, len);
  }, 'content'),

  willDestroy: function() {
    var content = get(this, 'content');
    if (content) { content.removeArrayObserver(this); }

    this._super();
  },

  arrayWillChange: function(content, start, removedCount) {
    // If the contents were empty before and this template collection has an
    // empty view remove it now.
    var emptyView = get(this, 'emptyView');
    if (emptyView && emptyView instanceof Ember.View) {
      emptyView.removeFromParent();
    }

    // Loop through child views that correspond with the removed items.
    // Note that we loop from the end of the array to the beginning because
    // we are mutating it as we go.
    var childViews = get(this, 'childViews'), childView, idx, len;

    len = get(childViews, 'length');

    var removingAll = removedCount === len;

    if (removingAll) {
      this.invokeForState('empty');
    }

    for (idx = start + removedCount - 1; idx >= start; idx--) {
      childView = childViews[idx];
      if (removingAll) { childView.removedFromDOM = true; }
      childView.destroy();
    }
  },

  /**
    Called when a mutation to the underlying content array occurs.

    This method will replay that mutation against the views that compose the
    Ember.CollectionView, ensuring that the view reflects the model.

    This array observer is added in contentDidChange.

    @param {Array} addedObjects
      the objects that were added to the content

    @param {Array} removedObjects
      the objects that were removed from the content

    @param {Number} changeIndex
      the index at which the changes occurred
  */
  arrayDidChange: function(content, start, removed, added) {
    var itemViewClass = get(this, 'itemViewClass'),
        childViews = get(this, 'childViews'),
        addedViews = [], view, item, idx, len, itemTagName;

    if ('string' === typeof itemViewClass) {
      itemViewClass = Ember.getPath(itemViewClass);
    }

    Ember.assert(fmt("itemViewClass must be a subclass of Ember.View, not %@", [itemViewClass]), Ember.View.detect(itemViewClass));

    len = content ? get(content, 'length') : 0;
    if (len) {
      for (idx = start; idx < start+added; idx++) {
        item = content.objectAt(idx);

        view = this.createChildView(itemViewClass, {
          content: item,
          contentIndex: idx
        });

        addedViews.push(view);
      }
    } else {
      var emptyView = get(this, 'emptyView');
      if (!emptyView) { return; }

      emptyView = this.createChildView(emptyView);
      addedViews.push(emptyView);
      set(this, 'emptyView', emptyView);
    }
    childViews.replace(start, 0, addedViews);
  },

  createChildView: function(view, attrs) {
    view = this._super(view, attrs);

    var itemTagName = get(view, 'tagName');
    var tagName = (itemTagName === null || itemTagName === undefined) ? Ember.CollectionView.CONTAINER_MAP[get(this, 'tagName')] : itemTagName;

    set(view, 'tagName', tagName);

    return view;
  }
});

/**
  @static

  A map of parent tags to their default child tags. You can add
  additional parent tags if you want collection views that use
  a particular parent tag to default to a child tag.

  @type Hash
  @constant
*/
Ember.CollectionView.CONTAINER_MAP = {
  ul: 'li',
  ol: 'li',
  table: 'tr',
  thead: 'tr',
  tbody: 'tr',
  tfoot: 'tr',
  tr: 'td',
  select: 'option'
};

})();



(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();



(function() {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*globals jQuery*/

})();

(function() {
var get = Ember.get, set = Ember.set, getPath = Ember.getPath;

/**
  @class
*/
Ember.State = Ember.Object.extend(Ember.Evented,
/** @scope Ember.State.prototype */{
  isState: true,

  /**
    A reference to the parent state.

    @type {Ember.State}
  */
  parentState: null,
  start: null,

  /**
    The name of this state.

    @type String
  */
  name: null,

  /**
    The full path to this state.

    @type String
    @readOnly
  */
  path: Ember.computed(function() {
    var parentPath = getPath(this, 'parentState.path'),
        path = get(this, 'name');

    if (parentPath) {
      path = parentPath + '.' + path;
    }

    return path;
  }).property().cacheable(),

  /**
    @private

    Override the default event firing from Ember.Evented to
    also call methods with the given name.
  */
  trigger: function(name) {
    if (this[name]) {
      this[name].apply(this, [].slice.call(arguments, 1));
    }
    this._super.apply(this, arguments);
  },

  /** @private */
  init: function() {
    var states = get(this, 'states'), foundStates;
    set(this, 'childStates', Ember.A());
    set(this, 'eventTransitions', get(this, 'eventTransitions') || {});

    var name, value, transitionTarget;

    // As a convenience, loop over the properties
    // of this state and look for any that are other
    // Ember.State instances or classes, and move them
    // to the `states` hash. This avoids having to
    // create an explicit separate hash.

    if (!states) {
      states = {};

      for (name in this) {
        if (name === "constructor") { continue; }

        if (value = this[name]) {
          if (transitionTarget = value.transitionTarget) {
            this.eventTransitions[name] = transitionTarget;
          }

          this.setupChild(states, name, value);
        }
      }

      set(this, 'states', states);
    } else {
      for (name in states) {
        this.setupChild(states, name, states[name]);
      }
    }

    set(this, 'pathsCache', {});
    set(this, 'pathsCacheNoContext', {});
  },

  /** @private */
  setupChild: function(states, name, value) {
    if (!value) { return false; }

    if (value.isState) {
      set(value, 'name', name);
    } else if (Ember.State.detect(value)) {
      value = value.create({
        name: name
      });
    }

    if (value.isState) {
      set(value, 'parentState', this);
      get(this, 'childStates').pushObject(value);
      states[name] = value;
    }
  },

  lookupEventTransition: function(name) {
    var path, state = this;

    while(state && !path) {
      path = state.eventTransitions[name];
      state = state.get('parentState');
    }

    return path;
  },

  /**
    A Boolean value indicating whether the state is a leaf state
    in the state hierarchy. This is false if the state has child
    states; otherwise it is true.

    @type Boolean
  */
  isLeaf: Ember.computed(function() {
    return !get(this, 'childStates').length;
  }).cacheable(),

  /**
    This is the default transition event.

    @event
    @param {Ember.StateManager} manager
    @param context
    @see Ember.StateManager#transitionEvent
  */
  setup: Ember.K,

  /**
    This event fires when the state is entered.

    @event
    @param {Ember.StateManager} manager
  */
  enter: Ember.K,

  /**
    This event fires when the state is exited.

    @event
    @param {Ember.StateManager} manager
  */
  exit: Ember.K
});

var Event = Ember.$ && Ember.$.Event;

Ember.State.reopenClass(
/** @scope Ember.State */{

  /**
  @static

  Creates an action function for transitioning to the named state while preserving context.

  The following example StateManagers are equivalent:

      aManager = Ember.StateManager.create({
        stateOne: Ember.State.create({
          changeToStateTwo: Ember.State.transitionTo('stateTwo')
        }),
        stateTwo: Ember.State.create({})
      })

      bManager = Ember.StateManager.create({
        stateOne: Ember.State.create({
          changeToStateTwo: function(manager, context){
            manager.transitionTo('stateTwo', context)
          }
        }),
        stateTwo: Ember.State.create({})
      })

  @param {String} target
  */
  transitionTo: function(target) {
    var event = function(stateManager, context) {
      if (Event && context instanceof Event) {
        context = context.context;
      }

      stateManager.transitionTo(target, context);
    };

    event.transitionTarget = target;

    return event;
  }
});

})();



(function() {
var get = Ember.get, set = Ember.set, getPath = Ember.getPath, fmt = Ember.String.fmt;
var arrayForEach = Ember.ArrayPolyfills.forEach;
/**
  @class

  StateManager is part of Ember's implementation of a finite state machine. A StateManager
  instance manages a number of properties that are instances of `Ember.State`,
  tracks the current active state, and triggers callbacks when states have changed.

  ## Defining States

  The states of StateManager can be declared in one of two ways. First, you can define
  a `states` property that contains all the states:

      managerA = Ember.StateManager.create({
        states: {
          stateOne: Ember.State.create(),
          stateTwo: Ember.State.create()
        }
      })

      managerA.get('states')
      // {
      //   stateOne: Ember.State.create(),
      //   stateTwo: Ember.State.create()
      // }

  You can also add instances of `Ember.State` (or an `Ember.State` subclass) directly as properties
  of a StateManager. These states will be collected into the `states` property for you.

      managerA = Ember.StateManager.create({
        stateOne: Ember.State.create(),
        stateTwo: Ember.State.create()
      })

      managerA.get('states')
      // {
      //   stateOne: Ember.State.create(),
      //   stateTwo: Ember.State.create()
      // }

  ## The Initial State
  When created a StateManager instance will immediately enter into the state
  defined as its `start` property or the state referenced by name in its
  `initialState` property:

      managerA = Ember.StateManager.create({
        start: Ember.State.create({})
      })

      managerA.getPath('currentState.name') // 'start'

      managerB = Ember.StateManager.create({
        initialState: 'beginHere',
        beginHere: Ember.State.create({})
      })

      managerB.getPath('currentState.name') // 'beginHere'

  Because it is a property you may also provide a computed function if you wish to derive
  an `initialState` programmatically:

      managerC = Ember.StateManager.create({
        initialState: function(){
          if (someLogic) {
            return 'active';
          } else {
            return 'passive';
          }
        }.property(),
        active: Ember.State.create({}),
        passive: Ember.State.create({})
      })

  ## Moving Between States
  A StateManager can have any number of Ember.State objects as properties
  and can have a single one of these states as its current state.

  Calling `transitionTo` transitions between states:

      robotManager = Ember.StateManager.create({
        initialState: 'poweredDown',
        poweredDown: Ember.State.create({}),
        poweredUp: Ember.State.create({})
      })

      robotManager.getPath('currentState.name') // 'poweredDown'
      robotManager.transitionTo('poweredUp')
      robotManager.getPath('currentState.name') // 'poweredUp'

  Before transitioning into a new state the existing `currentState` will have its
  `exit` method called with the StateManager instance as its first argument and
  an object representing the transition as its second argument.

  After transitioning into a new state the new `currentState` will have its
  `enter` method called with the StateManager instance as its first argument and
  an object representing the transition as its second argument.

      robotManager = Ember.StateManager.create({
        initialState: 'poweredDown',
        poweredDown: Ember.State.create({
          exit: function(stateManager){
            console.log("exiting the poweredDown state")
          }
        }),
        poweredUp: Ember.State.create({
          enter: function(stateManager){
            console.log("entering the poweredUp state. Destroy all humans.")
          }
        })
      })

      robotManager.getPath('currentState.name') // 'poweredDown'
      robotManager.transitionTo('poweredUp')
      // will log
      // 'exiting the poweredDown state'
      // 'entering the poweredUp state. Destroy all humans.'


  Once a StateManager is already in a state, subsequent attempts to enter that state will
  not trigger enter or exit method calls. Attempts to transition into a state that the
  manager does not have will result in no changes in the StateManager's current state:

      robotManager = Ember.StateManager.create({
        initialState: 'poweredDown',
        poweredDown: Ember.State.create({
          exit: function(stateManager){
            console.log("exiting the poweredDown state")
          }
        }),
        poweredUp: Ember.State.create({
          enter: function(stateManager){
            console.log("entering the poweredUp state. Destroy all humans.")
          }
        })
      })

      robotManager.getPath('currentState.name') // 'poweredDown'
      robotManager.transitionTo('poweredUp')
      // will log
      // 'exiting the poweredDown state'
      // 'entering the poweredUp state. Destroy all humans.'
      robotManager.transitionTo('poweredUp') // no logging, no state change

      robotManager.transitionTo('someUnknownState') // silently fails
      robotManager.getPath('currentState.name') // 'poweredUp'


  Each state property may itself contain properties that are instances of Ember.State.
  The StateManager can transition to specific sub-states in a series of transitionTo method calls or
  via a single transitionTo with the full path to the specific state. The StateManager will also
  keep track of the full path to its currentState

      robotManager = Ember.StateManager.create({
        initialState: 'poweredDown',
        poweredDown: Ember.State.create({
          charging: Ember.State.create(),
          charged: Ember.State.create()
        }),
        poweredUp: Ember.State.create({
          mobile: Ember.State.create(),
          stationary: Ember.State.create()
        })
      })

      robotManager.getPath('currentState.name') // 'poweredDown'

      robotManager.transitionTo('poweredUp')
      robotManager.getPath('currentState.name') // 'poweredUp'

      robotManager.transitionTo('mobile')
      robotManager.getPath('currentState.name') // 'mobile'

      // transition via a state path
      robotManager.transitionTo('poweredDown.charging')
      robotManager.getPath('currentState.name') // 'charging'

      robotManager.getPath('currentState.get.path') // 'poweredDown.charging'

  Enter transition methods will be called for each state and nested child state in their
  hierarchical order.  Exit methods will be called for each state and its nested states in
  reverse hierarchical order.

  Exit transitions for a parent state are not called when entering into one of its child states,
  only when transitioning to a new section of possible states in the hierarchy.

      robotManager = Ember.StateManager.create({
        initialState: 'poweredDown',
        poweredDown: Ember.State.create({
          enter: function(){},
          exit: function(){
            console.log("exited poweredDown state")
          },
          charging: Ember.State.create({
            enter: function(){},
            exit: function(){}
          }),
          charged: Ember.State.create({
            enter: function(){
              console.log("entered charged state")
            },
            exit: function(){
              console.log("exited charged state")
            }
          })
        }),
        poweredUp: Ember.State.create({
          enter: function(){
            console.log("entered poweredUp state")
          },
          exit: function(){},
          mobile: Ember.State.create({
            enter: function(){
              console.log("entered mobile state")
            },
            exit: function(){}
          }),
          stationary: Ember.State.create({
            enter: function(){},
            exit: function(){}
          })
        })
      })


      robotManager.get('currentState.get.path') // 'poweredDown'
      robotManager.transitionTo('charged')
      // logs 'entered charged state'
      // but does *not* log  'exited poweredDown state'
      robotManager.getPath('currentState.name') // 'charged

      robotManager.transitionTo('poweredUp.mobile')
      // logs
      // 'exited charged state'
      // 'exited poweredDown state'
      // 'entered poweredUp state'
      // 'entered mobile state'

  During development you can set a StateManager's `enableLogging` property to `true` to
  receive console messages of state transitions.

      robotManager = Ember.StateManager.create({
        enableLogging: true
      })

  ## Managing currentState with Actions
  To control which transitions between states are possible for a given state, StateManager
  can receive and route action messages to its states via the `send` method.  Calling to `send` with
  an action name will begin searching for a method with the same name starting at the current state
  and moving up through the parent states in a state hierarchy until an appropriate method is found
  or the StateManager instance itself is reached.

  If an appropriately named method is found it will be called with the state manager as the first
  argument and an optional `context` object as the second argument.

      managerA = Ember.StateManager.create({
        initialState: 'stateOne.substateOne.subsubstateOne',
        stateOne: Ember.State.create({
          substateOne: Ember.State.create({
            anAction: function(manager, context){
              console.log("an action was called")
            },
            subsubstateOne: Ember.State.create({})
          })
        })
      })

      managerA.getPath('currentState.name') // 'subsubstateOne'
      managerA.send('anAction')
      // 'stateOne.substateOne.subsubstateOne' has no anAction method
      // so the 'anAction' method of 'stateOne.substateOne' is called
      // and logs "an action was called"
      // with managerA as the first argument
      // and no second argument

      someObject = {}
      managerA.send('anAction', someObject)
      // the 'anAction' method of 'stateOne.substateOne' is called again
      // with managerA as the first argument and
      // someObject as the second argument.


  If the StateManager attempts to send an action but does not find an appropriately named
  method in the current state or while moving upwards through the state hierarchy
  it will throw a new Ember.Error. Action detection only moves upwards through the state hierarchy
  from the current state. It does not search in other portions of the hierarchy.

      managerB = Ember.StateManager.create({
        initialState: 'stateOne.substateOne.subsubstateOne',
        stateOne: Ember.State.create({
          substateOne: Ember.State.create({
            subsubstateOne: Ember.State.create({})
          })
        }),
        stateTwo: Ember.State.create({
         anAction: function(manager, context){
           // will not be called below because it is
           // not a parent of the current state
         }
        })
      })

      managerB.getPath('currentState.name') // 'subsubstateOne'
      managerB.send('anAction')
      // Error: <Ember.StateManager:ember132> could not
      // respond to event anAction in state stateOne.substateOne.subsubstateOne.

  Inside of an action method the given state should delegate `transitionTo` calls on its
  StateManager.

      robotManager = Ember.StateManager.create({
        initialState: 'poweredDown.charging',
        poweredDown: Ember.State.create({
          charging: Ember.State.create({
            chargeComplete: function(manager, context){
              manager.transitionTo('charged')
            }
          }),
          charged: Ember.State.create({
            boot: function(manager, context){
              manager.transitionTo('poweredUp')
            }
          })
        }),
        poweredUp: Ember.State.create({
          beginExtermination: function(manager, context){
            manager.transitionTo('rampaging')
          },
          rampaging: Ember.State.create()
        })
      })

      robotManager.getPath('currentState.name') // 'charging'
      robotManager.send('boot') // throws error, no boot action
                                // in current hierarchy
      robotManager.getPath('currentState.name') // remains 'charging'

      robotManager.send('beginExtermination') // throws error, no beginExtermination
                                              // action in current hierarchy
      robotManager.getPath('currentState.name') // remains 'charging'

      robotManager.send('chargeComplete')
      robotManager.getPath('currentState.name') // 'charged'

      robotManager.send('boot')
      robotManager.getPath('currentState.name') // 'poweredUp'

      robotManager.send('beginExtermination', allHumans)
      robotManager.getPath('currentState.name') // 'rampaging'

  Transition actions can also be created using the `transitionTo` method of the Ember.State class. The
  following example StateManagers are equivalent:

      aManager = Ember.StateManager.create({
        stateOne: Ember.State.create({
          changeToStateTwo: Ember.State.transitionTo('stateTwo')
        }),
        stateTwo: Ember.State.create({})
      })

      bManager = Ember.StateManager.create({
        stateOne: Ember.State.create({
          changeToStateTwo: function(manager, context){
            manager.transitionTo('stateTwo', context)
          }
        }),
        stateTwo: Ember.State.create({})
      })
**/
Ember.StateManager = Ember.State.extend(
/** @scope Ember.StateManager.prototype */ {

  /**
    When creating a new statemanager, look for a default state to transition
    into. This state can either be named `start`, or can be specified using the
    `initialState` property.
  */
  init: function() {
    this._super();

    set(this, 'stateMeta', Ember.Map.create());

    var initialState = get(this, 'initialState');

    if (!initialState && getPath(this, 'states.start')) {
      initialState = 'start';
    }

    if (initialState) {
      this.transitionTo(initialState);
      Ember.assert('Failed to transition to initial state "' + initialState + '"', !!get(this, 'currentState'));
    }
  },

  stateMetaFor: function(state) {
    var meta = get(this, 'stateMeta'),
        stateMeta = meta.get(state);

    if (!stateMeta) {
      stateMeta = {};
      meta.set(state, stateMeta);
    }

    return stateMeta;
  },

  setStateMeta: function(state, key, value) {
    return set(this.stateMetaFor(state), key, value);
  },

  getStateMeta: function(state, key) {
    return get(this.stateMetaFor(state), key);
  },

  /**
    The current state from among the manager's possible states. This property should
    not be set directly.  Use `transitionTo` to move between states by name.

    @type Ember.State
    @readOnly
  */
  currentState: null,

  /**
    The name of transitionEvent that this stateManager will dispatch

    @property {String}
    @default 'setup'
  */
  transitionEvent: 'setup',

  /**
    If set to true, `errorOnUnhandledEvents` will cause an exception to be
    raised if you attempt to send an event to a state manager that is not
    handled by the current state or any of its parent states.

    @type Boolean
    @default true
  */
  errorOnUnhandledEvent: true,

  send: function(event, context) {
    Ember.assert('Cannot send event "' + event + '" while currentState is ' + get(this, 'currentState'), get(this, 'currentState'));
    if (arguments.length === 1) { context = {}; }
    return this.sendRecursively(event, get(this, 'currentState'), context);
  },

  sendRecursively: function(event, currentState, context) {
    var log = this.enableLogging,
        action = currentState[event];

    // Test to see if the action is a method that
    // can be invoked. Don't blindly check just for
    // existence, because it is possible the state
    // manager has a child state of the given name,
    // and we should still raise an exception in that
    // case.
    if (typeof action === 'function') {
      if (log) { Ember.Logger.log(fmt("STATEMANAGER: Sending event '%@' to state %@.", [event, get(currentState, 'path')])); }
      return action.call(currentState, this, context);
    } else {
      var parentState = get(currentState, 'parentState');
      if (parentState) {
        return this.sendRecursively(event, parentState, context);
      } else if (get(this, 'errorOnUnhandledEvent')) {
        throw new Ember.Error(this.toString() + " could not respond to event " + event + " in state " + getPath(this, 'currentState.path') + ".");
      }
    }
  },

  /**
    Finds a state by its state path.

    Example:

        manager = Ember.StateManager.create({
          root: Ember.State.create({
            dashboard: Ember.State.create()
          })
        });

        manager.getStateByPath(manager, "root.dashboard")

        // returns the dashboard state

    @param {Ember.State} root the state to start searching from
    @param {String} path the state path to follow
    @returns {Ember.State} the state at the end of the path
  */
  getStateByPath: function(root, path) {
    var parts = path.split('.'),
        state = root;

    for (var i=0, l=parts.length; i<l; i++) {
      state = get(get(state, 'states'), parts[i]);
      if (!state) { break; }
    }

    return state;
  },

  findStateByPath: function(state, path) {
    var possible;

    while (!possible && state) {
      possible = this.getStateByPath(state, path);
      state = get(state, 'parentState');
    }

    return possible;
  },

  findStatesByPath: function(state, path) {
    if (!path || path === "") { return undefined; }
    var r = path.split('.'),
        ret = [];

    for (var i=0, len = r.length; i < len; i++) {
      var states = get(state, 'states');

      if (!states) { return undefined; }

      var s = get(states, r[i]);
      if (s) { state = s; ret.push(s); }
      else { return undefined; }
    }

    return ret;
  },

  goToState: function() {
    // not deprecating this yet so people don't constantly need to
    // make trivial changes for little reason.
    return this.transitionTo.apply(this, arguments);
  },

  transitionTo: function(path, context) {
    // 1. Normalize arguments
    // 2. Ensure that we are in the correct state
    // 3. Map provided path to context objects and send
    //    appropriate transitionEvent events

    if (Ember.empty(path)) { return; }

    var contexts = context ? Array.prototype.slice.call(arguments, 1) : [],
        currentState = get(this, 'currentState') || this,
        resolveState = currentState,
        exitStates = [],
        matchedContexts = [],
        cachedPath,
        enterStates,
        state,
        initialState,
        stateIdx,
        useContext;

    if (!context && (cachedPath = currentState.pathsCacheNoContext[path])) {
      // fast path

      exitStates = cachedPath.exitStates;
      enterStates = cachedPath.enterStates;
      resolveState = cachedPath.resolveState;
    } else {
      // normal path

      if ((cachedPath = currentState.pathsCache[path])) {
        // cache hit

        exitStates = cachedPath.exitStates;
        enterStates = cachedPath.enterStates;
        resolveState = cachedPath.resolveState;
      } else {
        // cache miss

        enterStates = this.findStatesByPath(currentState, path);

        while (resolveState && !enterStates) {
          exitStates.unshift(resolveState);

          resolveState = get(resolveState, 'parentState');
          if (!resolveState) {
            enterStates = this.findStatesByPath(this, path);
            if (!enterStates) { return; }
          }
          enterStates = this.findStatesByPath(resolveState, path);
        }

        while (enterStates.length > 0 && enterStates[0] === exitStates[0]) {
          resolveState = enterStates.shift();
          exitStates.shift();
        }

        currentState.pathsCache[name] = {
          exitStates: exitStates,
          enterStates: enterStates,
          resolveState: resolveState
        };
      }

      stateIdx = enterStates.length-1;
      while (contexts.length > 0) {
        if (stateIdx >= 0) {
          state = enterStates[stateIdx--];
        } else {
          state = enterStates[0] ? get(enterStates[0], 'parentState') : resolveState;
          if (!state) { throw "Cannot match all contexts to states"; }
          enterStates.unshift(state);
          exitStates.unshift(state);
        }

        useContext = context && (!get(state, 'isRoutable') || get(state, 'isDynamic'));
        matchedContexts.unshift(useContext ? contexts.pop() : null);
      }

      if (enterStates.length > 0) {
        state = enterStates[enterStates.length - 1];

        while(true) {
          initialState = get(state, 'initialState') || 'start';
          state = getPath(state, 'states.'+initialState);
          if (!state) { break; }
          enterStates.push(state);
        }

        while (enterStates.length > 0) {
          if (enterStates[0] !== exitStates[0]) { break; }

          if (enterStates.length === matchedContexts.length) {
            if (this.getStateMeta(enterStates[0], 'context') !== matchedContexts[0]) { break; }
            matchedContexts.shift();
          }

          resolveState = enterStates.shift();
          exitStates.shift();
        }
      }
    }

    this.enterState(exitStates, enterStates, enterStates[enterStates.length-1] || resolveState);
    this.triggerSetupContext(enterStates, matchedContexts);
  },

  triggerSetupContext: function(enterStates, contexts) {
    var offset = enterStates.length - contexts.length;
    Ember.assert("More contexts provided than states", offset >= 0);

    arrayForEach.call(enterStates, function(state, idx) {
      state.trigger(get(this, 'transitionEvent'), this, contexts[idx-offset]);
    }, this);
  },

  getState: function(name) {
    var state = get(this, name),
        parentState = get(this, 'parentState');

    if (state) {
      return state;
    } else if (parentState) {
      return parentState.getState(name);
    }
  },

  enterState: function(exitStates, enterStates, state) {
    var log = this.enableLogging,
        stateManager = this;

    exitStates = exitStates.slice(0).reverse();
    arrayForEach.call(exitStates, function(state) {
      state.trigger('exit', stateManager);
    });

    arrayForEach.call(enterStates, function(state) {
      if (log) { Ember.Logger.log("STATEMANAGER: Entering " + get(state, 'path')); }
      state.trigger('enter', stateManager);
    });

    set(this, 'currentState', state);
  }
});

})();



(function() {
// ==========================================================================
// Project:  Ember Statecharts
// Copyright: ©2011 Living Social Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();

(function() {
var get = Ember.get, getPath = Ember.getPath;

// The Ember Routable mixin assumes the existance of a simple
// routing shim that supports the following three behaviors:
//
// * .getURL() - this is called when the page loads
// * .setURL(newURL) - this is called from within the state
//   manager when the state changes to a routable state
// * .onURLChange(callback) - this happens when the user presses
//   the back or forward button

var paramForClass = function(classObject) {
  var className = classObject.toString(),
      parts = className.split("."),
      last = parts[parts.length - 1];

  return Ember.String.underscore(last) + "_id";
};

var merge = function(original, hash) {
  for (var prop in hash) {
    if (!hash.hasOwnProperty(prop)) { continue; }
    if (original.hasOwnProperty(prop)) { continue; }

    original[prop] = hash[prop];
  }
};

Ember.Routable = Ember.Mixin.create({
  init: function() {
    var redirection;
    this.on('connectOutlets', this, this.stashContext);

    if (redirection = get(this, 'redirectsTo')) {
      Ember.assert("You cannot use `redirectsTo` if you already have a `connectOutlets` method", this.connectOutlets === Ember.K);

      this.connectOutlets = function(router) {
        router.transitionTo(redirection);
      };
    }

    // normalize empty route to '/'
    var route = get(this, 'route');
    if (route === '') {
      route = '/';
    }

    this._super();

    Ember.assert("You cannot use `redirectsTo` on a state that has child states", !redirection || (!!redirection && !!get(this, 'isLeaf')));
  },

  /**
    @private

    Whenever a routable state is entered, the context it was entered with
    is stashed so that we can regenerate the state's `absoluteURL` on
    demand.
  */
  stashContext: function(manager, context) {
    var serialized = this.serialize(manager, context);
    Ember.assert('serialize must return a hash', !serialized || typeof serialized === 'object');

    manager.setStateMeta(this, 'context', context);
    manager.setStateMeta(this, 'serialized', serialized);

    if (get(this, 'isRoutable') && !get(manager, 'isRouting')) {
      this.updateRoute(manager, get(manager, 'location'));
    }
  },

  /**
    @private

    Whenever a routable state is entered, the router's location object
    is notified to set the URL to the current absolute path.

    In general, this will update the browser's URL.
  */
  updateRoute: function(manager, location) {
    if (get(this, 'isLeaf')) {
      var path = this.absoluteRoute(manager);
      location.setURL(path);
    }
  },

  /**
    @private

    Get the absolute route for the current state and a given
    hash.

    This method is private, as it expects a serialized hash,
    not the original context object.
  */
  absoluteRoute: function(manager, hash) {
    var parentState = get(this, 'parentState');
    var path = '', generated;

    // If the parent state is routable, use its current path
    // as this route's prefix.
    if (get(parentState, 'isRoutable')) {
      path = parentState.absoluteRoute(manager, hash);
    }

    var matcher = get(this, 'routeMatcher'),
        serialized = manager.getStateMeta(this, 'serialized');

    // merge the existing serialized object in with the passed
    // in hash.
    hash = hash || {};
    merge(hash, serialized);

    generated = matcher && matcher.generate(hash);

    if (generated) {
      path = path + '/' + generated;
    }

    return path;
  },

  /**
    @private

    At the moment, a state is routable if it has a string `route`
    property. This heuristic may change.
  */
  isRoutable: Ember.computed(function() {
    return typeof get(this, 'route') === 'string';
  }).cacheable(),

  /**
    @private

    A _RouteMatcher object generated from the current route's `route`
    string property.
  */
  routeMatcher: Ember.computed(function() {
    var route = get(this, 'route');
    if (route) {
      return Ember._RouteMatcher.create({ route: route });
    }
  }).cacheable(),

  /**
    @private

    Check whether the route has dynamic segments
  */
  isDynamic: Ember.computed(function() {
    var routeMatcher = get(this, 'routeMatcher');
    if (routeMatcher) {
      return routeMatcher.identifiers.length > 0;
    }
  }).cacheable(),

  /**
    @private

    The model class associated with the current state. This property
    uses the `modelType` property, in order to allow it to be
    specified as a String.
  */
  modelClass: Ember.computed(function() {
    var modelType = get(this, 'modelType');

    if (typeof modelType === 'string') {
      return Ember.getPath(window, modelType);
    } else {
      return modelType;
    }
  }).cacheable(),

  /**
    @private

    Get the model class for the state. The heuristic is:

    * The state must have a single dynamic segment
    * The dynamic segment must end in `_id`
    * A dynamic segment like `blog_post_id` is converted into `BlogPost`
    * The name is then looked up on the passed in namespace

    The process of initializing an application with a router will
    pass the application's namespace into the router, which will be
    used here.
  */
  modelClassFor: function(namespace) {
    var modelClass, routeMatcher, identifiers, match, className;

    // if an explicit modelType was specified, use that
    if (modelClass = get(this, 'modelClass')) { return modelClass; }

    // if the router has no lookup namespace, we won't be able to guess
    // the modelType
    if (!namespace) { return; }

    // make sure this state is actually a routable state
    routeMatcher = get(this, 'routeMatcher');
    if (!routeMatcher) { return; }

    // only guess modelType for states with a single dynamic segment
    // (no more, no fewer)
    identifiers = routeMatcher.identifiers;
    if (identifiers.length !== 2) { return; }

    // extract the `_id` from the end of the dynamic segment; if the
    // dynamic segment does not end in `_id`, we can't guess the
    // modelType
    match = identifiers[1].match(/^(.*)_id$/);
    if (!match) { return; }

    // convert the underscored type into a class form and look it up
    // on the router's namespace
    className = Ember.String.classify(match[1]);
    return get(namespace, className);
  },

  /**
    The default method that takes a `params` object and converts
    it into an object.

    By default, a params hash that looks like `{ post_id: 1 }`
    will be looked up as `namespace.Post.find(1)`. This is
    designed to work seamlessly with Ember Data, but will work
    fine with any class that has a `find` method.
  */
  deserialize: function(manager, params) {
    var modelClass, routeMatcher, param;

    if (modelClass = this.modelClassFor(get(manager, 'namespace'))) {
      return modelClass.find(params[paramForClass(modelClass)]);
    }

    return params;
  },

  /**
    The default method that takes an object and converts it into
    a params hash.

    By default, if there is a single dynamic segment named
    `blog_post_id` and the object is a `BlogPost` with an
    `id` of `12`, the serialize method will produce:

        { blog_post_id: 12 }
  */
  serialize: function(manager, context) {
    var modelClass, routeMatcher, namespace, param, id;

    if (Ember.empty(context)) { return ''; }

    if (modelClass = this.modelClassFor(get(manager, 'namespace'))) {
      param = paramForClass(modelClass);
      id = get(context, 'id');
      context = {};
      context[param] = id;
    }

    return context;
  },

  /**
    @private

    Once `unroute` has finished unwinding, `routePath` will be called
    with the remainder of the route.

    For example, if you were in the /posts/1/comments state, and you
    moved into the /posts/2/comments state, `routePath` will be called
    on the state whose path is `/posts` with the path `/2/comments`.
  */
  routePath: function(manager, path) {
    if (get(this, 'isLeaf')) { return; }

    var childStates = get(this, 'childStates'), match;

    childStates = childStates.sort(function(a, b) {
      var aDynamicSegments = getPath(a, 'routeMatcher.identifiers.length'),
          bDynamicSegments = getPath(b, 'routeMatcher.identifiers.length'),
          aRoute = get(a, 'route'),
          bRoute = get(b, 'route');

      if (aRoute.indexOf(bRoute) === 0) {
        return -1;
      } else if (bRoute.indexOf(aRoute) === 0) {
        return 1;
      }

      if (aDynamicSegments !== bDynamicSegments) {
        return aDynamicSegments - bDynamicSegments;
      }

      return getPath(b, 'route.length') - getPath(a, 'route.length');
    });

    var state = childStates.find(function(state) {
      var matcher = get(state, 'routeMatcher');
      if (match = matcher.match(path)) { return true; }
    });

    Ember.assert("Could not find state for path " + path, !!state);

    var object = state.deserialize(manager, match.hash);
    manager.transitionTo(get(state, 'path'), object);
    manager.send('routePath', match.remaining);
  },

  /**
    @private

    When you move to a new route by pressing the back
    or forward button, this method is called first.

    Its job is to move the state manager into a parent
    state of the state it will eventually move into.
  */
  unroutePath: function(router, path) {
    // If we're at the root state, we're done
    if (get(this, 'parentState') === router) {
      return;
    }

    path = path.replace(/^(?=[^\/])/, "/");
    var absolutePath = this.absoluteRoute(router);

    var route = get(this, 'route');

    // If the current path is empty, move up one state,
    // because the index ('/') state must be a leaf node.
    if (route !== '/') {
      // If the current path is a prefix of the path we're trying
      // to go to, we're done.
      var index = path.indexOf(absolutePath),
          next = path.charAt(absolutePath.length);

      if (index === 0 && (next === "/" || next === "")) {
        return;
      }
    }

    // Transition to the parent and call unroute again.
    var parentPath = get(get(this, 'parentState'), 'path');
    router.transitionTo(parentPath);
    router.send('unroutePath', path);
  },

  /**
    The `connectOutlets` event will be triggered once a
    state has been entered. It will be called with the
    route's context.
  */
  connectOutlets: Ember.K,

  /**
   The `navigateAway` event will be triggered when the
   URL changes due to the back/forward button
  */
  navigateAway: Ember.K
});

})();



(function() {
/**
  @class
*/
Ember.Route = Ember.State.extend(Ember.Routable);

})();



(function() {
var escapeForRegex = function(text) {
  return text.replace(/[\-\[\]{}()*+?.,\\\^\$|#\s]/g, "\\$&");
};

Ember._RouteMatcher = Ember.Object.extend({
  state: null,

  init: function() {
    var route = this.route,
        identifiers = [],
        count = 1,
        escaped;

    // Strip off leading slash if present
    if (route.charAt(0) === '/') {
      route = this.route = route.substr(1);
    }

    escaped = escapeForRegex(route);

    var regex = escaped.replace(/:([a-z_]+)(?=$|\/)/gi, function(match, id) {
      identifiers[count++] = id;
      return "([^/]+)";
    });

    this.identifiers = identifiers;
    this.regex = new RegExp("^/?" + regex);
  },

  match: function(path) {
    var match = path.match(this.regex);

    if (match) {
      var identifiers = this.identifiers,
          hash = {};

      for (var i=1, l=identifiers.length; i<l; i++) {
        hash[identifiers[i]] = match[i];
      }

      return {
        remaining: path.substr(match[0].length),
        hash: identifiers.length > 0 ? hash : null
      };
    }
  },

  generate: function(hash) {
    var identifiers = this.identifiers, route = this.route, id;
    for (var i=1, l=identifiers.length; i<l; i++) {
      id = identifiers[i];
      route = route.replace(new RegExp(":" + id), hash[id]);
    }
    return route;
  }
});

})();



(function() {
var get = Ember.get, getPath = Ember.getPath, set = Ember.set;

/**
  @class

  `Ember.Router` is the subclass of `Ember.StateManager` responsible for providing URL-based
  application state detection. The `Ember.Router` instance of an application detects the browser URL
  at application load time and attempts to match it to a specific application state. Additionally
  the router will update the URL to reflect an application's state changes over time.

  ## Adding a Router Instance to Your Application
  An instance of Ember.Router can be associated with an instance of Ember.Application in one of two ways:

  You can provide a subclass of Ember.Router as the `Router` property of your application. An instance
  of this Router class will be instantiated and route detection will be enabled when the application's
  `initialize` method is called. The Router instance will be available as the `router` property
  of the application:

      App = Ember.Application.create({
        Router: Ember.Router.extend({ ... })
      });

      App.initialize();
      App.get('router') // an instance of App.Router

  If you want to define a Router instance elsewhere, you can pass the instance to the application's
  `initialize` method:

      App = Ember.Application.create();
      aRouter = Ember.Router.create({ ... });

      App.initialize(aRouter);
      App.get('router') // aRouter

  ## Adding Routes to a Router
  The `initialState` property of Ember.Router instances is named `root`. The state stored in this
  property should be a subclass of Ember.Route. The `root` route should itself have states that are
  also subclasses of Ember.Route and have `route` properties describing the URL pattern you would
  like to detect.

      App = Ember.Application.create({
        Router: Ember.Router.extend({
          root: Ember.Route.extend({
            index: Ember.Route.extend({
              route: '/'
            }),
            ... additional Ember.Routes ...
          })
        })
      });
      App.initialize();


  When an application loads, Ember will parse the URL and attempt to find an Ember.Route within
  the application's states that matches. (The example URL-matching below will use the default
  'hash syntax' provided by `Ember.HashLocation`.)

  In the following route structure:

      App = Ember.Application.create({
        Router: Ember.Router.extend({
          root: Ember.Route.extend({
            aRoute: Ember.Route.extend({
              route: '/'
            }),
            bRoute: Ember.Route.extend({
              route: '/alphabeta'
            })
          })
        })
      });
      App.initialize();

  Loading the page at the URL '#/' will detect the route property of 'root.aRoute' ('/') and
  transition the router first to the state named 'root' and then to the substate 'aRoute'.

  Respectively, loading the page at the URL '#/alphabeta' would detect the route property of
  'root.bRoute' ('/alphabeta') and transition the router first to the state named 'root' and
  then to the substate 'bRoute'.

  ## Route Transition Events
  Transitioning between Ember.Route instances (including the transition into the detected
  route when loading the application)  triggers the same transition events as state transitions for
  base `Ember.State`s. However, the default `setup` transition event is named `connectOutlets` on
  Ember.Router instances (see 'Changing View Hierarchy in Response To State Change').

  The following route structure when loaded with the URL "#/"

      App = Ember.Application.create({
        Router: Ember.Router.extend({
          root: Ember.Route.extend({
            aRoute: Ember.Route.extend({
              route: '/',
              enter: function(router) {
                console.log("entering root.aRoute from", router.getPath('currentState.name'));
              },
              connectOutlets: function(router) {
                console.log("entered root.aRoute, fully transitioned to", router.getPath('currentState.path'));
              }
            })
          })
        })
      });
      App.initialize();

  Will result in console output of:

      'entering root.aRoute from root'
      'entered root.aRoute, fully transitioned to root.aRoute '

  Ember.Route has two additional callbacks for handling URL serialization and deserialization. See
  'Serializing/Deserializing URLs'

  ## Routes With Dynamic Segments
  An Ember.Route's `route` property can reference dynamic sections of the URL by prefacing a URL segment
  with the ':' character.  The values of these dynamic segments will be passed as a hash to the
  `deserialize` method of the matching Route (see 'Serializing/Deserializing URLs').

  ## Serializing/Deserializing URLs
  Ember.Route has two callbacks for associating a particular object context with a URL: `serialize`
  for converting an object into a parameters hash to fill dynamic segments of a URL and `deserialize`
  for converting a hash of dynamic segments from the URL into the appropriate object.

  ### Deserializing A URL's Dynamic Segments
  When an application is first loaded or the URL is changed manually (e.g. through the browser's
  back button) the `deserialize` method of the URL's matching Ember.Route will be called with
  the application's router as its first argument and a hash of the URLs dynamic segments and values
  as its second argument.

  The following route structure when loaded with the URL "#/fixed/thefirstvalue/anotherFixed/thesecondvalue":

      App = Ember.Application.create({
        Router: Ember.Router.extend({
          root: Ember.Route.extend({
            aRoute: Ember.Route.extend({
              route: '/fixed/:dynamicSectionA/anotherFixed/:dynamicSectionB',
              deserialize: function(router, params) {}
            })
          })
        })
      });
      App.initialize();

  Will call the 'deserialize' method of the Route instance at the path 'root.aRoute' with the
  following hash as its second argument:

      {
        dynamicSectionA: 'thefirstvalue',
        dynamicSectionB: 'thesecondvalue'
      }

  Within `deserialize` you should use this information to retrieve or create an appropriate context
  object for the given url (e.g. by loading from a remote API or accessing the browser's
  `localStorage`). This object must be the `return` value for `deserialize` and will be
  passed to the Route's `connectOutlets` and `serialize` methods.

  When an application's state is changed from within the application itself, the context provided for
  the transiton will be passed and `deserialize` is not called (see 'Transitions Between States').

  ### Serializing An Object For URLs with Dynamic Segments
  When transitioning into a Route whose `route` property contains dynamic segments the Route's
  `serialize` method is called with the Route's router as the first argument and the Route's
  context as the second argument.  The return value of `serialize` will be use to populate the
  dynamic segments and should be a object with keys that match the names of the dynamic sections.

  Given the following route structure:

      App = Ember.Application.create({
        Router: Ember.Router.extend({
          root: Ember.Route.extend({
            aRoute: Ember.Route.extend({
              route: '/'
            }),
            bRoute: Ember.Route.extend({
              route: '/staticSection/:someDynamicSegment',
              serialize: function(router, context) {
                return {
                  someDynamicSegment: context.get('name')
                }
              }
            })
          })
        })
      });
      App.initialize();


  Transitioning to "root.bRoute" with a context of `Object.create({name: 'Yehuda'})` will call
  the Route's `serialize` method with the context as its second argument and update the URL to
  '#/staticSection/Yehuda'.

  ## Transitions Between States
  Once a routed application has initialized its state based on the entry URL, subsequent transitions to other
  states will update the URL if the entered Route has a `route` property. Given the following route structure
  loaded at the URL '#/':

      App = Ember.Application.create({
        Router: Ember.Router.extend({
          root: Ember.Route.extend({
            aRoute: Ember.Route.extend({
              route: '/',
              moveElsewhere: Ember.Route.transitionTo('bRoute')
            }),
            bRoute: Ember.Route.extend({
              route: '/someOtherLocation'
            })
          })
        })
      });
      App.initialize();

  And application code:

      App.get('router').send('moveElsewhere');

  Will transition the application's state to 'root.bRoute' and trigger an update of the URL to
  '#/someOtherLocation

  For URL patterns with dynamic segments a context can be supplied as the second argument to `send`.
  The router will match dynamic segments names to keys on this object and fill in the URL with the
  supplied values. Given the following state structure loaded at the URL '#/':

      App = Ember.Application.create({
        Router: Ember.Router.extend({
          root: Ember.Route.extend({
            aRoute: Ember.Route.extend({
              route: '/',
              moveElsewhere: Ember.Route.transitionTo('bRoute')
            }),
            bRoute: Ember.Route.extend({
              route: '/a/route/:dynamicSection/:anotherDynamicSection',
              connectOutlets: function(router, context) {},
            })
          })
        })
      });
      App.initialize();

  And application code:

      App.get('router').send('moveElsewhere', {
        dynamicSection: '42',
        anotherDynamicSection: 'Life'
      });

  Will transition the application's state to 'root.bRoute' and trigger an update of the URL to
  '#/a/route/42/Life'.

  The context argument will also be passed as the second argument to the `serialize` method call.

  ## Injection of Controller Singletons
  During application initialization Ember will detect properties of the application ending in 'Controller',
  create singleton instances of each class, and assign them as a properties on the router.  The property name
  will be the UpperCamel name converted to lowerCamel format. These controller classes should be subclasses
  of Ember.ObjectController, Ember.ArrayController, or a custom Ember.Object that includes the
  Ember.ControllerMixin mixin.

      App = Ember.Application.create({
        FooController: Ember.Object.create(Ember.ControllerMixin),
        Router: Ember.Router.extend({ ... })
      });

      App.getPath('router.fooController'); // instance of App.FooController

  The controller singletons will have their `namespace` property set to the application and their `target`
  property set to the application's router singleton for easy integration with Ember's user event system.
  See 'Changing View Hierarchy in Response To State Change' and 'Responding to User-initiated Events'

  ## Responding to User-initiated Events
  Controller instances injected into the router at application initialization have their `target` property
  set to the application's router instance. These controllers will also be the default `context` for their
  associated views.  Uses of the `{{action}}` helper will automatically target the application's router.

  Given the following application entered at the URL '#/':

      App = Ember.Application.create({
        Router: Ember.Router.extend({
          root: Ember.Route.extend({
            aRoute: Ember.Route.extend({
              route: '/',
              anActionOnTheRouter: function(router, context) {
                router.transitionTo('anotherState', context);
              }
            })
            anotherState: Ember.Route.extend({
              route: '/differentUrl',
              connectOutlets: function(router, context) {

              }
            })
          })
        })
      });
      App.initialize();

  The following template:

      <script type="text/x-handlebars" data-template-name="aView">
          <h1><a {{action anActionOnTheRouter}}>{{title}}</a></h1>
      </script>

  Will delegate `click` events on the rendered `h1` to the application's router instance. In this case the
  `anActionOnTheRouter` method of the state at 'root.aRoute' will be called with the view's controller
  as the context argument. This context will be passed to the `connectOutlets` as its second argument.

  Different `context` can be supplied from within the `{{action}}` helper, allowing specific context passing
  between application states:

      <script type="text/x-handlebars" data-template-name="photos">
        {{#each photo in controller}}
          <h1><a {{action showPhoto context="photo"}}>{{title}}</a></h1>
        {{/each}}
      </script>

  See Handlebars.helpers.actions for additional usage examples.


  ## Changing View Hierarchy in Response To State Change
  Changes in application state that change the URL should be accompanied by associated changes in view
  hierarchy.  This can be accomplished by calling 'connectOutlet' on the injected controller singletons from
  within the 'connectOutlets' event of an Ember.Route:

      App = Ember.Application.create({
        OneController: Ember.ObjectController.extend(),
        OneView: Ember.View.extend(),

        AnotherController: Ember.ObjectController.extend(),
        AnotherView: Ember.View.extend(),

        Router: Ember.Router.extend({
          root: Ember.Route.extend({
            aRoute: Ember.Route.extend({
              route: '/',
              connectOutlets: function(router, context) {
                router.get('oneController').connectOutlet('another');
              },
            })
          })
        })
      });
      App.initialize();


  This will detect the '{{outlet}}' portion of `oneController`'s view (an instance of `App.OneView`) and
  fill it with a rendered instance of `App.AnotherView` whose `context` will be the single instance of
  `App.AnotherController` stored on the router in the `anotherController` property.

  For more information about Outlets, see `Ember.Handlebars.helpers.outlet`. For additional information on
  the `connectOutlet` method, see `Ember.Controller.connectOutlet`. For more information on
  controller injections, see `Ember.Application#initialize()`. For additional information about view context,
  see `Ember.View`.

  @extends Ember.StateManager
*/
Ember.Router = Ember.StateManager.extend(
/** @scope Ember.Router.prototype */ {

  /**
    @property {String}
    @default 'root'
  */
  initialState: 'root',

  /**
    The `Ember.Location` implementation to be used to manage the application
    URL state. The following values are supported:

    * 'hash': Uses URL fragment identifiers (like #/blog/1) for routing.
    * 'none': Does not read or set the browser URL, but still allows for
      routing to happen. Useful for testing.

    @type String
    @default 'hash'
  */
  location: 'hash',

  /**
    On router, transitionEvent should be called connectOutlets

    @property {String}
    @default 'connectOutlets'
  */
  transitionEvent: 'connectOutlets',

  route: function(path) {
    set(this, 'isRouting', true);

    try {
      path = path.replace(/^(?=[^\/])/, "/");

      this.send('navigateAway');
      this.send('unroutePath', path);

      var currentURL = get(this, 'currentState').absoluteRoute(this);
      var rest = path.substr(currentURL.length);

      this.send('routePath', rest);
    } finally {
      set(this, 'isRouting', false);
    }

    get(this, 'currentState').updateRoute(this, get(this, 'location'));
  },

  urlFor: function(path, hash) {
    var currentState = get(this, 'currentState') || this,
        state = this.findStateByPath(currentState, path);

    Ember.assert("To get a URL for a state, it must have a `route` property.", !!get(state, 'routeMatcher'));

    var location = get(this, 'location'),
        absoluteRoute = state.absoluteRoute(this, hash);

    return location.formatURL(absoluteRoute);
  },

  urlForEvent: function(eventName, context) {
    var currentState = get(this, 'currentState');
    var targetStateName = currentState.lookupEventTransition(eventName);

    Ember.assert(Ember.String.fmt("You must specify a target state for event '%@' in order to link to it in the current state '%@'.", [eventName, get(currentState, 'path')]), !!targetStateName);

    var targetState = this.findStateByPath(currentState, targetStateName);

    Ember.assert("Your target state name " + targetStateName + " for event " + eventName + " did not resolve to a state", !!targetState);

    var hash = this.serializeRecursively(targetState, context);

    return this.urlFor(targetStateName, hash);
  },

  /** @private */
  serializeRecursively: function(state, hash) {
    hash = state.serialize(this, hash);
    var parentState = state.get("parentState");
    if (parentState && parentState instanceof Ember.Route) {
      return this.serializeRecursively(parentState, hash);
    } else {
      return hash;
    }
  },

  /** @private */
  init: function() {
    this._super();

    var location = get(this, 'location');
    if ('string' === typeof location) {
      set(this, 'location', Ember.Location.create({ implementation: location }));
    }
  },

  /** @private */
  willDestroy: function() {
    get(this, 'location').destroy();
  }
});

})();



(function() {
// ==========================================================================
// Project:  Ember Routing
// Copyright: ©2012 Tilde Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();

(function() {
var get = Ember.get, set = Ember.set, getPath = Ember.getPath, fmt = Ember.String.fmt;

Ember.StateManager.reopen(
/** @scope Ember.StateManager.prototype */ {

  /**
    If the current state is a view state or the descendent of a view state,
    this property will be the view associated with it. If there is no
    view state active in this state manager, this value will be null.

    @type Ember.View
  */
  currentView: Ember.computed(function() {
    var currentState = get(this, 'currentState'),
        view;

    while (currentState) {
      if (get(currentState, 'isViewState')) {
        view = get(currentState, 'view');
        if (view) { return view; }
      }

      currentState = get(currentState, 'parentState');
    }

    return null;
  }).property('currentState').cacheable()

});

})();



(function() {
var get = Ember.get, set = Ember.set;
/**
  @class

  Ember.ViewState extends Ember.State to control the presence of a childView within a
  container based on the current state of the ViewState's StateManager.

  ## Interactions with Ember's View System.
  When combined with instances of `Ember.StateManager`, ViewState is designed to
  interact with Ember's view system to control which views are added to
  and removed from the DOM based on the manager's current state.

  By default, a StateManager will manage views inside the 'body' element. This can be
  customized by setting the `rootElement` property to a CSS selector of an existing
  HTML element you would prefer to receive view rendering.


      viewStates = Ember.StateManager.create({
        rootElement: '#some-other-element'
      })

  You can also specify a particular instance of `Ember.ContainerView` you would like to receive
  view rendering by setting the `rootView` property. You will be responsible for placing
  this element into the DOM yourself.

      aLayoutView = Ember.ContainerView.create()

      // make sure this view instance is added to the browser
      aLayoutView.appendTo('body')

      App.viewStates = Ember.StateManager.create({
        rootView: aLayoutView
      })


  Once you have an instance of StateManager controlling a view, you can provide states
  that are instances of `Ember.ViewState`.  When the StateManager enters a state
  that is an instance of `Ember.ViewState` that `ViewState`'s `view` property will be
  instantiated and inserted into the StateManager's `rootView` or `rootElement`.
  When a state is exited, the `ViewState`'s view will be removed from the StateManager's
  view.

      ContactListView = Ember.View.extend({
        classNames: ['my-contacts-css-class'],
        template: Ember.Handlebars.compile('<h2>People</h2>')
      })

      PhotoListView = Ember.View.extend({
        classNames: ['my-photos-css-class'],
        template: Ember.Handlebars.compile('<h2>Photos</h2>')
      })

      viewStates = Ember.StateManager.create({
        showingPeople: Ember.ViewState.create({
          view: ContactListView
        }),
        showingPhotos: Ember.ViewState.create({
          view: PhotoListView
        })
      })

      viewStates.transitionTo('showingPeople')

  The above code will change the rendered HTML from

      <body></body>

  to

      <body>
        <div id="ember1" class="ember-view my-contacts-css-class">
          <h2>People</h2>
        </div>
      </body>

  Changing the current state via `transitionTo` from `showingPeople` to
  `showingPhotos` will remove the `showingPeople` view and add the `showingPhotos` view:

      viewStates.transitionTo('showingPhotos')

  will change the rendered HTML to

      <body>
        <div id="ember2" class="ember-view my-photos-css-class">
          <h2>Photos</h2>
        </div>
      </body>


  When entering nested `ViewState`s, each state's view will be draw into the the StateManager's
  `rootView` or `rootElement` as siblings.


      ContactListView = Ember.View.extend({
        classNames: ['my-contacts-css-class'],
        template: Ember.Handlebars.compile('<h2>People</h2>')
      })

      EditAContactView = Ember.View.extend({
        classNames: ['editing-a-contact-css-class'],
        template: Ember.Handlebars.compile('Editing...')
      })

      viewStates = Ember.StateManager.create({
        showingPeople: Ember.ViewState.create({
          view: ContactListView,

          withEditingPanel: Ember.ViewState.create({
            view: EditAContactView
          })
        })
      })


      viewStates.transitionTo('showingPeople.withEditingPanel')


  Will result in the following rendered HTML:

      <body>
        <div id="ember2" class="ember-view my-contacts-css-class">
          <h2>People</h2>
        </div>

        <div id="ember2" class="ember-view editing-a-contact-css-class">
          Editing...
        </div>
      </body>


  ViewState views are added and removed from their StateManager's view via their
  `enter` and `exit` methods. If you need to override these methods, be sure to call
  `_super` to maintain the adding and removing behavior:

      viewStates = Ember.StateManager.create({
        aState: Ember.ViewState.create({
          view: Ember.View.extend({}),
          enter: function(manager){
            // calling _super ensures this view will be
            // properly inserted
            this._super(manager);

            // now you can do other things
          }
        })
      })

  ## Managing Multiple Sections of A Page With States
  Multiple StateManagers can be combined to control multiple areas of an application's rendered views.
  Given the following HTML body:

      <body>
        <div id='sidebar-nav'>
        </div>
        <div id='content-area'>
        </div>
      </body>

  You could separately manage view state for each section with two StateManagers

      navigationStates = Ember.StateManager.create({
        rootElement: '#sidebar-nav',
        userAuthenticated: Em.ViewState.create({
          view: Ember.View.extend({})
        }),
        userNotAuthenticated: Em.ViewState.create({
          view: Ember.View.extend({})
        })
      })

      contentStates = Ember.StateManager.create({
        rootElement: '#content-area',
        books: Em.ViewState.create({
          view: Ember.View.extend({})
        }),
        music: Em.ViewState.create({
          view: Ember.View.extend({})
        })
      })


  If you prefer to start with an empty body and manage state programmatically you
  can also take advantage of StateManager's `rootView` property and the ability of
  `Ember.ContainerView`s to manually manage their child views.


      dashboard = Ember.ContainerView.create({
        childViews: ['navigationAreaView', 'contentAreaView'],
        navigationAreaView: Ember.ContainerView.create({}),
        contentAreaView: Ember.ContainerView.create({})
      })

      navigationStates = Ember.StateManager.create({
        rootView: dashboard.get('navigationAreaView'),
        userAuthenticated: Em.ViewState.create({
          view: Ember.View.extend({})
        }),
        userNotAuthenticated: Em.ViewState.create({
          view: Ember.View.extend({})
        })
      })

      contentStates = Ember.StateManager.create({
        rootView: dashboard.get('contentAreaView'),
        books: Em.ViewState.create({
          view: Ember.View.extend({})
        }),
        music: Em.ViewState.create({
          view: Ember.View.extend({})
        })
      })

      dashboard.appendTo('body')

  ## User Manipulation of State via `{{action}}` Helpers
  The Handlebars `{{action}}` helper is StateManager-aware and will use StateManager action sending
  to connect user interaction to action-based state transitions.

  Given the following body and handlebars template

      <body>
        <script type='text/x-handlebars'>
          <a href="#" {{action "anAction" target="App.appStates"}}> Go </a>
        </script>
      </body>

  And application code

      App = Ember.Application.create()
      App.appStates = Ember.StateManager.create({
        initialState: 'aState',
        aState: Ember.State.create({
          anAction: function(manager, context){}
        }),
        bState: Ember.State.create({})
      })

  A user initiated click or touch event on "Go" will trigger the 'anAction' method of
  `App.appStates.aState` with `App.appStates` as the first argument and a
  `jQuery.Event` object as the second object. The `jQuery.Event` will include a property
  `view` that references the `Ember.View` object that was interacted with.

**/
Ember.ViewState = Ember.State.extend(
/** @scope Ember.ViewState.prototype */ {
  isViewState: true,

  init: function() {
    Ember.deprecate("Ember.ViewState is deprecated and will be removed from future releases. Consider using the outlet pattern to display nested views instead. For more information, see http://emberjs.com/guides/outlets/.");
    return this._super();
  },

  enter: function(stateManager) {
    var view = get(this, 'view'), root, childViews;

    if (view) {
      if (Ember.View.detect(view)) {
        view = view.create();
        set(this, 'view', view);
      }

      Ember.assert('view must be an Ember.View', view instanceof Ember.View);

      root = stateManager.get('rootView');

      if (root) {
        childViews = get(root, 'childViews');
        childViews.pushObject(view);
      } else {
        root = stateManager.get('rootElement') || 'body';
        view.appendTo(root);
      }
    }
  },

  exit: function(stateManager) {
    var view = get(this, 'view');

    if (view) {
      // If the view has a parent view, then it is
      // part of a view hierarchy and should be removed
      // from its parent.
      if (get(view, 'parentView')) {
        view.removeFromParent();
      } else {

        // Otherwise, the view is a "root view" and
        // was appended directly to the DOM.
        view.remove();
      }
    }
  }
});

})();



(function() {
// ==========================================================================
// Project:  Ember Statecharts
// Copyright: ©2011 Living Social Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();

(function() {
// ==========================================================================
// Project:   metamorph
// Copyright: ©2011 My Company Inc. All rights reserved.
// ==========================================================================

(function(window) {

  var K = function(){},
      guid = 0,
      document = window.document,

      // Feature-detect the W3C range API, the extended check is for IE9 which only partially supports ranges
      supportsRange = ('createRange' in document) && (typeof Range !== 'undefined') && Range.prototype.createContextualFragment,

      // Internet Explorer prior to 9 does not allow setting innerHTML if the first element
      // is a "zero-scope" element. This problem can be worked around by making
      // the first node an invisible text node. We, like Modernizr, use &shy;
      needsShy = (function(){
        var testEl = document.createElement('div');
        testEl.innerHTML = "<div></div>";
        testEl.firstChild.innerHTML = "<script></script>";
        return testEl.firstChild.innerHTML === '';
      })();

  // Constructor that supports either Metamorph('foo') or new
  // Metamorph('foo');
  //
  // Takes a string of HTML as the argument.

  var Metamorph = function(html) {
    var self;

    if (this instanceof Metamorph) {
      self = this;
    } else {
      self = new K();
    }

    self.innerHTML = html;
    var myGuid = 'metamorph-'+(guid++);
    self.start = myGuid + '-start';
    self.end = myGuid + '-end';

    return self;
  };

  K.prototype = Metamorph.prototype;

  var rangeFor, htmlFunc, removeFunc, outerHTMLFunc, appendToFunc, afterFunc, prependFunc, startTagFunc, endTagFunc;

  outerHTMLFunc = function() {
    return this.startTag() + this.innerHTML + this.endTag();
  };

  startTagFunc = function() {
    return "<script id='" + this.start + "' type='text/x-placeholder'></script>";
  };

  endTagFunc = function() {
    return "<script id='" + this.end + "' type='text/x-placeholder'></script>";
  };

  // If we have the W3C range API, this process is relatively straight forward.
  if (supportsRange) {

    // Get a range for the current morph. Optionally include the starting and
    // ending placeholders.
    rangeFor = function(morph, outerToo) {
      var range = document.createRange();
      var before = document.getElementById(morph.start);
      var after = document.getElementById(morph.end);

      if (outerToo) {
        range.setStartBefore(before);
        range.setEndAfter(after);
      } else {
        range.setStartAfter(before);
        range.setEndBefore(after);
      }

      return range;
    };

    htmlFunc = function(html, outerToo) {
      // get a range for the current metamorph object
      var range = rangeFor(this, outerToo);

      // delete the contents of the range, which will be the
      // nodes between the starting and ending placeholder.
      range.deleteContents();

      // create a new document fragment for the HTML
      var fragment = range.createContextualFragment(html);

      // insert the fragment into the range
      range.insertNode(fragment);
    };

    removeFunc = function() {
      // get a range for the current metamorph object including
      // the starting and ending placeholders.
      var range = rangeFor(this, true);

      // delete the entire range.
      range.deleteContents();
    };

    appendToFunc = function(node) {
      var range = document.createRange();
      range.setStart(node);
      range.collapse(false);
      var frag = range.createContextualFragment(this.outerHTML());
      node.appendChild(frag);
    };

    afterFunc = function(html) {
      var range = document.createRange();
      var after = document.getElementById(this.end);

      range.setStartAfter(after);
      range.setEndAfter(after);

      var fragment = range.createContextualFragment(html);
      range.insertNode(fragment);
    };

    prependFunc = function(html) {
      var range = document.createRange();
      var start = document.getElementById(this.start);

      range.setStartAfter(start);
      range.setEndAfter(start);

      var fragment = range.createContextualFragment(html);
      range.insertNode(fragment);
    };

  } else {
    /**
     * This code is mostly taken from jQuery, with one exception. In jQuery's case, we
     * have some HTML and we need to figure out how to convert it into some nodes.
     *
     * In this case, jQuery needs to scan the HTML looking for an opening tag and use
     * that as the key for the wrap map. In our case, we know the parent node, and
     * can use its type as the key for the wrap map.
     **/
    var wrapMap = {
      select: [ 1, "<select multiple='multiple'>", "</select>" ],
      fieldset: [ 1, "<fieldset>", "</fieldset>" ],
      table: [ 1, "<table>", "</table>" ],
      tbody: [ 2, "<table><tbody>", "</tbody></table>" ],
      tr: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
      colgroup: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
      map: [ 1, "<map>", "</map>" ],
      _default: [ 0, "", "" ]
    };

    /**
     * Given a parent node and some HTML, generate a set of nodes. Return the first
     * node, which will allow us to traverse the rest using nextSibling.
     *
     * We need to do this because innerHTML in IE does not really parse the nodes.
     **/
    var firstNodeFor = function(parentNode, html) {
      var arr = wrapMap[parentNode.tagName.toLowerCase()] || wrapMap._default;
      var depth = arr[0], start = arr[1], end = arr[2];

      if (needsShy) { html = '&shy;'+html; }

      var element = document.createElement('div');
      element.innerHTML = start + html + end;

      for (var i=0; i<=depth; i++) {
        element = element.firstChild;
      }

      // Look for &shy; to remove it.
      if (needsShy) {
        var shyElement = element;

        // Sometimes we get nameless elements with the shy inside
        while (shyElement.nodeType === 1 && !shyElement.nodeName) {
          shyElement = shyElement.firstChild;
        }

        // At this point it's the actual unicode character.
        if (shyElement.nodeType === 3 && shyElement.nodeValue.charAt(0) === "\u00AD") {
          shyElement.nodeValue = shyElement.nodeValue.slice(1);
        }
      }

      return element;
    };

    /**
     * In some cases, Internet Explorer can create an anonymous node in
     * the hierarchy with no tagName. You can create this scenario via:
     *
     *     div = document.createElement("div");
     *     div.innerHTML = "<table>&shy<script></script><tr><td>hi</td></tr></table>";
     *     div.firstChild.firstChild.tagName //=> ""
     *
     * If our script markers are inside such a node, we need to find that
     * node and use *it* as the marker.
     **/
    var realNode = function(start) {
      while (start.parentNode.tagName === "") {
        start = start.parentNode;
      }

      return start;
    };

    /**
     * When automatically adding a tbody, Internet Explorer inserts the
     * tbody immediately before the first <tr>. Other browsers create it
     * before the first node, no matter what.
     *
     * This means the the following code:
     *
     *     div = document.createElement("div");
     *     div.innerHTML = "<table><script id='first'></script><tr><td>hi</td></tr><script id='last'></script></table>
     *
     * Generates the following DOM in IE:
     *
     *     + div
     *       + table
     *         - script id='first'
     *         + tbody
     *           + tr
     *             + td
     *               - "hi"
     *           - script id='last'
     *
     * Which means that the two script tags, even though they were
     * inserted at the same point in the hierarchy in the original
     * HTML, now have different parents.
     *
     * This code reparents the first script tag by making it the tbody's
     * first child.
     **/
    var fixParentage = function(start, end) {
      if (start.parentNode !== end.parentNode) {
        end.parentNode.insertBefore(start, end.parentNode.firstChild);
      }
    };

    htmlFunc = function(html, outerToo) {
      // get the real starting node. see realNode for details.
      var start = realNode(document.getElementById(this.start));
      var end = document.getElementById(this.end);
      var parentNode = end.parentNode;
      var node, nextSibling, last;

      // make sure that the start and end nodes share the same
      // parent. If not, fix it.
      fixParentage(start, end);

      // remove all of the nodes after the starting placeholder and
      // before the ending placeholder.
      node = start.nextSibling;
      while (node) {
        nextSibling = node.nextSibling;
        last = node === end;

        // if this is the last node, and we want to remove it as well,
        // set the `end` node to the next sibling. This is because
        // for the rest of the function, we insert the new nodes
        // before the end (note that insertBefore(node, null) is
        // the same as appendChild(node)).
        //
        // if we do not want to remove it, just break.
        if (last) {
          if (outerToo) { end = node.nextSibling; } else { break; }
        }

        node.parentNode.removeChild(node);

        // if this is the last node and we didn't break before
        // (because we wanted to remove the outer nodes), break
        // now.
        if (last) { break; }

        node = nextSibling;
      }

      // get the first node for the HTML string, even in cases like
      // tables and lists where a simple innerHTML on a div would
      // swallow some of the content.
      node = firstNodeFor(start.parentNode, html);

      // copy the nodes for the HTML between the starting and ending
      // placeholder.
      while (node) {
        nextSibling = node.nextSibling;
        parentNode.insertBefore(node, end);
        node = nextSibling;
      }
    };

    // remove the nodes in the DOM representing this metamorph.
    //
    // this includes the starting and ending placeholders.
    removeFunc = function() {
      var start = realNode(document.getElementById(this.start));
      var end = document.getElementById(this.end);

      this.html('');
      start.parentNode.removeChild(start);
      end.parentNode.removeChild(end);
    };

    appendToFunc = function(parentNode) {
      var node = firstNodeFor(parentNode, this.outerHTML());

      while (node) {
        nextSibling = node.nextSibling;
        parentNode.appendChild(node);
        node = nextSibling;
      }
    };

    afterFunc = function(html) {
      // get the real starting node. see realNode for details.
      var end = document.getElementById(this.end);
      var insertBefore = end.nextSibling;
      var parentNode = end.parentNode;
      var nextSibling;
      var node;

      // get the first node for the HTML string, even in cases like
      // tables and lists where a simple innerHTML on a div would
      // swallow some of the content.
      node = firstNodeFor(parentNode, html);

      // copy the nodes for the HTML between the starting and ending
      // placeholder.
      while (node) {
        nextSibling = node.nextSibling;
        parentNode.insertBefore(node, insertBefore);
        node = nextSibling;
      }
    };

    prependFunc = function(html) {
      var start = document.getElementById(this.start);
      var parentNode = start.parentNode;
      var nextSibling;
      var node;

      node = firstNodeFor(parentNode, html);
      var insertBefore = start.nextSibling;

      while (node) {
        nextSibling = node.nextSibling;
        parentNode.insertBefore(node, insertBefore);
        node = nextSibling;
      }
    }
  }

  Metamorph.prototype.html = function(html) {
    this.checkRemoved();
    if (html === undefined) { return this.innerHTML; }

    htmlFunc.call(this, html);

    this.innerHTML = html;
  };

  Metamorph.prototype.replaceWith = function(html) {
    this.checkRemoved();
    htmlFunc.call(this, html, true);
  };

  Metamorph.prototype.remove = removeFunc;
  Metamorph.prototype.outerHTML = outerHTMLFunc;
  Metamorph.prototype.appendTo = appendToFunc;
  Metamorph.prototype.after = afterFunc;
  Metamorph.prototype.prepend = prependFunc;
  Metamorph.prototype.startTag = startTagFunc;
  Metamorph.prototype.endTag = endTagFunc;

  Metamorph.prototype.isRemoved = function() {
    var before = document.getElementById(this.start);
    var after = document.getElementById(this.end);

    return !before || !after;
  };

  Metamorph.prototype.checkRemoved = function() {
    if (this.isRemoved()) {
      throw new Error("Cannot perform operations on a Metamorph that is not in the DOM.");
    }
  };

  window.Metamorph = Metamorph;
})(this);


})();

(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */
var objectCreate = Ember.create;

/**
  @namespace
  @name Handlebars
  @private
*/

/**
  @namespace
  @name Handlebars.helpers
  @description Helpers for Handlebars templates
*/

Ember.assert("Ember Handlebars requires Handlebars 1.0.beta.5 or greater", window.Handlebars && window.Handlebars.VERSION.match(/^1\.0\.beta\.[56789]$|^1\.0\.rc\.[123456789]+/));

/**
  @class

  Prepares the Handlebars templating library for use inside Ember's view
  system.

  The Ember.Handlebars object is the standard Handlebars library, extended to use
  Ember's get() method instead of direct property access, which allows
  computed properties to be used inside templates.

  To create an Ember.Handlebars template, call Ember.Handlebars.compile().  This will
  return a function that can be used by Ember.View for rendering.
*/
Ember.Handlebars = objectCreate(Handlebars);

Ember.Handlebars.helpers = objectCreate(Handlebars.helpers);

/**
  Override the the opcode compiler and JavaScript compiler for Handlebars.
*/
Ember.Handlebars.Compiler = function() {};
Ember.Handlebars.Compiler.prototype = objectCreate(Handlebars.Compiler.prototype);
Ember.Handlebars.Compiler.prototype.compiler = Ember.Handlebars.Compiler;

Ember.Handlebars.JavaScriptCompiler = function() {};
Ember.Handlebars.JavaScriptCompiler.prototype = objectCreate(Handlebars.JavaScriptCompiler.prototype);
Ember.Handlebars.JavaScriptCompiler.prototype.compiler = Ember.Handlebars.JavaScriptCompiler;
Ember.Handlebars.JavaScriptCompiler.prototype.namespace = "Ember.Handlebars";


Ember.Handlebars.JavaScriptCompiler.prototype.initializeBuffer = function() {
  return "''";
};

/**
  Override the default buffer for Ember Handlebars. By default, Handlebars creates
  an empty String at the beginning of each invocation and appends to it. Ember's
  Handlebars overrides this to append to a single shared buffer.

  @private
*/
Ember.Handlebars.JavaScriptCompiler.prototype.appendToBuffer = function(string) {
  return "data.buffer.push("+string+");";
};

/**
  Rewrite simple mustaches from {{foo}} to {{bind "foo"}}. This means that all simple
  mustaches in Ember's Handlebars will also set up an observer to keep the DOM
  up to date when the underlying property changes.

  @private
*/
Ember.Handlebars.Compiler.prototype.mustache = function(mustache) {
  if (mustache.params.length || mustache.hash) {
    return Handlebars.Compiler.prototype.mustache.call(this, mustache);
  } else {
    var id = new Handlebars.AST.IdNode(['_triageMustache']);

    // Update the mustache node to include a hash value indicating whether the original node
    // was escaped. This will allow us to properly escape values when the underlying value
    // changes and we need to re-render the value.
    if(!mustache.escaped) {
      mustache.hash = mustache.hash || new Handlebars.AST.HashNode([]);
      mustache.hash.pairs.push(["unescaped", new Handlebars.AST.StringNode("true")]);
    }
    mustache = new Handlebars.AST.MustacheNode([id].concat([mustache.id]), mustache.hash, !mustache.escaped);
    return Handlebars.Compiler.prototype.mustache.call(this, mustache);
  }
};

/**
  Used for precompilation of Ember Handlebars templates. This will not be used during normal
  app execution.

  @param {String} string The template to precompile
*/
Ember.Handlebars.precompile = function(string) {
  var ast = Handlebars.parse(string);

  var options = {
    knownHelpers: {
      action: true,
      unbound: true,
      bindAttr: true,
      template: true,
      view: true,
      _triageMustache: true
    },
    data: true,
    stringParams: true
  };

  var environment = new Ember.Handlebars.Compiler().compile(ast, options);
  return new Ember.Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);
};

/**
  The entry point for Ember Handlebars. This replaces the default Handlebars.compile and turns on
  template-local data and String parameters.

  @param {String} string The template to compile
*/
Ember.Handlebars.compile = function(string) {
  var ast = Handlebars.parse(string);
  var options = { data: true, stringParams: true };
  var environment = new Ember.Handlebars.Compiler().compile(ast, options);
  var templateSpec = new Ember.Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);

  return Handlebars.template(templateSpec);
};

/**
  If a path starts with a reserved keyword, returns the root
  that should be used.

  @private
*/
var normalizePath = Ember.Handlebars.normalizePath = function(root, path, data) {
  var keywords = (data && data.keywords) || {},
      keyword, isKeyword;

  // Get the first segment of the path. For example, if the
  // path is "foo.bar.baz", returns "foo".
  keyword = path.split('.', 1)[0];

  // Test to see if the first path is a keyword that has been
  // passed along in the view's data hash. If so, we will treat
  // that object as the new root.
  if (keywords.hasOwnProperty(keyword)) {
    // Look up the value in the template's data hash.
    root = keywords[keyword];
    isKeyword = true;

    // Handle cases where the entire path is the reserved
    // word. In that case, return the object itself.
    if (path === keyword) {
      path = '';
    } else {
      // Strip the keyword from the path and look up
      // the remainder from the newly found root.
      path = path.substr(keyword.length+1);
    }
  }

  return { root: root, path: path, isKeyword: isKeyword };
};
/**
  Lookup both on root and on window. If the path starts with
  a keyword, the corresponding object will be looked up in the
  template's data hash and used to resolve the path.

  @param {Object} root The object to look up the property on
  @param {String} path The path to be lookedup
  @param {Object} options The template's option hash
*/

Ember.Handlebars.getPath = function(root, path, options) {
  var data = options && options.data,
      normalizedPath = normalizePath(root, path, data),
      value;

  // In cases where the path begins with a keyword, change the
  // root to the value represented by that keyword, and ensure
  // the path is relative to it.
  root = normalizedPath.root;
  path = normalizedPath.path;

  value = Ember.getPath(root, path);

  if (value === undefined && root !== window && Ember.isGlobalPath(path)) {
    value = Ember.getPath(window, path);
  }
  return value;
};

/**
  Registers a helper in Handlebars that will be called if no property with the
  given name can be found on the current context object, and no helper with
  that name is registered.

  This throws an exception with a more helpful error message so the user can
  track down where the problem is happening.

  @name Handlebars.helpers.helperMissing
  @param {String} path
  @param {Hash} options
*/
Ember.Handlebars.registerHelper('helperMissing', function(path, options) {
  var error, view = "";

  error = "%@ Handlebars error: Could not find property '%@' on object %@.";
  if (options.data){
    view = options.data.view;
  }
  throw new Ember.Error(Ember.String.fmt(error, [view, path, this]));
});


})();



(function() {

Ember.String.htmlSafe = function(str) {
  return new Handlebars.SafeString(str);
};

var htmlSafe = Ember.String.htmlSafe;

if (Ember.EXTEND_PROTOTYPES) {

  /**
    @see Ember.String.htmlSafe
  */
  String.prototype.htmlSafe = function() {
    return htmlSafe(this);
  };

}

})();



(function() {
/*jshint newcap:false*/
var set = Ember.set, get = Ember.get, getPath = Ember.getPath;

var DOMManager = {
  remove: function(view) {
    var morph = view.morph;
    if (morph.isRemoved()) { return; }
    set(view, 'element', null);
    view._lastInsert = null;
    morph.remove();
  },

  prepend: function(view, childView) {
    childView._insertElementLater(function() {
      var morph = view.morph;
      morph.prepend(childView.outerHTML);
      childView.outerHTML = null;
    });
  },

  after: function(view, nextView) {
    nextView._insertElementLater(function() {
      var morph = view.morph;
      morph.after(nextView.outerHTML);
      nextView.outerHTML = null;
    });
  },

  replace: function(view) {
    var morph = view.morph;

    view.transitionTo('preRender');
    view.clearRenderedChildren();
    var buffer = view.renderToBuffer();

    Ember.run.schedule('render', this, function() {
      if (get(view, 'isDestroyed')) { return; }
      view.invalidateRecursively('element');
      view._notifyWillInsertElement();
      morph.replaceWith(buffer.string());
      view.transitionTo('inDOM');
      view._notifyDidInsertElement();
    });
  },

  empty: function(view) {
    view.morph.html("");
  }
};

// The `morph` and `outerHTML` properties are internal only
// and not observable.

Ember._Metamorph = Ember.Mixin.create({
  isVirtual: true,
  tagName: '',

  init: function() {
    this._super();
    this.morph = Metamorph();
  },

  beforeRender: function(buffer) {
    buffer.push(this.morph.startTag());
  },

  afterRender: function(buffer) {
    buffer.push(this.morph.endTag());
  },

  createElement: function() {
    var buffer = this.renderToBuffer();
    this.outerHTML = buffer.string();
    this.clearBuffer();
  },

  domManager: DOMManager
});

Ember._MetamorphView = Ember.View.extend(Ember._Metamorph);


})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */

var get = Ember.get, set = Ember.set, getPath = Ember.Handlebars.getPath;
/**
  @ignore
  @private
  @class

  Ember._HandlebarsBoundView is a private view created by the Handlebars `{{bind}}`
  helpers that is used to keep track of bound properties.

  Every time a property is bound using a `{{mustache}}`, an anonymous subclass
  of Ember._HandlebarsBoundView is created with the appropriate sub-template and
  context set up. When the associated property changes, just the template for
  this view will re-render.
*/
Ember._HandlebarsBoundView = Ember._MetamorphView.extend({
/** @scope Ember._HandlebarsBoundView.prototype */

  /**
    The function used to determine if the `displayTemplate` or
    `inverseTemplate` should be rendered. This should be a function that takes
    a value and returns a Boolean.

    @type Function
    @default null
  */
  shouldDisplayFunc: null,

  /**
    Whether the template rendered by this view gets passed the context object
    of its parent template, or gets passed the value of retrieving `path`
    from the `pathRoot`.

    For example, this is true when using the `{{#if}}` helper, because the
    template inside the helper should look up properties relative to the same
    object as outside the block. This would be false when used with `{{#with
    foo}}` because the template should receive the object found by evaluating
    `foo`.

    @type Boolean
    @default false
  */
  preserveContext: false,

  /**
    If `preserveContext` is true, this is the object that will be used
    to render the template.

    @type Object
  */
  previousContext: null,

  /**
    The template to render when `shouldDisplayFunc` evaluates to true.

    @type Function
    @default null
  */
  displayTemplate: null,

  /**
    The template to render when `shouldDisplayFunc` evaluates to false.

    @type Function
    @default null
  */
  inverseTemplate: null,


  /**
    The path to look up on `pathRoot` that is passed to
    `shouldDisplayFunc` to determine which template to render.

    In addition, if `preserveContext` is false, the object at this path will
    be passed to the template when rendering.

    @type String
    @default null
  */
  path: null,

  /**
    The object from which the `path` will be looked up. Sometimes this is the
    same as the `previousContext`, but in cases where this view has been generated
    for paths that start with a keyword such as `view` or `controller`, the
    path root will be that resolved object.

    @type Object
  */
  pathRoot: null,

  normalizedValue: Ember.computed(function() {
    var path = get(this, 'path'),
        pathRoot  = get(this, 'pathRoot'),
        valueNormalizer = get(this, 'valueNormalizerFunc'),
        result, templateData;

    // Use the pathRoot as the result if no path is provided. This
    // happens if the path is `this`, which gets normalized into
    // a `pathRoot` of the current Handlebars context and a path
    // of `''`.
    if (path === '') {
      result = pathRoot;
    } else {
      templateData = get(this, 'templateData');
      result = getPath(pathRoot, path, { data: templateData });
    }

    return valueNormalizer ? valueNormalizer(result) : result;
  }).property('path', 'pathRoot', 'valueNormalizerFunc').volatile(),

  rerenderIfNeeded: function() {
    if (!get(this, 'isDestroyed') && get(this, 'normalizedValue') !== this._lastNormalizedValue) {
      this.rerender();
    }
  },

  /**
    Determines which template to invoke, sets up the correct state based on
    that logic, then invokes the default Ember.View `render` implementation.

    This method will first look up the `path` key on `pathRoot`,
    then pass that value to the `shouldDisplayFunc` function. If that returns
    true, the `displayTemplate` function will be rendered to DOM. Otherwise,
    `inverseTemplate`, if specified, will be rendered.

    For example, if this Ember._HandlebarsBoundView represented the {{#with foo}}
    helper, it would look up the `foo` property of its context, and
    `shouldDisplayFunc` would always return true. The object found by looking
    up `foo` would be passed to `displayTemplate`.

    @param {Ember.RenderBuffer} buffer
  */
  render: function(buffer) {
    // If not invoked via a triple-mustache ({{{foo}}}), escape
    // the content of the template.
    var escape = get(this, 'isEscaped');

    var shouldDisplay = get(this, 'shouldDisplayFunc'),
        preserveContext = get(this, 'preserveContext'),
        context = get(this, 'previousContext');

    var inverseTemplate = get(this, 'inverseTemplate'),
        displayTemplate = get(this, 'displayTemplate');

    var result = get(this, 'normalizedValue');
    this._lastNormalizedValue = result;

    // First, test the conditional to see if we should
    // render the template or not.
    if (shouldDisplay(result)) {
      set(this, 'template', displayTemplate);

      // If we are preserving the context (for example, if this
      // is an #if block, call the template with the same object.
      if (preserveContext) {
        set(this, '_context', context);
      } else {
      // Otherwise, determine if this is a block bind or not.
      // If so, pass the specified object to the template
        if (displayTemplate) {
          set(this, '_context', result);
        } else {
        // This is not a bind block, just push the result of the
        // expression to the render context and return.
          if (result === null || result === undefined) {
            result = "";
          } else if (!(result instanceof Handlebars.SafeString)) {
            result = String(result);
          }

          if (escape) { result = Handlebars.Utils.escapeExpression(result); }
          buffer.push(result);
          return;
        }
      }
    } else if (inverseTemplate) {
      set(this, 'template', inverseTemplate);

      if (preserveContext) {
        set(this, '_context', context);
      } else {
        set(this, '_context', result);
      }
    } else {
      set(this, 'template', function() { return ''; });
    }

    return this._super(buffer);
  }
});

})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt;
var getPath = Ember.Handlebars.getPath, normalizePath = Ember.Handlebars.normalizePath;
var forEach = Ember.ArrayPolyfills.forEach;

var EmberHandlebars = Ember.Handlebars, helpers = EmberHandlebars.helpers;

// Binds a property into the DOM. This will create a hook in DOM that the
// KVO system will look for and update if the property changes.
/** @private */
var bind = function(property, options, preserveContext, shouldDisplay, valueNormalizer) {
  var data = options.data,
      fn = options.fn,
      inverse = options.inverse,
      view = data.view,
      currentContext = this,
      pathRoot, path, normalized;

  normalized = normalizePath(currentContext, property, data);

  pathRoot = normalized.root;
  path = normalized.path;

  // Set up observers for observable objects
  if ('object' === typeof this) {
    // Create the view that will wrap the output of this template/property
    // and add it to the nearest view's childViews array.
    // See the documentation of Ember._HandlebarsBoundView for more.
    var bindView = view.createChildView(Ember._HandlebarsBoundView, {
      preserveContext: preserveContext,
      shouldDisplayFunc: shouldDisplay,
      valueNormalizerFunc: valueNormalizer,
      displayTemplate: fn,
      inverseTemplate: inverse,
      path: path,
      pathRoot: pathRoot,
      previousContext: currentContext,
      isEscaped: !options.hash.unescaped,
      templateData: options.data
    });

    view.appendChild(bindView);

    /** @private */
    var observer = function() {
      Ember.run.once(bindView, 'rerenderIfNeeded');
    };

    // Observes the given property on the context and
    // tells the Ember._HandlebarsBoundView to re-render. If property
    // is an empty string, we are printing the current context
    // object ({{this}}) so updating it is not our responsibility.
    if (path !== '') {
      Ember.addObserver(pathRoot, path, observer);
    }
  } else {
    // The object is not observable, so just render it out and
    // be done with it.
    data.buffer.push(getPath(pathRoot, path, options));
  }
};

/**
  '_triageMustache' is used internally select between a binding and helper for
  the given context. Until this point, it would be hard to determine if the
  mustache is a property reference or a regular helper reference. This triage
  helper resolves that.

  This would not be typically invoked by directly.

  @private
  @name Handlebars.helpers._triageMustache
  @param {String} property Property/helperID to triage
  @param {Function} fn Context to provide for rendering
  @returns {String} HTML string
*/
EmberHandlebars.registerHelper('_triageMustache', function(property, fn) {
  Ember.assert("You cannot pass more than one argument to the _triageMustache helper", arguments.length <= 2);
  if (helpers[property]) {
    return helpers[property].call(this, fn);
  }
  else {
    return helpers.bind.apply(this, arguments);
  }
});

/**
  `bind` can be used to display a value, then update that value if it
  changes. For example, if you wanted to print the `title` property of
  `content`:

      {{bind "content.title"}}

  This will return the `title` property as a string, then create a new
  observer at the specified path. If it changes, it will update the value in
  DOM. Note that if you need to support IE7 and IE8 you must modify the
  model objects properties using Ember.get() and Ember.set() for this to work as
  it relies on Ember's KVO system.  For all other browsers this will be handled
  for you automatically.

  @private
  @name Handlebars.helpers.bind
  @param {String} property Property to bind
  @param {Function} fn Context to provide for rendering
  @returns {String} HTML string
*/
EmberHandlebars.registerHelper('bind', function(property, fn) {
  Ember.assert("You cannot pass more than one argument to the bind helper", arguments.length <= 2);

  var context = (fn.contexts && fn.contexts[0]) || this;

  return bind.call(context, property, fn, false, function(result) {
    return !Ember.none(result);
  });
});

/**
  Use the `boundIf` helper to create a conditional that re-evaluates
  whenever the bound value changes.

      {{#boundIf "content.shouldDisplayTitle"}}
        {{content.title}}
      {{/boundIf}}

  @private
  @name Handlebars.helpers.boundIf
  @param {String} property Property to bind
  @param {Function} fn Context to provide for rendering
  @returns {String} HTML string
*/
EmberHandlebars.registerHelper('boundIf', function(property, fn) {
  var context = (fn.contexts && fn.contexts[0]) || this;
  var func = function(result) {
    if (Ember.typeOf(result) === 'array') {
      return get(result, 'length') !== 0;
    } else {
      return !!result;
    }
  };

  return bind.call(context, property, fn, true, func, func);
});

/**
  @name Handlebars.helpers.with
  @param {Function} context
  @param {Hash} options
  @returns {String} HTML string
*/
EmberHandlebars.registerHelper('with', function(context, options) {
  if (arguments.length === 4) {
    var keywordName, path, rootPath, normalized;

    Ember.assert("If you pass more than one argument to the with helper, it must be in the form #with foo as bar", arguments[1] === "as");
    options = arguments[3];
    keywordName = arguments[2];
    path = arguments[0];

    Ember.assert("You must pass a block to the with helper", options.fn && options.fn !== Handlebars.VM.noop);

    if (Ember.isGlobal(path)) {
      Ember.bind(options.data.keywords, keywordName, path);
    } else {
      normalized = normalizePath(this, path, options.data);
      path = normalized.path;
      rootPath = normalized.root;

      // This is a workaround for the fact that you cannot bind separate objects
      // together. When we implement that functionality, we should use it here.
      var contextKey = Ember.$.expando + Ember.guidFor(rootPath);
      options.data.keywords[contextKey] = rootPath;

      // if the path is '' ("this"), just bind directly to the current context
      var contextPath = path ? contextKey + '.' + path : contextKey;
      Ember.bind(options.data.keywords, keywordName, contextPath);
    }

    return bind.call(this, path, options.fn, true, function(result) {
      return !Ember.none(result);
    });
  } else {
    Ember.assert("You must pass exactly one argument to the with helper", arguments.length === 2);
    Ember.assert("You must pass a block to the with helper", options.fn && options.fn !== Handlebars.VM.noop);
    return helpers.bind.call(options.contexts[0], context, options);
  }
});


/**
  @name Handlebars.helpers.if
  @param {Function} context
  @param {Hash} options
  @returns {String} HTML string
*/
EmberHandlebars.registerHelper('if', function(context, options) {
  Ember.assert("You must pass exactly one argument to the if helper", arguments.length === 2);
  Ember.assert("You must pass a block to the if helper", options.fn && options.fn !== Handlebars.VM.noop);

  return helpers.boundIf.call(options.contexts[0], context, options);
});

/**
  @name Handlebars.helpers.unless
  @param {Function} context
  @param {Hash} options
  @returns {String} HTML string
*/
EmberHandlebars.registerHelper('unless', function(context, options) {
  Ember.assert("You must pass exactly one argument to the unless helper", arguments.length === 2);
  Ember.assert("You must pass a block to the unless helper", options.fn && options.fn !== Handlebars.VM.noop);

  var fn = options.fn, inverse = options.inverse;

  options.fn = inverse;
  options.inverse = fn;

  return helpers.boundIf.call(options.contexts[0], context, options);
});

/**
  `bindAttr` allows you to create a binding between DOM element attributes and
  Ember objects. For example:

      <img {{bindAttr src="imageUrl" alt="imageTitle"}}>

  @name Handlebars.helpers.bindAttr
  @param {Hash} options
  @returns {String} HTML string
*/
EmberHandlebars.registerHelper('bindAttr', function(options) {

  var attrs = options.hash;

  Ember.assert("You must specify at least one hash argument to bindAttr", !!Ember.keys(attrs).length);

  var view = options.data.view;
  var ret = [];
  var ctx = this;

  // Generate a unique id for this element. This will be added as a
  // data attribute to the element so it can be looked up when
  // the bound property changes.
  var dataId = ++Ember.$.uuid;

  // Handle classes differently, as we can bind multiple classes
  var classBindings = attrs['class'];
  if (classBindings !== null && classBindings !== undefined) {
    var classResults = EmberHandlebars.bindClasses(this, classBindings, view, dataId, options);
    ret.push('class="' + Handlebars.Utils.escapeExpression(classResults.join(' ')) + '"');
    delete attrs['class'];
  }

  var attrKeys = Ember.keys(attrs);

  // For each attribute passed, create an observer and emit the
  // current value of the property as an attribute.
  forEach.call(attrKeys, function(attr) {
    var path = attrs[attr],
        pathRoot, normalized;

    Ember.assert(fmt("You must provide a String for a bound attribute, not %@", [path]), typeof path === 'string');

    normalized = normalizePath(ctx, path, options.data);

    pathRoot = normalized.root;
    path = normalized.path;

    var value = (path === 'this') ? pathRoot : getPath(pathRoot, path, options),
        type = Ember.typeOf(value);

    Ember.assert(fmt("Attributes must be numbers, strings or booleans, not %@", [value]), value === null || value === undefined || type === 'number' || type === 'string' || type === 'boolean');

    var observer, invoker;

    /** @private */
    observer = function observer() {
      var result = getPath(pathRoot, path, options);

      Ember.assert(fmt("Attributes must be numbers, strings or booleans, not %@", [result]), result === null || result === undefined || typeof result === 'number' || typeof result === 'string' || typeof result === 'boolean');

      var elem = view.$("[data-bindattr-" + dataId + "='" + dataId + "']");

      // If we aren't able to find the element, it means the element
      // to which we were bound has been removed from the view.
      // In that case, we can assume the template has been re-rendered
      // and we need to clean up the observer.
      if (elem.length === 0) {
        Ember.removeObserver(pathRoot, path, invoker);
        return;
      }

      Ember.View.applyAttributeBindings(elem, attr, result);
    };

    /** @private */
    invoker = function() {
      Ember.run.once(observer);
    };

    // Add an observer to the view for when the property changes.
    // When the observer fires, find the element using the
    // unique data id and update the attribute to the new value.
    if (path !== 'this') {
      Ember.addObserver(pathRoot, path, invoker);
    }

    // if this changes, also change the logic in ember-views/lib/views/view.js
    if ((type === 'string' || (type === 'number' && !isNaN(value)))) {
      ret.push(attr + '="' + Handlebars.Utils.escapeExpression(value) + '"');
    } else if (value && type === 'boolean') {
      // The developer controls the attr name, so it should always be safe
      ret.push(attr + '="' + attr + '"');
    }
  }, this);

  // Add the unique identifier
  // NOTE: We use all lower-case since Firefox has problems with mixed case in SVG
  ret.push('data-bindattr-' + dataId + '="' + dataId + '"');
  return new EmberHandlebars.SafeString(ret.join(' '));
});

/**
  Helper that, given a space-separated string of property paths and a context,
  returns an array of class names. Calling this method also has the side
  effect of setting up observers at those property paths, such that if they
  change, the correct class name will be reapplied to the DOM element.

  For example, if you pass the string "fooBar", it will first look up the
  "fooBar" value of the context. If that value is true, it will add the
  "foo-bar" class to the current element (i.e., the dasherized form of
  "fooBar"). If the value is a string, it will add that string as the class.
  Otherwise, it will not add any new class name.

  @param {Ember.Object} context
    The context from which to lookup properties

  @param {String} classBindings
    A string, space-separated, of class bindings to use

  @param {Ember.View} view
    The view in which observers should look for the element to update

  @param {Srting} bindAttrId
    Optional bindAttr id used to lookup elements

  @returns {Array} An array of class names to add
*/
EmberHandlebars.bindClasses = function(context, classBindings, view, bindAttrId, options) {
  var ret = [], newClass, value, elem;

  // Helper method to retrieve the property from the context and
  // determine which class string to return, based on whether it is
  // a Boolean or not.
  var classStringForPath = function(root, path, className, options) {
    var val = path !== '' ? getPath(root, path, options) : true;

    // If the value is truthy and we're using the colon syntax,
    // we should return the className directly
    if (!!val && className) {
      return className;

    // If value is a Boolean and true, return the dasherized property
    // name.
    } else if (val === true) {
      // Normalize property path to be suitable for use
      // as a class name. For exaple, content.foo.barBaz
      // becomes bar-baz.
      var parts = path.split('.');
      return Ember.String.dasherize(parts[parts.length-1]);

    // If the value is not false, undefined, or null, return the current
    // value of the property.
    } else if (val !== false && val !== undefined && val !== null) {
      return val;

    // Nothing to display. Return null so that the old class is removed
    // but no new class is added.
    } else {
      return null;
    }
  };

  // For each property passed, loop through and setup
  // an observer.
  forEach.call(classBindings.split(' '), function(binding) {

    // Variable in which the old class value is saved. The observer function
    // closes over this variable, so it knows which string to remove when
    // the property changes.
    var oldClass;

    var observer, invoker;

    var split = binding.split(':'),
        path = split[0],
        className = split[1],
        pathRoot = context,
        normalized;

    if (path !== '') {
      normalized = normalizePath(context, path, options.data);

      pathRoot = normalized.root;
      path = normalized.path;
    }

    // Set up an observer on the context. If the property changes, toggle the
    // class name.
    /** @private */
    observer = function() {
      // Get the current value of the property
      newClass = classStringForPath(pathRoot, path, className, options);
      elem = bindAttrId ? view.$("[data-bindattr-" + bindAttrId + "='" + bindAttrId + "']") : view.$();

      // If we can't find the element anymore, a parent template has been
      // re-rendered and we've been nuked. Remove the observer.
      if (elem.length === 0) {
        Ember.removeObserver(pathRoot, path, invoker);
      } else {
        // If we had previously added a class to the element, remove it.
        if (oldClass) {
          elem.removeClass(oldClass);
        }

        // If necessary, add a new class. Make sure we keep track of it so
        // it can be removed in the future.
        if (newClass) {
          elem.addClass(newClass);
          oldClass = newClass;
        } else {
          oldClass = null;
        }
      }
    };

    /** @private */
    invoker = function() {
      Ember.run.once(observer);
    };

    if (path !== '') {
      Ember.addObserver(pathRoot, path, invoker);
    }

    // We've already setup the observer; now we just need to figure out the
    // correct behavior right now on the first pass through.
    value = classStringForPath(pathRoot, path, className, options);

    if (value) {
      ret.push(value);

      // Make sure we save the current value so that it can be removed if the
      // observer fires.
      oldClass = value;
    }
  });

  return ret;
};


})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */

// TODO: Don't require the entire module
var get = Ember.get, set = Ember.set;
var PARENT_VIEW_PATH = /^parentView\./;
var EmberHandlebars = Ember.Handlebars;

/** @private */
EmberHandlebars.ViewHelper = Ember.Object.create({

  propertiesFromHTMLOptions: function(options, thisContext) {
    var hash = options.hash, data = options.data;
    var extensions = {},
        classes = hash['class'],
        dup = false;

    if (hash.id) {
      extensions.elementId = hash.id;
      dup = true;
    }

    if (classes) {
      classes = classes.split(' ');
      extensions.classNames = classes;
      dup = true;
    }

    if (hash.classBinding) {
      extensions.classNameBindings = hash.classBinding.split(' ');
      dup = true;
    }

    if (hash.classNameBindings) {
      extensions.classNameBindings = hash.classNameBindings.split(' ');
      dup = true;
    }

    if (hash.attributeBindings) {
      Ember.assert("Setting 'attributeBindings' via Handlebars is not allowed. Please subclass Ember.View and set it there instead.");
      extensions.attributeBindings = null;
      dup = true;
    }

    if (dup) {
      hash = Ember.$.extend({}, hash);
      delete hash.id;
      delete hash['class'];
      delete hash.classBinding;
    }

    // Look for bindings passed to the helper and, if they are
    // local, make them relative to the current context instead of the
    // view.
    var path, normalized;

    for (var prop in hash) {
      if (!hash.hasOwnProperty(prop)) { continue; }

      // Test if the property ends in "Binding"
      if (Ember.IS_BINDING.test(prop) && typeof hash[prop] === 'string') {
        path = hash[prop];

        normalized = Ember.Handlebars.normalizePath(null, path, data);
        if (normalized.isKeyword) {
          hash[prop] = 'templateData.keywords.'+path;
        } else if (!Ember.isGlobalPath(path)) {
          if (path === 'this') {
            hash[prop] = 'bindingContext';
          } else {
            hash[prop] = 'bindingContext.'+path;
          }
        }
      }
    }

    // Make the current template context available to the view
    // for the bindings set up above.
    extensions.bindingContext = thisContext;

    return Ember.$.extend(hash, extensions);
  },

  helper: function(thisContext, path, options) {
    var inverse = options.inverse,
        data = options.data,
        view = data.view,
        fn = options.fn,
        hash = options.hash,
        newView;

    if ('string' === typeof path) {
      newView = EmberHandlebars.getPath(thisContext, path, options);
      Ember.assert("Unable to find view at path '" + path + "'", !!newView);
    } else {
      newView = path;
    }

    Ember.assert(Ember.String.fmt('You must pass a view class to the #view helper, not %@ (%@)', [path, newView]), Ember.View.detect(newView));

    var viewOptions = this.propertiesFromHTMLOptions(options, thisContext);
    var currentView = data.view;
    viewOptions.templateData = options.data;

    if (fn) {
      Ember.assert("You cannot provide a template block if you also specified a templateName", !get(viewOptions, 'templateName') && !get(newView.proto(), 'templateName'));
      viewOptions.template = fn;
    }

    currentView.appendChild(newView, viewOptions);
  }
});

/**
  `{{view}}` inserts a new instance of `Ember.View` into a template passing its options
  to the `Ember.View`'s `create` method and using the supplied block as the view's own template.

  An empty `<body>` and the following template:

      <script type="text/x-handlebars">
        A span:
        {{#view tagName="span"}}
          hello.
        {{/view}}
      </script>

  Will result in HTML structure:

      <body>
        <!-- Note: the handlebars template script
             also results in a rendered Ember.View
             which is the outer <div> here -->

        <div class="ember-view">
          A span:
          <span id="ember1" class="ember-view">
            Hello.
          </span>
        </div>
      </body>

  ### parentView setting

  The `parentView` property of the new `Ember.View` instance created through `{{view}}`
  will be set to the `Ember.View` instance of the template where `{{view}}` was called.

      aView = Ember.View.create({
        template: Ember.Handlebars.compile("{{#view}} my parent: {{parentView.elementId}} {{/view}}")
      })

      aView.appendTo('body')

  Will result in HTML structure:

      <div id="ember1" class="ember-view">
        <div id="ember2" class="ember-view">
          my parent: ember1
        </div>
      </div>

  ### Setting CSS id and class attributes

  The HTML `id` attribute can be set on the `{{view}}`'s resulting element with the `id` option.
  This option will _not_ be passed to `Ember.View.create`.

      <script type="text/x-handlebars">
        {{#view tagName="span" id="a-custom-id"}}
          hello.
        {{/view}}
      </script>

  Results in the following HTML structure:

      <div class="ember-view">
        <span id="a-custom-id" class="ember-view">
          hello.
        </span>
      </div>

  The HTML `class` attribute can be set on the `{{view}}`'s resulting element with
  the `class` or `classNameBindings` options. The `class` option
  will directly set the CSS `class` attribute and will not be passed to
  `Ember.View.create`. `classNameBindings` will be passed to `create` and use
  `Ember.View`'s class name binding functionality:

      <script type="text/x-handlebars">
        {{#view tagName="span" class="a-custom-class"}}
          hello.
        {{/view}}
      </script>

  Results in the following HTML structure:

      <div class="ember-view">
        <span id="ember2" class="ember-view a-custom-class">
          hello.
        </span>
      </div>

  ### Supplying a different view class
  `{{view}}` can take an optional first argument before its supplied options to specify a
  path to a custom view class.

      <script type="text/x-handlebars">
        {{#view "MyApp.CustomView"}}
          hello.
        {{/view}}
      </script>

  The first argument can also be a relative path. Ember will search for the view class
  starting at the `Ember.View` of the template where `{{view}}` was used as the root object:

      MyApp = Ember.Application.create({})
      MyApp.OuterView = Ember.View.extend({
        innerViewClass: Ember.View.extend({
          classNames: ['a-custom-view-class-as-property']
        }),
        template: Ember.Handlebars.compile('{{#view "innerViewClass"}} hi {{/view}}')
      })

      MyApp.OuterView.create().appendTo('body')

Will result in the following HTML:

      <div id="ember1" class="ember-view">
        <div id="ember2" class="ember-view a-custom-view-class-as-property">
          hi
        </div>
      </div>

  ### Blockless use

  If you supply a custom `Ember.View` subclass that specifies its own template
  or provide a `templateName` option to `{{view}}` it can be used without supplying a block.
  Attempts to use both a `templateName` option and supply a block will throw an error.

      <script type="text/x-handlebars">
        {{view "MyApp.ViewWithATemplateDefined"}}
      </script>

  ### viewName property

  You can supply a `viewName` option to `{{view}}`. The `Ember.View` instance will
  be referenced as a property of its parent view by this name.

      aView = Ember.View.create({
        template: Ember.Handlebars.compile('{{#view viewName="aChildByName"}} hi {{/view}}')
      })

      aView.appendTo('body')
      aView.get('aChildByName') // the instance of Ember.View created by {{view}} helper

  @name Handlebars.helpers.view
  @param {String} path
  @param {Hash} options
  @returns {String} HTML string
*/
EmberHandlebars.registerHelper('view', function(path, options) {
  Ember.assert("The view helper only takes a single argument", arguments.length <= 2);

  // If no path is provided, treat path param as options.
  if (path && path.data && path.data.isRenderData) {
    options = path;
    path = "Ember.View";
  }

  return EmberHandlebars.ViewHelper.helper(this, path, options);
});


})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */

// TODO: Don't require all of this module
var get = Ember.get, getPath = Ember.Handlebars.getPath, fmt = Ember.String.fmt;

/**
  `{{collection}}` is a `Ember.Handlebars` helper for adding instances of
  `Ember.CollectionView` to a template.  See `Ember.CollectionView` for additional
  information on how a `CollectionView` functions.

  `{{collection}}`'s primary use is as a block helper with a `contentBinding` option
  pointing towards an `Ember.Array`-compatible object.  An `Ember.View` instance will
  be created for each item in its `content` property. Each view will have its own
  `content` property set to the appropriate item in the collection.

  The provided block will be applied as the template for each item's view.

  Given an empty `<body>` the following template:

      <script type="text/x-handlebars">
        {{#collection contentBinding="App.items"}}
          Hi {{content.name}}
        {{/collection}}
      </script>

  And the following application code

      App = Ember.Application.create()
      App.items = [
        Ember.Object.create({name: 'Dave'}),
        Ember.Object.create({name: 'Mary'}),
        Ember.Object.create({name: 'Sara'})
      ]

  Will result in the HTML structure below

      <div class="ember-view">
        <div class="ember-view">Hi Dave</div>
        <div class="ember-view">Hi Mary</div>
        <div class="ember-view">Hi Sara</div>
      </div>

  ### Blockless Use
  If you provide an `itemViewClass` option that has its own `template` you can omit
  the block.

  The following template:

      <script type="text/x-handlebars">
        {{collection contentBinding="App.items" itemViewClass="App.AnItemView"}}
      </script>

  And application code

      App = Ember.Application.create()
      App.items = [
        Ember.Object.create({name: 'Dave'}),
        Ember.Object.create({name: 'Mary'}),
        Ember.Object.create({name: 'Sara'})
      ]

      App.AnItemView = Ember.View.extend({
        template: Ember.Handlebars.compile("Greetings {{content.name}}")
      })

  Will result in the HTML structure below

      <div class="ember-view">
        <div class="ember-view">Greetings Dave</div>
        <div class="ember-view">Greetings Mary</div>
        <div class="ember-view">Greetings Sara</div>
      </div>

  ### Specifying a CollectionView subclass
  By default the `{{collection}}` helper will create an instance of `Ember.CollectionView`.
  You can supply a `Ember.CollectionView` subclass to the helper by passing it
  as the first argument:

      <script type="text/x-handlebars">
        {{#collection App.MyCustomCollectionClass contentBinding="App.items"}}
          Hi {{content.name}}
        {{/collection}}
      </script>


  ### Forwarded `item.*`-named Options
  As with the `{{view}}`, helper options passed to the `{{collection}}` will be set on
  the resulting `Ember.CollectionView` as properties. Additionally, options prefixed with
  `item` will be applied to the views rendered for each item (note the camelcasing):

        <script type="text/x-handlebars">
          {{#collection contentBinding="App.items"
                        itemTagName="p"
                        itemClassNames="greeting"}}
            Howdy {{content.name}}
          {{/collection}}
        </script>

  Will result in the following HTML structure:

      <div class="ember-view">
        <p class="ember-view greeting">Howdy Dave</p>
        <p class="ember-view greeting">Howdy Mary</p>
        <p class="ember-view greeting">Howdy Sara</p>
      </div>

  @name Handlebars.helpers.collection
  @param {String} path
  @param {Hash} options
  @returns {String} HTML string
*/
Ember.Handlebars.registerHelper('collection', function(path, options) {
  // If no path is provided, treat path param as options.
  if (path && path.data && path.data.isRenderData) {
    options = path;
    path = undefined;
    Ember.assert("You cannot pass more than one argument to the collection helper", arguments.length === 1);
  } else {
    Ember.assert("You cannot pass more than one argument to the collection helper", arguments.length === 2);
  }

  var fn = options.fn;
  var data = options.data;
  var inverse = options.inverse;

  // If passed a path string, convert that into an object.
  // Otherwise, just default to the standard class.
  var collectionClass;
  collectionClass = path ? getPath(this, path, options) : Ember.CollectionView;
  Ember.assert(fmt("%@ #collection: Could not find collection class %@", [data.view, path]), !!collectionClass);

  var hash = options.hash, itemHash = {}, match;

  // Extract item view class if provided else default to the standard class
  var itemViewClass, itemViewPath = hash.itemViewClass;
  var collectionPrototype = collectionClass.proto();
  delete hash.itemViewClass;
  itemViewClass = itemViewPath ? getPath(collectionPrototype, itemViewPath, options) : collectionPrototype.itemViewClass;
  Ember.assert(fmt("%@ #collection: Could not find itemViewClass %@", [data.view, itemViewPath]), !!itemViewClass);

  // Go through options passed to the {{collection}} helper and extract options
  // that configure item views instead of the collection itself.
  for (var prop in hash) {
    if (hash.hasOwnProperty(prop)) {
      match = prop.match(/^item(.)(.*)$/);

      if(match) {
        // Convert itemShouldFoo -> shouldFoo
        itemHash[match[1].toLowerCase() + match[2]] = hash[prop];
        // Delete from hash as this will end up getting passed to the
        // {{view}} helper method.
        delete hash[prop];
      }
    }
  }

  var tagName = hash.tagName || collectionPrototype.tagName;

  if (fn) {
    itemHash.template = fn;
    delete options.fn;
  }

  var emptyViewClass;
  if (inverse && inverse !== Handlebars.VM.noop) {
    emptyViewClass = get(collectionPrototype, 'emptyViewClass');
    emptyViewClass = emptyViewClass.extend({
          template: inverse,
          tagName: itemHash.tagName
    });
  } else if (hash.emptyViewClass) {
    emptyViewClass = getPath(this, hash.emptyViewClass, options);
  }
  hash.emptyView = emptyViewClass;

  if (hash.eachHelper === 'each') {
    itemHash._context = Ember.computed(function() {
      return get(this, 'content');
    }).property('content');
    delete hash.eachHelper;
  }

  var viewOptions = Ember.Handlebars.ViewHelper.propertiesFromHTMLOptions({ data: data, hash: itemHash }, this);
  hash.itemViewClass = itemViewClass.extend(viewOptions);

  return Ember.Handlebars.helpers.view.call(this, collectionClass, options);
});




})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */
var getPath = Ember.Handlebars.getPath;

/**
  `unbound` allows you to output a property without binding. *Important:* The
  output will not be updated if the property changes. Use with caution.

      <div>{{unbound somePropertyThatDoesntChange}}</div>

  @name Handlebars.helpers.unbound
  @param {String} property
  @returns {String} HTML string
*/
Ember.Handlebars.registerHelper('unbound', function(property, fn) {
  var context = (fn.contexts && fn.contexts[0]) || this;
  return getPath(context, property, fn);
});

})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*jshint debug:true*/
var getPath = Ember.Handlebars.getPath, normalizePath = Ember.Handlebars.normalizePath;

/**
  `log` allows you to output the value of a value in the current rendering
  context.

      {{log myVariable}}

  @name Handlebars.helpers.log
  @param {String} property
*/
Ember.Handlebars.registerHelper('log', function(property, options) {
  var context = (options.contexts && options.contexts[0]) || this,
      normalized = normalizePath(context, property, options.data),
      pathRoot = normalized.root,
      path = normalized.path,
      value = (path === 'this') ? pathRoot : getPath(pathRoot, path, options);
  Ember.Logger.log(value);
});

/**
  The `debugger` helper executes the `debugger` statement in the current
  context.

      {{debugger}}

  @name Handlebars.helpers.debugger
  @param {String} property
*/
Ember.Handlebars.registerHelper('debugger', function() {
  debugger;
});

})();



(function() {
var get = Ember.get, set = Ember.set;

Ember.Handlebars.EachView = Ember.CollectionView.extend(Ember._Metamorph, {
  itemViewClass: Ember._MetamorphView,
  emptyViewClass: Ember._MetamorphView,

  createChildView: function(view, attrs) {
    view = this._super(view, attrs);

    // At the moment, if a container view subclass wants
    // to insert keywords, it is responsible for cloning
    // the keywords hash. This will be fixed momentarily.
    var keyword = get(this, 'keyword');

    if (keyword) {
      var data = get(view, 'templateData');

      data = Ember.copy(data);
      data.keywords = view.cloneKeywords();
      set(view, 'templateData', data);

      var content = get(view, 'content');

      // In this case, we do not bind, because the `content` of
      // a #each item cannot change.
      data.keywords[keyword] = content;
    }

    return view;
  }
});

Ember.Handlebars.registerHelper('each', function(path, options) {
  if (arguments.length === 4) {
    Ember.assert("If you pass more than one argument to the each helper, it must be in the form #each foo in bar", arguments[1] === "in");

    var keywordName = arguments[0];

    options = arguments[3];
    path = arguments[2];
    if (path === '') { path = "this"; }

    options.hash.keyword = keywordName;
  } else {
    options.hash.eachHelper = 'each';
  }

  Ember.assert("You must pass a block to the each helper", options.fn && options.fn !== Handlebars.VM.noop);

  options.hash.contentBinding = path;
  // Set up emptyView as a metamorph with no tag
  //options.hash.emptyViewClass = Ember._MetamorphView;

  return Ember.Handlebars.helpers.collection.call(this, 'Ember.Handlebars.EachView', options);
});

})();



(function() {
/**
  `template` allows you to render a template from inside another template.
  This allows you to re-use the same template in multiple places. For example:

      <script type="text/x-handlebars">
        {{#with loggedInUser}}
          Last Login: {{lastLogin}}
          User Info: {{template "user_info"}}
        {{/with}}
      </script>

      <script type="text/x-handlebars" data-template-name="user_info">
        Name: <em>{{name}}</em>
        Karma: <em>{{karma}}</em>
      </script>

  This helper looks for templates in the global Ember.TEMPLATES hash. If you
  add &lt;script&gt; tags to your page with the `data-template-name` attribute set,
  they will be compiled and placed in this hash automatically.

  You can also manually register templates by adding them to the hash:

      Ember.TEMPLATES["my_cool_template"] = Ember.Handlebars.compile('<b>{{user}}</b>');

  @name Handlebars.helpers.template
  @param {String} templateName the template to render
*/

Ember.Handlebars.registerHelper('template', function(name, options) {
  var template = Ember.TEMPLATES[name];

  Ember.assert("Unable to find template with name '"+name+"'.", !!template);

  Ember.TEMPLATES[name](this, { data: options.data });
});

})();



(function() {
var EmberHandlebars = Ember.Handlebars, getPath = EmberHandlebars.getPath, get = Ember.get;

var ActionHelper = EmberHandlebars.ActionHelper = {
  registeredActions: {}
};

ActionHelper.registerAction = function(actionName, eventName, target, view, context) {
  var actionId = (++Ember.$.uuid).toString();

  ActionHelper.registeredActions[actionId] = {
    eventName: eventName,
    handler: function(event) {
      event.view = view;
      event.context = context;

      // Check for StateManager (or compatible object)
      if (target.isState && typeof target.send === 'function') {
        return target.send(actionName, event);
      } else {
        return target[actionName].call(target, event);
      }
    }
  };

  view.on('willRerender', function() {
    delete ActionHelper.registeredActions[actionId];
  });

  return actionId;
};

/**
  The `{{action}}` helper registers an HTML element within a template for
  DOM event handling.  User interaction with that element will call the method
  on the template's associated `Ember.View` instance that has the same name
  as the first provided argument to `{{action}}`:

  Given the following Handlebars template on the page

      <script type="text/x-handlebars" data-template-name='a-template'>
        <div {{action "anActionName"}}>
          click me
        </div>
      </script>

  And application code

      AView = Ember.View.extend({
        templateName; 'a-template',
        anActionName: function(event){}
      });

      aView = AView.create();
      aView.appendTo('body');

  Will results in the following rendered HTML

      <div class="ember-view">
        <div data-ember-action="1">
          click me
        </div>
      </div>

  Clicking "click me" will trigger the `anActionName` method of the `aView`
  object with a  `jQuery.Event` object as its argument. The `jQuery.Event`
  object will be extended to include a `view` property that is set to the
  original view interacted with (in this case the `aView` object).

  ### Event Propagation

  Events triggered through the action helper will automatically have
  `.preventDefault()` called on them. You do not need to do so in your event
  handlers. To stop propagation of the event, simply return `false` from your
  handler.

  If you need the default handler to trigger you should either register your
  own event handler, or use event methods on your view class.

  ### Specifying an Action Target

  A `target` option can be provided to change which object will receive the
  method call. This option must be a string representing a path to an object:

      <script type="text/x-handlebars" data-template-name='a-template'>
        <div {{action "anActionName" target="MyApplication.someObject"}}>
          click me
        </div>
      </script>

  Clicking "click me" in the rendered HTML of the above template will trigger
  the  `anActionName` method of the object at `MyApplication.someObject`.
  The first argument to this method will be a `jQuery.Event` extended to
  include a `view` property that is set to the original view interacted with.

  A path relative to the template's `Ember.View` instance can also be used as
  a target:

      <script type="text/x-handlebars" data-template-name='a-template'>
        <div {{action "anActionName" target="parentView"}}>
          click me
        </div>
      </script>

  Clicking "click me" in the rendered HTML of the above template will trigger
  the `anActionName` method of the view's parent view.

  The `{{action}}` helper is `Ember.StateManager` aware. If the target of the
  action is an `Ember.StateManager` instance `{{action}}` will use the `send`
  functionality of StateManagers. The documentation for `Ember.StateManager`
  has additional information about this use.

  If an action's target does not implement a method that matches the supplied
  action name an error will be thrown.

      <script type="text/x-handlebars" data-template-name='a-template'>
        <div {{action "aMethodNameThatIsMissing"}}>
          click me
        </div>
      </script>

  With the following application code

      AView = Ember.View.extend({
        templateName; 'a-template',
        // note: no method 'aMethodNameThatIsMissing'
        anActionName: function(event){}
      });

      aView = AView.create();
      aView.appendTo('body');

  Will throw `Uncaught TypeError: Cannot call method 'call' of undefined` when
  "click me" is clicked.

  ### Specifying DOM event type

  By default the `{{action}}` helper registers for DOM `click` events. You can
  supply an `on` option to the helper to specify a different DOM event name:

      <script type="text/x-handlebars" data-template-name='a-template'>
        <div {{action "aMethodNameThatIsMissing" on="doubleClick"}}>
          click me
        </div>
      </script>

  See `Ember.EventDispatcher` for a list of acceptable DOM event names.

  Because `{{action}}` depends on Ember's event dispatch system it will only
  function if an `Ember.EventDispatcher` instance is available. An
  `Ember.EventDispatcher` instance will be created when a new
  `Ember.Application` is created. Having an instance of `Ember.Application`
  will satisfy this requirement.

  ### Specifying a context

  By default the `{{action}}` helper passes the current Handlebars context
  along in the `jQuery.Event` object. You may specify an alternative object to
  pass as the context by providing a property path:

      <script type="text/x-handlebars" data-template-name='a-template'>
        {{#each person in people}}
          <div {{action "edit" context="person"}}>
            click me
          </div>
        {{/each}}
      </script>

  @name Handlebars.helpers.action
  @param {String} actionName
  @param {Hash} options
*/
EmberHandlebars.registerHelper('action', function(actionName, options) {
  var hash = options.hash,
      eventName = hash.on || "click",
      view = options.data.view,
      target, context, controller;

  view = get(view, 'concreteView');

  if (hash.target) {
    target = getPath(this, hash.target, options);
  } else if (controller = options.data.keywords.controller) {
    target = get(controller, 'target');
  }

  target = target || view;

  context = hash.context ? getPath(this, hash.context, options) : options.contexts[0];

  var output = [], url;

  if (hash.href && target.urlForEvent) {
    url = target.urlForEvent(actionName, context);
    output.push('href="' + url + '"');
  }

  var actionId = ActionHelper.registerAction(actionName, eventName, target, view, context);
  output.push('data-ember-action="' + actionId + '"');

  return new EmberHandlebars.SafeString(output.join(" "));
});

})();



(function() {
var get = Ember.get, set = Ember.set;

/**

  When used in a Handlebars template that is assigned to an `Ember.View` instance's
  `layout` property Ember will render the layout template first, inserting the view's
  own rendered output at the `{{ yield }}` location.

  An empty `<body>` and the following application code:

      AView = Ember.View.extend({
        classNames: ['a-view-with-layout'],
        layout: Ember.Handlebars.compile('<div class="wrapper">{{ yield }}</div>'),
        template: Ember.Handlebars.compile('<span>I am wrapped</span>')
      })

      aView = AView.create()
      aView.appendTo('body')

  Will result in the following HTML output:

      <body>
        <div class='ember-view a-view-with-layout'>
          <div class="wrapper">
            <span>I am wrapped</span>
          </div>
        </div>
      </body>

  The yield helper cannot be used outside of a template assigned to an `Ember.View`'s `layout` property
  and will throw an error if attempted.

      BView = Ember.View.extend({
        classNames: ['a-view-with-layout'],
        template: Ember.Handlebars.compile('{{yield}}')
      })

      bView = BView.create()
      bView.appendTo('body')

      // throws
      // Uncaught Error: assertion failed: You called yield in a template that was not a layout

  @name Handlebars.helpers.yield
  @param {Hash} options
  @returns {String} HTML string
*/
Ember.Handlebars.registerHelper('yield', function(options) {
  var view = options.data.view, template;

  while (view && !get(view, 'layout')) {
    view = get(view, 'parentView');
  }

  Ember.assert("You called yield in a template that was not a layout", !!view);

  template = get(view, 'template');

  if (template) { template(this, options); }
});

})();



(function() {
/**
  The `outlet` helper allows you to specify that the current
  view's controller will fill in the view for a given area.

      {{outlet}}

  By default, when the the current controller's `view`
  property changes, the outlet will replace its current
  view with the new view.

      controller.set('view', someView);

  You can also specify a particular name, other than view:

      {{outlet masterView}}
      {{outlet detailView}}

  Then, you can control several outlets from a single
  controller:

      controller.set('masterView', postsView);
      controller.set('detailView', postView);

  @name Handlebars.helpers.outlet
  @param {String} property the property on the controller
    that holds the view for this outlet
*/
Ember.Handlebars.registerHelper('outlet', function(property, options) {
  if (property && property.data && property.data.isRenderData) {
    options = property;
    property = 'view';
  }

  options.hash.currentViewBinding = "controller." + property;

  return Ember.Handlebars.helpers.view.call(this, Ember.ContainerView, options);
});

})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var set = Ember.set, get = Ember.get;

/**
  @class

  Creates an HTML input of type 'checkbox' with HTML related properties
  applied directly to the input.

      {{view Ember.Checkbox classNames="applicaton-specific-checkbox"}}

      <input id="ember1" class="ember-view ember-checkbox applicaton-specific-checkbox" type="checkbox">

  You can add a `label` tag yourself in the template where the Ember.Checkbox is being used.

      <label>
        Some Title
        {{view Ember.Checkbox classNames="applicaton-specific-checkbox"}}
      </label>


  The `checked` attribute of an Ember.Checkbox object should always be set
  through the Ember object or by interacting with its rendered element representation
  via the mouse, keyboard, or touch.  Updating the value of the checkbox via jQuery will
  result in the checked value of the object and its element losing synchronization.

  ## Layout and LayoutName properties
  Because HTML `input` elements are self closing `layout` and `layoutName` properties will
  not be applied. See `Ember.View`'s layout section for more information.

*/
Ember.Checkbox = Ember.View.extend({
  classNames: ['ember-checkbox'],

  tagName: 'input',

  attributeBindings: ['type', 'checked', 'disabled'],

  type: "checkbox",
  checked: false,
  disabled: false,

  init: function() {
    this._super();
    this.on("change", this, this._updateElementValue);
  },

  /**
    @private
  */
  _updateElementValue: function() {
    set(this, 'checked', this.$().prop('checked'));
  }
});

})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

/** @class */
Ember.TextSupport = Ember.Mixin.create(
/** @scope Ember.TextSupport.prototype */ {

  value: "",

  attributeBindings: ['placeholder', 'disabled', 'maxlength'],
  placeholder: null,
  disabled: false,
  maxlength: null,

  insertNewline: Ember.K,
  cancel: Ember.K,

  init: function() {
    this._super();
    this.on("focusOut", this, this._elementValueDidChange);
    this.on("change", this, this._elementValueDidChange);
    this.on("keyUp", this, this.interpretKeyEvents);
  },

  /**
    @private
  */
  interpretKeyEvents: function(event) {
    var map = Ember.TextSupport.KEY_EVENTS;
    var method = map[event.keyCode];

    this._elementValueDidChange();
    if (method) { return this[method](event); }
  },

  _elementValueDidChange: function() {
    set(this, 'value', this.$().val());
  }

});

Ember.TextSupport.KEY_EVENTS = {
  13: 'insertNewline',
  27: 'cancel'
};

})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

/**
  @class

  The `Ember.TextField` view class renders a text
  [input](https://developer.mozilla.org/en/HTML/Element/Input) element. It
  allows for binding Ember properties to the text field contents (`value`),
  live-updating as the user inputs text.

  Example:

      {{view Ember.TextField valueBinding="firstName"}}

  ## Layout and LayoutName properties
  Because HTML `input` elements are self closing `layout` and `layoutName` properties will
  not be applied. See `Ember.View`'s layout section for more information.

  @extends Ember.TextSupport
*/
Ember.TextField = Ember.View.extend(Ember.TextSupport,
  /** @scope Ember.TextField.prototype */ {

  classNames: ['ember-text-field'],
  tagName: "input",
  attributeBindings: ['type', 'value', 'size'],

  /**
    The value attribute of the input element. As the user inputs text, this
    property is updated live.

    @type String
    @default ""
  */
  value: "",

  /**
    The type attribute of the input element.

    @type String
    @default "text"
  */
  type: "text",

  /**
    The size of the text field in characters.

    @type String
    @default null
  */
  size: null
});

})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

Ember.Button = Ember.View.extend(Ember.TargetActionSupport, {
  classNames: ['ember-button'],
  classNameBindings: ['isActive'],

  tagName: 'button',

  propagateEvents: false,

  attributeBindings: ['type', 'disabled', 'href'],

  /** @private
    Overrides TargetActionSupport's targetObject computed
    property to use Handlebars-specific path resolution.
  */
  targetObject: Ember.computed(function() {
    var target = get(this, 'target'),
        root = get(this, 'context'),
        data = get(this, 'templateData');

    if (typeof target !== 'string') { return target; }

    return Ember.Handlebars.getPath(root, target, { data: data });
  }).property('target').cacheable(),

  // Defaults to 'button' if tagName is 'input' or 'button'
  type: Ember.computed(function(key, value) {
    var tagName = this.get('tagName');
    if (value !== undefined) { this._type = value; }
    if (this._type !== undefined) { return this._type; }
    if (tagName === 'input' || tagName === 'button') { return 'button'; }
  }).property('tagName').cacheable(),

  disabled: false,

  // Allow 'a' tags to act like buttons
  href: Ember.computed(function() {
    return this.get('tagName') === 'a' ? '#' : null;
  }).property('tagName').cacheable(),

  mouseDown: function() {
    if (!get(this, 'disabled')) {
      set(this, 'isActive', true);
      this._mouseDown = true;
      this._mouseEntered = true;
    }
    return get(this, 'propagateEvents');
  },

  mouseLeave: function() {
    if (this._mouseDown) {
      set(this, 'isActive', false);
      this._mouseEntered = false;
    }
  },

  mouseEnter: function() {
    if (this._mouseDown) {
      set(this, 'isActive', true);
      this._mouseEntered = true;
    }
  },

  mouseUp: function(event) {
    if (get(this, 'isActive')) {
      // Actually invoke the button's target and action.
      // This method comes from the Ember.TargetActionSupport mixin.
      this.triggerAction();
      set(this, 'isActive', false);
    }

    this._mouseDown = false;
    this._mouseEntered = false;
    return get(this, 'propagateEvents');
  },

  keyDown: function(event) {
    // Handle space or enter
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.mouseDown();
    }
  },

  keyUp: function(event) {
    // Handle space or enter
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.mouseUp();
    }
  },

  // TODO: Handle proper touch behavior.  Including should make inactive when
  // finger moves more than 20x outside of the edge of the button (vs mouse
  // which goes inactive as soon as mouse goes out of edges.)

  touchStart: function(touch) {
    return this.mouseDown(touch);
  },

  touchEnd: function(touch) {
    return this.mouseUp(touch);
  },

  init: function() {
    Ember.deprecate("Ember.Button is deprecated and will be removed from future releases. Consider using the `{{action}}` helper.");
    this._super();
  }
});

})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

/**
  @class

  The `Ember.TextArea` view class renders a
  [textarea](https://developer.mozilla.org/en/HTML/Element/textarea) element.
  It allows for binding Ember properties to the text area contents (`value`),
  live-updating as the user inputs text.

  ## Layout and LayoutName properties

  Because HTML `textarea` elements do not contain inner HTML the `layout` and `layoutName`
  properties will not be applied. See `Ember.View`'s layout section for more information.

  @extends Ember.TextSupport
*/
Ember.TextArea = Ember.View.extend(Ember.TextSupport,
/** @scope Ember.TextArea.prototype */ {

  classNames: ['ember-text-area'],

  tagName: "textarea",
  attributeBindings: ['rows', 'cols'],
  rows: null,
  cols: null,

  _updateElementValue: Ember.observer(function() {
    this.$().val(get(this, 'value'));
  }, 'value'),

  init: function() {
    this._super();
    this.on("didInsertElement", this, this._updateElementValue);
  }

});

})();



(function() {
Ember.TabContainerView = Ember.View.extend();

})();



(function() {
var get = Ember.get, getPath = Ember.getPath;

Ember.TabPaneView = Ember.View.extend({
  tabsContainer: Ember.computed(function() {
    return this.nearestInstanceOf(Ember.TabContainerView);
  }).property().volatile(),

  isVisible: Ember.computed(function() {
    return get(this, 'viewName') === getPath(this, 'tabsContainer.currentView');
  }).property('tabsContainer.currentView').volatile()
});

})();



(function() {
var get = Ember.get, setPath = Ember.setPath;

Ember.TabView = Ember.View.extend({
  tabsContainer: Ember.computed(function() {
    return this.nearestInstanceOf(Ember.TabContainerView);
  }).property().volatile(),

  mouseUp: function() {
    setPath(this, 'tabsContainer.currentView', get(this, 'value'));
  }
});

})();



(function() {

})();



(function() {
/*jshint eqeqeq:false */

var set = Ember.set, get = Ember.get, getPath = Ember.getPath;
var indexOf = Ember.EnumerableUtils.indexOf, indexesOf = Ember.EnumerableUtils.indexesOf;

/**
  @class

  The Ember.Select view class renders a
  [select](https://developer.mozilla.org/en/HTML/Element/select) HTML element,
  allowing the user to choose from a list of options. The selected option(s)
  are updated live in the `selection` property.

  @extends Ember.View
*/
Ember.Select = Ember.View.extend(
  /** @scope Ember.Select.prototype */ {

  tagName: 'select',
  classNames: ['ember-select'],
  defaultTemplate: Ember.Handlebars.compile('{{#if view.prompt}}<option value>{{view.prompt}}</option>{{/if}}{{#each view.content}}{{view Ember.SelectOption contentBinding="this"}}{{/each}}'),
  attributeBindings: ['multiple'],

  /**
    The `multiple` attribute of the select element. Indicates whether multiple
    options can be selected.

    @type Boolean
    @default false
  */
  multiple: false,

  /**
    The list of options.

    If `optionLabelPath` and `optionValuePath` are not overridden, this should
    be a list of strings, which will serve simultaneously as labels and values.

    Otherwise, this should be a list of objects. For instance:

        content: Ember.A([
            { id: 1, firstName: 'Yehuda' },
            { id: 2, firstName: 'Tom' }
          ])),
        optionLabelPath: 'content.firstName',
        optionValuePath: 'content.id'

    @type Array
    @default null
  */
  content: null,

  /**
    When `multiple` is false, the element of `content` that is currently
    selected, if any.

    When `multiple` is true, an array of such elements.

    @type Object or Array
    @default null
  */
  selection: null,

  /**
    In single selection mode (when `multiple` is false), value can be used to get
    the current selection's value or set the selection by it's value.

    It is not currently supported in multiple selection mode.

    @type String
    @default null
  */
  value: Ember.computed(function(key, value) {
    if (arguments.length === 2) { return value; }

    var valuePath = get(this, 'optionValuePath').replace(/^content\.?/, '');
    return valuePath ? getPath(this, 'selection.' + valuePath) : get(this, 'selection');
  }).property('selection').cacheable(),

  /**
    If given, a top-most dummy option will be rendered to serve as a user
    prompt.

    @type String
    @default null
  */
  prompt: null,

  /**
    The path of the option labels. See `content`.

    @type String
    @default 'content'
  */
  optionLabelPath: 'content',

  /**
    The path of the option values. See `content`.

    @type String
    @default 'content'
  */
  optionValuePath: 'content',

  _change: function() {
    if (get(this, 'multiple')) {
      this._changeMultiple();
    } else {
      this._changeSingle();
    }
  },

  selectionDidChange: Ember.observer(function() {
    var selection = get(this, 'selection'),
        isArray = Ember.isArray(selection);
    if (get(this, 'multiple')) {
      if (!isArray) {
        set(this, 'selection', Ember.A([selection]));
        return;
      }
      this._selectionDidChangeMultiple();
    } else {
      this._selectionDidChangeSingle();
    }
  }, 'selection'),

  valueDidChange: Ember.observer(function() {
    var content = get(this, 'content'),
        value = get(this, 'value'),
        valuePath = get(this, 'optionValuePath').replace(/^content\.?/, ''),
        selectedValue = (valuePath ? getPath(this, 'selection.' + valuePath) : get(this, 'selection')),
        selection;

    if (value !== selectedValue) {
      selection = content.find(function(obj) {
        return value === (valuePath ? get(obj, valuePath) : obj);
      });

      this.set('selection', selection);
    }
  }, 'value'),


  _triggerChange: function() {
    var selection = get(this, 'selection');

    if (selection) { this.selectionDidChange(); }

    this._change();
  },

  _changeSingle: function() {
    var selectedIndex = this.$()[0].selectedIndex,
        content = get(this, 'content'),
        prompt = get(this, 'prompt');

    if (!content) { return; }
    if (prompt && selectedIndex === 0) { set(this, 'selection', null); return; }

    if (prompt) { selectedIndex -= 1; }
    set(this, 'selection', content.objectAt(selectedIndex));
  },

  _changeMultiple: function() {
    var options = this.$('option:selected'),
        prompt = get(this, 'prompt'),
        offset = prompt ? 1 : 0,
        content = get(this, 'content');

    if (!content){ return; }
    if (options) {
      var selectedIndexes = options.map(function(){
        return this.index - offset;
      }).toArray();
      set(this, 'selection', content.objectsAt(selectedIndexes));
    }
  },

  _selectionDidChangeSingle: function() {
    var el = this.$()[0],
        content = get(this, 'content'),
        selection = get(this, 'selection'),
        selectionIndex = content ? indexOf(content, selection) : -1,
        prompt = get(this, 'prompt');

    if (prompt) { selectionIndex += 1; }
    if (el) { el.selectedIndex = selectionIndex; }
  },

  _selectionDidChangeMultiple: function() {
    var content = get(this, 'content'),
        selection = get(this, 'selection'),
        selectedIndexes = content ? indexesOf(content, selection) : [-1],
        prompt = get(this, 'prompt'),
        offset = prompt ? 1 : 0,
        options = this.$('option'),
        adjusted;

    if (options) {
      options.each(function() {
        adjusted = this.index > -1 ? this.index + offset : -1;
        this.selected = indexOf(selectedIndexes, adjusted) > -1;
      });
    }
  },

  init: function() {
    this._super();
    this.on("didInsertElement", this, this._triggerChange);
    this.on("change", this, this._change);
  }
});

Ember.SelectOption = Ember.View.extend({
  tagName: 'option',
  attributeBindings: ['value', 'selected'],

  defaultTemplate: function(context, options) {
    options = { data: options.data, hash: {} };
    Ember.Handlebars.helpers.bind.call(context, "view.label", options);
  },

  init: function() {
    this.labelPathDidChange();
    this.valuePathDidChange();

    this._super();
  },

  selected: Ember.computed(function() {
    var content = get(this, 'content'),
        selection = getPath(this, 'parentView.selection');
    if (getPath(this, 'parentView.multiple')) {
      return selection && indexOf(selection, content) > -1;
    } else {
      // Primitives get passed through bindings as objects... since
      // `new Number(4) !== 4`, we use `==` below
      return content == selection;
    }
  }).property('content', 'parentView.selection').volatile(),

  labelPathDidChange: Ember.observer(function() {
    var labelPath = getPath(this, 'parentView.optionLabelPath');

    if (!labelPath) { return; }

    Ember.defineProperty(this, 'label', Ember.computed(function() {
      return getPath(this, labelPath);
    }).property(labelPath).cacheable());
  }, 'parentView.optionLabelPath'),

  valuePathDidChange: Ember.observer(function() {
    var valuePath = getPath(this, 'parentView.optionValuePath');

    if (!valuePath) { return; }

    Ember.defineProperty(this, 'value', Ember.computed(function() {
      return getPath(this, valuePath);
    }).property(valuePath).cacheable());
  }, 'parentView.optionValuePath')
});


})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */
// Find templates stored in the head tag as script tags and make them available
// to Ember.CoreView in the global Ember.TEMPLATES object. This will be run as as
// jQuery DOM-ready callback.
//
// Script tags with "text/x-handlebars" will be compiled
// with Ember's Handlebars and are suitable for use as a view's template.
// Those with type="text/x-raw-handlebars" will be compiled with regular
// Handlebars and are suitable for use in views' computed properties.
Ember.Handlebars.bootstrap = function(ctx) {
  var selectors = 'script[type="text/x-handlebars"], script[type="text/x-raw-handlebars"]';

  if (Ember.ENV.LEGACY_HANDLEBARS_TAGS) { selectors += ', script[type="text/html"]'; }

  Ember.warn("Ember no longer parses text/html script tags by default. Set ENV.LEGACY_HANDLEBARS_TAGS = true to restore this functionality.", Ember.ENV.LEGACY_HANDLEBARS_TAGS || Ember.$('script[type="text/html"]').length === 0);

  Ember.$(selectors, ctx)
    .each(function() {
    // Get a reference to the script tag
    var script = Ember.$(this),
        type   = script.attr('type');

    var compile = (script.attr('type') === 'text/x-raw-handlebars') ?
                  Ember.$.proxy(Handlebars.compile, Handlebars) :
                  Ember.$.proxy(Ember.Handlebars.compile, Ember.Handlebars),
      // Get the name of the script, used by Ember.View's templateName property.
      // First look for data-template-name attribute, then fall back to its
      // id if no name is found.
      templateName = script.attr('data-template-name') || script.attr('id'),
      template = compile(script.html()),
      view, viewPath, elementId, tagName, options;

    if (templateName) {
      // For templates which have a name, we save them and then remove them from the DOM
      Ember.TEMPLATES[templateName] = template;

      // Remove script tag from DOM
      script.remove();
    } else {
      if (script.parents('head').length !== 0) {
        // don't allow inline templates in the head
        throw new Ember.Error("Template found in <head> without a name specified. " +
                         "Please provide a data-template-name attribute.\n" +
                         script.html());
      }

      // For templates which will be evaluated inline in the HTML document, instantiates a new
      // view, and replaces the script tag holding the template with the new
      // view's DOM representation.
      //
      // Users can optionally specify a custom view subclass to use by setting the
      // data-view attribute of the script tag.
      viewPath = script.attr('data-view');
      view = viewPath ? Ember.getPath(viewPath) : Ember.View;

      // Get the id of the script, used by Ember.View's elementId property,
      // Look for data-element-id attribute.
      elementId = script.attr('data-element-id');

      // Users can optionally specify a custom tag name to use by setting the
      // data-tag-name attribute on the script tag.
      tagName = script.attr('data-tag-name');

      options = { template: template };
      if (elementId) { options.elementId = elementId; }
      if (tagName)   { options.tagName   = tagName; }

      view = view.create(options);

      view._insertElementLater(function() {
        script.replaceWith(this.$());

        // Avoid memory leak in IE
        script = null;
      });
    }
  });
};

Ember.$(document).ready(
  function(){
    Ember.Handlebars.bootstrap( Ember.$(document) );
  }
);

})();



(function() {
// ==========================================================================
// Project:   Ember Handlebars Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();

// Version: v0.9.8.1-437-g68d406e
// Last commit: 68d406e (2012-06-25 14:59:55 -0700)


(function() {
// ==========================================================================
// Project:   Ember
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();

(function() {
window.DS = Ember.Namespace.create({
  CURRENT_API_REVISION: 4
});

})();



(function() {
var get = Ember.get, set = Ember.set;

/**
  A record array is an array that contains records of a certain type. The record
  array materializes records as needed when they are retrieved for the first
  time. You should not create record arrays yourself. Instead, an instance of
  DS.RecordArray or its subclasses will be returned by your application's store
  in response to queries.
*/

DS.RecordArray = Ember.ArrayProxy.extend({

  /**
    The model type contained by this record array.

    @type DS.Model
  */
  type: null,

  // The array of client ids backing the record array. When a
  // record is requested from the record array, the record
  // for the client id at the same index is materialized, if
  // necessary, by the store.
  content: null,

  // The store that created this record array.
  store: null,

  objectAtContent: function(index) {
    var content = get(this, 'content'),
        clientId = content.objectAt(index),
        store = get(this, 'store');

    if (clientId !== undefined) {
      return store.findByClientId(get(this, 'type'), clientId);
    }
  }
});

})();



(function() {
var get = Ember.get;

DS.FilteredRecordArray = DS.RecordArray.extend({
  filterFunction: null,

  replace: function() {
    var type = get(this, 'type').toString();
    throw new Error("The result of a client-side filter (on " + type + ") is immutable.");
  },

  updateFilter: Ember.observer(function() {
    var store = get(this, 'store');
    store.updateRecordArrayFilter(this, get(this, 'type'), get(this, 'filterFunction'));
  }, 'filterFunction')
});

})();



(function() {
var get = Ember.get, set = Ember.set;

DS.AdapterPopulatedRecordArray = DS.RecordArray.extend({
  query: null,
  isLoaded: false,

  replace: function() {
    var type = get(this, 'type').toString();
    throw new Error("The result of a server query (on " + type + ") is immutable.");
  },

  load: function(array) {
    var store = get(this, 'store'), type = get(this, 'type');

    var clientIds = store.loadMany(type, array).clientIds;

    this.beginPropertyChanges();
    set(this, 'content', Ember.A(clientIds));
    set(this, 'isLoaded', true);
    this.endPropertyChanges();
  }
});


})();



(function() {
var get = Ember.get, set = Ember.set, getPath = Ember.getPath, guidFor = Ember.guidFor;

var Set = function() {
  this.hash = {};
  this.list = [];
};

Set.prototype = {
  add: function(item) {
    var hash = this.hash,
        guid = guidFor(item);

    if (hash.hasOwnProperty(guid)) { return; }

    hash[guid] = true;
    this.list.push(item);
  },

  remove: function(item) {
    var hash = this.hash,
        guid = guidFor(item);

    if (!hash.hasOwnProperty(guid)) { return; }

    delete hash[guid];
    var list = this.list,
        index = Ember.EnumerableUtils.indexOf(this, item);

    list.splice(index, 1);
  },

  isEmpty: function() {
    return this.list.length === 0;
  }
};

var LoadedState = Ember.State.extend({
  recordWasAdded: function(manager, record) {
    var dirty = manager.dirty, observer;
    dirty.add(record);

    observer = function() {
      if (!get(record, 'isDirty')) {
        record.removeObserver('isDirty', observer);
        manager.send('childWasSaved', record);
      }
    };

    record.addObserver('isDirty', observer);
  },

  recordWasRemoved: function(manager, record) {
    var dirty = manager.dirty, observer;
    dirty.add(record);

    observer = function() {
      record.removeObserver('isDirty', observer);
      if (!get(record, 'isDirty')) { manager.send('childWasSaved', record); }
    };

    record.addObserver('isDirty', observer);
  }
});

var states = {
  loading: Ember.State.create({
    isLoaded: false,
    isDirty: false,

    loadedRecords: function(manager, count) {
      manager.decrement(count);
    },

    becameLoaded: function(manager) {
      manager.transitionTo('clean');
    }
  }),

  clean: LoadedState.create({
    isLoaded: true,
    isDirty: false,

    recordWasAdded: function(manager, record) {
      this._super(manager, record);
      manager.goToState('dirty');
    },

    update: function(manager, clientIds) {
      var manyArray = manager.manyArray;
      set(manyArray, 'content', clientIds);
    }
  }),

  dirty: LoadedState.create({
    isLoaded: true,
    isDirty: true,

    childWasSaved: function(manager, child) {
      var dirty = manager.dirty;
      dirty.remove(child);

      if (dirty.isEmpty()) { manager.send('arrayBecameSaved'); }
    },

    arrayBecameSaved: function(manager) {
      manager.goToState('clean');
    }
  })
};

DS.ManyArrayStateManager = Ember.StateManager.extend({
  manyArray: null,
  initialState: 'loading',
  states: states,

  /**
   This number is used to keep track of the number of outstanding
   records that must be loaded before the array is considered
   loaded. As results stream in, this number is decremented until
   it becomes zero, at which case the `isLoaded` flag will be set
   to true
  */
  counter: 0,

  init: function() {
    this._super();
    this.dirty = new Set();
    this.counter = getPath(this, 'manyArray.length');
  },

  decrement: function(count) {
    var counter = this.counter = this.counter - count;

    Ember.assert("Somehow the ManyArray loaded counter went below 0. This is probably an ember-data bug. Please report it at https://github.com/emberjs/data/issues", counter >= 0);

    if (counter === 0) {
      this.send('becameLoaded');
    }
  }
});

})();



(function() {
var get = Ember.get, set = Ember.set, getPath = Ember.getPath, setPath = Ember.setPath;

DS.ManyArray = DS.RecordArray.extend({
  init: function() {
    set(this, 'stateManager', DS.ManyArrayStateManager.create({ manyArray: this }));

    return this._super();
  },

  parentRecord: null,

  isDirty: Ember.computed(function() {
    return getPath(this, 'stateManager.currentState.isDirty');
  }).property('stateManager.currentState').cacheable(),

  isLoaded: Ember.computed(function() {
    return getPath(this, 'stateManager.currentState.isLoaded');
  }).property('stateManager.currentState').cacheable(),

  send: function(event, context) {
    this.get('stateManager').send(event, context);
  },

  fetch: function() {
    var clientIds = get(this, 'content'),
        store = get(this, 'store'),
        type = get(this, 'type');

    store.fetchUnloadedClientIds(type, clientIds);
  },

  // Overrides Ember.Array's replace method to implement
  replaceContent: function(index, removed, added) {
    var parentRecord = get(this, 'parentRecord');
    var pendingParent = parentRecord && !get(parentRecord, 'id');
    var stateManager = get(this, 'stateManager');

    // Map the array of record objects into an array of  client ids.
    added = added.map(function(record) {
      Ember.assert("You can only add records of " + (get(this, 'type') && get(this, 'type').toString()) + " to this association.", !get(this, 'type') || (get(this, 'type') === record.constructor));

      // If the record to which this many array belongs does not yet
      // have an id, notify the newly-added record that it must wait
      // for the parent to receive an id before the child can be
      // saved.
      if (pendingParent) {
        record.send('waitingOn', parentRecord);
      }

      var oldParent = this.assignInverse(record, parentRecord);

      record.get('transaction')
        .relationshipBecameDirty(record, oldParent, parentRecord);

      stateManager.send('recordWasAdded', record);

      return record.get('clientId');
    }, this);

    var store = this.store;

    var len = index+removed, record;
    for (var i = index; i < len; i++) {
      // TODO: null out inverse FK
      record = this.objectAt(i);
      var oldParent = this.assignInverse(record, parentRecord, true);

      record.get('transaction')
        .relationshipBecameDirty(record, parentRecord, null);

      // If we put the child record into a pending state because
      // we were waiting on the parent record to get an id, we
      // can tell the child it no longer needs to wait.
      if (pendingParent) {
        record.send('doneWaitingOn', parentRecord);
      }

      stateManager.send('recordWasAdded', record);
    }

    this._super(index, removed, added);
  },

  assignInverse: function(record, parentRecord, remove) {
    var associationMap = get(record.constructor, 'associations'),
        possibleAssociations = associationMap.get(parentRecord.constructor),
        possible, actual, oldParent;

    if (!possibleAssociations) { return; }

    for (var i = 0, l = possibleAssociations.length; i < l; i++) {
      possible = possibleAssociations[i];

      if (possible.kind === 'belongsTo') {
        actual = possible;
        break;
      }
    }

    if (actual) {
      oldParent = get(record, actual.name);
      set(record, actual.name, remove ? null : parentRecord);
      return oldParent;
    }
  },

  // Create a child record within the parentRecord
  createRecord: function(hash, transaction) {
    var parentRecord = get(this, 'parentRecord'),
        store = get(parentRecord, 'store'),
        type = get(this, 'type'),
        record;

    transaction = transaction || get(parentRecord, 'transaction');

    record = store.createRecord.call(store, type, hash, transaction);
    this.pushObject(record);

    return record;
  }
});

})();



(function() {

})();



(function() {
var get = Ember.get, set = Ember.set, getPath = Ember.getPath, fmt = Ember.String.fmt,
    removeObject = Ember.EnumerableUtils.removeObject;

/**
  A transaction allows you to collect multiple records into a unit of work
  that can be committed or rolled back as a group.

  For example, if a record has local modifications that have not yet
  been saved, calling `commit()` on its transaction will cause those
  modifications to be sent to the adapter to be saved. Calling
  `rollback()` on its transaction would cause all of the modifications to
  be discarded and the record to return to the last known state before
  changes were made.

  If a newly created record's transaction is rolled back, it will
  immediately transition to the deleted state.

  If you do not explicitly create a transaction, a record is assigned to
  an implicit transaction called the default transaction. In these cases,
  you can treat your application's instance of `DS.Store` as a transaction
  and call the `commit()` and `rollback()` methods on the store itself.

  Once a record has been successfully committed or rolled back, it will
  be moved back to the implicit transaction. Because it will now be in
  a clean state, it can be moved to a new transaction if you wish.

  ### Creating a Transaction

  To create a new transaction, call the `transaction()` method of your
  application's `DS.Store` instance:

      var transaction = App.store.transaction();

  This will return a new instance of `DS.Transaction` with no records
  yet assigned to it.

  ### Adding Existing Records

  Add records to a transaction using the `add()` method:

      record = App.store.find(Person, 1);
      transaction.add(record);

  Note that only records whose `isDirty` flag is `false` may be added
  to a transaction. Once modifications to a record have been made
  (its `isDirty` flag is `true`), it is not longer able to be added to
  a transaction.

  ### Creating New Records

  Because newly created records are dirty from the time they are created,
  and because dirty records can not be added to a transaction, you must
  use the `createRecord()` method to assign new records to a transaction.

  For example, instead of this:

    var transaction = store.transaction();
    var person = Person.createRecord({ name: "Steve" });

    // won't work because person is dirty
    transaction.add(person);

  Call `createRecord()` on the transaction directly:

    var transaction = store.transaction();
    transaction.createRecord(Person, { name: "Steve" });

  ### Asynchronous Commits

  Typically, all of the records in a transaction will be committed
  together. However, new records that have a dependency on other new
  records need to wait for their parent record to be saved and assigned an
  ID. In that case, the child record will continue to live in the
  transaction until its parent is saved, at which time the transaction will
  attempt to commit again.

  For this reason, you should not re-use transactions once you have committed
  them. Always make a new transaction and move the desired records to it before
  calling commit.
*/

DS.Transaction = Ember.Object.extend({
  /**
    @private

    Creates the bucket data structure used to segregate records by
    type.
  */
  init: function() {
    set(this, 'buckets', {
      clean:    Ember.Map.create(),
      created:  Ember.Map.create(),
      updated:  Ember.Map.create(),
      deleted:  Ember.Map.create(),
      inflight: Ember.Map.create()
    });

    this.dirtyRelationships = {
      byChild: Ember.Map.create(),
      byNewParent: Ember.Map.create(),
      byOldParent: Ember.Map.create()
    };
  },

  /**
    Creates a new record of the given type and assigns it to the transaction
    on which the method was called.

    This is useful as only clean records can be added to a transaction and
    new records created using other methods immediately become dirty.

    @param {DS.Model} type the model type to create
    @param {Object} hash the data hash to assign the new record
  */
  createRecord: function(type, hash) {
    var store = get(this, 'store');

    return store.createRecord(type, hash, this);
  },

  /**
    Adds an existing record to this transaction. Only records without
    modficiations (i.e., records whose `isDirty` property is `false`)
    can be added to a transaction.

    @param {DS.Model} record the record to add to the transaction
  */
  add: function(record) {
    // we could probably make this work if someone has a valid use case. Do you?
    Ember.assert("Once a record has changed, you cannot move it into a different transaction", !get(record, 'isDirty'));

    var recordTransaction = get(record, 'transaction'),
        defaultTransaction = getPath(this, 'store.defaultTransaction');

    Ember.assert("Models cannot belong to more than one transaction at a time.", recordTransaction === defaultTransaction);

    this.adoptRecord(record);
  },

  /**
    Commits the transaction, which causes all of the modified records that
    belong to the transaction to be sent to the adapter to be saved.

    Once you call `commit()` on a transaction, you should not re-use it.

    When a record is saved, it will be removed from this transaction and
    moved back to the store's default transaction.
  */
  commit: function() {
    var self = this,
        iterate;

    iterate = function(bucketType, fn, binding) {
      var dirty = self.bucketForType(bucketType);

      dirty.forEach(function(type, records) {
        if (records.isEmpty()) { return; }

        var array = [];

        records.forEach(function(record) {
          record.send('willCommit');

          if (get(record, 'isPending') === false) {
            array.push(record);
          }
        });

        fn.call(binding, type, array);
      });
    };

    var commitDetails = {
      updated: {
        eachType: function(fn, binding) { iterate('updated', fn, binding); }
      },

      created: {
        eachType: function(fn, binding) { iterate('created', fn, binding); }
      },

      deleted: {
        eachType: function(fn, binding) { iterate('deleted', fn, binding); }
      }
    };

    var store = get(this, 'store');
    var adapter = get(store, '_adapter');

    this.removeCleanRecords();

    if (adapter && adapter.commit) { adapter.commit(store, commitDetails); }
    else { throw fmt("Adapter is either null or does not implement `commit` method", this); }
  },

  /**
    Rolling back a transaction resets the records that belong to
    that transaction.

    Updated records have their properties reset to the last known
    value from the persistence layer. Deleted records are reverted
    to a clean, non-deleted state. Newly created records immediately
    become deleted, and are not sent to the adapter to be persisted.

    After the transaction is rolled back, any records that belong
    to it will return to the store's default transaction, and the
    current transaction should not be used again.
  */
  rollback: function() {
    var store = get(this, 'store'),
        dirty;

    // Loop through all of the records in each of the dirty states
    // and initiate a rollback on them. As a side effect of telling
    // the record to roll back, it should also move itself out of
    // the dirty bucket and into the clean bucket.
    ['created', 'updated', 'deleted', 'inflight'].forEach(function(bucketType) {
      dirty = this.bucketForType(bucketType);

      dirty.forEach(function(type, records) {
        records.forEach(function(record) {
          record.send('rollback');
        });
      });
    }, this);

    // Now that all records in the transaction are guaranteed to be
    // clean, migrate them all to the store's default transaction.
    this.removeCleanRecords();
  },

  /**
    @private

    Removes a record from this transaction and back to the store's
    default transaction.

    Note: This method is private for now, but should probably be exposed
    in the future once we have stricter error checking (for example, in the
    case of the record being dirty).

    @param {DS.Model} record
  */
  remove: function(record) {
    var defaultTransaction = getPath(this, 'store.defaultTransaction');
    defaultTransaction.adoptRecord(record);
  },

  /**
    @private

    Removes all of the records in the transaction's clean bucket.
  */
  removeCleanRecords: function() {
    var clean = this.bucketForType('clean'),
        self = this;

    clean.forEach(function(type, records) {
      records.forEach(function(record) {
        self.remove(record);
      });
    });
  },

  /**
    @private

    Returns the bucket for the given bucket type. For example, you might call
    `this.bucketForType('updated')` to get the `Ember.Map` that contains all
    of the records that have changes pending.

    @param {String} bucketType the type of bucket
    @returns Ember.Map
  */
  bucketForType: function(bucketType) {
    var buckets = get(this, 'buckets');

    return get(buckets, bucketType);
  },

  /**
    @private

    This method moves a record into a different transaction without the normal
    checks that ensure that the user is not doing something weird, like moving
    a dirty record into a new transaction.

    It is designed for internal use, such as when we are moving a clean record
    into a new transaction when the transaction is committed.

    This method must not be called unless the record is clean.

    @param {DS.Model} record
  */
  adoptRecord: function(record) {
    var oldTransaction = get(record, 'transaction');

    if (oldTransaction) {
      oldTransaction.removeFromBucket('clean', record);
    }

    this.addToBucket('clean', record);
    set(record, 'transaction', this);
  },

  /**
    @private

    Adds a record to the named bucket.

    @param {String} bucketType one of `clean`, `created`, `updated`, or `deleted`
  */
  addToBucket: function(bucketType, record) {
    var bucket = this.bucketForType(bucketType),
        type = record.constructor;

    var records = bucket.get(type);

    if (!records) {
      records = Ember.OrderedSet.create();
      bucket.set(type, records);
    }

    records.add(record);
  },

  /**
    @private

    Removes a record from the named bucket.

    @param {String} bucketType one of `clean`, `created`, `updated`, or `deleted`
  */
  removeFromBucket: function(bucketType, record) {
    var bucket = this.bucketForType(bucketType),
        type = record.constructor;

    var records = bucket.get(type);
    records.remove(record);
  },

  /**
    @private

    Called by a ManyArray when a new record is added to it. This
    method will index a relationship description by the child
    record, its old parent, and its new parent.

    The store will provide this description to the adapter's
    shouldCommit method, so it can determine whether any of
    the records is pending another record. The store will also
    provide a list of these descriptions to the adapter's commit
    method.

    @param {DS.Model} record the new child record
    @param {DS.Model} oldParent the parent that the child is
      moving from, or null
    @param {DS.Model} newParent the parent that the child is
      moving to, or null
  */
  relationshipBecameDirty: function(child, oldParent, newParent) {
    var relationships = this.dirtyRelationships, relationship;

    var relationshipsForChild = relationships.byChild.get(child),
        possibleRelationship,
        needsNewEntries = true;

    // If the child has any existing dirty relationships in this
    // transaction, we need to collapse the old relationship
    // into the new one. For example, if we change the parent of
    // a child record before saving, there is no need to save the
    // record that was its parent temporarily.
    if (relationshipsForChild) {

      // Loop through all of the relationships we know about that
      // contain the same child as the new relationship.
      for (var i=0, l=relationshipsForChild.length; i<l; i++) {
        relationship = relationshipsForChild[i];

        // If the parent of the child record has changed, there is
        // no need to update the old parent that had not yet been saved.
        //
        // This case is two changes in a record's parent:
        //
        //   A -> B
        //   B -> C
        //
        // In this case, there is no need to remember the A->B
        // change. We can collapse both changes into:
        //
        //   A -> C
        //
        // Another possible case is:
        //
        //   A -> B
        //   B -> A
        //
        // In this case, we don't need to do anything. We can
        // simply remove the original A->B change and call it
        // a day.
        if (relationship.newParent === oldParent) {
          oldParent = relationship.oldParent;
          this.removeRelationship(relationship);

          // This is the case of A->B followed by B->A.
          if (relationship.oldParent === newParent) {
            needsNewEntries = false;
          }
        }
      }
    }

    relationship = {
      child: child,
      oldParent: oldParent,
      newParent: newParent
    };

    // If we didn't go A->B and then B->A, add new dirty relationship
    // entries.
    if (needsNewEntries) {
      this.addRelationshipTo('byChild', child, relationship);
      this.addRelationshipTo('byOldParent', oldParent, relationship);
      this.addRelationshipTo('byNewParent', newParent, relationship);
    }
  },

  removeRelationship: function(relationship) {
    var relationships = this.dirtyRelationships;

    removeObject(relationships.byOldParent.get(relationship.oldParent), relationship);
    removeObject(relationships.byNewParent.get(relationship.newParent), relationship);
    removeObject(relationships.byChild.get(relationship.child), relationship);
  },

  addRelationshipTo: function(type, record, description) {
    var map = this.dirtyRelationships[type];

    var relationships = map.get(record);

    if (!relationships) {
      relationships = [ description ];
      map.set(record, relationships);
    } else {
      relationships.push(description);
    }
  },

  /**
    @private

    Called by a record's state manager to indicate that the record has entered
    a dirty state. The record will be moved from the `clean` bucket and into
    the appropriate dirty bucket.

    @param {String} bucketType one of `created`, `updated`, or `deleted`
  */
  recordBecameDirty: function(bucketType, record) {
    this.removeFromBucket('clean', record);
    this.addToBucket(bucketType, record);
  },

  /**
    @private

    Called by a record's state manager to indicate that the record has entered
    inflight state. The record will be moved from its current dirty bucket and into
    the `inflight` bucket.

    @param {String} bucketType one of `created`, `updated`, or `deleted`
  */
  recordBecameInFlight: function(kind, record) {
    this.removeFromBucket(kind, record);
    this.addToBucket('inflight', record);
  },

  /**
    @private

    Called by a record's state manager to indicate that the record has entered
    a clean state. The record will be moved from its current dirty or inflight bucket and into
    the `clean` bucket.

    @param {String} bucketType one of `created`, `updated`, or `deleted`
  */
  recordBecameClean: function(kind, record) {
    this.removeFromBucket(kind, record);

    this.remove(record);
  }
});

})();



(function() {
/*globals Ember*/
var get = Ember.get, set = Ember.set, getPath = Ember.getPath, fmt = Ember.String.fmt;

var DATA_PROXY = {
  get: function(name) {
    return this.savedData[name];
  }
};

// These values are used in the data cache when clientIds are
// needed but the underlying data has not yet been loaded by
// the server.
var UNLOADED = 'unloaded';
var LOADING = 'loading';

// Implementors Note:
//
//   The variables in this file are consistently named according to the following
//   scheme:
//
//   * +id+ means an identifier managed by an external source, provided inside the
//     data hash provided by that source.
//   * +clientId+ means a transient numerical identifier generated at runtime by
//     the data store. It is important primarily because newly created objects may
//     not yet have an externally generated id.
//   * +type+ means a subclass of DS.Model.

/**
  The store contains all of the hashes for records loaded from the server.
  It is also responsible for creating instances of DS.Model when you request one
  of these data hashes, so that they can be bound to in your Handlebars templates.

  Create a new store like this:

       MyApp.store = DS.Store.create();

  You can retrieve DS.Model instances from the store in several ways. To retrieve
  a record for a specific id, use the `find()` method:

       var record = MyApp.store.find(MyApp.Contact, 123);

   By default, the store will talk to your backend using a standard REST mechanism.
   You can customize how the store talks to your backend by specifying a custom adapter:

       MyApp.store = DS.Store.create({
         adapter: 'MyApp.CustomAdapter'
       });

    You can learn more about writing a custom adapter by reading the `DS.Adapter`
    documentation.
*/
DS.Store = Ember.Object.extend({

  /**
    Many methods can be invoked without specifying which store should be used.
    In those cases, the first store created will be used as the default. If
    an application has multiple stores, it should specify which store to use
    when performing actions, such as finding records by id.

    The init method registers this store as the default if none is specified.
  */
  init: function() {
    // Enforce API revisioning. See BREAKING_CHANGES.md for more.
    var revision = get(this, 'revision');

    if (revision !== DS.CURRENT_API_REVISION && !Ember.ENV.TESTING) {
      throw new Error("Error: The Ember Data library has had breaking API changes since the last time you updated the library. Please review the list of breaking changes at https://github.com/emberjs/data/blob/master/BREAKING_CHANGES.md, then update your store's `revision` property to " + DS.CURRENT_API_REVISION);
    }

    if (!get(DS, 'defaultStore') || get(this, 'isDefaultStore')) {
      set(DS, 'defaultStore', this);
    }

    // internal bookkeeping; not observable
    this.typeMaps = {};
    this.recordCache = [];
    this.clientIdToId = {};
    this.recordArraysByClientId = {};

    // Internally, we maintain a map of all unloaded IDs requested by
    // a ManyArray. As the adapter loads hashes into the store, the
    // store notifies any interested ManyArrays. When the ManyArray's
    // total number of loading records drops to zero, it becomes
    // `isLoaded` and fires a `didLoad` event.
    this.loadingRecordArrays = {};

    set(this, 'defaultTransaction', this.transaction());

    return this._super();
  },

  /**
    Returns a new transaction scoped to this store.

    @see {DS.Transaction}
    @returns DS.Transaction
  */
  transaction: function() {
    return DS.Transaction.create({ store: this });
  },

  /**
    @private

    This is used only by the record's DataProxy. Do not use this directly.
  */
  dataForRecord: function(record) {
    var type = record.constructor,
        clientId = get(record, 'clientId'),
        typeMap = this.typeMapFor(type);

    return typeMap.cidToHash[clientId];
  },

  /**
    The adapter to use to communicate to a backend server or other persistence layer.

    This can be specified as an instance, a class, or a property path that specifies
    where the adapter can be located.

    @property {DS.Adapter|String}
  */
  adapter: null,

  /**
    @private

    This property returns the adapter, after resolving a possible String.

    @returns DS.Adapter
  */
  _adapter: Ember.computed(function() {
    var adapter = get(this, 'adapter');
    if (typeof adapter === 'string') {
      return getPath(this, adapter, false) || getPath(window, adapter);
    }
    return adapter;
  }).property('adapter').cacheable(),

  // A monotonically increasing number to be used to uniquely identify
  // data hashes and records.
  clientIdCounter: 1,

  // .....................
  // . CREATE NEW RECORD .
  // .....................

  /**
    Create a new record in the current store. The properties passed
    to this method are set on the newly created record.

    @param {subclass of DS.Model} type
    @param {Object} properties a hash of properties to set on the
      newly created record.
    @returns DS.Model
  */
  createRecord: function(type, properties, transaction) {
    properties = properties || {};

    // Create a new instance of the model `type` and put it
    // into the specified `transaction`. If no transaction is
    // specified, the default transaction will be used.
    //
    // NOTE: A `transaction` is specified when the
    // `transaction.createRecord` API is used.
    var record = type._create({
      store: this
    });

    transaction = transaction || get(this, 'defaultTransaction');
    transaction.adoptRecord(record);

    // Extract the primary key from the `properties` hash,
    // based on the `primaryKey` for the model type.
    var primaryKey = get(record, 'primaryKey'),
        id = properties[primaryKey] || null;

    // If the passed properties do not include a primary key,
    // give the adapter an opportunity to generate one.
    var adapter;
    if (Ember.none(id)) {
      adapter = get(this, 'adapter');
      if (adapter && adapter.generateIdForRecord) {
        id = adapter.generateIdForRecord(this, record);
        properties.id = id;
      }
    }

    var hash = {}, clientId;

    // Push the hash into the store. If present, associate the
    // extracted `id` with the hash.
    clientId = this.pushHash(hash, id, type);

    record.send('didChangeData');

    var recordCache = get(this, 'recordCache');

    // Now that we have a clientId, attach it to the record we
    // just created.
    set(record, 'clientId', clientId);

    // Store the record we just created in the record cache for
    // this clientId.
    recordCache[clientId] = record;

    // Set the properties specified on the record.
    record.setProperties(properties);

    this.updateRecordArrays(type, clientId, get(record, 'data'));

    return record;
  },

  // .................
  // . DELETE RECORD .
  // .................

  /**
    For symmetry, a record can be deleted via the store.

    @param {DS.Model} record
  */
  deleteRecord: function(record) {
    record.send('deleteRecord');
  },

  // ................
  // . FIND RECORDS .
  // ................

  /**
    This is the main entry point into finding records. The first
    parameter to this method is always a subclass of `DS.Model`.

    You can use the `find` method on a subclass of `DS.Model`
    directly if your application only has one store. For
    example, instead of `store.find(App.Person, 1)`, you could
    say `App.Person.find(1)`.

    ---

    To find a record by ID, pass the `id` as the second parameter:

        store.find(App.Person, 1);
        App.Person.find(1);

    If the record with that `id` had not previously been loaded,
    the store will return an empty record immediately and ask
    the adapter to find the data by calling the adapter's `find`
    method.

    The `find` method will always return the same object for a
    given type and `id`. To check whether the adapter has populated
    a record, you can check its `isLoaded` property.

    ---

    To find all records for a type, call `find` with no additional
    parameters:

        store.find(App.Person);
        App.Person.find();

    This will return a `RecordArray` representing all known records
    for the given type and kick off a request to the adapter's
    `findAll` method to load any additional records for the type.

    The `RecordArray` returned by `find()` is live. If any more
    records for the type are added at a later time through any
    mechanism, it will automatically update to reflect the change.

    ---

    To find a record by a query, call `find` with a hash as the
    second parameter:

        store.find(App.Person, { page: 1 });
        App.Person.find({ page: 1 });

    This will return a `RecordArray` immediately, but it will always
    be an empty `RecordArray` at first. It will call the adapter's
    `findQuery` method, which will populate the `RecordArray` once
    the server has returned results.

    You can check whether a query results `RecordArray` has loaded
    by checking its `isLoaded` property.
  */
  find: function(type, id, query) {
    if (id === undefined) {
      return this.findAll(type);
    }

    if (query !== undefined) {
      return this.findMany(type, id, query);
    } else if (Ember.typeOf(id) === 'object') {
      return this.findQuery(type, id);
    }

    if (Ember.isArray(id)) {
      return this.findMany(type, id);
    }

    var clientId = this.typeMapFor(type).idToCid[id];

    return this.findByClientId(type, clientId, id);
  },

  findByClientId: function(type, clientId, id) {
    var recordCache = get(this, 'recordCache'),
        dataCache, record;

    // If there is already a clientId assigned for this
    // type/id combination, try to find an existing
    // record for that id and return. Otherwise,
    // materialize a new record and set its data to the
    // value we already have.
    if (clientId !== undefined) {
      record = recordCache[clientId];

      if (!record) {
        // create a new instance of the model type in the
        // 'isLoading' state
        record = this.materializeRecord(type, clientId);

        dataCache = this.typeMapFor(type).cidToHash;

        if (typeof dataCache[clientId] === 'object') {
          record.send('didChangeData');
        }
      }
    } else {
      clientId = this.pushHash(LOADING, id, type);

      // create a new instance of the model type in the
      // 'isLoading' state
      record = this.materializeRecord(type, clientId, id);

      // let the adapter set the data, possibly async
      var adapter = get(this, '_adapter');
      if (adapter && adapter.find) { adapter.find(this, type, id); }
      else { throw fmt("Adapter is either null or does not implement `find` method", this); }
    }

    return record;
  },

  /**
    @private

    Given a type and array of `clientId`s, determines which of those
    `clientId`s has not yet been loaded.

    In preparation for loading, this method also marks any unloaded
    `clientId`s as loading.
  */
  neededClientIds: function(type, clientIds) {
    var neededClientIds = [],
        typeMap = this.typeMapFor(type),
        dataCache = typeMap.cidToHash,
        clientId;

    for (var i=0, l=clientIds.length; i<l; i++) {
      clientId = clientIds[i];
      if (dataCache[clientId] === UNLOADED) {
        neededClientIds.push(clientId);
        dataCache[clientId] = LOADING;
      }
    }

    return neededClientIds;
  },

  /**
    @private

    This method is the entry point that associations use to update
    themselves when their underlying data changes.

    First, it determines which of its `clientId`s are still unloaded,
    then converts the needed `clientId`s to IDs and invokes `findMany`
    on the adapter.
  */
  fetchUnloadedClientIds: function(type, clientIds) {
    var neededClientIds = this.neededClientIds(type, clientIds);
    this.fetchMany(type, neededClientIds);
  },

  /**
    @private

    This method takes a type and list of `clientId`s, converts the
    `clientId`s into IDs, and then invokes the adapter's `findMany`
    method.

    It is used both by a brand new association (via the `findMany`
    method) or when the data underlying an existing association
    changes (via the `fetchUnloadedClientIds` method).
  */
  fetchMany: function(type, clientIds) {
    var clientIdToId = this.clientIdToId;

    var neededIds = Ember.EnumerableUtils.map(clientIds, function(clientId) {
      return clientIdToId[clientId];
    });

    var adapter = get(this, '_adapter');
    if (adapter && adapter.findMany) { adapter.findMany(this, type, neededIds); }
    else { throw fmt("Adapter is either null or does not implement `findMany` method", this); }
  },

  /**
    @private

    `findMany` is the entry point that associations use to generate a
    new `ManyArray` for the list of IDs specified by the server for
    the association.

    Its responsibilities are:

    * convert the IDs into clientIds
    * determine which of the clientIds still need to be loaded
    * create a new ManyArray whose content is *all* of the clientIds
    * notify the ManyArray of the number of its elements that are
      already loaded
    * insert the unloaded clientIds into the `loadingRecordArrays`
      bookkeeping structure, which will allow the `ManyArray` to know
      when all of its loading elements are loaded from the server.
    * ask the adapter to load the unloaded elements, by invoking
      findMany with the still-unloaded IDs.
  */
  findMany: function(type, ids) {
    // 1. Convert ids to client ids
    // 2. Determine which of the client ids need to be loaded
    // 3. Create a new ManyArray whose content is ALL of the clientIds
    // 4. Decrement the ManyArray's counter by the number of loaded clientIds
    // 5. Put the ManyArray into our bookkeeping data structure, keyed on
    //    the needed clientIds
    // 6. Ask the adapter to load the records for the unloaded clientIds (but
    //    convert them back to ids)

    var clientIds = this.clientIdsForIds(type, ids);

    var neededClientIds = this.neededClientIds(type, clientIds),
        manyArray = this.createManyArray(type, Ember.A(clientIds)),
        loadedCount = clientIds.length - neededClientIds.length,
        loadingRecordArrays = this.loadingRecordArrays,
        clientId, i, l;

    manyArray.send('loadedRecords', loadedCount);

    if (neededClientIds.length) {
      for (i=0, l=neededClientIds.length; i<l; i++) {
        clientId = neededClientIds[i];
        if (loadingRecordArrays[clientId]) {
          loadingRecordArrays[clientId].push(manyArray);
        } else {
          this.loadingRecordArrays[clientId] = [ manyArray ];
        }
      }

      this.fetchMany(type, neededClientIds);
    }

    return manyArray;
  },

  findQuery: function(type, query) {
    var array = DS.AdapterPopulatedRecordArray.create({ type: type, content: Ember.A([]), store: this });
    var adapter = get(this, '_adapter');
    if (adapter && adapter.findQuery) { adapter.findQuery(this, type, query, array); }
    else { throw fmt("Adapter is either null or does not implement `findQuery` method", this); }
    return array;
  },

  findAll: function(type) {

    var typeMap = this.typeMapFor(type),
        findAllCache = typeMap.findAllCache;

    if (findAllCache) { return findAllCache; }

    var array = DS.RecordArray.create({ type: type, content: Ember.A([]), store: this });
    this.registerRecordArray(array, type);

    var adapter = get(this, '_adapter');
    if (adapter && adapter.findAll) { adapter.findAll(this, type); }

    typeMap.findAllCache = array;
    return array;
  },

  filter: function(type, query, filter) {
    // allow an optional server query
    if (arguments.length === 3) {
      this.findQuery(type, query);
    } else if (arguments.length === 2) {
      filter = query;
    }

    var array = DS.FilteredRecordArray.create({ type: type, content: Ember.A([]), store: this, filterFunction: filter });

    this.registerRecordArray(array, type, filter);

    return array;
  },

  // ............
  // . UPDATING .
  // ............

  hashWasUpdated: function(type, clientId, record) {
    // Because hash updates are invoked at the end of the run loop,
    // it is possible that a record might be deleted after its hash
    // has been modified and this method was scheduled to be called.
    //
    // If that's the case, the record would have already been removed
    // from all record arrays; calling updateRecordArrays would just
    // add it back. If the record is deleted, just bail. It shouldn't
    // give us any more trouble after this.

    if (get(record, 'isDeleted')) { return; }
    this.updateRecordArrays(type, clientId, get(record, 'data'));
  },

  // ..............
  // . PERSISTING .
  // ..............

  commit: function() {
    var defaultTransaction = get(this, 'defaultTransaction');
    set(this, 'defaultTransaction', this.transaction());

    defaultTransaction.commit();
  },

  didUpdateRecords: function(array, hashes) {
    if (hashes) {
      array.forEach(function(record, idx) {
        this.didUpdateRecord(record, hashes[idx]);
      }, this);
    } else {
      array.forEach(function(record) {
        this.didUpdateRecord(record);
      }, this);
    }
  },

  didUpdateRecord: function(record, hash) {
    if (hash) {
      var clientId = get(record, 'clientId'),
          dataCache = this.typeMapFor(record.constructor).cidToHash;

      dataCache[clientId] = hash;
      record.send('didChangeData');
      record.hashWasUpdated();
    } else {
      record.send('didSaveData');
    }

    record.send('didCommit');
  },

  didDeleteRecords: function(array) {
    array.forEach(function(record) {
      record.send('didCommit');
    });
  },

  didDeleteRecord: function(record) {
    record.send('didCommit');
  },

  _didCreateRecord: function(record, hash, typeMap, clientId, primaryKey) {
    var recordData = get(record, 'data'), id, changes;

    if (hash) {
      typeMap.cidToHash[clientId] = hash;

      // If the server returns a hash, we assume that the server's version
      // of the data supercedes the local changes.
      record.beginPropertyChanges();
      record.send('didChangeData');
      recordData.adapterDidUpdate();
      record.hashWasUpdated();
      record.endPropertyChanges();

      id = hash[primaryKey];

      typeMap.idToCid[id] = clientId;
      this.clientIdToId[clientId] = id;
    } else {
      recordData.commit();
    }

    record.send('didCommit');
  },


  didCreateRecords: function(type, array, hashes) {
    var primaryKey = type.proto().primaryKey,
        typeMap = this.typeMapFor(type),
        clientId;

    for (var i=0, l=get(array, 'length'); i<l; i++) {
      var record = array[i], hash = hashes[i];
      clientId = get(record, 'clientId');

      this._didCreateRecord(record, hash, typeMap, clientId, primaryKey);
    }
  },

  didCreateRecord: function(record, hash) {
    var type = record.constructor,
        typeMap = this.typeMapFor(type),
        clientId, primaryKey;

    // The hash is optional, but if it is not provided, the client must have
    // provided a primary key.

    primaryKey = type.proto().primaryKey;

    // TODO: Make Ember.assert more flexible
    if (hash) {
      Ember.assert("The server must provide a primary key: " + primaryKey, get(hash, primaryKey));
    } else {
      Ember.assert("The server did not return data, and you did not create a primary key (" + primaryKey + ") on the client", get(get(record, 'data'), primaryKey));
    }

    clientId = get(record, 'clientId');

    this._didCreateRecord(record, hash, typeMap, clientId, primaryKey);
  },

  recordWasInvalid: function(record, errors) {
    record.send('becameInvalid', errors);
  },

  // .................
  // . RECORD ARRAYS .
  // .................

  registerRecordArray: function(array, type, filter) {
    var recordArrays = this.typeMapFor(type).recordArrays;

    recordArrays.push(array);

    this.updateRecordArrayFilter(array, type, filter);
  },

  createManyArray: function(type, clientIds) {
    var array = DS.ManyArray.create({ type: type, content: clientIds, store: this });

    clientIds.forEach(function(clientId) {
      var recordArrays = this.recordArraysForClientId(clientId);
      recordArrays.add(array);
    }, this);

    return array;
  },

  updateRecordArrayFilter: function(array, type, filter) {
    var typeMap = this.typeMapFor(type),
        dataCache = typeMap.cidToHash,
        clientIds = typeMap.clientIds,
        clientId, hash, proxy;

    var recordCache = get(this, 'recordCache'),
        foundRecord,
        record;

    for (var i=0, l=clientIds.length; i<l; i++) {
      clientId = clientIds[i];
      foundRecord = false;

      hash = dataCache[clientId];
      if (typeof hash === 'object') {
        if (record = recordCache[clientId]) {
          if (!get(record, 'isDeleted')) {
            proxy = get(record, 'data');
            foundRecord = true;
          }
        } else {
          DATA_PROXY.savedData = hash;
          proxy = DATA_PROXY;
          foundRecord = true;
        }

        if (foundRecord) { this.updateRecordArray(array, filter, type, clientId, proxy); }
      }
    }
  },

  updateRecordArrays: function(type, clientId, dataProxy) {
    var recordArrays = this.typeMapFor(type).recordArrays,
        filter;

    recordArrays.forEach(function(array) {
      filter = get(array, 'filterFunction');
      this.updateRecordArray(array, filter, type, clientId, dataProxy);
    }, this);

    // loop through all manyArrays containing an unloaded copy of this
    // clientId and notify them that the record was loaded.
    var manyArrays = this.loadingRecordArrays[clientId], manyArray;

    if (manyArrays) {
      for (var i=0, l=manyArrays.length; i<l; i++) {
        manyArrays[i].send('loadedRecords', 1);
      }

      this.loadingRecordArrays[clientId] = null;
    }
  },

  updateRecordArray: function(array, filter, type, clientId, dataProxy) {
    var shouldBeInArray;

    if (!filter) {
      shouldBeInArray = true;
    } else {
      shouldBeInArray = filter(dataProxy);
    }

    var content = get(array, 'content');
    var alreadyInArray = content.indexOf(clientId) !== -1;

    var recordArrays = this.recordArraysForClientId(clientId);

    if (shouldBeInArray && !alreadyInArray) {
      recordArrays.add(array);
      content.pushObject(clientId);
    } else if (!shouldBeInArray && alreadyInArray) {
      recordArrays.remove(array);
      content.removeObject(clientId);
    }
  },

  removeFromRecordArrays: function(record) {
    var clientId = get(record, 'clientId');
    var recordArrays = this.recordArraysForClientId(clientId);

    recordArrays.forEach(function(array) {
      var content = get(array, 'content');
      content.removeObject(clientId);
    });
  },

  // ............
  // . INDEXING .
  // ............

  recordArraysForClientId: function(clientId) {
    var recordArrays = get(this, 'recordArraysByClientId');
    var ret = recordArrays[clientId];

    if (!ret) {
      ret = recordArrays[clientId] = Ember.OrderedSet.create();
    }

    return ret;
  },

  typeMapFor: function(type) {
    var typeMaps = get(this, 'typeMaps');
    var guidForType = Ember.guidFor(type);

    var typeMap = typeMaps[guidForType];

    if (typeMap) {
      return typeMap;
    } else {
      return (typeMaps[guidForType] =
        {
          idToCid: {},
          clientIds: [],
          cidToHash: {},
          recordArrays: []
      });
    }
  },

  /** @private

    For a given type and id combination, returns the client id used by the store.
    If no client id has been assigned yet, one will be created and returned.

    @param {DS.Model} type
    @param {String|Number} id
  */
  clientIdForId: function(type, id) {
    var clientId = this.typeMapFor(type).idToCid[id];

    if (clientId !== undefined) { return clientId; }

    return this.pushHash(UNLOADED, id, type);
  },

  /**
    @private

    This method works exactly like `clientIdForId`, but does not
    require looking up the `typeMap` for every `clientId` and
    invoking a method per `clientId`.
  */
  clientIdsForIds: function(type, ids) {
    var typeMap = this.typeMapFor(type),
        idToClientIdMap = typeMap.idToCid;

    return Ember.EnumerableUtils.map(ids, function(id) {
      var clientId = idToClientIdMap[id];
      if (clientId) { return clientId; }
      return this.pushHash(UNLOADED, id, type);
    }, this);
  },

  // ................
  // . LOADING DATA .
  // ................

  /**
    Load a new data hash into the store for a given id and type combination.
    If data for that record had been loaded previously, the new information
    overwrites the old.

    If the record you are loading data for has outstanding changes that have not
    yet been saved, an exception will be thrown.

    @param {DS.Model} type
    @param {String|Number} id
    @param {Object} hash the data hash to load
  */
  load: function(type, id, hash) {
    if (hash === undefined) {
      hash = id;
      var primaryKey = type.proto().primaryKey;
      Ember.assert("A data hash was loaded for a record of type " + type.toString() + " but no primary key '" + primaryKey + "' was provided.", primaryKey in hash);
      id = hash[primaryKey];
    }

    var typeMap = this.typeMapFor(type),
        dataCache = typeMap.cidToHash,
        clientId = typeMap.idToCid[id],
        recordCache = get(this, 'recordCache');

    if (clientId !== undefined) {
      dataCache[clientId] = hash;

      var record = recordCache[clientId];
      if (record) {
        record.send('didChangeData');
      }
    } else {
      clientId = this.pushHash(hash, id, type);
    }

    DATA_PROXY.savedData = hash;
    this.updateRecordArrays(type, clientId, DATA_PROXY);

    return { id: id, clientId: clientId };
  },

  loadMany: function(type, ids, hashes) {
    var clientIds = Ember.A([]);

    if (hashes === undefined) {
      hashes = ids;
      ids = [];
      var primaryKey = type.proto().primaryKey;

      ids = Ember.EnumerableUtils.map(hashes, function(hash) {
        return hash[primaryKey];
      });
    }

    for (var i=0, l=get(ids, 'length'); i<l; i++) {
      var loaded = this.load(type, ids[i], hashes[i]);
      clientIds.pushObject(loaded.clientId);
    }

    return { clientIds: clientIds, ids: ids };
  },

  /** @private

    Stores a data hash for the specified type and id combination and returns
    the client id.

    @param {Object} hash
    @param {String|Number} id
    @param {DS.Model} type
    @returns {Number}
  */
  pushHash: function(hash, id, type) {
    var typeMap = this.typeMapFor(type);

    var idToClientIdMap = typeMap.idToCid,
        clientIdToIdMap = this.clientIdToId,
        clientIds = typeMap.clientIds,
        dataCache = typeMap.cidToHash;

    var clientId = ++this.clientIdCounter;

    dataCache[clientId] = hash;

    // if we're creating an item, this process will be done
    // later, once the object has been persisted.
    if (id) {
      idToClientIdMap[id] = clientId;
      clientIdToIdMap[clientId] = id;
    }

    clientIds.push(clientId);

    return clientId;
  },

  // ..........................
  // . RECORD MATERIALIZATION .
  // ..........................

  materializeRecord: function(type, clientId, id) {
    var record;

    get(this, 'recordCache')[clientId] = record = type._create({
      store: this,
      clientId: clientId,
      _id: id
    });

    get(this, 'defaultTransaction').adoptRecord(record);

    record.send('loadingData');
    return record;
  },

  destroy: function() {
    if (get(DS, 'defaultStore') === this) {
      set(DS, 'defaultStore', null);
    }

    return this._super();
  }
});

})();



(function() {
var get = Ember.get, set = Ember.set, getPath = Ember.getPath, guidFor = Ember.guidFor;

/**
  This file encapsulates the various states that a record can transition
  through during its lifecycle.

  ### State Manager

  A record's state manager explicitly tracks what state a record is in
  at any given time. For instance, if a record is newly created and has
  not yet been sent to the adapter to be saved, it would be in the
  `created.uncommitted` state.  If a record has had local modifications
  made to it that are in the process of being saved, the record would be
  in the `updated.inFlight` state. (These state paths will be explained
  in more detail below.)

  Events are sent by the record or its store to the record's state manager.
  How the state manager reacts to these events is dependent on which state
  it is in. In some states, certain events will be invalid and will cause
  an exception to be raised.

  States are hierarchical. For example, a record can be in the
  `deleted.start` state, then transition into the `deleted.inFlight` state.
  If a child state does not implement an event handler, the state manager
  will attempt to invoke the event on all parent states until the root state is
  reached. The state hierarchy of a record is described in terms of a path
  string. You can determine a record's current state by getting its manager's
  current state path:

        record.getPath('stateManager.currentState.path');
        //=> "created.uncommitted"

  The `DS.Model` states are themselves stateless. What we mean is that,
  though each instance of a record also has a unique instance of a
  `DS.StateManager`, the hierarchical states that each of *those* points
  to is a shared data structure. For performance reasons, instead of each
  record getting its own copy of the hierarchy of states, each state
  manager points to this global, immutable shared instance. How does a
  state know which record it should be acting on?  We pass a reference to
  the current state manager as the first parameter to every method invoked
  on a state.

  The state manager passed as the first parameter is where you should stash
  state about the record if needed; you should never store data on the state
  object itself. If you need access to the record being acted on, you can
  retrieve the state manager's `record` property. For example, if you had
  an event handler `myEvent`:

      myEvent: function(manager) {
        var record = manager.get('record');
        record.doSomething();
      }

  For more information about state managers in general, see the Ember.js
  documentation on `Ember.StateManager`.

  ### Events, Flags, and Transitions

  A state may implement zero or more events, flags, or transitions.

  #### Events

  Events are named functions that are invoked when sent to a record. The
  state manager will first look for a method with the given name on the
  current state. If no method is found, it will search the current state's
  parent, and then its grandparent, and so on until reaching the top of
  the hierarchy. If the root is reached without an event handler being found,
  an exception will be raised. This can be very helpful when debugging new
  features.

  Here's an example implementation of a state with a `myEvent` event handler:

      aState: DS.State.create({
        myEvent: function(manager, param) {
          console.log("Received myEvent with "+param);
        }
      })

  To trigger this event:

      record.send('myEvent', 'foo');
      //=> "Received myEvent with foo"

  Note that an optional parameter can be sent to a record's `send()` method,
  which will be passed as the second parameter to the event handler.

  Events should transition to a different state if appropriate. This can be
  done by calling the state manager's `goToState()` method with a path to the
  desired state. The state manager will attempt to resolve the state path
  relative to the current state. If no state is found at that path, it will
  attempt to resolve it relative to the current state's parent, and then its
  parent, and so on until the root is reached. For example, imagine a hierarchy
  like this:

      * created
        * start <-- currentState
        * inFlight
      * updated
        * inFlight

  If we are currently in the `start` state, calling
  `goToState('inFlight')` would transition to the `created.inFlight` state,
  while calling `goToState('updated.inFlight')` would transition to
  the `updated.inFlight` state.

  Remember that *only events* should ever cause a state transition. You should
  never call `goToState()` from outside a state's event handler. If you are
  tempted to do so, create a new event and send that to the state manager.

  #### Flags

  Flags are Boolean values that can be used to introspect a record's current
  state in a more user-friendly way than examining its state path. For example,
  instead of doing this:

      var statePath = record.getPath('stateManager.currentState.path');
      if (statePath === 'created.inFlight') {
        doSomething();
      }

  You can say:

      if (record.get('isNew') && record.get('isSaving')) {
        doSomething();
      }

  If your state does not set a value for a given flag, the value will
  be inherited from its parent (or the first place in the state hierarchy
  where it is defined).

  The current set of flags are defined below. If you want to add a new flag,
  in addition to the area below, you will also need to declare it in the
  `DS.Model` class.

  #### Transitions

  Transitions are like event handlers but are called automatically upon
  entering or exiting a state. To implement a transition, just call a method
  either `enter` or `exit`:

      myState: DS.State.create({
        // Gets called automatically when entering
        // this state.
        enter: function(manager) {
          console.log("Entered myState");
        }
      })

   Note that enter and exit events are called once per transition. If the
   current state changes, but changes to another child state of the parent,
   the transition event on the parent will not be triggered.
*/

var stateProperty = Ember.computed(function(key) {
  var parent = get(this, 'parentState');
  if (parent) {
    return get(parent, key);
  }
}).property();

var isEmptyObject = function(object) {
  for (var name in object) {
    if (object.hasOwnProperty(name)) { return false; }
  }

  return true;
};

var hasDefinedProperties = function(object) {
  for (var name in object) {
    if (object.hasOwnProperty(name) && object[name]) { return true; }
  }

  return false;
};

DS.State = Ember.State.extend({
  isLoaded: stateProperty,
  isDirty: stateProperty,
  isSaving: stateProperty,
  isDeleted: stateProperty,
  isError: stateProperty,
  isNew: stateProperty,
  isValid: stateProperty,
  isPending: stateProperty,

  // For states that are substates of a
  // DirtyState (updated or created), it is
  // useful to be able to determine which
  // type of dirty state it is.
  dirtyType: stateProperty
});

var setProperty = function(manager, context) {
  var key = context.key, value = context.value;

  var record = get(manager, 'record'),
      data = get(record, 'data');

  set(data, key, value);
};

var setAssociation = function(manager, context) {
  var key = context.key, value = context.value;

  var record = get(manager, 'record'),
      data = get(record, 'data');

  data.setAssociation(key, value);
};

var didChangeData = function(manager) {
  var record = get(manager, 'record'),
      data = get(record, 'data');

  data._savedData = null;
  record.notifyPropertyChange('data');
};

// The waitingOn event shares common functionality
// between the different dirty states, but each is
// treated slightly differently. This method is exposed
// so that each implementation can invoke the common
// behavior, and then implement the behavior specific
// to the state.
var waitingOn = function(manager, object) {
  var record = get(manager, 'record'),
      pendingQueue = get(record, 'pendingQueue'),
      objectGuid = guidFor(object);

  var observer = function() {
    if (get(object, 'id')) {
      manager.send('doneWaitingOn', object);
      Ember.removeObserver(object, 'id', observer);
    }
  };

  pendingQueue[objectGuid] = [object, observer];
  Ember.addObserver(object, 'id', observer);
};

// Implementation notes:
//
// Each state has a boolean value for all of the following flags:
//
// * isLoaded: The record has a populated `data` property. When a
//   record is loaded via `store.find`, `isLoaded` is false
//   until the adapter sets it. When a record is created locally,
//   its `isLoaded` property is always true.
// * isDirty: The record has local changes that have not yet been
//   saved by the adapter. This includes records that have been
//   created (but not yet saved) or deleted.
// * isSaving: The record's transaction has been committed, but
//   the adapter has not yet acknowledged that the changes have
//   been persisted to the backend.
// * isDeleted: The record was marked for deletion. When `isDeleted`
//   is true and `isDirty` is true, the record is deleted locally
//   but the deletion was not yet persisted. When `isSaving` is
//   true, the change is in-flight. When both `isDirty` and
//   `isSaving` are false, the change has persisted.
// * isError: The adapter reported that it was unable to save
//   local changes to the backend. This may also result in the
//   record having its `isValid` property become false if the
//   adapter reported that server-side validations failed.
// * isNew: The record was created on the client and the adapter
//   did not yet report that it was successfully saved.
// * isValid: No client-side validations have failed and the
//   adapter did not report any server-side validation failures.
// * isPending: A record `isPending` when it belongs to an
//   association on another record and that record has not been
//   saved. A record in this state cannot be saved because it
//   lacks a "foreign key" that will be supplied by its parent
//   association when the parent record has been created. When
//   the adapter reports that the parent has saved, the
//   `isPending` property on all children will become `false`
//   and the transaction will try to commit the records.

// This mixin is mixed into various uncommitted states. Make
// sure to mix it in *after* the class definition, so its
// super points to the class definition.
var Uncommitted = Ember.Mixin.create({
  setProperty: setProperty,
  setAssociation: setAssociation
});

// These mixins are mixed into substates of the concrete
// subclasses of DirtyState.

var CreatedUncommitted = Ember.Mixin.create({
  deleteRecord: function(manager) {
    var record = get(manager, 'record');
    this._super(manager);

    record.withTransaction(function(t) {
      t.recordBecameClean('created', record);
    });
    manager.goToState('deleted.saved');
  }
});

var UpdatedUncommitted = Ember.Mixin.create({
  deleteRecord: function(manager) {
    this._super(manager);

    var record = get(manager, 'record');

    record.withTransaction(function(t) {
      t.recordBecameClean('updated', record);
    });

    manager.goToState('deleted');
  }
});

// The dirty state is a abstract state whose functionality is
// shared between the `created` and `updated` states.
//
// The deleted state shares the `isDirty` flag with the
// subclasses of `DirtyState`, but with a very different
// implementation.
var DirtyState = DS.State.extend({
  initialState: 'uncommitted',

  // FLAGS
  isDirty: true,

  // SUBSTATES

  // When a record first becomes dirty, it is `uncommitted`.
  // This means that there are local pending changes,
  // but they have not yet begun to be saved.
  uncommitted: DS.State.extend({
    // TRANSITIONS
    enter: function(manager) {
      var dirtyType = get(this, 'dirtyType'),
          record = get(manager, 'record');

      record.withTransaction(function (t) {
        t.recordBecameDirty(dirtyType, record);
      });
    },

    // EVENTS
    deleteRecord: Ember.K,

    waitingOn: function(manager, object) {
      waitingOn(manager, object);
      manager.goToState('pending');
    },

    willCommit: function(manager) {
      manager.goToState('inFlight');
    },

    becameInvalid: function(manager) {
      var dirtyType = get(this, 'dirtyType'),
          record = get(manager, 'record');

      record.withTransaction(function (t) {
        t.recordBecameInFlight(dirtyType, record);
      });

      manager.goToState('invalid');
    },

    rollback: function(manager) {
      var record = get(manager, 'record'),
          dirtyType = get(this, 'dirtyType'),
          data = get(record, 'data');

      data.rollback();

      record.withTransaction(function(t) {
        t.recordBecameClean(dirtyType, record);
      });

      manager.goToState('loaded');
    }
  }, Uncommitted),

  // Once a record has been handed off to the adapter to be
  // saved, it is in the 'in flight' state. Changes to the
  // record cannot be made during this window.
  inFlight: DS.State.extend({
    // FLAGS
    isSaving: true,

    // TRANSITIONS
    enter: function(manager) {
      var dirtyType = get(this, 'dirtyType'),
          record = get(manager, 'record');

      record.withTransaction(function (t) {
        t.recordBecameInFlight(dirtyType, record);
      });
    },

    // EVENTS
    didCommit: function(manager) {
      var dirtyType = get(this, 'dirtyType'),
          record = get(manager, 'record');

      record.withTransaction(function(t) {
        t.recordBecameClean('inflight', record);
      });

      manager.goToState('loaded');
      manager.send('invokeLifecycleCallbacks', dirtyType);
    },

    becameInvalid: function(manager, errors) {
      var record = get(manager, 'record');

      set(record, 'errors', errors);

      manager.goToState('invalid');
      manager.send('invokeLifecycleCallbacks');
    },

    becameError: function(manager) {
      manager.goToState('error');
      manager.send('invokeLifecycleCallbacks');
    },

    didChangeData: didChangeData
  }),

  // If a record becomes associated with a newly created
  // parent record, it will be `pending` until the parent
  // record has successfully persisted. Once this happens,
  // this record can use the parent's primary key as its
  // foreign key.
  //
  // If the record's transaction had already started to
  // commit, the record will transition to the `inFlight`
  // state. If it had not, the record will transition to
  // the `uncommitted` state.
  pending: DS.State.extend({
    initialState: 'uncommitted',

    // FLAGS
    isPending: true,

    // SUBSTATES

    // A pending record whose transaction has not yet
    // started to commit is in this state.
    uncommitted: DS.State.extend({
      // EVENTS
      deleteRecord: function(manager) {
        var record = get(manager, 'record'),
            pendingQueue = get(record, 'pendingQueue'),
            tuple;

        // since we are leaving the pending state, remove any
        // observers we have registered on other records.
        for (var prop in pendingQueue) {
          if (!pendingQueue.hasOwnProperty(prop)) { continue; }

          tuple = pendingQueue[prop];
          Ember.removeObserver(tuple[0], 'id', tuple[1]);
        }
      },

      willCommit: function(manager) {
        manager.goToState('committing');
      },

      doneWaitingOn: function(manager, object) {
        var record = get(manager, 'record'),
            pendingQueue = get(record, 'pendingQueue'),
            objectGuid = guidFor(object);

        delete pendingQueue[objectGuid];

        if (isEmptyObject(pendingQueue)) {
          manager.send('doneWaiting');
        }
      },

      doneWaiting: function(manager) {
        var dirtyType = get(this, 'dirtyType');
        manager.goToState(dirtyType + '.uncommitted');
      }
    }, Uncommitted),

    // A pending record whose transaction has started
    // to commit is in this state. Since it has not yet
    // been sent to the adapter, it is not `inFlight`
    // until all of its dependencies have been committed.
    committing: DS.State.extend({
      // FLAGS
      isSaving: true,

      // EVENTS
      doneWaitingOn: function(manager, object) {
        var record = get(manager, 'record'),
            pendingQueue = get(record, 'pendingQueue'),
            objectGuid = guidFor(object);

        delete pendingQueue[objectGuid];

        if (isEmptyObject(pendingQueue)) {
          manager.send('doneWaiting');
        }
      },

      doneWaiting: function(manager) {
        var record = get(manager, 'record'),
            transaction = get(record, 'transaction');

        // Now that the record is no longer pending, schedule
        // the transaction to commit.
        Ember.run.once(transaction, transaction.commit);
      },

      willCommit: function(manager) {
        var record = get(manager, 'record'),
            pendingQueue = get(record, 'pendingQueue');

        if (isEmptyObject(pendingQueue)) {
          var dirtyType = get(this, 'dirtyType');
          manager.goToState(dirtyType + '.inFlight');
        }
      }
    })
  }),

  // A record is in the `invalid` state when its client-side
  // invalidations have failed, or if the adapter has indicated
  // the the record failed server-side invalidations.
  invalid: DS.State.extend({
    // FLAGS
    isValid: false,

    exit: function(manager) {
      var record = get(manager, 'record');

      record.withTransaction(function (t) {
        t.recordBecameClean('inflight', record);
      });
    },

    // EVENTS
    deleteRecord: function(manager) {
      manager.goToState('deleted');
    },

    setAssociation: setAssociation,

    setProperty: function(manager, context) {
      setProperty(manager, context);

      var record = get(manager, 'record'),
          errors = get(record, 'errors'),
          key = context.key;

      delete errors[key];

      if (!hasDefinedProperties(errors)) {
        manager.send('becameValid');
      }
    },

    rollback: function(manager) {
      manager.send('becameValid');
      manager.send('rollback');
    },

    becameValid: function(manager) {
      manager.goToState('uncommitted');
    },

    invokeLifecycleCallbacks: function(manager) {
      var record = get(manager, 'record');
      record.trigger('becameInvalid', record);
    }
  })
});

// The created and updated states are created outside the state
// chart so we can reopen their substates and add mixins as
// necessary.

var createdState = DirtyState.create({
  dirtyType: 'created',

  // FLAGS
  isNew: true
});

var updatedState = DirtyState.create({
  dirtyType: 'updated'
});

// The created.uncommitted state and created.pending.uncommitted share
// some logic defined in CreatedUncommitted.
createdState.states.uncommitted.reopen(CreatedUncommitted);
createdState.states.pending.states.uncommitted.reopen(CreatedUncommitted);

// The created.uncommitted state needs to immediately transition to the
// deleted state if it is rolled back.
createdState.states.uncommitted.reopen({
  rollback: function(manager) {
    this._super(manager);
    manager.goToState('deleted.saved');
  }
});

// The updated.uncommitted state and updated.pending.uncommitted share
// some logic defined in UpdatedUncommitted.
updatedState.states.uncommitted.reopen(UpdatedUncommitted);
updatedState.states.pending.states.uncommitted.reopen(UpdatedUncommitted);
updatedState.states.inFlight.reopen({
  didSaveData: function(manager) {
    var record = get(manager, 'record'),
        data = get(record, 'data');

    data.saveData();
    data.adapterDidUpdate();
  }
});

var states = {
  rootState: Ember.State.create({
    // FLAGS
    isLoaded: false,
    isDirty: false,
    isSaving: false,
    isDeleted: false,
    isError: false,
    isNew: false,
    isValid: true,
    isPending: false,

    // SUBSTATES

    // A record begins its lifecycle in the `empty` state.
    // If its data will come from the adapter, it will
    // transition into the `loading` state. Otherwise, if
    // the record is being created on the client, it will
    // transition into the `created` state.
    empty: DS.State.create({
      // EVENTS
      loadingData: function(manager) {
        manager.goToState('loading');
      },

      didChangeData: function(manager) {
        didChangeData(manager);

        manager.goToState('loaded.created');
      }
    }),

    // A record enters this state when the store askes
    // the adapter for its data. It remains in this state
    // until the adapter provides the requested data.
    //
    // Usually, this process is asynchronous, using an
    // XHR to retrieve the data.
    loading: DS.State.create({
      // TRANSITIONS
      exit: function(manager) {
        var record = get(manager, 'record');
        record.trigger('didLoad');
      },

      // EVENTS
      didChangeData: function(manager, data) {
        didChangeData(manager);
        manager.send('loadedData');
      },

      loadedData: function(manager) {
        manager.goToState('loaded');
      }
    }),

    // A record enters this state when its data is populated.
    // Most of a record's lifecycle is spent inside substates
    // of the `loaded` state.
    loaded: DS.State.create({
      initialState: 'saved',

      // FLAGS
      isLoaded: true,

      // SUBSTATES

      // If there are no local changes to a record, it remains
      // in the `saved` state.
      saved: DS.State.create({

        // EVENTS
        setProperty: function(manager, context) {
          setProperty(manager, context);
          manager.goToState('updated');
        },

        setAssociation: function(manager, context) {
          setAssociation(manager, context);
          manager.goToState('updated');
        },

        didChangeData: didChangeData,

        deleteRecord: function(manager) {
          manager.goToState('deleted');
        },

        waitingOn: function(manager, object) {
          waitingOn(manager, object);
          manager.goToState('updated.pending');
        },

        invokeLifecycleCallbacks: function(manager, dirtyType) {
          var record = get(manager, 'record');
          if (dirtyType === 'created') {
            record.trigger('didCreate', record);
          } else {
            record.trigger('didUpdate', record);
          }
        }
      }),

      // A record is in this state after it has been locally
      // created but before the adapter has indicated that
      // it has been saved.
      created: createdState,

      // A record is in this state if it has already been
      // saved to the server, but there are new local changes
      // that have not yet been saved.
      updated: updatedState
    }),

    // A record is in this state if it was deleted from the store.
    deleted: DS.State.create({
      // FLAGS
      isDeleted: true,
      isLoaded: true,
      isDirty: true,

      // TRANSITIONS
      enter: function(manager) {
        var record = get(manager, 'record'),
            store = get(record, 'store');

        store.removeFromRecordArrays(record);
      },

      // SUBSTATES

      // When a record is deleted, it enters the `start`
      // state. It will exit this state when the record's
      // transaction starts to commit.
      start: DS.State.create({
        // TRANSITIONS
        enter: function(manager) {
          var record = get(manager, 'record');

          record.withTransaction(function(t) {
            t.recordBecameDirty('deleted', record);
          });
        },

        // EVENTS
        willCommit: function(manager) {
          manager.goToState('inFlight');
        },

        rollback: function(manager) {
          var record = get(manager, 'record'),
              data = get(record, 'data');

          data.rollback();
          record.withTransaction(function(t) {
            t.recordBecameClean('deleted', record);
          });
          manager.goToState('loaded');
        }
      }),

      // After a record's transaction is committing, but
      // before the adapter indicates that the deletion
      // has saved to the server, a record is in the
      // `inFlight` substate of `deleted`.
      inFlight: DS.State.create({
        // FLAGS
        isSaving: true,

        // TRANSITIONS
        enter: function(manager) {
          var record = get(manager, 'record');

          record.withTransaction(function (t) {
            t.recordBecameInFlight('deleted', record);
          });
        },

        // EVENTS
        didCommit: function(manager) {
          var record = get(manager, 'record');

          record.withTransaction(function(t) {
            t.recordBecameClean('inflight', record);
          });

          manager.goToState('saved');

          manager.send('invokeLifecycleCallbacks');
        }
      }),

      // Once the adapter indicates that the deletion has
      // been saved, the record enters the `saved` substate
      // of `deleted`.
      saved: DS.State.create({
        // FLAGS
        isDirty: false,

        invokeLifecycleCallbacks: function(manager) {
          var record = get(manager, 'record');
          record.trigger('didDelete', record);
        }
      })
    }),

    // If the adapter indicates that there was an unknown
    // error saving a record, the record enters the `error`
    // state.
    error: DS.State.create({
      isError: true,

      // EVENTS

      invokeLifecycleCallbacks: function(manager) {
        var record = get(manager, 'record');
        record.trigger('becameError', record);
      }
    })
  })
};

DS.StateManager = Ember.StateManager.extend({
  record: null,
  initialState: 'rootState',
  states: states
});

})();



(function() {
var get = Ember.get, set = Ember.set;

//  When a record is changed on the client, it is considered "dirty"--there are
//  pending changes that need to be saved to a persistence layer, such as a
//  server.
//
//  If the record is rolled back, it re-enters a clean state, any changes are
//  discarded, and its attributes are reset back to the last known good copy
//  of the data that came from the server.
//
//  If the record is committed, the changes are sent to the server to be saved,
//  and once the server confirms that they are valid, the record's "canonical"
//  data becomes the original canonical data plus the changes merged in.
//
//  A DataProxy is an object that encapsulates this change tracking. It
//  contains three buckets:
//
//  * `savedData` - the last-known copy of the data from the server
//  * `unsavedData` - a hash that contains any changes that have not yet
//     been committed
//  * `associations` - this is similar to `savedData`, but holds the client
//    ids of associated records
//
//  When setting a property on the object, the value is placed into the
//  `unsavedData` bucket:
//
//      proxy.set('key', 'value');
//
//      // unsavedData:
//      {
//        key: "value"
//      }
//
//  When retrieving a property from the object, it first looks to see
//  if that value exists in the `unsavedData` bucket, and returns it if so.
//  Otherwise, it returns the value from the `savedData` bucket.
//
//  When the adapter notifies a record that it has been saved, it merges the
//  `unsavedData` bucket into the `savedData` bucket. If the record's
//  transaction is rolled back, the `unsavedData` hash is simply discarded.
//
//  This object is a regular JS object for performance. It is only
//  used internally for bookkeeping purposes.

var DataProxy = DS._DataProxy = function(record) {
  this.record = record;

  this.unsavedData = {};

  this.associations = {};
};

DataProxy.prototype = {
  get: function(key) { return Ember.get(this, key); },
  set: function(key, value) { return Ember.set(this, key, value); },

  setAssociation: function(key, value) {
    this.associations[key] = value;
  },

  savedData: function() {
    var savedData = this._savedData;
    if (savedData) { return savedData; }

    var record = this.record,
        clientId = get(record, 'clientId'),
        store = get(record, 'store');

    if (store) {
      savedData = store.dataForRecord(record);
      this._savedData = savedData;
      return savedData;
    }
  },

  unknownProperty: function(key) {
    var unsavedData = this.unsavedData,
        associations = this.associations,
        savedData = this.savedData(),
        store;

    var value = unsavedData[key], association;

    // if this is a belongsTo association, this will
    // be a clientId.
    association = associations[key];

    if (association !== undefined) {
      store = get(this.record, 'store');
      return store.clientIdToId[association];
    }

    if (savedData && value === undefined) {
      value = savedData[key];
    }

    return value;
  },

  setUnknownProperty: function(key, value) {
    var record = this.record,
        unsavedData = this.unsavedData;

    unsavedData[key] = value;

    record.hashWasUpdated();

    return value;
  },

  commit: function() {
    this.saveData();

    this.record.notifyPropertyChange('data');
  },

  rollback: function() {
    this.unsavedData = {};

    this.record.notifyPropertyChange('data');
  },

  saveData: function() {
    var record = this.record;

    var unsavedData = this.unsavedData;
    var savedData = this.savedData();

    for (var prop in unsavedData) {
      if (unsavedData.hasOwnProperty(prop)) {
        savedData[prop] = unsavedData[prop];
        delete unsavedData[prop];
      }
    }
  },

  adapterDidUpdate: function() {
    this.unsavedData = {};
  }
};

})();



(function() {
var get = Ember.get, set = Ember.set, getPath = Ember.getPath, none = Ember.none;

var retrieveFromCurrentState = Ember.computed(function(key) {
  return get(getPath(this, 'stateManager.currentState'), key);
}).property('stateManager.currentState').cacheable();

DS.Model = Ember.Object.extend(Ember.Evented, {
  isLoaded: retrieveFromCurrentState,
  isDirty: retrieveFromCurrentState,
  isSaving: retrieveFromCurrentState,
  isDeleted: retrieveFromCurrentState,
  isError: retrieveFromCurrentState,
  isNew: retrieveFromCurrentState,
  isPending: retrieveFromCurrentState,
  isValid: retrieveFromCurrentState,

  clientId: null,
  transaction: null,
  stateManager: null,
  pendingQueue: null,
  errors: null,

  // because unknownProperty is used, any internal property
  // must be initialized here.
  primaryKey: 'id',
  id: Ember.computed(function(key, value) {
    var primaryKey = get(this, 'primaryKey'),
        data = get(this, 'data');

    if (arguments.length === 2) {
      set(data, primaryKey, value);
      return value;
    }

    var id = get(data, primaryKey);
    return id ? id : this._id;
  }).property('primaryKey', 'data'),

  // The following methods are callbacks invoked by `toJSON`. You
  // can override one of the callbacks to override specific behavior,
  // or toJSON itself.
  //
  // If you override toJSON, you can invoke these callbacks manually
  // to get the default behavior.

  /**
    Add the record's primary key to the JSON hash.

    The default implementation uses the record's specified `primaryKey`
    and the `id` computed property, which are passed in as parameters.

    @param {Object} json the JSON hash being built
    @param {Number|String} id the record's id
    @param {String} key the primaryKey for the record
  */
  addIdToJSON: function(json, id, key) {
    if (id) { json[key] = id; }
  },

  /**
    Add the attributes' current values to the JSON hash.

    The default implementation gets the current value of each
    attribute from the `data`, and uses a `defaultValue` if
    specified in the `DS.attr` definition.

    @param {Object} json the JSON hash being build
    @param {Ember.Map} attributes a Map of attributes
    @param {DataProxy} data the record's data, accessed with `get` and `set`.
  */
  addAttributesToJSON: function(json, attributes, data) {
    attributes.forEach(function(name, meta) {
      var key = meta.key(this.constructor),
          value = get(data, key);

      if (value === undefined) {
        value = meta.options.defaultValue;
      }

      json[key] = value;
    }, this);
  },

  /**
    Add the value of a `hasMany` association to the JSON hash.

    The default implementation honors the `embedded` option
    passed to `DS.hasMany`. If embedded, `toJSON` is recursively
    called on the child records. If not, the `id` of each
    record is added.

    Note that if a record is not embedded and does not
    yet have an `id` (usually provided by the server), it
    will not be included in the output.

    @param {Object} json the JSON hash being built
    @param {DataProxy} data the record's data, accessed with `get` and `set`.
    @param {Object} meta information about the association
    @param {Object} options options passed to `toJSON`
  */
  addHasManyToJSON: function(json, data, meta, options) {
    var key = meta.key,
        manyArray = get(this, key),
        records = [], i, l,
        clientId, id;

    if (meta.options.embedded) {
      // TODO: Avoid materializing embedded hashes if possible
      manyArray.forEach(function(record) {
        records.push(record.toJSON(options));
      });
    } else {
      var clientIds = get(manyArray, 'content');

      for (i=0, l=clientIds.length; i<l; i++) {
        clientId = clientIds[i];
        id = get(this, 'store').clientIdToId[clientId];

        if (id !== undefined) {
          records.push(id);
        }
      }
    }

    key = meta.options.key || get(this, 'namingConvention').keyToJSONKey(key);
    json[key] = records;
  },

  /**
    Add the value of a `belongsTo` association to the JSON hash.

    The default implementation always includes the `id`.

    @param {Object} json the JSON hash being built
    @param {DataProxy} data the record's data, accessed with `get` and `set`.
    @param {Object} meta information about the association
    @param {Object} options options passed to `toJSON`
  */
  addBelongsToToJSON: function(json, data, meta, options) {
    var key = meta.key, value, id;

    if (meta.options.embedded) {
      key = meta.options.key || get(this, 'namingConvention').keyToJSONKey(key);
      value = get(data.record, key);
      json[key] = value ? value.toJSON(options) : null;
    } else {
      key = meta.options.key || get(this, 'namingConvention').foreignKey(key);
      id = data.get(key);
      json[key] = none(id) ? null : id;
    }
  },
  /**
    Create a JSON representation of the record, including its `id`,
    attributes and associations. Honor any settings defined on the
    attributes or associations (such as `embedded` or `key`).
  */
  toJSON: function(options) {
    var data = get(this, 'data'),
        result = {},
        type = this.constructor,
        attributes = get(type, 'attributes'),
        primaryKey = get(this, 'primaryKey'),
        id = get(this, 'id'),
        store = get(this, 'store'),
        associations;

    options = options || {};

    // delegate to `addIdToJSON` callback
    this.addIdToJSON(result, id, primaryKey);

    // delegate to `addAttributesToJSON` callback
    this.addAttributesToJSON(result, attributes, data);

    associations = get(type, 'associationsByName');

    // add associations, delegating to `addHasManyToJSON` and
    // `addBelongsToToJSON`.
    associations.forEach(function(key, meta) {
      if (options.associations && meta.kind === 'hasMany') {
        this.addHasManyToJSON(result, data, meta, options);
      } else if (meta.kind === 'belongsTo') {
        this.addBelongsToToJSON(result, data, meta, options);
      }
    }, this);

    return result;
  },

  data: Ember.computed(function() {
    return new DS._DataProxy(this);
  }).cacheable(),

  didLoad: Ember.K,
  didUpdate: Ember.K,
  didCreate: Ember.K,
  didDelete: Ember.K,
  becameInvalid: Ember.K,
  becameError: Ember.K,

  init: function() {
    var stateManager = DS.StateManager.create({
      record: this
    });

    set(this, 'pendingQueue', {});

    set(this, 'stateManager', stateManager);
    stateManager.goToState('empty');
  },

  destroy: function() {
    if (!get(this, 'isDeleted')) {
      this.deleteRecord();
    }
    this._super();
  },

  send: function(name, context) {
    return get(this, 'stateManager').send(name, context);
  },

  withTransaction: function(fn) {
    var transaction = get(this, 'transaction');
    if (transaction) { fn(transaction); }
  },

  setProperty: function(key, value) {
    this.send('setProperty', { key: key, value: value });
  },

  deleteRecord: function() {
    this.send('deleteRecord');
  },

  waitingOn: function(record) {
    this.send('waitingOn', record);
  },

  notifyHashWasUpdated: function() {
    var store = get(this, 'store');
    if (store) {
      store.hashWasUpdated(this.constructor, get(this, 'clientId'), this);
    }
  },

  unknownProperty: function(key) {
    var data = get(this, 'data');

    if (data && key in data) {
      Ember.assert("You attempted to access the " + key + " property on a record without defining an attribute.", false);
    }
  },

  setUnknownProperty: function(key, value) {
    var data = get(this, 'data');

    if (data && key in data) {
      Ember.assert("You attempted to set the " + key + " property on a record without defining an attribute.", false);
    } else {
      return this._super(key, value);
    }
  },

  namingConvention: {
    keyToJSONKey: function(key) {
      // TODO: Strip off `is` from the front. Example: `isHipster` becomes `hipster`
      return Ember.String.decamelize(key);
    },

    foreignKey: function(key) {
      return Ember.String.decamelize(key) + '_id';
    }
  },

  /** @private */
  hashWasUpdated: function() {
    // At the end of the run loop, notify record arrays that
    // this record has changed so they can re-evaluate its contents
    // to determine membership.
    Ember.run.once(this, this.notifyHashWasUpdated);
  },

  dataDidChange: Ember.observer(function() {
    var associations = get(this.constructor, 'associationsByName'),
        data = get(this, 'data'), store = get(this, 'store'),
        idToClientId = store.idToClientId,
        cachedValue;

    associations.forEach(function(name, association) {
      if (association.kind === 'hasMany') {
        cachedValue = this.cacheFor(name);

        if (cachedValue) {
          var key = association.options.key || get(this, 'namingConvention').keyToJSONKey(name),
              ids = data.get(key) || [];
          
          var clientIds;   
          if(association.options.embedded) {
            clientIds = store.loadMany(association.type, ids).clientIds;
          } else {
            clientIds = Ember.EnumerableUtils.map(ids, function(id) {
              return store.clientIdForId(association.type, id);
            });
          }
          
          set(cachedValue, 'content', Ember.A(clientIds));
          cachedValue.fetch();
        }
      }
    }, this);
  }, 'data'),

  /**
    @private

    Override the default event firing from Ember.Evented to
    also call methods with the given name.
  */
  trigger: function(name) {
    this[name].apply(this, [].slice.call(arguments, 1));
    this._super.apply(this, arguments);
  }
});

// Helper function to generate store aliases.
// This returns a function that invokes the named alias
// on the default store, but injects the class as the
// first parameter.
var storeAlias = function(methodName) {
  return function() {
    var store = get(DS, 'defaultStore'),
        args = [].slice.call(arguments);

    args.unshift(this);
    return store[methodName].apply(store, args);
  };
};

DS.Model.reopenClass({
  find: storeAlias('find'),
  filter: storeAlias('filter'),

  _create: DS.Model.create,

  create: function() {
    throw new Ember.Error("You should not call `create` on a model. Instead, call `createRecord` with the attributes you would like to set.");
  },

  createRecord: storeAlias('createRecord')
});

})();



(function() {
var get = Ember.get, getPath = Ember.getPath;
DS.Model.reopenClass({
  attributes: Ember.computed(function() {
    var map = Ember.Map.create();

    this.eachComputedProperty(function(name, meta) {
      if (meta.isAttribute) { map.set(name, meta); }
    });

    return map;
  }).cacheable(),

  processAttributeKeys: function() {
    if (this.processedAttributeKeys) { return; }

    var namingConvention = this.proto().namingConvention;

    this.eachComputedProperty(function(name, meta) {
      if (meta.isAttribute && !meta.options.key) {
        meta.options.key = namingConvention.keyToJSONKey(name, this);
      }
    }, this);
  }
});

DS.attr = function(type, options) {
  var transform = DS.attr.transforms[type];
  Ember.assert("Could not find model attribute of type " + type, !!transform);

  var transformFrom = transform.from;
  var transformTo = transform.to;

  options = options || {};

  var meta = {
    type: type,
    isAttribute: true,
    options: options,

    // this will ensure that the key always takes naming
    // conventions into consideration.
    key: function(recordType) {
      recordType.processAttributeKeys();
      return options.key;
    }
  };

  return Ember.computed(function(key, value) {
    var data;

    key = meta.key(this.constructor);

    if (arguments.length === 2) {
      value = transformTo(value);
      this.setProperty(key, value);
    } else {
      data = get(this, 'data');
      value = get(data, key);

      if (value === undefined) {
        value = options.defaultValue;
      }
    }

    return transformFrom(value);
  // `data` is never set directly. However, it may be
  // invalidated from the state manager's setData
  // event.
  }).property('data').cacheable().meta(meta);
};

DS.attr.transforms = {
  string: {
    from: function(serialized) {
      return Ember.none(serialized) ? null : String(serialized);
    },

    to: function(deserialized) {
      return Ember.none(deserialized) ? null : String(deserialized);
    }
  },

  number: {
    from: function(serialized) {
      return Ember.none(serialized) ? null : Number(serialized);
    },

    to: function(deserialized) {
      return Ember.none(deserialized) ? null : Number(deserialized);
    }
  },

  'boolean': {
    from: function(serialized) {
      return Boolean(serialized);
    },

    to: function(deserialized) {
      return Boolean(deserialized);
    }
  },

  date: {
    from: function(serialized) {
      var type = typeof serialized;

      if (type === "string" || type === "number") {
        return new Date(serialized);
      } else if (serialized === null || serialized === undefined) {
        // if the value is not present in the data,
        // return undefined, not null.
        return serialized;
      } else {
        return null;
      }
    },

    to: function(date) {
      if (date instanceof Date) {
        var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var pad = function(num) {
          return num < 10 ? "0"+num : ""+num;
        };

        var utcYear = date.getUTCFullYear(),
            utcMonth = date.getUTCMonth(),
            utcDayOfMonth = date.getUTCDate(),
            utcDay = date.getUTCDay(),
            utcHours = date.getUTCHours(),
            utcMinutes = date.getUTCMinutes(),
            utcSeconds = date.getUTCSeconds();


        var dayOfWeek = days[utcDay];
        var dayOfMonth = pad(utcDayOfMonth);
        var month = months[utcMonth];

        return dayOfWeek + ", " + dayOfMonth + " " + month + " " + utcYear + " " +
               pad(utcHours) + ":" + pad(utcMinutes) + ":" + pad(utcSeconds) + " GMT";
      } else if (date === undefined) {
        return undefined;
      } else {
        return null;
      }
    }
  }
};


})();



(function() {

})();



(function() {
var get = Ember.get, set = Ember.set, getPath = Ember.getPath,
    none = Ember.none;

var embeddedFindRecord = function(store, type, data, key, one) {
  var association = get(data, key);
  return none(association) ? undefined : store.load(type, association).id;
};

var referencedFindRecord = function(store, type, data, key, one) {
  return get(data, key);
};

var hasAssociation = function(type, options, one) {
  options = options || {};

  var embedded = options.embedded,
      findRecord = embedded ? embeddedFindRecord : referencedFindRecord;

  var meta = { type: type, isAssociation: true, options: options, kind: 'belongsTo' };

  return Ember.computed(function(key, value) {
    var data = get(this, 'data'), ids, id, association,
        store = get(this, 'store');

    if (typeof type === 'string') {
      type = getPath(this, type, false) || getPath(window, type);
    }

    if (arguments.length === 2) {
      key = options.key || get(this, 'namingConvention').foreignKey(key);
      this.send('setAssociation', { key: key, value: Ember.none(value) ? null : get(value, 'clientId') });
      //data.setAssociation(key, get(value, 'clientId'));
      // put the client id in `key` in the data hash
      return value;
    } else {
      // Embedded belongsTo associations should not look for
      // a foreign key.
      if (embedded) {
        key = options.key || get(this, 'namingConvention').keyToJSONKey(key);

      // Non-embedded associations should look for a foreign key.
      // For example, instead of person, we might look for person_id
      } else {
        key = options.key || get(this, 'namingConvention').foreignKey(key);
      }
      id = findRecord(store, type, data, key, true);
      association = id ? store.find(type, id) : null;
    }

    return association;
  }).property('data').cacheable().meta(meta);
};

DS.belongsTo = function(type, options) {
  Ember.assert("The type passed to DS.belongsTo must be defined", !!type);
  return hasAssociation(type, options);
};

})();



(function() {
var get = Ember.get, set = Ember.set, getPath = Ember.getPath;
var embeddedFindRecord = function(store, type, data, key) {
  var association = get(data, key);
  return association ? store.loadMany(type, association).ids : [];
};

var referencedFindRecord = function(store, type, data, key, one) {
  return get(data, key);
};

var hasAssociation = function(type, options) {
  options = options || {};

  var embedded = options.embedded,
      findRecord = embedded ? embeddedFindRecord : referencedFindRecord;

  var meta = { type: type, isAssociation: true, options: options, kind: 'hasMany' };

  return Ember.computed(function(key, value) {
    var data = get(this, 'data'),
        store = get(this, 'store'),
        ids, id, association;

    if (typeof type === 'string') {
      type = getPath(this, type, false) || getPath(window, type);
    }

    key = options.key || get(this, 'namingConvention').keyToJSONKey(key);
    ids = findRecord(store, type, data, key);
    association = store.findMany(type, ids || []);
    set(association, 'parentRecord', this);

    return association;
  }).property().cacheable().meta(meta);
};

DS.hasMany = function(type, options) {
  Ember.assert("The type passed to DS.hasMany must be defined", !!type);
  return hasAssociation(type, options);
};

})();



(function() {
var get = Ember.get, getPath = Ember.getPath;

DS.Model.reopenClass({
  typeForAssociation: function(name) {
    var association = get(this, 'associationsByName').get(name);
    return association && association.type;
  },

  associations: Ember.computed(function() {
    var map = Ember.Map.create();

    this.eachComputedProperty(function(name, meta) {
      if (meta.isAssociation) {
        var type = meta.type,
            typeList = map.get(type);

        if (typeof type === 'string') {
          type = getPath(this, type, false) || getPath(window, type);
          meta.type = type;
        }

        if (!typeList) {
          typeList = [];
          map.set(type, typeList);
        }

        typeList.push({ name: name, kind: meta.kind });
      }
    });

    return map;
  }).cacheable(),

  associationsByName: Ember.computed(function() {
    var map = Ember.Map.create(), type;

    this.eachComputedProperty(function(name, meta) {
      if (meta.isAssociation) {
        meta.key = name;
        type = meta.type;

        if (typeof type === 'string') {
          type = getPath(this, type, false) || getPath(window, type);
          meta.type = type;
        }

        map.set(name, meta);
      }
    });

    return map;
  }).cacheable()
});

})();



(function() {

})();



(function() {
/**
  An adapter is an object that receives requests from a store and
  translates them into the appropriate action to take against your
  persistence layer. The persistence layer is usually an HTTP API, but may
  be anything, such as the browser's local storage.

  ### Creating an Adapter

  First, create a new subclass of `DS.Adapter`:

      App.MyAdapter = DS.Adapter.extend({
        // ...your code here
      });

  To tell your store which adapter to use, set its `adapter` property:

      App.store = DS.Store.create({
        revision: 3,
        adapter: App.MyAdapter.create()
      });

  `DS.Adapter` is an abstract base class that you should override in your
  application to customize it for your backend. The minimum set of methods
  that you should implement is:

    * `find()`
    * `createRecord()`
    * `updateRecord()`
    * `deleteRecord()`

   To improve the network performance of your application, you can optimize
   your adapter by overriding these lower-level methods:

    * `findMany()`
    * `createRecords()`
    * `updateRecords()`
    * `deleteRecords()`
    * `commit()`

   For more information about the adapter API, please see `README.md`.
*/

DS.Adapter = Ember.Object.extend({
  /**
    The `find()` method is invoked when the store is asked for a record that
    has not previously been loaded. In response to `find()` being called, you
    should query your persistence layer for a record with the given ID. Once
    found, you can asynchronously call the store's `load()` method to load
    the record.

    Here is an example `find` implementation:

      find: function(store, type, id) {
        var url = type.url;
        url = url.fmt(id);

        jQuery.getJSON(url, function(data) {
            // data is a Hash of key/value pairs. If your server returns a
            // root, simply do something like:
            // store.load(type, id, data.person)
            store.load(type, id, data);
        });
      }
  */
  find: null,

  /**
    If the globally unique IDs for your records should be generated on the client,
    implement the `generateIdForRecord()` method. This method will be invoked
    each time you create a new record, and the value returned from it will be
    assigned to the record's `primaryKey`.

    Most traditional REST-like HTTP APIs will not use this method. Instead, the ID
    of the record will be set by the server, and your adapter will update the store
    with the new ID when it calls `didCreateRecord()`. Only implement this method if
    you intend to generate record IDs on the client-side.

    The `generateIdForRecord()` method will be invoked with the requesting store as
    the first parameter and the newly created record as the second parameter:

        generateIdForRecord: function(store, record) {
          var uuid = App.generateUUIDWithStatisticallyLowOddsOfCollision();
          return uuid;
        }
  */
  generateIdForRecord: null,

  commit: function(store, commitDetails) {
    commitDetails.updated.eachType(function(type, array) {
      this.updateRecords(store, type, array.slice());
    }, this);

    commitDetails.created.eachType(function(type, array) {
      this.createRecords(store, type, array.slice());
    }, this);

    commitDetails.deleted.eachType(function(type, array) {
      this.deleteRecords(store, type, array.slice());
    }, this);
  },

  createRecords: function(store, type, records) {
    records.forEach(function(record) {
      this.createRecord(store, type, record);
    }, this);
  },

  updateRecords: function(store, type, records) {
    records.forEach(function(record) {
      this.updateRecord(store, type, record);
    }, this);
  },

  deleteRecords: function(store, type, records) {
    records.forEach(function(record) {
      this.deleteRecord(store, type, record);
    }, this);
  },

  findMany: function(store, type, ids) {
    ids.forEach(function(id) {
      this.find(store, type, id);
    }, this);
  }
});

})();



(function() {
var set = Ember.set;

Ember.onLoad('application', function(app) {
  app.registerInjection({
    name: "store",
    before: "controllers",

    injection: function(app, stateManager, property) {
      if (property === 'Store') {
        set(stateManager, 'store', app[property].create());
      }
    }
  });

  app.registerInjection({
    name: "giveStoreToControllers",

    injection: function(app, stateManager, property) {
      if (property.match(/Controller$/)) {
        var controllerName = property.charAt(0).toLowerCase() + property.substr(1);
        var store = stateManager.get('store');
        var controller = stateManager.get(controllerName);

        controller.set('store', store);
      }
    }
  });
});

})();



(function() {
DS.fixtureAdapter = DS.Adapter.create({
  find: function(store, type, id) {
    var fixtures = type.FIXTURES;

    Ember.assert("Unable to find fixtures for model type "+type.toString(), !!fixtures);
    if (fixtures.hasLoaded) { return; }

    setTimeout(function() {
      store.loadMany(type, fixtures);
      fixtures.hasLoaded = true;
    }, 300);
  },

  findMany: function() {
    this.find.apply(this, arguments);
  },

  findAll: function(store, type) {
    var fixtures = type.FIXTURES;

    Ember.assert("Unable to find fixtures for model type "+type.toString(), !!fixtures);

    var ids = fixtures.map(function(item, index, self){ return item.id; });
    store.loadMany(type, ids, fixtures);
  }

});

})();



(function() {
/*global jQuery*/

var get = Ember.get, set = Ember.set, getPath = Ember.getPath;

DS.RESTAdapter = DS.Adapter.extend({
  bulkCommit: false,
	
  createRecord: function(store, type, record) {
    var root = this.rootForType(type);

    var data = {};
    data[root] = record.toJSON();

    this.ajax(this.buildURL(root), "POST", {
      data: data,
      context: this,
      success: function(json) {
        this.didCreateRecord(store, type, record, json);
      }
    });
  },

  didCreateRecord: function(store, type, record, json) {
    var root = this.rootForType(type);

    this.sideload(store, type, json, root);
    store.didCreateRecord(record, json[root]);
  },

  createRecords: function(store, type, records) {
    if (get(this, 'bulkCommit') === false) {
      return this._super(store, type, records);
    }

    var root = this.rootForType(type),
        plural = this.pluralize(root);

    var data = {};
    data[plural] = records.map(function(record) {
      return record.toJSON();
    });

    this.ajax(this.buildURL(root), "POST", {
      data: data,
      context: this,
      success: function(json) {
        this.didCreateRecords(store, type, records, json);
      }
    });
  },

  didCreateRecords: function(store, type, records, json) {
    var root = this.pluralize(this.rootForType(type));

    this.sideload(store, type, json, root);
    store.didCreateRecords(type, records, json[root]);
  },

  updateRecord: function(store, type, record) {
    var id = get(record, 'id');
    var root = this.rootForType(type);

    var data = {};
    data[root] = record.toJSON();

    this.ajax(this.buildURL(root, id), "PUT", {
      data: data,
      context: this,
      success: function(json) {
        this.didUpdateRecord(store, type, record, json);
      }
    });
  },

  didUpdateRecord: function(store, type, record, json) {
    var root = this.rootForType(type);

    this.sideload(store, type, json, root);
    store.didUpdateRecord(record, json && json[root]);
  },

  updateRecords: function(store, type, records) {
    if (get(this, 'bulkCommit') === false) {
      return this._super(store, type, records);
    }

    var root = this.rootForType(type),
        plural = this.pluralize(root);

    var data = {};
    data[plural] = records.map(function(record) {
      return record.toJSON();
    });

    this.ajax(this.buildURL(root, "bulk"), "PUT", {
      data: data,
      context: this,
      success: function(json) {
        this.didUpdateRecords(store, type, records, json);
      }
    });
  },

  didUpdateRecords: function(store, type, records, json) {
    var root = this.pluralize(this.rootForType(type));

    this.sideload(store, type, json, root);
    store.didUpdateRecords(records, json[root]);
  },

  deleteRecord: function(store, type, record) {
    var id = get(record, 'id');
    var root = this.rootForType(type);

    this.ajax(this.buildURL(root, id), "DELETE", {
      context: this,
      success: function(json) {
        this.didDeleteRecord(store, type, record, json);
      }
    });
  },

  didDeleteRecord: function(store, type, record, json) {
    if (json) { this.sideload(store, type, json); }
    store.didDeleteRecord(record);
  },

  deleteRecords: function(store, type, records) {
    if (get(this, 'bulkCommit') === false) {
      return this._super(store, type, records);
    }

    var root = this.rootForType(type),
        plural = this.pluralize(root);

    var data = {};
    data[plural] = records.map(function(record) {
      return get(record, 'id');
    });

    this.ajax(this.buildURL(root, 'bulk'), "DELETE", {
      data: data,
      context: this,
      success: function(json) {
        this.didDeleteRecords(store, type, records, json);
      }
    });
  },

  didDeleteRecords: function(store, type, records, json) {
    if (json) { this.sideload(store, type, json); }
    store.didDeleteRecords(records);
  },

  find: function(store, type, id) {
    var root = this.rootForType(type);

    this.ajax(this.buildURL(root, id), "GET", {
      success: function(json) {
        this.sideload(store, type, json, root);
        store.load(type, json[root]);
      }
    });
  },

  findMany: function(store, type, ids) {
    var root = this.rootForType(type), plural = this.pluralize(root);

    this.ajax(this.buildURL(root), "GET", {
      data: { ids: ids },
      success: function(json) {
        this.sideload(store, type, json, plural);
        store.loadMany(type, json[plural]);
      }
    });
  },

  findAll: function(store, type) {
    var root = this.rootForType(type), plural = this.pluralize(root);

    this.ajax(this.buildURL(root), "GET", {
      success: function(json) {
        this.sideload(store, type, json, plural);
        store.loadMany(type, json[plural]);
      }
    });
  },

  findQuery: function(store, type, query, recordArray) {
    var root = this.rootForType(type), plural = this.pluralize(root);

    this.ajax(this.buildURL(root), "GET", {
      data: query,
      success: function(json) {
        this.sideload(store, type, json, plural);
        recordArray.load(json[plural]);
      }
    });
  },

  // HELPERS

  plurals: {},

  // define a plurals hash in your subclass to define
  // special-case pluralization
  pluralize: function(name) {
    return this.plurals[name] || name + "s";
  },

  rootForType: function(type) {
    if (type.url) { return type.url; }

    // use the last part of the name as the URL
    var parts = type.toString().split(".");
    var name = parts[parts.length - 1];
    return name.replace(/([A-Z])/g, '_$1').toLowerCase().slice(1);
  },

  ajax: function(url, type, hash) {
    hash.url = url;
    hash.type = type;
    hash.dataType = 'json';
    hash.contentType = 'application/json; charset=utf-8';
    hash.context = this;

    if (hash.data && type !== 'GET') {
      hash.data = JSON.stringify(hash.data);
    }

    jQuery.ajax(hash);
  },

  sideload: function(store, type, json, root) {
    var sideloadedType, mappings, loaded = {};

    loaded[root] = true;

    for (var prop in json) {
      if (!json.hasOwnProperty(prop)) { continue; }
      if (prop === root) { continue; }

      sideloadedType = type.typeForAssociation(prop);

      if (!sideloadedType) {
        mappings = get(this, 'mappings');
        Ember.assert("Your server returned a hash with the key " + prop + " but you have no mappings", !!mappings);

        sideloadedType = get(mappings, prop);

        if (typeof sideloadedType === 'string') {
          sideloadedType = getPath(window, sideloadedType);
        }

        Ember.assert("Your server returned a hash with the key " + prop + " but you have no mapping for it", !!sideloadedType);
      }

      this.sideloadAssociations(store, sideloadedType, json, prop, loaded);
    }
  },

  sideloadAssociations: function(store, type, json, prop, loaded) {
    loaded[prop] = true;

    get(type, 'associationsByName').forEach(function(key, meta) {
      key = meta.key || key;
      if (meta.kind === 'belongsTo') {
        key = this.pluralize(key);
      }
      if (json[key] && !loaded[key]) {
        this.sideloadAssociations(store, meta.type, json, key, loaded);
      }
    }, this);

    this.loadValue(store, type, json[prop]);
  },

  loadValue: function(store, type, value) {
    if (value instanceof Array) {
      store.loadMany(type, value);
    } else {
      store.load(type, value);
    }
  },

  buildURL: function(record, suffix) {
    var url = [""];

    Ember.assert("Namespace URL (" + this.namespace + ") must not start with slash", !this.namespace || this.namespace.toString().charAt(0) !== "/");
    Ember.assert("Record URL (" + record + ") must not start with slash", !record || record.toString().charAt(0) !== "/");
    Ember.assert("URL suffix (" + suffix + ") must not start with slash", !suffix || suffix.toString().charAt(0) !== "/");

    if (this.namespace !== undefined) {
      url.push(this.namespace);
    }

    url.push(this.pluralize(record));
    if (suffix !== undefined) {
      url.push(suffix);
    }

    return url.join("/");
  }
});


})();



(function() {
//Copyright (C) 2011 by Living Social, Inc.

//Permission is hereby granted, free of charge, to any person obtaining a copy of
//this software and associated documentation files (the "Software"), to deal in
//the Software without restriction, including without limitation the rights to
//use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
//of the Software, and to permit persons to whom the Software is furnished to do
//so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.

})();

ansiparse = function (str) {
  //
  // I'm terrible at writing parsers.
  //
  var matchingControl = null,
      matchingData = null,
      matchingText = '',
      ansiState = [],
      result = [],
      state = {};

  //
  // General workflow for this thing is:
  // \033\[33mText
  // |     |  |
  // |     |  matchingText
  // |     matchingData
  // matchingControl
  //
  // In further steps we hope it's all going to be fine. It usually is.
  //

  for (var i = 0; i < str.length; i++) {
    if (matchingControl != null) {
      if (matchingControl == '\033' && str[i] == '\[') {
        //
        // We've matched full control code. Lets start matching formating data.
        //

        //
        // "emit" matched text with correct state
        //
        if (matchingText) {
          state.text = matchingText;
          result.push(state);
          state = {};
          matchingText = "";
        }

        matchingControl = null;
        matchingData = '';
      }
      else {
        //
        // We failed to match anything - most likely a bad control code. We
        // go back to matching regular strings.
        //
        matchingText += matchingControl + str[i];
        matchingControl = null;
      }
      continue;
    }
    else if (matchingData != null) {
      if (str[i] == ';') {
        //
        // `;` separates many formatting codes, for example: `\033[33;43m`
        // means that both `33` and `43` should be applied.
        //
        // TODO: this can be simplified by modifying state here.
        //
        ansiState.push(matchingData);
        matchingData = '';
      }
      else if (str[i] == 'm') {
        //
        // `m` finished whole formatting code. We can proceed to matching
        // formatted text.
        //
        ansiState.push(matchingData);
        matchingData = null;
        matchingText = '';

        //
        // Convert matched formatting data into user-friendly state object.
        //
        // TODO: DRY.
        //
        ansiState.forEach(function (ansiCode) {
          if (ansiparse.foregroundColors[ansiCode]) {
            state.foreground = ansiparse.foregroundColors[ansiCode];
          }
          else if (ansiparse.backgroundColors[ansiCode]) {
            state.background = ansiparse.backgroundColors[ansiCode];
          }
          else if (ansiCode == 39) {
            delete state.foreground;
          }
          else if (ansiCode == 49) {
            delete state.background;
          }
          else if (ansiparse.styles[ansiCode]) {
            state[ansiparse.styles[ansiCode]] = true;
          }
          else if (ansiCode == 22) {
            state.bold = false;
          }
          else if (ansiCode == 23) {
            state.italic = false;
          }
          else if (ansiCode == 24) {
            state.underline = false;
          }
        });
        ansiState = [];
      }
      else {
        matchingData += str[i];
      }
      continue;
    }

    if (str[i] == '\033') {
      matchingControl = str[i];

    }
    else {
      matchingText += str[i];
    }
  }

  if (matchingText) {
    state.text = matchingText + (matchingControl ? matchingControl : '');
    result.push(state);
  }
  return result;
}

ansiparse.foregroundColors = {
  '30': 'black',
  '31': 'red',
  '32': 'green',
  '33': 'yellow',
  '34': 'blue',
  '35': 'magenta',
  '36': 'cyan',
  '37': 'white',
  '90': 'grey'
};

ansiparse.backgroundColors = {
  '40': 'black',
  '41': 'red',
  '42': 'green',
  '43': 'yellow',
  '44': 'blue',
  '45': 'magenta',
  '46': 'cyan',
  '47': 'white'
};

ansiparse.styles = {
  '1': 'bold',
  '3': 'italic',
  '4': 'underline'
};

if (typeof module == "object" && typeof window == "undefined") {
  module.exports = ansiparse;
}


// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement /*, fromIndex */) {
    "use strict";

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    if (len === 0) {
      return -1;
    }

    var n = 0;
    if (arguments.length > 0) {
      n = Number(arguments[1]);
      if (n !== n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n !== 0 && n !== (Infinity) && n !== -(Infinity)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }

    if (n >= len) {
      return -1;
    }

    var k = n >= 0
          ? n
          : Math.max(len - Math.abs(n), 0);

    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }

    return -1;
  };
}

// Instantiate the object
var I18n = I18n || {};

// Set default locale to english
I18n.defaultLocale = "en";

// Set default handling of translation fallbacks to false
I18n.fallbacks = false;

// Set default separator
I18n.defaultSeparator = ".";

// Set current locale to null
I18n.locale = null;

// Set the placeholder format. Accepts `{{placeholder}}` and `%{placeholder}`.
I18n.PLACEHOLDER = /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm;

I18n.fallbackRules = {
};

I18n.pluralizationRules = {
  en: function (n) {
    return n == 0 ? ["zero", "none", "other"] : n == 1 ? "one" : "other";
  }
};

I18n.getFallbacks = function(locale) {
  if (locale === I18n.defaultLocale) {
    return [];
  } else if (!I18n.fallbackRules[locale]) {
    var rules = []
      , components = locale.split("-");

    for (var l = 1; l < components.length; l++) {
      rules.push(components.slice(0, l).join("-"));
    }

    rules.push(I18n.defaultLocale);

    I18n.fallbackRules[locale] = rules;
  }

  return I18n.fallbackRules[locale];
}

I18n.isValidNode = function(obj, node, undefined) {
  return obj[node] !== null && obj[node] !== undefined;
};

I18n.lookup = function(scope, options) {
  var options = options || {}
    , lookupInitialScope = scope
    , translations = this.prepareOptions(I18n.translations)
    , locale = options.locale || I18n.currentLocale()
    , messages = translations[locale] || {}
    , options = this.prepareOptions(options)
    , currentScope
  ;

  if (typeof(scope) == "object") {
    scope = scope.join(this.defaultSeparator);
  }

  if (options.scope) {
    scope = options.scope.toString() + this.defaultSeparator + scope;
  }

  scope = scope.split(this.defaultSeparator);

  while (messages && scope.length > 0) {
    currentScope = scope.shift();
    messages = messages[currentScope];
  }

  if (!messages) {
    if (I18n.fallbacks) {
      var fallbacks = this.getFallbacks(locale);
      for (var fallback = 0; fallback < fallbacks.length; fallbacks++) {
        messages = I18n.lookup(lookupInitialScope, this.prepareOptions({locale: fallbacks[fallback]}, options));
        if (messages) {
          break;
        }
      }
    }

    if (!messages && this.isValidNode(options, "defaultValue")) {
        messages = options.defaultValue;
    }
  }

  return messages;
};

// Merge serveral hash options, checking if value is set before
// overwriting any value. The precedence is from left to right.
//
//   I18n.prepareOptions({name: "John Doe"}, {name: "Mary Doe", role: "user"});
//   #=> {name: "John Doe", role: "user"}
//
I18n.prepareOptions = function() {
  var options = {}
    , opts
    , count = arguments.length
  ;

  for (var i = 0; i < count; i++) {
    opts = arguments[i];

    if (!opts) {
      continue;
    }

    for (var key in opts) {
      if (!this.isValidNode(options, key)) {
        options[key] = opts[key];
      }
    }
  }

  return options;
};

I18n.interpolate = function(message, options) {
  options = this.prepareOptions(options);
  var matches = message.match(this.PLACEHOLDER)
    , placeholder
    , value
    , name
  ;

  if (!matches) {
    return message;
  }

  for (var i = 0; placeholder = matches[i]; i++) {
    name = placeholder.replace(this.PLACEHOLDER, "$1");

    value = options[name];

    if (!this.isValidNode(options, name)) {
      value = "[missing " + placeholder + " value]";
    }

    regex = new RegExp(placeholder.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}"));
    message = message.replace(regex, value);
  }

  return message;
};

I18n.translate = function(scope, options) {
  options = this.prepareOptions(options);
  var translation = this.lookup(scope, options);

  try {
    if (typeof(translation) == "object") {
      if (typeof(options.count) == "number") {
        return this.pluralize(options.count, scope, options);
      } else {
        return translation;
      }
    } else {
      return this.interpolate(translation, options);
    }
  } catch(err) {
    return this.missingTranslation(scope);
  }
};

I18n.localize = function(scope, value) {
  switch (scope) {
    case "currency":
      return this.toCurrency(value);
    case "number":
      scope = this.lookup("number.format");
      return this.toNumber(value, scope);
    case "percentage":
      return this.toPercentage(value);
    default:
      if (scope.match(/^(date|time)/)) {
        return this.toTime(scope, value);
      } else {
        return value.toString();
      }
  }
};

I18n.parseDate = function(date) {
  var matches, convertedDate;

  // we have a date, so just return it.
  if (typeof(date) == "object") {
    return date;
  };

  // it matches the following formats:
  //   yyyy-mm-dd
  //   yyyy-mm-dd[ T]hh:mm::ss
  //   yyyy-mm-dd[ T]hh:mm::ss
  //   yyyy-mm-dd[ T]hh:mm::ssZ
  //   yyyy-mm-dd[ T]hh:mm::ss+0000
  //
  matches = date.toString().match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?(Z|\+0000)?/);

  if (matches) {
    for (var i = 1; i <= 6; i++) {
      matches[i] = parseInt(matches[i], 10) || 0;
    }

    // month starts on 0
    matches[2] -= 1;

    if (matches[7]) {
      convertedDate = new Date(Date.UTC(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6]));
    } else {
      convertedDate = new Date(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6]);
    }
  } else if (typeof(date) == "number") {
    // UNIX timestamp
    convertedDate = new Date();
    convertedDate.setTime(date);
  } else if (date.match(/\d+ \d+:\d+:\d+ [+-]\d+ \d+/)) {
    // a valid javascript format with timezone info
    convertedDate = new Date();
    convertedDate.setTime(Date.parse(date))
  } else {
    // an arbitrary javascript string
    convertedDate = new Date();
    convertedDate.setTime(Date.parse(date));
  }

  return convertedDate;
};

I18n.toTime = function(scope, d) {
  var date = this.parseDate(d)
    , format = this.lookup(scope)
  ;

  if (date.toString().match(/invalid/i)) {
    return date.toString();
  }

  if (!format) {
    return date.toString();
  }

  return this.strftime(date, format);
};

I18n.strftime = function(date, format) {
  var options = this.lookup("date");

  if (!options) {
    return date.toString();
  }

  options.meridian = options.meridian || ["AM", "PM"];

  var weekDay = date.getDay()
    , day = date.getDate()
    , year = date.getFullYear()
    , month = date.getMonth() + 1
    , hour = date.getHours()
    , hour12 = hour
    , meridian = hour > 11 ? 1 : 0
    , secs = date.getSeconds()
    , mins = date.getMinutes()
    , offset = date.getTimezoneOffset()
    , absOffsetHours = Math.floor(Math.abs(offset / 60))
    , absOffsetMinutes = Math.abs(offset) - (absOffsetHours * 60)
    , timezoneoffset = (offset > 0 ? "-" : "+") + (absOffsetHours.toString().length < 2 ? "0" + absOffsetHours : absOffsetHours) + (absOffsetMinutes.toString().length < 2 ? "0" + absOffsetMinutes : absOffsetMinutes)
  ;

  if (hour12 > 12) {
    hour12 = hour12 - 12;
  } else if (hour12 === 0) {
    hour12 = 12;
  }

  var padding = function(n) {
    var s = "0" + n.toString();
    return s.substr(s.length - 2);
  };

  var f = format;
  f = f.replace("%a", options.abbr_day_names[weekDay]);
  f = f.replace("%A", options.day_names[weekDay]);
  f = f.replace("%b", options.abbr_month_names[month]);
  f = f.replace("%B", options.month_names[month]);
  f = f.replace("%d", padding(day));
  f = f.replace("%e", day);
  f = f.replace("%-d", day);
  f = f.replace("%H", padding(hour));
  f = f.replace("%-H", hour);
  f = f.replace("%I", padding(hour12));
  f = f.replace("%-I", hour12);
  f = f.replace("%m", padding(month));
  f = f.replace("%-m", month);
  f = f.replace("%M", padding(mins));
  f = f.replace("%-M", mins);
  f = f.replace("%p", options.meridian[meridian]);
  f = f.replace("%S", padding(secs));
  f = f.replace("%-S", secs);
  f = f.replace("%w", weekDay);
  f = f.replace("%y", padding(year));
  f = f.replace("%-y", padding(year).replace(/^0+/, ""));
  f = f.replace("%Y", year);
  f = f.replace("%z", timezoneoffset);

  return f;
};

I18n.toNumber = function(number, options) {
  options = this.prepareOptions(
    options,
    this.lookup("number.format"),
    {precision: 3, separator: ".", delimiter: ",", strip_insignificant_zeros: false}
  );

  var negative = number < 0
    , string = Math.abs(number).toFixed(options.precision).toString()
    , parts = string.split(".")
    , precision
    , buffer = []
    , formattedNumber
  ;

  number = parts[0];
  precision = parts[1];

  while (number.length > 0) {
    buffer.unshift(number.substr(Math.max(0, number.length - 3), 3));
    number = number.substr(0, number.length -3);
  }

  formattedNumber = buffer.join(options.delimiter);

  if (options.precision > 0) {
    formattedNumber += options.separator + parts[1];
  }

  if (negative) {
    formattedNumber = "-" + formattedNumber;
  }

  if (options.strip_insignificant_zeros) {
    var regex = {
        separator: new RegExp(options.separator.replace(/\./, "\\.") + "$")
      , zeros: /0+$/
    };

    formattedNumber = formattedNumber
      .replace(regex.zeros, "")
      .replace(regex.separator, "")
    ;
  }

  return formattedNumber;
};

I18n.toCurrency = function(number, options) {
  options = this.prepareOptions(
    options,
    this.lookup("number.currency.format"),
    this.lookup("number.format"),
    {unit: "$", precision: 2, format: "%u%n", delimiter: ",", separator: "."}
  );

  number = this.toNumber(number, options);
  number = options.format
    .replace("%u", options.unit)
    .replace("%n", number)
  ;

  return number;
};

I18n.toHumanSize = function(number, options) {
  var kb = 1024
    , size = number
    , iterations = 0
    , unit
    , precision
  ;

  while (size >= kb && iterations < 4) {
    size = size / kb;
    iterations += 1;
  }

  if (iterations === 0) {
    unit = this.t("number.human.storage_units.units.byte", {count: size});
    precision = 0;
  } else {
    unit = this.t("number.human.storage_units.units." + [null, "kb", "mb", "gb", "tb"][iterations]);
    precision = (size - Math.floor(size) === 0) ? 0 : 1;
  }

  options = this.prepareOptions(
    options,
    {precision: precision, format: "%n%u", delimiter: ""}
  );

  number = this.toNumber(size, options);
  number = options.format
    .replace("%u", unit)
    .replace("%n", number)
  ;

  return number;
};

I18n.toPercentage = function(number, options) {
  options = this.prepareOptions(
    options,
    this.lookup("number.percentage.format"),
    this.lookup("number.format"),
    {precision: 3, separator: ".", delimiter: ""}
  );

  number = this.toNumber(number, options);
  return number + "%";
};

I18n.pluralizer = function(locale) {
  pluralizer = this.pluralizationRules[locale];
  if (pluralizer !== undefined) return pluralizer;
  return this.pluralizationRules["en"];
};

I18n.findAndTranslateValidNode = function(keys, translation) {
  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    if (this.isValidNode(translation, key)) return translation[key];
  }
  return null;
};

I18n.pluralize = function(count, scope, options) {
  var translation;

  try {
    translation = this.lookup(scope, options);
  } catch (error) {}

  if (!translation) {
    return this.missingTranslation(scope);
  }

  var message;
  options = this.prepareOptions(options);
  options.count = count.toString();

  pluralizer = this.pluralizer(this.currentLocale());
  key = pluralizer(Math.abs(count));
  keys = ((typeof key == "object") && (key instanceof Array)) ? key : [key];

  message = this.findAndTranslateValidNode(keys, translation);
  if (message == null) message = this.missingTranslation(scope, keys[0]);

  return this.interpolate(message, options);
};

I18n.missingTranslation = function() {
  var message = '[missing "' + this.currentLocale()
    , count = arguments.length
  ;

  for (var i = 0; i < count; i++) {
    message += "." + arguments[i];
  }

  message += '" translation]';

  return message;
};

I18n.currentLocale = function() {
  return (I18n.locale || I18n.defaultLocale);
};

// shortcuts
I18n.t = I18n.translate;
I18n.l = I18n.localize;
I18n.p = I18n.pluralize;

/*
 * timeago: a jQuery plugin, version: 0.9.2 (2010-09-14)
 * @requires jQuery v1.2.3 or later
 *
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. '4 minutes ago' or 'about 1 day ago').
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2008-2010, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
 */
(function($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) return inWords(timestamp);
    else if (typeof timestamp == 'string') return inWords($.timeago.parse(timestamp));
    else return inWords($.timeago.datetime(timestamp));
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 3000,
      allowFuture: true,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: 'ago',
        suffixFromNow: 'from now',
        seconds: 'less than a minute',
        minute: 'about a minute',
        minutes: '%d minutes',
        hour: 'about an hour',
        hours: 'about %d hours',
        day: 'a day',
        days: '%d days',
        month: 'about a month',
        months: '%d months',
        year: 'about a year',
        years: '%d years',
        numbers: []
      }
    },
    distanceInWords: function(date) {
      if(!date) {
        return;
      }
      if(typeof date == 'string') {
        date = $.timeago.parse(date);
      }
      return $.timeago.inWords($.timeago.distance(date));
    },
    inWords: function(distanceMillis) {
      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
        distanceMillis = Math.abs(distanceMillis);
      }

      var seconds = distanceMillis / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 48 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.floor(days)) ||
        days < 60 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.floor(days / 30)) ||
        years < 2 && substitute($l.year, 1) ||
        substitute($l.years, Math.floor(years));

      return $.trim([prefix, words, suffix].join(' '));
    },
    distance: function(date) {
      return (this.now() - date.getTime());
    },
    now: function() {
      return new Date().getTime();
    },
    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d\d\d+/,''); // remove milliseconds
      s = s.replace(/-/,'/').replace(/-/,'/');
      s = s.replace(/T/,' ').replace(/Z/,' UTC');
      s = s.replace(/([\+-]\d\d)\:?(\d\d)/,' $1$2'); // -04:00 -> -0400
      return new Date(s);
    }
  });

  $.fn.timeago = function() {
    this.each(function() {
      var data = prepareData(this);
      if (!isNaN(data.datetime)) {
        $(this).text(inWords(data.datetime));
      }
    });
    return this;
  };

  function prepareData(element) {
    element = $(element);
    if (!element.data('timeago') || (element.data('timeago').title != element.attr('title'))) {
      element.data('timeago', { datetime: $t.parse(element.attr('title')), title: element.attr('title') });
    }
    return element.data('timeago');
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return $t.distance(date);
  }

  // fix for IE6 suckage
  document.createElement('abbr');
  document.createElement('time');
})(jQuery);



/*!
 * MockJax - jQuery Plugin to Mock Ajax requests
 *
 * Version:  1.5.0pre
 * Released:
 * Home:   http://github.com/appendto/jquery-mockjax
 * Author:   Jonathan Sharp (http://jdsharp.com)
 * License:  MIT,GPL
 *
 * Copyright (c) 2011 appendTo LLC.
 * Dual licensed under the MIT or GPL licenses.
 * http://appendto.com/open-source-licenses
 */
(function($) {
	var _ajax = $.ajax,
		mockHandlers = [],
		CALLBACK_REGEX = /=\?(&|$)/,
		jsc = (new Date()).getTime();


	// Parse the given XML string.
	function parseXML(xml) {
		if ( window['DOMParser'] == undefined && window.ActiveXObject ) {
			DOMParser = function() { };
			DOMParser.prototype.parseFromString = function( xmlString ) {
				var doc = new ActiveXObject('Microsoft.XMLDOM');
				doc.async = 'false';
				doc.loadXML( xmlString );
				return doc;
			};
		}

		try {
			var xmlDoc 	= ( new DOMParser() ).parseFromString( xml, 'text/xml' );
			if ( $.isXMLDoc( xmlDoc ) ) {
				var err = $('parsererror', xmlDoc);
				if ( err.length == 1 ) {
					throw('Error: ' + $(xmlDoc).text() );
				}
			} else {
				throw('Unable to parse XML');
			}
		} catch( e ) {
			var msg = ( e.name == undefined ? e : e.name + ': ' + e.message );
			$(document).trigger('xmlParseError', [ msg ]);
			return undefined;
		}
		return xmlDoc;
	}

	// Trigger a jQuery event
	function trigger(s, type, args) {
		(s.context ? jQuery(s.context) : jQuery.event).trigger(type, args);
	}

	// Check if the data field on the mock handler and the request match. This
	// can be used to restrict a mock handler to being used only when a certain
	// set of data is passed to it.
	function isMockDataEqual( mock, live ) {
		var identical = false;
		// Test for situations where the data is a querystring (not an object)
		if (typeof live === 'string') {
			// Querystring may be a regex
			return $.isFunction( mock.test ) ? mock.test(live) : mock == live;
		}
		$.each(mock, function(k, v) {
			if ( live[k] === undefined ) {
				identical = false;
				return identical;
			} else {
				identical = true;
				if ( typeof live[k] == 'object' ) {
					return isMockDataEqual(mock[k], live[k]);
				} else {
					if ( $.isFunction( mock[k].test ) ) {
						identical = mock[k].test(live[k]);
					} else {
						identical = ( mock[k] == live[k] );
					}
					return identical;
				}
			}
		});

		return identical;
	}

	// Check the given handler should mock the given request
	function getMockForRequest( handler, requestSettings ) {
		// If the mock was registered with a function, let the function decide if we
		// want to mock this request
		if ( $.isFunction(handler) ) {
			return handler( requestSettings );
		}

		// Inspect the URL of the request and check if the mock handler's url
		// matches the url for this ajax request
		if ( $.isFunction(handler.url.test) ) {
			// The user provided a regex for the url, test it
			if ( !handler.url.test( requestSettings.url ) ) {
				return null;
			}
		} else {
			// Look for a simple wildcard '*' or a direct URL match
			var star = handler.url.indexOf('*');
			if (handler.url !== requestSettings.url && star === -1 ||
					!new RegExp(handler.url.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&").replace('*', '.+')).test(requestSettings.url)) {
				return null;
			}
		}

		// Inspect the data submitted in the request (either POST body or GET query string)
		if ( handler.data && requestSettings.data ) {
			if ( !isMockDataEqual(handler.data, requestSettings.data) ) {
				// They're not identical, do not mock this request
				return null;
			}
		}
		// Inspect the request type
		if ( handler && handler.type &&
				 handler.type.toLowerCase() != requestSettings.type.toLowerCase() ) {
			// The request type doesn't match (GET vs. POST)
			return null;
		}

		return handler;
	}

	// If logging is enabled, log the mock to the console
	function logMock( mockHandler, requestSettings ) {
		var c = $.extend({}, $.mockjaxSettings, mockHandler);
		if ( c.log && $.isFunction(c.log) ) {
			c.log('MOCK ' + requestSettings.type.toUpperCase() + ': ' + requestSettings.url, $.extend({}, requestSettings));
		}
	}

	// Process the xhr objects send operation
	function _xhrSend(mockHandler, requestSettings, origSettings) {

		// This is a substitute for < 1.4 which lacks $.proxy
		var process = (function(that) {
			return function() {
				return (function() {
					// The request has returned
					this.status 		= mockHandler.status;
					this.statusText		= mockHandler.statusText;
					this.readyState 	= 4;

					// We have an executable function, call it to give
					// the mock handler a chance to update it's data
					if ( $.isFunction(mockHandler.response) ) {
						mockHandler.response(origSettings);
					}
					// Copy over our mock to our xhr object before passing control back to
					// jQuery's onreadystatechange callback
					if ( requestSettings.dataType == 'json' && ( typeof mockHandler.responseText == 'object' ) ) {
						this.responseText = JSON.stringify(mockHandler.responseText);
					} else if ( requestSettings.dataType == 'xml' ) {
						if ( typeof mockHandler.responseXML == 'string' ) {
							this.responseXML = parseXML(mockHandler.responseXML);
						} else {
							this.responseXML = mockHandler.responseXML;
						}
					} else {
						this.responseText = mockHandler.responseText;
					}
					if( typeof mockHandler.status == 'number' || typeof mockHandler.status == 'string' ) {
						this.status = mockHandler.status;
					}
					if( typeof mockHandler.statusText === "string") {
						this.statusText = mockHandler.statusText;
					}
					// jQuery < 1.4 doesn't have onreadystate change for xhr
					if ( $.isFunction(this.onreadystatechange) ) {
						if( mockHandler.isTimeout) {
							this.status = -1;
						}
						this.onreadystatechange( mockHandler.isTimeout ? 'timeout' : undefined );
					} else if ( mockHandler.isTimeout ) {
						// Fix for 1.3.2 timeout to keep success from firing.
						this.status = -1;
					}
				}).apply(that);
			};
		})(this);

		if ( mockHandler.proxy ) {
			// We're proxying this request and loading in an external file instead
			_ajax({
				global: false,
				url: mockHandler.proxy,
				type: mockHandler.proxyType,
				data: mockHandler.data,
				dataType: requestSettings.dataType === "script" ? "text/plain" : requestSettings.dataType,
				complete: function(xhr, txt) {
					mockHandler.responseXML = xhr.responseXML;
					mockHandler.responseText = xhr.responseText;
					mockHandler.status = xhr.status;
					mockHandler.statusText = xhr.statusText;
					this.responseTimer = setTimeout(process, mockHandler.responseTime || 0);
				}
			});
		} else {
			// type == 'POST' || 'GET' || 'DELETE'
			if ( requestSettings.async === false ) {
				// TODO: Blocking delay
				process();
			} else {
				this.responseTimer = setTimeout(process, mockHandler.responseTime || 50);
			}
		}
	}

	// Construct a mocked XHR Object
	function xhr(mockHandler, requestSettings, origSettings, origHandler) {
		// Extend with our default mockjax settings
		mockHandler = $.extend({}, $.mockjaxSettings, mockHandler);

		if (typeof mockHandler.headers === 'undefined') {
			mockHandler.headers = {};
		}
		if ( mockHandler.contentType ) {
			mockHandler.headers['content-type'] = mockHandler.contentType;
		}

		return {
			status: mockHandler.status,
			statusText: mockHandler.statusText,
			readyState: 1,
			open: function() { },
			send: function() {
				origHandler.fired = true;
				_xhrSend.call(this, mockHandler, requestSettings, origSettings);
			},
			abort: function() {
				clearTimeout(this.responseTimer);
			},
			setRequestHeader: function(header, value) {
				mockHandler.headers[header] = value;
			},
			getResponseHeader: function(header) {
				// 'Last-modified', 'Etag', 'content-type' are all checked by jQuery
				if ( mockHandler.headers && mockHandler.headers[header] ) {
					// Return arbitrary headers
					return mockHandler.headers[header];
				} else if ( header.toLowerCase() == 'last-modified' ) {
					return mockHandler.lastModified || (new Date()).toString();
				} else if ( header.toLowerCase() == 'etag' ) {
					return mockHandler.etag || '';
				} else if ( header.toLowerCase() == 'content-type' ) {
					return mockHandler.contentType || 'text/plain';
				}
			},
			getAllResponseHeaders: function() {
				var headers = '';
				$.each(mockHandler.headers, function(k, v) {
					headers += k + ': ' + v + "\n";
				});
				return headers;
			}
		};
	}

	// Process a JSONP mock request.
	function processJsonpMock( requestSettings, mockHandler, origSettings ) {
		// Handle JSONP Parameter Callbacks, we need to replicate some of the jQuery core here
		// because there isn't an easy hook for the cross domain script tag of jsonp

		processJsonpUrl( requestSettings );

		requestSettings.dataType = "json";
		if(requestSettings.data && CALLBACK_REGEX.test(requestSettings.data) || CALLBACK_REGEX.test(requestSettings.url)) {
			createJsonpCallback(requestSettings, mockHandler);

			// We need to make sure
			// that a JSONP style response is executed properly

			var rurl = /^(\w+:)?\/\/([^\/?#]+)/,
				parts = rurl.exec( requestSettings.url ),
				remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);

			requestSettings.dataType = "script";
			if(requestSettings.type.toUpperCase() === "GET" && remote ) {
				var newMockReturn = processJsonpRequest( requestSettings, mockHandler, origSettings );

				// Check if we are supposed to return a Deferred back to the mock call, or just
				// signal success
				if(newMockReturn) {
					return newMockReturn;
				} else {
					return true;
				}
			}
		}
		return null;
	}

	// Append the required callback parameter to the end of the request URL, for a JSONP request
	function processJsonpUrl( requestSettings ) {
		if ( requestSettings.type.toUpperCase() === "GET" ) {
			if ( !CALLBACK_REGEX.test( requestSettings.url ) ) {
				requestSettings.url += (/\?/.test( requestSettings.url ) ? "&" : "?") +
					(requestSettings.jsonp || "callback") + "=?";
			}
		} else if ( !requestSettings.data || !CALLBACK_REGEX.test(requestSettings.data) ) {
			requestSettings.data = (requestSettings.data ? requestSettings.data + "&" : "") + (requestSettings.jsonp || "callback") + "=?";
		}
	}

	// Process a JSONP request by evaluating the mocked response text
	function processJsonpRequest( requestSettings, mockHandler, origSettings ) {
		// Synthesize the mock request for adding a script tag
		var callbackContext = origSettings && origSettings.context || requestSettings,
			newMock = null;


		// If the response handler on the moock is a function, call it
		if ( mockHandler.response && $.isFunction(mockHandler.response) ) {
			mockHandler.response(origSettings);
		} else {

			// Evaluate the responseText javascript in a global context
			if( typeof mockHandler.responseText === 'object' ) {
				$.globalEval( '(' + JSON.stringify( mockHandler.responseText ) + ')');
			} else {
				$.globalEval( '(' + mockHandler.responseText + ')');
			}
		}

		// Successful response
		jsonpSuccess( requestSettings, mockHandler );
		jsonpComplete( requestSettings, mockHandler );

		// If we are running under jQuery 1.5+, return a deferred object
		if(jQuery.Deferred){
			newMock = new jQuery.Deferred();
			if(typeof mockHandler.responseText == "object"){
				newMock.resolve( mockHandler.responseText );
			}
			else{
				newMock.resolve( jQuery.parseJSON( mockHandler.responseText ) );
			}
		}
		return newMock;
	}


	// Create the required JSONP callback function for the request
	function createJsonpCallback( requestSettings, mockHandler ) {
		jsonp = requestSettings.jsonpCallback || ("jsonp" + jsc++);

		// Replace the =? sequence both in the query string and the data
		if ( requestSettings.data ) {
			requestSettings.data = (requestSettings.data + "").replace(CALLBACK_REGEX, "=" + jsonp + "$1");
		}

		requestSettings.url = requestSettings.url.replace(CALLBACK_REGEX, "=" + jsonp + "$1");


		// Handle JSONP-style loading
		window[ jsonp ] = window[ jsonp ] || function( tmp ) {
			data = tmp;
			jsonpSuccess( requestSettings, mockHandler );
			jsonpComplete( requestSettings, mockHandler );
			// Garbage collect
			window[ jsonp ] = undefined;

			try {
				delete window[ jsonp ];
			} catch(e) {}

			if ( head ) {
				head.removeChild( script );
			}
		};
	}

	// The JSONP request was successful
	function jsonpSuccess(requestSettings, mockHandler) {
		// If a local callback was specified, fire it and pass it the data
		if ( requestSettings.success ) {
			requestSettings.success.call( callbackContext, ( mockHandler.response ? mockHandler.response.toString() : mockHandler.responseText || ''), status, {} );
		}

		// Fire the global callback
		if ( requestSettings.global ) {
			trigger(requestSettings, "ajaxSuccess", [{}, requestSettings] );
		}
	}

	// The JSONP request was completed
	function jsonpComplete(requestSettings, mockHandler) {
		// Process result
		if ( requestSettings.complete ) {
			requestSettings.complete.call( callbackContext, {} , status );
		}

		// The request was completed
		if ( requestSettings.global ) {
			trigger( "ajaxComplete", [{}, requestSettings] );
		}

		// Handle the global AJAX counter
		if ( requestSettings.global && ! --jQuery.active ) {
			jQuery.event.trigger( "ajaxStop" );
		}
	}


	// The core $.ajax replacement.
	function handleAjax( url, origSettings ) {
		var mockRequest, requestSettings, mockHandler;

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			origSettings = url;
			url = undefined;
		} else {
			// work around to support 1.5 signature
			origSettings.url = url;
		}

		// Extend the original settings for the request
		requestSettings = jQuery.extend(true, {}, jQuery.ajaxSettings, origSettings);

		// Iterate over our mock handlers (in registration order) until we find
		// one that is willing to intercept the request
		for(var k = 0; k < mockHandlers.length; k++) {
			if ( !mockHandlers[k] ) {
				continue;
			}

			mockHandler = getMockForRequest( mockHandlers[k], requestSettings );
			if(!mockHandler) {
				// No valid mock found for this request
				continue;
			}

			// Handle console logging
			logMock( mockHandler, requestSettings );


			if ( requestSettings.dataType === "jsonp" ) {
				if ((mockRequest = processJsonpMock( requestSettings, mockHandler, origSettings ))) {
					// This mock will handle the JSONP request
					return mockRequest;
				}
			}


			// Removed to fix #54 - keep the mocking data object intact
			//mockHandler.data = requestSettings.data;

			mockHandler.cache = requestSettings.cache;
			mockHandler.timeout = requestSettings.timeout;
			mockHandler.global = requestSettings.global;

			(function(mockHandler, requestSettings, origSettings, origHandler) {
				mockRequest = _ajax.call($, $.extend(true, {}, origSettings, {
					// Mock the XHR object
					xhr: function() { return xhr( mockHandler, requestSettings, origSettings, origHandler ) }
				}));
			})(mockHandler, requestSettings, origSettings, mockHandlers[k]);

			return mockRequest;
		}

		// We don't have a mock request, trigger a normal request
		return _ajax.apply($, [origSettings]);
	}


	// Public

	$.extend({
		ajax: handleAjax
	});

	$.mockjaxSettings = {
		//url:        null,
		//type:       'GET',
		log:          function(msg) {
										window['console'] && window.console.log && window.console.log(msg);
					  			},
		status:       200,
		statusText:   "OK",
		responseTime: 500,
		isTimeout:    false,
		contentType:  'text/plain',
		response:     '',
		responseText: '',
		responseXML:  '',
		proxy:        '',
		proxyType:    'GET',

		lastModified: null,
		etag:         '',
		headers: {
			etag: 'IJF@H#@923uf8023hFO@I#H#',
			'content-type' : 'text/plain'
		}
	};

	$.mockjax = function(settings) {
		var i = mockHandlers.length;
		mockHandlers[i] = settings;
		return i;
	};
	$.mockjaxClear = function(i) {
		if ( arguments.length == 1 ) {
			mockHandlers[i] = null;
		} else {
			mockHandlers = [];
		}
	};
	$.mockjax.handler = function(i) {
	  if ( arguments.length == 1 ) {
			return mockHandlers[i];
		}
	};
})(jQuery);
