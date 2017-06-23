var Cookie = (function() {
  var
  get = function(cookieName) {
    var re = new RegExp('[; ]' + cookieName + '=([^\\s;]*)');
    var sMatch = (' ' + document.cookie).match(re);
    if (cookieName && sMatch) return sMatch[1];
    return '';
  },

  create = function(name, value, days) {
    days = days || 30;
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
    document.cookie = name + "=" + value + expires + "; path=/";
  },

  destroy = function(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
  },

  userKey = function(size) {
    size = size || 25;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < size; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  },

  name = function(testName, variantName, createdAt) {
    return "lind_" + testName + "_" + variantName + "_" + createdAt + "#" + userKey();
  };

  return {
    get: get,
    create: create,
    update: create,
    destroy: destroy,
    name: name
  };
})();


window.onload = function() {
  var variantCookie  = Cookie.get(variantCookieName);
  var cookieValue = variantCookie.split("#")[0].split("_");
  if(triggerEventTesting(window.lindDashKey+'=on') || !!Cookie.get("lindOnlinePrevSet")) {

    Cookie.create("lindOnlinePrevSet",1);

    if(!Cookie.get("lindOnlinePrevSet")) {
      Cookie.destroy("lindLimbod");
      Cookie.destroy("lindLimbom");
    }

    var env = Cookie.get("lindForceHmgScript");

    var div = document.createElement("div");
    var a = document.createElement("a");

    a.onclick = function(){
      Cookie.destroy("lindOnlinePrevSet");
      Cookie.destroy(variantCookieName);
      window.location.href = window.location.href.replace(window.lindDashKey+"=on",window.lindDashKey+"=off");
      return false;
    }

    a.append("Exit preview mode");
    a.style.cursor = "pointer";
    div.append(a);
    div.classList.add('modal-lind');

    if(env) {
      a = document.createElement("a")
      a.append("Production");
      a.onclick = function(){
        Cookie.destroy("lindForceHmgScript");
        window.location.reload();
        return false;
      }
      a.style.cursor = "pointer";

      div.append(a)
    } else {
      a = document.createElement("a")
      a.append("Stage");

      a.onclick = function(){
        Cookie.create("lindForceHmgScript",1);
        window.location.reload();
        return false;
      }
      a.style.cursor = "pointer";
      div.append(a)
    }

    var testList = document.createElement("ul")
    for(var key in window.LindTests) {
      li = document.createElement("li");
      li.append(window.LindTests[key].name);
      li.append(" "+window.LindTests[key].audience + "%");
      if(cookieValue && cookieValue[1] == key) {
        li.style.color = "blue";
        li.style.fontWeight = "600";
      }
      var testVariation = document.createElement("ul");
      for(var j in window.LindTests[key].variants) {
        subli = document.createElement("li");
        a = document.createElement("a");
        if(cookieValue && cookieValue[1]+'_'+cookieValue[2] == key+'_'+j) {
          a.style.color = "red";
        }
        a.style.cursor = "pointer";
        a.setAttribute("data-test-name",key);
        a.setAttribute("data-test-variant",j);
        a.onclick = function(){
          Cookie.create(variantCookieName,"lind_"+this.getAttribute("data-test-name")+"_"+this.getAttribute("data-test-variant")+"_1490134041&hmg=1");
          window.location.reload();
          return false;
        };
        a.append(window.LindTests[key].variants[j].name);
        a.append(" "+window.LindTests[key].variants[j].audience + "%");
        subli.append(a);
        testVariation.append(subli);
      }
      li.append(testVariation);
      testList.append(li);
      div.append(testList);
    }
    document.querySelector("body").insertAdjacentElement("afterbegin",div);

    var styles = '<style type="text/css">.modal-lind{font-family:sans-serif;position:fixed;top:0;right:0;left:0;bottom:0;background-color:rgba(0, 0, 0, 0.6);z-index:999999;display:none}.modal-lind:after{content:"";display:block;border:1px solid #d6d6d6;border-radius:0 0 5px 5px;padding:0px 0 0px 0;position:absolute;border-top:0;bottom:-4px;height:5px;width:100%}.modal-lind.show{display:block}.modal-lind > ul{background:#fff;width:300px;max-height:340px;overflow:scroll;position:absolute;top:110px;border-radius:3px;left:50%;transform:translateX(-50%);padding:20px;box-sizing:border-box;list-style-type:none}.modal-lind ul li{color:#4d4d4d;font-size:16px;margin-bottom:10px}.modal-lind ul li ul{border-top:1px solid #b5b5b5}.modal-lind ul li ul li{color:#4d4d4d;font-size:14px;margin:5px 0}.modal-lind ul li ul li a{color:#4d4d4d;font-weight:100;text-decoration:none}.modal-lind ul li ul li a:hover{text-decoration:underline}.modal-lind ul ul{padding:0;border-top:none;list-style-type:none}.modal-lind > a{display:block;text-align:center;color:#fff;padding:14px;font-size:16px}.lindButton{outline:none;width:70px;height:70px;z-index:9999999;right:20px;bottom:20px;position:fixed;background:#fff;border-radius:50%;box-shadow:1px 1px 3px 1px rgba(0,0,0,0.2)}.lindButton .lindButton-logo{position:absolute;top:-8px;right:8px}.lindButton .lind-modal-close{width:22px;position:absolute;top:50%;left:50%;margin:-11px 0 0 -11px;display:none}.lindButton.open .lindButton-logo{display:none}.lindButton.open .lind-modal-close{display:block}</style>';
    document.body.insertAdjacentHTML("beforeend", styles);

    var templates = '<a href="javascript:void(0);" class="lindButton"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSI1M3B4IiBoZWlnaHQ9IjcwcHgiIHZpZXdCb3g9IjAgMCA1MyA3MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4NCiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQyICgzNjc4MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN5bWJvbDwvdGl0bGU+DQogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogICAgPGRlZnM+DQogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iMCUiIHkxPSIwJSIgeDI9IjcyLjUzMTgzODUlIiB5Mj0iNzAuMDU0OTA4NCUiIGlkPSJsaW5lYXJHcmFkaWVudC0xIj4NCiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwNEJDNDciIG9mZnNldD0iMCUiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMxQTlFM0IiIG9mZnNldD0iMTAwJSI+PC9zdG9wPg0KICAgICAgICA8L2xpbmVhckdyYWRpZW50Pg0KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9IjEwMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSIgaWQ9ImxpbmVhckdyYWRpZW50LTIiPg0KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0FDREYxRCIgb2Zmc2V0PSIwJSI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzY5QjAxNCIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+DQogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+DQogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iMTAwJSIgeTE9IjAlIiB4Mj0iMzAuMDEzNTA4MSUiIHkyPSI3OS44MjEyMTUzJSIgaWQ9ImxpbmVhckdyYWRpZW50LTMiPg0KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0ZGQTEyOSIgb2Zmc2V0PSIwJSI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0ZGNkYxQSIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+DQogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+DQogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIiBpZD0ibGluZWFyR3JhZGllbnQtNCI+DQogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjQUNERjFEIiBvZmZzZXQ9IjAlIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjNjlCMDE0IiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4NCiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4NCiAgICA8L2RlZnM+DQogICAgPGcgaWQ9IkxJTkQiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPg0KICAgICAgICA8ZyBpZD0iMS4tVEVMQS1JTklDSU8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01MTcuMDAwMDAwLCAtNDYuMDAwMDAwKSI+DQogICAgICAgICAgICA8ZyBpZD0iTE9HTy1MSU5EIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MTcuMDAwMDAwLCA0Ni4wMDAwMDApIj4NCiAgICAgICAgICAgICAgICA8ZyBpZD0ic3ltYm9sIj4NCiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTMyLjY2NjY2NjcsNjIuMjIyMjIyMiBDNDMuNDkyNTg1Nyw2MS43MTc5NzY5IDUyLjExMTExMTEsNTMuMDMxNDM1IDUyLjExMTExMTEsNDIuMzg4ODg4OSBMNTIuMTExMTExMSw0Mi4zODg4ODg5IEM1Mi4xMTExMTExLDMxLjc0NjAyNjggNDMuNDkyNTg1NywyMy4wNTk0ODQ5IDMyLjY2NjY2NjcsMjIuNTU1NTU1NiBMMzIuNjY2NjY2NywyMi41NTU1NTU2IEwzMi42NjY2NjY3LDYyLjIyMjIyMjIgWiIgaWQ9IkxFTU9OIiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIj48L3BhdGg+DQogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zMi42NjY2NjY3LDIyLjM4NTYxNjIgQzM2LjcyMjE3MjMsMjIuNzUxNDY5IDQ1LjczMTYyMDksMjMuNTcwMjk3NCA0OSwxMS44MjEzNDEzIEw0OSwxMS44MjEzNDEzIEM0OC45Nzk4MTczLDExLjgxODE4NDYgNDguOTUyOTA3LDExLjgxNDM5NjcgNDguOTE5MjY5MSwxMS44MDk2NjE4IEw0OC45MTkyNjkxLDExLjgwOTY2MTggQzQ4LjYxNzEzOTcsMTEuNzY3MDQ3MyA0Ny43ODQxNDM0LDExLjY2NjY2NjcgNDYuNjQxOTg0MywxMS42NjY2NjY3IEw0Ni42NDE5ODQzLDExLjY2NjY2NjcgQzQyLjYwNjA0OTgsMTEuNjY2NjY2NyAzNC43MDM4OTkyLDEyLjkxODI2ODIgMzIuNjY2NjY2NywyMi4zODU2MTYyIiBpZD0iTEVBRiIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0yKSI+PC9wYXRoPg0KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMCw0NC4zMzI1NDMzIEMwLDU4LjEwNTk1NyAxMS4wMzEyNzE5LDY5LjM0NzQxODggMjQuODg4ODg4OSw3MCBMMjQuODg4ODg4OSw3MCBMMjQuODg4ODg4OSwxOC42NjY2NjY3IEMxMS4wMzEyNzE5LDE5LjMxODI5OTggMCwzMC41NTk3NjE2IDAsNDQuMzMyNTQzMyIgaWQ9Ik9SQU5HRSIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0zKSI+PC9wYXRoPg0KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMi4zMzMzMzMzMywwLjA1NDY5NDcxNTYgQzIuMzM5MDA3OTIsMC4wODU1ODExNDMyIDIuMzQ2ODg5MywwLjEyNjc2MzA0NyAyLjM1Njk3NzQ2LDAuMTc3NTk2OTU5IEwyLjM1Njk3NzQ2LDAuMTc3NTk2OTU5IEMyLjc2OTY0NjM3LDIuMjUwMjA0OTUgNi45NDExMDE2NSwyMC42NDcyNTUxIDI0Ljg4ODg4ODksMTguNDkxMzE4MSBMMjQuODg4ODg4OSwxOC40OTEzMTgxIEMyMy40NDA5MjIzLDEyLjY3Mjc2NTYgMjAuMjk2NTY4MSwwLjAwMDk2NTIwMDg2MyA0LjIwMjQ4MDczLDAgTDQuMjAyNDgwNzMsMCBDMy41OTcxOTA5NywwIDIuOTc2MTM4NDUsMC4wMTc2OTUzNDkyIDIuMzMzMzMzMzMsMC4wNTQ2OTQ3MTU2IEwyLjMzMzMzMzMzLDAuMDU0Njk0NzE1NiBaIiBpZD0iTEVBRiIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC00KSI+PC9wYXRoPg0KICAgICAgICAgICAgICAgIDwvZz4NCiAgICAgICAgICAgIDwvZz4NCiAgICAgICAgPC9nPg0KICAgIDwvZz4NCjwvc3ZnPg==" class="lindButton-logo" /><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxM3B4IiBoZWlnaHQ9IjE0cHgiIHZpZXdCb3g9IjAgMCAxMyAxNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4NCiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCAzOS4xICgzMTcyMCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPjcwQkIwM0M4LTQ1QUYtNDQxNS04RTIzLTIzMEZEMTgzNTkwQTwvdGl0bGU+DQogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPg0KICAgIDxkZWZzPjwvZGVmcz4NCiAgICA8ZyBpZD0iTmV0c2hvZXMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPg0KICAgICAgICA8ZyBpZD0iQXV0b3N1Z2dlc3Rpb24iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjcuMDAwMDAwLCAtMjEuMDAwMDAwKSIgZmlsbD0iI0Q4RDhEOCI+DQogICAgICAgICAgICA8ZyBpZD0iSWNvbmVMaW1wYXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMyNy4wMDAwMDAsIDIxLjAwMDAwMCkiPg0KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0wLjc1NDc1NzQwMywxLjE3Njc2NzY4IEMxLjIzMDcwODg4LDAuNjk0MzU1MzI0IDEuOTk4ODUyOCwwLjY5MDc4MTU1NyAyLjQ4MDE5NzczLDEuMTc4NjYwNTggTDEyLjI0MzM3NSwxMS4wNzQzNjk3IEMxMi43MjAzNTc5LDExLjU1NzgyNzUgMTIuNzI0NTEyMywxMi4zMzc0NTY3IDEyLjI0NTI0MjYsMTIuODIzMjMyMyBMMTIuMjQ1MjQyNiwxMi44MjMyMzIzIEMxMS43NjkyOTExLDEzLjMwNTY0NDcgMTEuMDAxMTQ3MiwxMy4zMDkyMTg0IDEwLjUxOTgwMjMsMTIuODIxMzM5NCBMMC43NTY2MjQ5NTEsMi45MjU2MzAyOCBDMC4yNzk2NDIwNTIsMi40NDIxNzI1IDAuMjc1NDg3Njc2LDEuNjYyNTQzMzQgMC43NTQ3NTc0MDMsMS4xNzY3Njc2OCBMMC43NTQ3NTc0MDMsMS4xNzY3Njc2OCIgaWQ9IlJlY3RhbmdsZS01Ij48L3BhdGg+DQogICAgICAgICAgICAgICAgPHBhdGggZD0iTTAuNzU0NzU3NDAzLDEyLjgyMzIzMjMgQzAuMjc4ODA1OTIyLDEyLjM0MDgyIDAuMjc1MjgwMDE5LDExLjU2MjI0ODcgMC43NTY2MjQ5NTEsMTEuMDc0MzY5NyBMMTAuNTE5ODAyMywxLjE3ODY2MDU4IEMxMC45OTY3ODUyLDAuNjk1MjAyODA0IDExLjc2NTk3MjksMC42OTA5OTIwMzQgMTIuMjQ1MjQyNiwxLjE3Njc2NzY4IEwxMi4yNDUyNDI2LDEuMTc2NzY3NjggQzEyLjcyMTE5NDEsMS42NTkxODAwNCAxMi43MjQ3MiwyLjQzNzc1MTI1IDEyLjI0MzM3NSwyLjkyNTYzMDI4IEwyLjQ4MDE5NzczLDEyLjgyMTMzOTQgQzIuMDAzMjE0ODMsMTMuMzA0Nzk3MiAxLjIzNDAyNzEzLDEzLjMwOTAwOCAwLjc1NDc1NzQwMywxMi44MjMyMzIzIEwwLjc1NDc1NzQwMywxMi44MjMyMzIzIiBpZD0iUmVjdGFuZ2xlLTUiPjwvcGF0aD4NCiAgICAgICAgICAgIDwvZz4NCiAgICAgICAgPC9nPg0KICAgIDwvZz4NCjwvc3ZnPg==" class="lind-modal-close" /></a>';
    document.body.insertAdjacentHTML("beforeend", templates);

    document.querySelector('.lindButton').addEventListener('click', function() {
      document.querySelector('.lindButton').classList.toggle('open')
      document.querySelector('.modal-lind').classList.toggle('show');
      return false;
    });

  }
  function triggerEventTesting(rule, path) {
    ruleType = typeof rule;
    if(ruleType == "function") {
      return rule();
    } else  {
      return !!((path||window.location.href).match(rule || ""));
    }
  }
};
