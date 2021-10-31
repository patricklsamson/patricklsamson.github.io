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

  add_event(window, "click", function (e) {
    if (
      !e.target.closest("#nav-btn") ||
      !id("nav-btn").contains(e.target || e.srcElement)
    ) {
      if (has_class(id("nav-btn"), "active")) {
        remove_class(id("nav-btn"), "active");
        remove_class(document.body, "y-hidden");
      }
    }
  });

  if (callback) {
    callback();
  }
}

function fixed_el(fixed_element, margin_element, vh_element) {
  var i;
  var height = 0;

  (function (next) {
    for (i = 0; i < qsel_all(fixed_element).length; i++) {
      height += qsel_all(fixed_element)[i].offsetHeight;

      if (i == qsel_all(fixed_element).length - 1) {
        next();
      }
    }
  })(function () {
    for (i = 0; i < qsel_all(margin_element).length; i++) {
      qsel_all(margin_element)[i].style.marginTop = "-" + height + "px";
    }

    if (vh_element) {
      for (i = 0; i < qsel_all(vh_element).length; i++) {
        qsel_all(vh_element)[i].style.minHeight =
          "calc(100vh - " + height + "px)";
      }
    }
  });
}

function scroll_class(element, className) {
  add_event(window, "scroll", function () {
    if (
      window.pageYOffset > element.offsetTop ||
      document.documentElement.scrollTop > element.offsetTop
    ) {
      add_class(element, className);
    } else {
      remove_class(element, className);
    }
  });
}

function match_height(element) {
  var i;
  var heights = [];

  for (i = 0; i < qsel_all(element).length; i++) {
    qsel_all(element)[i].style.height = "auto";
  }

  for (i = 0; i < qsel_all(element).length; i++) {
    heights.push(qsel_all(element)[i].offsetHeight);
  }

  var max = heights[0];

  for (i = 0; i < heights.length; i++) {
    if (heights[i] > max) {
      max = heights[i];
    }
  }

  for (i = 0; i < qsel_all(element).length; i++) {
    qsel_all(element)[i].style.height = max + "px";
  }
}

function match_media(media, match, unmatch) {
  if (window.matchMedia) {
    function matcher(param) {
      if (param.matches) {
        if (match) {
          match();
        }
      } else {
        if (unmatch) {
          unmatch();
        }
      }
    }

    matcher(window.matchMedia("only screen and (min-width: " + media + "px"));

    add_event(
      window.matchMedia("only screen and (min-width: " + media + "px"),
      "change",
      matcher
    );
  } else {
    if (screen.width >= media) {
      if (match) {
        match();
      }
    } else {
      if (unmatch) {
        unmatch();
      }
    }
  }
}
