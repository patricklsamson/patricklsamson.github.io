doc_ready(() => {
  nav_bar();
  fixed_el(".h-add", ".nmt", ".cvh");
  scroll_class(id("nav-bar"), "bg-change");
  match_height(".mh");

  match_media("only screen and (min-width: 576px)", 576, function match() {
    match_height(".mh2");
  });
});
