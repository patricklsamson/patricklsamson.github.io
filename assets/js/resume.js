doc_ready(() => {
  page_nav();

  for (var i = 2; i <= 3; i++) {
    match_height(".mh" + i, ".page" + i);
  }
});
