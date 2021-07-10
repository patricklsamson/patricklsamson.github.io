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

function body(id) {
  return document.body.id == id;
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

function create_el(element) {
  return document.createElement(element);
}

function inner(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/\'/g, "&#39;")
    .replace(/\//g, "&#x2F;");
}

function trim(str) {
  return str.replace(/\s+/g, " ").trim();
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

function num_only(e) {
  var char = e.which || e.keyCode;

  return !(char > 31 && (char < 48 || char > 57));
}

function no_num(e) {
  var char = e.which || e.keyCode;

  return char > 31 && (char < 48 || char > 57);
}

function num_commas(number) {
  return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function num_space(number) {
  return number.toString().replace(/\d{4}(?=.)/g, "$& ");
}

function match_media(media, oldMedia, match, unmatch) {
  if (window.matchMedia) {
    var mq = window.matchMedia(media);

    function matcher(param) {
      if (param.matches) {
        match();
      } else {
        unmatch();
      }
    }

    matcher(mq);
    add_event(mq, "change", matcher);
  } else {
    if (screen.width >= oldMedia) {
      match();
    } else {
      unmatch();
    }
  }
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

function modal_open() {
  if (has_class(document.body, "modal-open")) {
    document.body.style.top = "-" + window.scrollTop + "px";
  } else {
    document.body.style.top = "";
    window.scrollTo(0, parseInt(document.body.style.top || "0") * -1);
  }
}

function rand(number) {
  return Math.floor(Math.random() * number);
}

function localStorage_space() {
  var data = "";

  console.log("Current local storage: ");

  for (var key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      data += window.localStorage[key];

      console.log(
        key +
          " = " +
          ((window.localStorage[key].length * 16) / (8 * 1024)).toFixed(2) +
          " KB"
      );
    }
  }

  console.log(
    data
      ? "\n" +
          "Total space used: " +
          ((data.length * 16) / (8 * 1024)).toFixed(2) +
          " KB"
      : "Empty (0 KB)"
  );

  console.log(
    data
      ? "Approx. space remaining: " +
          (5120 - ((data.length * 16) / (8 * 1024)).toFixed(2)) +
          " KB"
      : "5 MB"
  );
}

function dataset(element, value) {
  if (element.dataset) {
    return element.dataset.value;
  } else {
    return element.getAttribute("data-" + value);
  }
}

function extend_obj(obj, addons) {
  if (typeof addons !== "undefined") {
    for (var prop in obj) {
      if (addons[prop] != undefined) {
        obj[prop] = addons[prop];
      }
    }
  }
}

var caro = window.caro || {};

caro = (function () {
  var caro = function caro(settings) {
    var self = this;

    self.def = {
      target: qsel(".caro"),
      dotsWrapper: qsel(".caro-dots"),
      arrowLeft: qsel(".caro-prev"),
      arrowRight: qsel(".caro-next"),
      autoplay: {
        on: false,
        interval: 5000,
      },
      transition: {
        speed: 300,
        easing: "",
      },
      swipe: true,
      autoHeight: true,
      afterChangeSlide: function afterChangeSlide() {},
    };

    extend_obj(self.def, settings);

    self.init();
  };

  caro.prototype.buildDots = function () {
    var self = this;

    for (var i = 0; i < self.totalSlides; i++) {
      var dot = document.createElement("span");

      add_att(dot, "data-slide", i + 1);
      self.def.dotsWrapper.appendChild(dot);
    }

    add_event(self.def.dotsWrapper, "click", function (e) {
      if (
        (e.target && e.target.nodeName == "SPAN") ||
        (e.srcElement && e.srcElement.nodeName == "SPAN")
      ) {
        self.curSlide = e.target.getAttribute("data-slide");
        self.gotoSlide();
      }
    });
  };

  caro.prototype.getCurLeft = function () {
    var self = this;

    self.curLeft = parseInt(self.sliderInner.style.left.split("px")[0]);
  };

  caro.prototype.gotoSlide = function () {
    var self = this;

    self.sliderInner.style.transition =
      "left " +
      self.def.transition.speed / 1000 +
      "s " +
      self.def.transition.easing;
    self.sliderInner.style.left = -self.curSlide * self.slideW + "px";

    add_class(self.def.target, "isAnimating");

    setTimeout(function () {
      self.sliderInner.style.transition = "";
      remove_class(self.def.target, "isAnimating");
    }, self.def.transition.speed);

    self.setDot();

    if (self.def.autoHeight) {
      self.def.target.style.height =
        self.allSlides[self.curSlide].offsetHeight + "px";
    }

    self.def.afterChangeSlide(self);
  };

  caro.prototype.init = function () {
    var self = this;

    function on_resize(c, t) {
      onresize = function () {
        clearTimeout(t);
        t = setTimeout(c, 100);
      };
      return onresize;
    }

    function loadedImg(el) {
      var loaded = false;

      function loadHandler() {
        if (loaded) {
          return;
        }

        loaded = true;
        self.loadedCnt++;

        if (self.loadedCnt >= self.totalSlides + 2) {
          self.updateSliderDimension();
        }
      }

      var img = el.querySelector("img");

      if (img) {
        img.onload = loadHandler;
        img.src = dataset(img, "src");
        img.style.display = "block";

        if (img.complete) {
          loadHandler();
        }
      } else {
        self.updateSliderDimension();
      }
    }

    add_event(
      window,
      "resize",
      on_resize(function () {
        self.updateSliderDimension();
      })
    );

    var nowHTML = self.def.target.innerHTML;
    self.def.target.innerHTML = '<div class="caro-inner">' + nowHTML + "</div>";

    self.allSlides = 0;
    self.curSlide = 0;
    self.curLeft = 0;
    self.totalSlides = self.def.target.querySelectorAll(".slide").length;

    self.sliderInner = self.def.target.querySelector(".caro-inner");
    self.loadedCnt = 0;

    var cloneFirst = self.def.target
      .querySelectorAll(".slide")[0]
      .cloneNode(true);
    self.sliderInner.appendChild(cloneFirst);

    var cloneLast = self.def.target
      .querySelectorAll(".slide")
      [self.totalSlides - 1].cloneNode(true);
    self.sliderInner.insertBefore(cloneLast, self.sliderInner.firstChild);

    self.curSlide++;
    self.allSlides = self.def.target.querySelectorAll(".slide");

    self.sliderInner.style.width = (self.totalSlides + 2) * 100 + "%";

    for (var i = 0; i < self.totalSlides + 2; i++) {
      self.allSlides[i].style.width = 100 / (self.totalSlides + 2) + "%";
      loadedImg(self.allSlides[i]);
    }

    self.buildDots();
    self.setDot();
    self.initArrows();

    if (self.def.swipe) {
      add_events(self.sliderInner, "mousedown touchstart", startSwipe);
    }

    self.isAnimating = false;

    function startSwipe(e) {
      var touch = e;

      self.getCurLeft();

      if (!self.isAnimating) {
        if (e.type == "touchstart") {
          touch = e.targetTouches[0] || e.changedTouches[0];
        }

        self.startX = touch.clientX;
        self.startY = touch.clientY;

        add_events(self.sliderInner, "mousemove touchmove", swipeMove);
        add_events(document.body, "mouseup touchend", swipeEnd);
      }
    }

    function swipeMove(e) {
      var touch = e;

      if (e.type == "touchmove") {
        touch = e.targetTouches[0] || e.changedTouches[0];
      }

      self.moveX = touch.clientX;
      self.moveY = touch.clientY;

      if (Math.abs(self.moveX - self.startX) < 40) return;

      self.isAnimating = true;
      add_class(self.def.target, "isAnimating");
      e.preventDefault();

      if (self.curLeft + self.moveX - self.startX > 0 && self.curLeft == 0) {
        self.curLeft = -self.totalSlides * self.slideW;
      } else if (
        self.curLeft + self.moveX - self.startX <
        -(self.totalSlides + 1) * self.slideW
      ) {
        self.curLeft = -self.slideW;
      }
      self.sliderInner.style.left =
        self.curLeft + self.moveX - self.startX + "px";

      return false;
    }

    function swipeEnd() {
      self.getCurLeft();

      if (Math.abs(self.moveX - self.startX) === 0) return;

      self.stayAtCur =
        Math.abs(self.moveX - self.startX) < 40 ||
        typeof self.moveX === "undefined"
          ? true
          : false;
      self.dir = self.startX < self.moveX ? "left" : "right";

      if (self.stayAtCur) {
      } else {
        self.dir == "left" ? self.curSlide-- : self.curSlide++;
        if (self.curSlide < 0) {
          self.curSlide = self.totalSlides;
        } else if (self.curSlide == self.totalSlides + 2) {
          self.curSlide = 1;
        }
      }

      self.gotoSlide();

      delete self.startX;
      delete self.startY;
      delete self.moveX;
      delete self.moveY;

      self.isAnimating = false;
      remove_class(self.def.target, "isAnimating");
      remove_events(self.sliderInner, "mousemove touchmove", swipeMove);
      remove_events(document.body, "mouseup touchend", swipeEnd);
    }
  };

  caro.prototype.initArrows = function () {
    var self = this;

    if (self.def.arrowLeft != "") {
      add_event(self.def.arrowLeft, "click", function () {
        if (!has_class(self.def.target, "isAnimating")) {
          if (self.curSlide == 1) {
            self.curSlide = self.totalSlides + 1;
            self.sliderInner.style.left = -self.curSlide * self.slideW + "px";
          }

          self.curSlide--;

          setTimeout(function () {
            self.gotoSlide();
          }, 20);
        }
      });
    }

    if (self.def.arrowRight != "") {
      add_event(self.def.arrowRight, "click", function () {
        if (!has_class(self.def.target, "isAnimating")) {
          if (self.curSlide == self.totalSlides) {
            self.curSlide = 0;
            self.sliderInner.style.left = -self.curSlide * self.slideW + "px";
          }

          self.curSlide++;

          setTimeout(function () {
            self.gotoSlide();
          }, 20);
        }
      });
    }

    if (self.def.autoplay.on) {
      setInterval(function () {
        if (!has_class(self.def.target, "isAnimating")) {
          if (self.curSlide == self.totalSlides) {
            self.curSlide = 0;
            self.sliderInner.style.left = -self.curSlide * self.slideW + "px";
          }

          self.curSlide++;

          setTimeout(function () {
            self.gotoSlide();
          }, 20);
        }
      }, self.def.autoplay.interval);
    }
  };

  caro.prototype.setDot = function () {
    var self = this;
    var tardot = self.curSlide - 1;

    for (var j = 0; j < self.totalSlides; j++) {
      remove_class(self.def.dotsWrapper.querySelectorAll("span")[j], "active");
    }

    if (self.curSlide - 1 < 0) {
      tardot = self.totalSlides - 1;
    } else if (self.curSlide - 1 > self.totalSlides - 1) {
      tardot = 0;
    }

    add_class(self.def.dotsWrapper.querySelectorAll("span")[tardot], "active");
  };

  caro.prototype.updateSliderDimension = function () {
    var self = this;

    self.slideW = parseInt(
      self.def.target.querySelectorAll(".slide")[0].offsetWidth
    );
    self.sliderInner.style.left = -self.slideW * self.curSlide + "px";

    if (self.def.autoHeight) {
      self.def.target.style.height =
        self.allSlides[self.curSlide].offsetHeight + "px";
    } else {
      for (var i = 0; i < self.totalSlides + 2; i++) {
        if (self.allSlides[i].offsetHeight > self.def.target.offsetHeight) {
          self.def.target.style.height = self.allSlides[i].offsetHeight + "px";
        }
      }
    }

    self.def.afterChangeSlide(self);
  };

  return caro;
})();

function search_sel() {
  let i;

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
