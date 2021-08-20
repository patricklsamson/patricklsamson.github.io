doc_ready(() => {
  let submitted = false;

  nav_bar();
  fixed_el(".h-add", ".nmt", ".cvh");
  scroll_class(id("nav-bar"), "bg-change");
  match_height(".mh");

  match_media(576, function match() {
    match_height(".mh2");
  });

  add_event(id("g-form"), "submit", () => {
    submitted = true;

    setTimeout(() => {
      id("g-form").reset();
    }, 500);
  });

  click_copy(id("yahoo"));
  click_copy(id("gmail"));

  add_event(id("portfolio-btn"), "click", () => {
    toggle_class(id("portfolio-btn"), "active");

    if (has_class(id("portfolio-btn"), "active")) {
      setTimeout(() => {
        id("portfolio-scroll-target").scrollIntoView(true);
      }, 150);
    } else {
      setTimeout(() => {
        id("portfolio").scrollIntoView(true);
      }, 150);
    }
  });
});
