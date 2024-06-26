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

function top_nav(callback) {
  add_event(id("top-nav-btn"), "click", function () {
    toggle_class(this, "active");
    toggle_class(document.body, "y-hidden");
  });

  add_event(window, "click", function (e) {
    if (
      !e.target.closest("#top-nav-btn") ||
      !id("top-nav-btn").contains(e.target || e.srcElement)
    ) {
      if (has_class(id("top-nav-btn"), "active")) {
        remove_class(id("top-nav-btn"), "active");
        remove_class(document.body, "y-hidden");
      }
    }
  });

  if (callback) {
    callback();
  }
}

function page_nav(callback) {
  var i;

  add_event(id("page-nav-btn"), "click", function () {
    toggle_class(this, "active");
    toggle_class(document.body, "y-hidden");
  });

  add_event(window, "click", function (e) {
    if (
      !e.target.closest("#page-nav") ||
      !id("page-nav").contains(e.target || e.srcElement)
    ) {
      if (has_class(id("page-nav-btn"), "active")) {
        remove_class(id("page-nav-btn"), "active");
        remove_class(document.body, "y-hidden");
      }
    }
  });

  if (callback) {
    callback();
  }

  add_event(id("save-page-btn"), "click", function () {
    var paperSize = this.className;

    add_class(qsel(".main-document"), "bg-transparent");

    for (i = 0; i < qsel_all(".p-pgnum").length; i++) {
      add_class(qsel_all(".p-pgnum")[i], "d-none-before");
    }

    for (i = 0; i < qsel_all("svg.svg-inline--fa").length; i++) {
      add_att(
        qsel_all("svg.svg-inline--fa")[i],
        "width",
        qsel_all("svg.svg-inline--fa")[i].getBoundingClientRect().width
      );

      add_att(
        qsel_all("svg.svg-inline--fa")[i],
        "height",
        qsel_all("svg.svg-inline--fa")[i].getBoundingClientRect().height
      );

      qsel_all("svg.svg-inline--fa")[i].style.width = null;
      qsel_all("svg.svg-inline--fa")[i].style.height = null;
    }

    setTimeout(function () {
      html2pdf().set({
        margin: 0,
        filename: document.title + ".pdf",
        image: { type: "jpeg", quality: "1", },
        html2canvas: { scale: 2, },
        jsPDF: { unit: "in", format: paperSize, },
      }).from(qsel(".main-document")).save();

      setTimeout(function () {
        remove_class(qsel(".main-document"), "bg-transparent");

        for (i = 0; i < qsel_all(".p-pgnum").length; i++) {
          remove_class(qsel_all(".p-pgnum")[i], "d-none-before");
        }
      }, 1000);
    }, 1000);
  });

  add_event(id("save-page-native-btn"), "click", function () {
    window.print();
  });

  for (i = 0; i < qsel_all(".nav-span").length; i++) {
    qsel_all(".nav-span")[i].innerHTML = "page" + (i + 1);
    add_class(qsel_all(".wrap-paper")[i], "page" + (i + 1));

    add_event(qsel_all(".nav-span")[i], "click", function () {
      for (i = 0; i < qsel_all(".nav-span").length; i++) {
        remove_class(qsel_all(".nav-span")[i], "active");
        remove_class(qsel_all(".wrap-paper")[i], "active");
      }

      add_class(this, "active");
      add_class(qsel("." + this.innerHTML), "active");
      console.log(document.title.split("Resume"))
      document.title = document.title.split("Resume")[0];
      document.title += "Resume-" + this.innerHTML.split("e")[1];
    });
  }
}

