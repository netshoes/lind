var Lind = (function() {

  if(!Object.keys(tests).length) {
    Cookie.clear();
    return false;
  }

  var variantCookie  = Cookie.get(variantCookieName),
      delayedCookie  = Cookie.get(delayedCookieName),
      filteredCookie = Cookie.get(filteredCookieName),
      sortedTest,
      validFilter;

  window.LindTests = tests;

  var createVariantPosition = function(variantCookie){
    var variantPosition = false;

    if(variantCookie) {
      if(variantCookie.indexOf("limbo") > -1 ) {
        variantPosition = {
          "variantName": "limbo",
          "testName": false
        };
      } else {
        var cookieValue = variantCookie.split("#")[0].split("_");
        variantPosition = {
          'variantName' : cookieValue[2],
          'testName' : cookieValue[1]
        };
      }
    }
    return variantPosition;
  };

  var isVariantValid = function(variantPosition) {
    var isValid = false;

    if(variantPosition){
      if( variantPosition.variantName != "limbo" && !tests.hasOwnProperty(variantPosition.testName)) {
        Cookie.destroy(variantCookieName);
        variantCookie = false;
      }
      isValid = variantPosition;
    }
    return isValid;
  };

  var runTest = function(testCase, key) {

    if(typeof tests[key].rule == 'function') {
      document.querySelector('html').style.opacity = 0;
      document.addEventListener("DOMContentLoaded", function(event) {
        triggerEvent(testCase);
        document.querySelector('html').style.opacity = 1;
      });
    } else {
      triggerEvent(testCase);
    }
  };

  var triggerEvent = function(test) {

    switch(test) {
      case 'validTest':
        if(Filter.valid(tests[variantPosition.testName].rule)) {
          tests[variantPosition.testName].variants[variantPosition.variantName].method();
          return Cookie.update(variantCookieName,variantCookie);
        }
        break;
      case 'delayedTest':
        if( Filter.valid(tests[delayedCookie].rule) ){
          var delayedsortedTest = tests[delayedCookie],
              delayedvariant = Sort.sortTest(delayedsortedTest.variants),
              delayedcookieValue = Cookie.name(delayedCookie, delayedvariant.key,delayedsortedTest.createdAt);

          delayedvariant.method();
          Cookie.destroy(delayedCookieName);
          return Cookie.create(variantCookieName,delayedcookieValue);
        }
        break;
      case 'sortNewTest':
        Cookie.clear();

        if(sortedTest && Filter.valid(sortedTest.rule) && validFilter) {
          var variant = Sort.sortTest(sortedTest.variants),
              cookieValue = Cookie.name(sortedTest.key, variant.key,sortedTest.createdAt);

          variant.method();
          return Cookie.create(variantCookieName, cookieValue);
        } else if(!validFilter && !filteredCookie) {

          return Cookie.create(filteredCookieName, "limbo");

        } else if(sortedTest && !filteredCookie) {
          return Cookie.create(delayedCookieName, sortedTest.key);
        }
        break;
    }
    return false;
  };

  var runValidTest = function() {
    if (variantPosition.variantName == "limbo") {
      return Cookie.update(variantCookieName, variantPosition.variantName);
    } else {
      return runTest('validTest', variantPosition.testName);
    }
  };

  var runDelayedTest = function(){
    runTest('delayedTest', delayedCookie);
  };

  var runSortNewTest = function(){
    sortedTest = Sort.sortTest(tests);
    validFilter = Filter.valid(sortedTest.exception);

    if(sortedTest.key == "withoutTest") {
      Cookie.create(filteredCookieName, "limbo", 1);
      filteredCookie = Cookie.get(filteredCookieName);
      validFilter = false;
      return false;
    }

    runTest( 'sortNewTest',  sortedTest.key);
    return false;
  };

  var variantPosition = createVariantPosition( variantCookie );
  variantPosition  = isVariantValid( variantPosition );

  if(variantPosition) {
    runValidTest();
  } else if(delayedCookie) {
    runDelayedTest();
  } else if(!variantCookie && !delayedCookie && !filteredCookie ) {
    runSortNewTest();
  }

})();
