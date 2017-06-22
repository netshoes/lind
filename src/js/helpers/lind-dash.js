(function(CONFIG) {
  if(!!CONFIG.dashUrl) {
      window.lindDashKey = CONFIG.dashActvationKey;

      var scripts = document.createElement('script');
      scripts.type = 'text/javascript';
      scripts.src = CONFIG.dashUrl;
      scripts.async = "async";
      
      document.getElementsByTagName('head')[0].appendChild(scripts);
  }
}(CONFIG));