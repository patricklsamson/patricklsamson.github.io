doc_ready(() => {
  let submitted = false;

  nav_bar();


  (function (next) {
    add_event(window, "load", function () {
      fixed_el(".h-add", ".nmt", ".pt-add", null, ".cvh");
      next();
    });
  })(function () {
      remove_class(document.body, "p-fixed");
      remove_class(id("loader"), "animate");
  });

  scroll_class(id("nav-bar"), "bg-change");
  match_height(".mh");

  match_media(
    576,
    function match() {
      match_height(".mh2");

      add_event(window, "resize", function () {
        match_height(".mh2");
      });
    },
    function unmatch() {
      add_event(window, "resize", function () {
        qsel_all(".mh2").forEach((element) => {
          element.removeAttribute("style");
        });
      });
    }
  );

  add_event(id("g-form"), "submit", () => {
    submitted = true;

    setTimeout(() => {
      id("g-form").reset();
      add_class(id("message-notice"), "show");
      add_class(id("message-notice"), "mt-xs-10");

      setTimeout(() => {
        remove_class(id("message-notice"), "show");
      }, 6000);
    }, 3000);
  });

  add_event(id("portfolio-btn"), "click", () => {
    toggle_class(id("portfolio-btn"), "active");

    if (has_class(id("portfolio-btn"), "active")) {
      setTimeout(() => {
        qsel("main > .cont:first-child").scrollIntoView(false);
      }, 250);
    } else {
      id("portfolio").scrollIntoView(true);
    }
  });

  id("copyright").innerHTML = new Date().getFullYear();

  $(".owl-carousel").owlCarousel({
    loop: true,
    margin: 20,
    nav: true,
    navText: [
      "<i class='fas fa-angle-left'></i>",
      "<i class='fas fa-angle-right'></i>",
    ],
    dots: true,
    autoplay: false,
    autoplayTimeout: 5000,
    responsive: {
      0: {
        items: 1,
      },
      992: {
        items: 2,
      },
    },
  });
});
