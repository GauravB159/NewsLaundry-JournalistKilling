var lastScrollTop = 0;
// element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
window.addEventListener("scroll", function() { // or window.addEventListener("scroll"....
  var footer = $('#protograph_toMobJustice_footer_container');
  var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
  if (st > lastScrollTop){
    //Scroll Down
    if (footer && !footer.hasClass('slide-in')) {
      footer.removeClass('slide-out');
      footer.addClass('slide-in');
    }
  } else {
    //Scroll UP
    if (footer && !footer.hasClass('slide-out')) {
      footer.removeClass('slide-in');
      footer.addClass('slide-out');
    }
  }
  lastScrollTop = st;
}, false);