function doc_ready(callback) {
  if (document.readyState != "loading") {
    callback();
  } else if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    document.attachEvent("onreadystatechange", function () {
      if (document.readyState == "complete") callback();
    });
  }
}

function id(element) {
  return document.getElementById(element);
}

function qsel(element) {
  return document.querySelector(element);
}

function qsel_all(element) {
  return document.querySelectorAll(element);
}

function add_event(element, e, fn) {
  if (element.addEventListener) {
    element.addEventListener(e, fn, false);
  } else if (element.attachEvent) {
    element.attachEvent("on" + e, fn);
  }
}

function remove_event(element, e, fn) {
  if (element.removeEventListener) {
    element.removeEventListener(e, fn, false);
  } else if (element.detachEvent) {
    element.detachEvent("on" + e, fn);
  }
}

function add_events(element, events, fn) {
  events.split(" ").forEach(function (e) {
    return add_event(element, e, fn);
  });
}

function remove_events(element, events, fn) {
  events.split(" ").forEach(function (e) {
    return remove_event(element, e, fn);
  });
}

function add_att(element, attribute, val) {
  if (element.setAttribute) {
    element.setAttribute(attribute, val);
  } else {
    var att = document.createAttribute(attribute);
    att.value = val;
    element.setAttributeNode(att);
  }
}

function has_class(element, className) {
  if (element.classList) {
    return element.classList.contains(className);
  } else {
    return new RegExp("(^| )" + className + "( |$)", "gi").test(
      element.className
    );
  }
}

function add_class(element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += " " + className;
  }
}

function remove_class(element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    element.className = element.className.replace(
      new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
      " "
    );
  }
}

function toggle_class(element, className) {
  if (element.classList) {
    element.classList.toggle(className);
  } else {
    var classes = element.className.split(" "),
      i = classes.indexOf(className);

    if (i >= 0) classes.splice(i, 1);
    else {
      classes.push(className);
      element.className = classes.join(" ");
    }
  }
}

function nav_bar(callback) {
  add_event(id("nav-btn"), "click", function () {
    toggle_class(this, "active");
    toggle_class(document.body, "y-hidden");
  });

  if (callback) {
    callback();
  }
}

function sticky(element) {
  add_event(window, "scroll", function () {
    if (
      window.pageYOffset > element.offsetTop ||
      document.documentElement.scrollTop > element.offsetTop
    ) {
      add_class(element, "sticky");
    } else {
      remove_class(element, "sticky");
    }
  });
}

function search_sel() {
  var i;

  add_event(qsel(".selected"), "click", function () {
    toggle_class(this, "active");
    qsel(".search-box input").value = "";

    setTimeout(function () {
      for (i = 0; i < qsel_all(".option").length; i++) {
        remove_class(qsel_all(".option")[i], "hide");
      }
    }, 500);

    if (has_class(this, "active")) {
      qsel(".search-box input").focus();
    }
  });

  for (i = 0; i < qsel_all(".option").length; i++) {
    add_event(qsel_all(".option")[i], "click", function () {
      qsel(".selected").innerHTML = this.querySelector("label").innerHTML;
      remove_class(qsel(".selected"), "active");
      qsel(".search-box input").value = "";

      setTimeout(function () {
        remove_class(qsel_all(".option")[i], "hide");
      }, 500);
    });
  }

  add_event(qsel(".search-box input"), "keyup", function () {
    for (i = 0; i < qsel_all(".option").length; i++) {
      if (qsel_all(".option")[i].querySelector("label")) {
        if (
          qsel_all(".option")
            [i].querySelector("label")
            .innerHTML.toLowerCase()
            .indexOf(this.value.toLowerCase()) > -1
        ) {
          remove_class(qsel_all(".option")[i], "hide");
        } else {
          add_class(qsel_all(".option")[i], "hide");
        }
      }
    }
  });
}

function match_height(element) {
  var i = 0;
  var items = qsel_all(element);
  var itemsHeight = [];

  for (i = 0; i < items.length; i++) {
    itemsHeight.push(items[i].offsetHeight);
  }

  var maxHeight = Math.max(...itemsHeight);

  for (i = 0; i < items.length; i++) {
    items[i].style.height = maxHeight + "px";
  }
}
