var Sort = (function() {
  var sortNumber = function(min,max) {
    min = min || 0;
    max = max || 100;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var sortTest = function(tests) {
    var minRange = 0,
        maxRange = 0,
        sortedTest = null,
        sortedNumber = sortNumber();

    for(var key in tests) {
      maxRange += tests[key].audience;
      if ( minRange <= sortedNumber && sortedNumber <= maxRange ) {
        tests[key].key = key;
        sortedTest = tests[key];
        break;
      }
      minRange = maxRange;
    }

    if( sortedTest === null ) {
      sortedTest = {key: "withoutTest"};
    }

    return sortedTest;

  };

  return {
    sortTest:sortTest,
    sortNumber:sortNumber
  };
})();