function fixed_el(
  fixedElements,
  navLandingElements,
  elementBelowFixedElements,
  elementsAboveFixedElements,
  fitToScreenElements
) {
  var i;
  var topHeight = 0;
  var height = 0;

  if (elementBelowFixedElements === undefined) {
    elementBelowFixedElements = null;
  }

  if (elementsAboveFixedElements === undefined) {
    elementsAboveFixedElements = null;
  }

  if (fitToScreenElements === undefined) {
    fitToScreenElements = null;
  }

  if (elementsAboveFixedElements) {
    for (i = 0; i < qsel_all(elementsAboveFixedElements).length; i++) {
      topHeight += qsel_all(elementsAboveFixedElements)[i].offsetHeight;
    }

    add_event(window, "scroll", function () {
      if (
        window.pageYOffset > topHeight ||
        window.scrollY > topHeight ||
        document.documentElement.scrollTop > topHeight
      ) {
        for (i = 0; i < qsel_all(fixedElements).length; i++) {
          qsel_all(fixedElements)[i].style.position = "fixed";
          qsel_all(fixedElements)[i].style.top = "0";
        }
      } else {
        for (i = 0; i < qsel_all(fixedElements).length; i++) {
          qsel_all(fixedElements)[i].style.position = null;
          qsel_all(fixedElements)[i].style.top = null;
        }
      }
    });
  }

  for (i = 0; i < qsel_all(fixedElements).length; i++) {
    height += qsel_all(fixedElements)[i].offsetHeight;
  }

  if (elementBelowFixedElements) {
    qsel(elementBelowFixedElements).style.paddingTop = height + 20 + "px";
  }

  if (elementsAboveFixedElements) {
    for (i = 0; i < qsel_all(navLandingElements).length; i++) {
      qsel_all(navLandingElements)[i].style.marginTop =
        "-" + (height * 2) + "px";
    }

    add_event(window, "scroll", function () {
      if (
        window.pageYOffset > topHeight ||
        window.scrollY > topHeight ||
        document.documentElement.scrollTop > topHeight
      ) {
        for (i = 0; i < qsel_all(navLandingElements).length; i++) {
          qsel_all(navLandingElements)[i].style.marginTop =
            "-" + height + "px";
        }
      } else {
        for (i = 0; i < qsel_all(navLandingElements).length; i++) {
          qsel_all(navLandingElements)[i].style.marginTop =
            "-" + (height * 2) + "px";
        }
      }
    });
  } else {
    for (i = 0; i < qsel_all(navLandingElements).length; i++) {
      qsel_all(navLandingElements)[i].style.marginTop =
        "-" + height + "px";
    }
  }

  if (fitToScreenElements) {
    for (i = 0; i < qsel_all(fitToScreenElements).length; i++) {
      qsel_all(fitToScreenElements)[i].style.minHeight =
        "calc(100vh - " + height + "px)";
    }
  }
}

function scroll_class(element, className) {
  add_event(window, "scroll", function () {
    if (
      window.pageYOffset > element.offsetTop ||
      window.scrollY > element.offsetTop ||
      document.documentElement.scrollTop > element.offsetTop
    ) {
      add_class(element, className);
    } else {
      remove_class(element, className);
    }
  });
}

function match_height(element, invisibleElement, remove) {
  if (invisibleElement === undefined) {
    invisibleElement = null;
  }

  if (remove === undefined) {
    remove = null;
  }

  var i;

  if (remove) {
    for (i = 0; i < qsel_all(element).length; i++) {
      qsel_all(element)[i].style.height = "auto";
    }

    return;
  }

  var heights = [];

  if (invisibleElement) {
    qsel(invisibleElement).style.display = "block";

    for (i = 0; i < qsel_all(invisibleElement).length; i++) {
      qsel_all(invisibleElement)[i].style.height = "auto";
      heights.push(qsel_all(invisibleElement)[i].offsetHeight);
    }

    qsel(invisibleElement).style.display = "";
  }

  for (i = 0; i < qsel_all(element).length; i++) {
    qsel_all(element)[i].style.height = "auto";
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
      if (param.matches && match) {
        match();

        add_event(window, "resize", function () {
          return match();
        });
      }

      if (!param.matches && unmatch) {
        unmatch();

        add_event(window, "resize", function () {
          return unmatch();
        });
      }
    }

    matcher(window.matchMedia("only screen and (min-width: " + media + "px"));

    add_event(
      window.matchMedia("only screen and (min-width: " + media + "px"),
      "change",
      matcher
    );
  } else {
    if (screen.width >= media && match) {
      match();

      add_event(window, "resize", function () {
        return match();
      });
    }

    if (screen.width < media && unmatch) {
      if (unmatch) {
        unmatch();

        add_event(window, "resize", function () {
          return unmatch();
        });
      }
    }
  }
}
