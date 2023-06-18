doc_ready(() => {
  let submitted = false;

  top_nav();

  // (function (next) {
  //   add_event(window, "load", function () {
  //     fixed_el(".h-add", ".nmt", ".pt-add", null, ".cvh");
  //     next();
  //   });
  // })(function () {
  //   remove_class(document.body, "p-fixed");
  //   remove_class(id("loader"), "animate");
  // });

  setTimeout(function () {
    remove_class(document.body, "p-fixed");
    remove_class(id("loader"), "animate");
  }, 2000);

  scroll_class(id("top-nav"), "bg-change");
  match_height(".mh");

  match_media(
    991,
    function match() {
      match_height(".mh2");
    },
    function unmatch() {
      match_height(".mh2", null, true);
    }
  );

  add_event(id("g-form"), "submit", () => {
    submitted = true;
    add_class(id("message-notice"), "show");

    setTimeout(() => {
      id("g-form").reset();

      setTimeout(() => {
        remove_class(id("message-notice"), "show");
      }, 2000);
    }, 500);
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

  qsel_all(".btn-cyan").forEach((button) => {
    add_event(button, "click", function () {
      toggle_class(this, "active");
    })
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
