(function ($) {
    "use-strict";
      // --------------
      // core
      $.fn.navWalker = function(breakPoint){
        if(typeof breakPoint == "string"){
            var navWalker = $(this).data('navWalker');
            if (navWalker) {
              if(arguments[1]){
                return navWalker.construct(breakPoint);
              }else{
                return navWalker[arguments[0]].apply(navWalker);
              }
            }
        } else {
          $(this).each(function(){
              if( typeof breakPoint == "number") {
                breakPoint = {
                  break : breakPoint
                }
              }
              options = $.extend({}, $.fn.navWalker.defaults, breakPoint);
              var navWalker = new NavWalker($(this), options);
              $(this).data('navWalker', navWalker);
          });
        }
        return this;
      };

      $.fn.navWalker.defaults = function(){
        this.break = 700;
      };
      // core
      // --------------


      // --------------
      // contructor
      function NavWalker(nav, breakPoint){
        var self = this;
        this.nav = nav;
        this.navClone = this.nav.clone().removeAttr("id").addClass("responsive-nav");
        this.btn = this.navClone.find(".nav-walker-btn");
        this.navo = this.nav.offset().top;
        this.navh = this.navClone.height();
        this.break = null;
        this.ww = $(window).width();
        this.wh = $(window).height();
        this.active = {
          activeIndex : [],
          linkArray : [],
          baseurl : "",
        };
        this.construct(breakPoint);

        // --------------
        // Event config
        $("body").prepend(this.navClone);
        $(document).on("ready", function(){
            self.init();

            // set on resize envent
            var timer;
            $(window).on("resize",function(){
              clearTimeout(timer);
              timer = setTimeout(function(){
                self.resizeE();
                self.scrollE();
              }, 300);
            });

            $(window).on("scroll",function(e){
              self.scrollE();
            });

            self.nav.find("a").on("click", function(){
              // nav.startTime = new Date();
              var cleanUrl = normalizeHref(self.active, $(this).attr("href"));
              self.search(cleanUrl);
            });

            self.btn.on("click", function(){
              // console.log("lkjjkll");
              self.toggleMenu();
            });
          //config
        // --------------
        });

        $("body").on("treatNav", function(){
            self.treatNav();
        });

        this.navClone.find("li").has("ul").children("a").on("click", function(e){
            slideSubMenu($(this));
            e.preventDefault();
        });
        // event config
      }

      NavWalker.prototype.construct = construct;
      // event method
      NavWalker.prototype.init = init;
      NavWalker.prototype.resizeE = resizeE;
      NavWalker.prototype.scrollE = scrollE;

      // find active part
      NavWalker.prototype.storeData = storeData;
      NavWalker.prototype.search = triggerSearch;
      NavWalker.prototype.treatNav = treatNav;

      // animation callback
      NavWalker.prototype.toggleMenu = toggleMenu;

      NavWalker.prototype.showNav = showNav;
      NavWalker.prototype.hideNav = hideNav;
      NavWalker.prototype.fixeResNav = fixeResNav;
      NavWalker.prototype.defixeResNav = defixeResNav;
      NavWalker.prototype.addActive = addActive;
      NavWalker.prototype.removeActive = removeActive;
    // ----------------------------
    // ----------------------------
    // active url part
    // ----------------------------
    // ----------------------------
    // --------------
    // init method
    function init(e) {
        var self = this,
            url = cleanUrl(window.location.href);
        // recuperation du storage
        var getStorage = localStorage.getItem('active'),
            parsedStorage = (getStorage) ? JSON.parse(getStorage) : undefined,
            anchorL = this.nav.find("a").length,
            sameStorage = (getStorage && parsedStorage.linkArray.length == anchorL) ? 1 : 0;
        // Put the object into storage
        if(getStorage && sameStorage){
            data = parsedStorage;
          } else {
            data = this.storeData(url);
          }

          this.resizeE(1);
          this.scrollE();

          this.active = data;
          this.search(url);
    }
    // init method
    // --------------
    function construct(object){
      if(object){
        for (prop in object){
          this[prop] = object[prop];
        };
      }else{
        this.break = object;
      }
    };
    // --------------
    // Store Data method
    // if no stored datas -> find & store
    function storeData(url){
        // store baseurl
        var self = this,
            active = {},
            slash = url.indexOf("/",7) +1,
            baseurl = (slash) ? url.substring(0, slash) : url;
            active.baseurl = baseurl;
            active.activeIndex = [];

        active.linkArray = [];
        // store main nav a href
        // normalize all href
        var anchor = this.nav.find("ul").find("a"),
            anchorArr = [];

        anchor.each(function(){
          var href = $(this).attr("href");
          href = (href.match(baseurl)) ? href : normalizeHref(active, href);
          anchorArr.push(href);
        });

        this.nav.find("ul").first().children("li").children("a").each(function(index){
          var self = $(this),
              href = self.attr("href"),
              childUl = self.parent("li").children("ul"),
              hasUl = childUl.length;
              if(index !== 0 ){
                var art = active.linkArray[index-1];
                indexParent = (art.href) ? art.index +1: art[art.length-1].index +1;
              }else{
                indexParent = 0;
              }

          href = (href.match(baseurl)) ? href : normalizeHref(active, href);

          var firstItem = new Anchor(href, indexParent);

          if(hasUl){
            var childUlArr = [];
            childUlArr.push(firstItem);

            childUl.find("a").each(function(index){
              var href = $(this).attr("href"),
                  indexChild = indexParent + index +1;
              href = (href.match(baseurl)) ? href : normalizeHref(active, href);
              var item = new Anchor(href, indexChild);
              childUlArr.push(item);
            });

            active.linkArray.push(childUlArr);

          }else{
            active.linkArray.push(firstItem);
          }
        });
        localStorage.setItem("active", JSON.stringify(active));
        return active;
      }


    function Anchor(href, index){
      this.href = href;
      this.index = index;
    }
    // --------------
    // normalize href
    // add base url if it missing return it
    function normalizeHref(activeTmp, href){
      baseurl = activeTmp.baseurl, href;
      if(href.match("index.html")){
        href = href.replace("index.html","");
      };
      var hrefNormalized = (href[0] === "/") ? baseurl + href.substring( 1,href.length ) : baseurl + href;
      return hrefNormalized;
    }
    // normalize href
    // --------------
    // --------------
    // clean url
    // remove ' ? ' from document.location.href return cleaned url
    function cleanUrl(url){
      var lastInter = url.indexOf("?"),
          lastHash = -1;
      switch (lastInter !== (-1) && lastHash !== (-1)) {
        case lastHash !== (-1):
              splitIndex = lastInter;
          break;
        case lastInter !==(-1):
            splitIndex = lastHash;
          break;
        default:
          var smaller = (lastHash > lastInter) ? lastInter : lastHash;
          splitIndex = smaller;
      }
      // split actual url when have to
      var url = (splitIndex) ? url.replace("index.html","") :  url.substring(0, splitIndex).replace("index.html","");
      return url;
    }
    // clean url
    // --------------
    // --------------
    // Store Data method
    // --------------

    // --------------
    // search method
    // --------------
    // search url in data stored -> active.linkArray
    function triggerSearch(url){
      var self = this;
          url = url;


      if(this.active.activeIndex.length !== 0){
        this.active.oldActiveIndex = this.active.activeIndex;
        this.active.activeIndex = [];
      }
      this.active.linkArray.forEach(function(el, index){
          if(el.href){
            searchUrl(el, url, self);
          }else{
            var parentEl = el;
            el.forEach(function(el){
              searchUrl(el, url, self, parentEl);
            });
          }
      });
    }
    // --------------
    // search async function
    function searchUrl(el, url, self, parentEl){
      //if perfect match store in data
      if(el.href === url){
      console.log("url");
      console.log(url);
        // if parent of element argument (parentEl) && if its different of el
        if(parentEl && parentEl[0] !== el) {
          self.active.activeIndex.push(parentEl[0], el);
        }else{
          self.active.activeIndex.push(el);
        }
        // create a custom event
        var custom = new CustomEvent("treatNav");
        document.body.dispatchEvent(custom);
      }
    }
    //proccess on custom event
    function treatNav(e){
      var self = this,
          main = this.nav.find("ul").find("a"),
          responsive = this.navClone.find("ul").find("a");

          if(this.active.oldActiveIndex){
            this.active.oldActiveIndex.forEach(function(el){
              var index = el.index,
                  active = $(main[index]),
                  activeResponsive = $(responsive[index]);

                  self.removeActive(active);
                  self.removeActive(activeResponsive);
            });
          }

          this.active.activeIndex.forEach(function(el){
            var index = el.index,
                active = $(main[index]),
                activeResponsive = $(responsive[index]);
                self.addActive(active);
                self.addActive(activeResponsive);
          });
    }
    // --------------
    // search method
    // --------------

    // --------------
    // EVENT EVENT EVENT
    // --------------
    // if window offset sup to nav offset
    // show nav clone else hide
    function scrollE(){
      var wo = $(window).scrollTop();
      if(this.underBreak && !wo){
        this.showNav(this.navClone);
        this.defixeResNav();
        return;
      }
      else if (wo >= this.navo){
          this.showNav(this.navClone);
          this.fixeResNav();
      } else {
          this.hideNav(this.navClone);
          this.defixeResNav();
      }
    }
    // --------------
    // SCROLL EVENT
    // --------------
    function resizeE(init){
      var wwNew = $(window).width();

      if(this.ww == wwNew && !init) return;

      if(wwNew <= this.break){
        this.showNav(this.navClone);
        this.hideNav(this.nav);
        this.underBreak = 1;

        this.nav.addClass("is-breaked");
        this.navClone.addClass("is-breaked");
      }else{
        this.hideNav(this.navClone);
        this.showNav(this.nav);
        this.underBreak = 0;

        this.nav.removeClass("is-breaked");
        this.navClone.removeClass("is-breaked");
        this.navClone.removeAttr("style");
        this.navClone.find("ul").first().removeAttr("style");
        this.navClone.find("ul ul").removeAttr("style");
        this.navClone.find("li.is-open").removeClass("is-open");

      }
      this.navo = (this.underBreak) ? 0 : this.nav.offset().top;
      this.navh = this.navClone.height();
      this.ww = wwNew;
    }
    // --------------
    // EVENT EVENT EVENT
    // --------------
    function toggleMenu(){
        if( ! this.underBreak) return;
        var self = this,
            mainUl = this.navClone.find("ul").first();

        mainUl.stop().slideToggle();
    }

    function slideSubMenu(subMenuAnchor){
      var liSubMenu = subMenuAnchor.parent("li"),
          ulSubMenu = liSubMenu.children("ul");

      if( ulSubMenu.length ) {
          if( ! ulSubMenu.children("li").first().hasClass("is-cloned") ){
            var normalLiClass = ulSubMenu.children("li").last().attr("class"),
                anchorClone = subMenuAnchor.clone().wrap("<li class='"+ normalLiClass +" is-cloned'></li>").parent();

            ulSubMenu.prepend(anchorClone);
          }
          ulSubMenu.stop().slideToggle();
          liSubMenu.stop().toggleClass("is-open");
      }
    }

    function showNav(nav){
      nav.removeClass("is-hidden");
    }
    function hideNav(nav){
      nav.addClass("is-hidden");
    }
    function fixeResNav(){
      this.navClone.addClass("is-fixed");
    }
    function defixeResNav(){
      this.navClone.removeClass("is-fixed");
    }
    function removeActive(oldActive){
        oldActive.removeClass("is-active");
    }
    function addActive(newActive){
        newActive.addClass("is-active");
    }
    // --------------
    // EVENT EVENT EVENT
    // --------------
})(jQuery);
