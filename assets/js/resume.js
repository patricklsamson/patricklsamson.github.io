doc_ready(() => {
  for (i = 0; i < qsel_all(".wrap-paper").length; i++) {
    if (
      qsel_all(".wrap-paper")[i].innerHTML == null ||
      qsel_all(".wrap-paper")[i].innerHTML == ""
    ) {
      qsel_all(".wrap-paper")[i].innerHTML = "Page " + (i + 1);
    }
  }

  for (i = 0; i < qsel_all(".nav-span").length; i++) {
    add_event(qsel_all(".nav-span")[i], "click", function () {
      for (i = 0; i < qsel_all(".nav-span").length; i++) {
        remove_class(qsel_all(".nav-span")[i], "active");
        remove_class(qsel_all(".wrap-paper")[i], "active");
      }

      add_class(this, "active");
      add_class(qsel("." + this.innerHTML), "active");
      document.title = document.title.split("-").slice(0, 3).join("-");
      document.title += "-" + this.innerHTML.split("e")[1];

      if (has_class(this, "page2") || has_class(this, "page3")) {
        for (i = 2; i <= 3; i++) {
          match_height(".mh" + i);
        }
      }
    });
  }
});