#jQuery Nav Walker
#####A small jQuery plugin for main responsive navigation.

###3 actions
* The anchor wich corresponding to the active page will receive an ` is-active ` class.
* Navigation will fixe to the window's top with an ` is-fixed ` class on window scroll.
* Navigation will switch to a responsive style when the window width reach the configured breakpoint. An ` is-breaked `  class will be added.


###Process
The plug-in will clone your navigation and insert it under the open body tag with the ` responsive-nav ` class.
This clone will be fixed on scroll and appear. The both navigation will receive an ` is active ` class on the link corresponding to the page displayed.


###Configure
```
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="pathTo/jquery.navwalker.min.js"></script>
<script>
  var breakpointArgument = NUMBER;
   // breakpointArgument corresponding to the window width which will switch the navigation to responsive.
   // must be a number !important!
  $("my-main-navigation").navWalker(breakpointArgument);
</script>
```

 ** Small Css Required **
```
  .responsive-nav.is-fixed {position: fixed;top: 0;bottom: auto;left: 0; right: 0;z-index: 10;}
  .responsive-nav.is-fixed.is-hidden {top: auto; bottom: 100%;}
  .my-nav.is-hidden {display: none;}
```

###Toggle bouton
You can put a bouton inside the `.my-nav` navigation with the ` nav-walker-btn ` class that will trigger automatically the toggle on the ul main navigation or you could add an external bouton (outside the main navigation nav tag).

```
  $("body").find(".nav-walker-btn").on("click", function(){
      $("#mainNav").navWalker("toggleMenu");
  });
```

*Some button's Css*
```
  .main-navigation:not(.responsive-nav) .nav-walker-btn {display: none;}
  .nav-walker-btn {display: inline-block;min-width: 30px;max-height: 30px;background: gray;display: none;}
  @media all and (max-width : BREAKPOINT ){
    .nav-walker-btn {display: inline-block;}
  }
```

###Overwrite functions
This plugin use addClass/removeClass for the final action (below this), the same way than Angular's ng-hide.

```
//nav can be .responsive-nav or .nav-walker
function showNav(nav){
  nav.removeClass("is-hidden");
}
function hideNav(nav){
  nav.addClass("is-hidden");
}
//oldActive corresponding to the old .is-active anchor
function removeActive(oldActive){
    oldActive.removeClass("is-active");
}
//newActive is the new .is-active link
function addActive(newActive){
    newActive.addClass("is-active");
}
```

You can overwrite these functions like this :
```
$("#mainNav").mainNav({
  break : 700,
  showNav : function(nav){
    console.log(nav);
    // can access to the prototype
    console.log(this);
  },
  addActive : function(newActive){
    //.....
  }
});
```

###Particularity
Responsive nav, when it's breaked, will transform the hover effect to toggle slide effect. The parent ` li ` will be clone and insert as the first child ` ul ` sub menu.



###Changelog
You can find the [Changelog here](/changelog/changelog.md) with all the version and the next coming features.



###Legal
Copyright 2015, Dorian Guilleminot <contact@plusdoption.com><br />
Licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).<br />
[http://creativecommons.org/licenses/by-sa/4.0/legalcode](http://creativecommons.org/licenses/by-sa/4.0/legalcode)
