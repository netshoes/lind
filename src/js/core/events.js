// Usage: Events.create('lindLoaded');

var Events = (function() {
  var event = function(name) {
    var event = document.createEvent('Event');
    event.initEvent(name, true, true);
    window.dispatchEvent(event);
  };

  return {
    create:event
  };
})();
