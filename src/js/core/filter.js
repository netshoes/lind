var Filter = (function(){
  var validateException = function(rule) {
    if(typeof rule == "function") {
      return rule();
    }

    return true;
  };

  return {
    valid:validateException
  };
})();