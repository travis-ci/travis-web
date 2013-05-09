var setupGoogleAnalytics = function() {
  window._gaq = [];
  _gaq.push(['_setAccount', Travis.config.ga_code]);
  _gaq.push(['_trackPageview']);

  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
}
