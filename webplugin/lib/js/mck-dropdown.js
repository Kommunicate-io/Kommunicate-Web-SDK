+function(e,t){"use strict";function n(t){t&&3===t.which||(e(r).remove(),e(a).each(function(){var n=e(this),i=o(n),r={relatedTarget:this};i.hasClass("open")&&(i.trigger(t=e.Event("hide.bs.mck-dropdown",r)),t.isDefaultPrevented()||(n.attr("aria-expanded","false"),i.removeClass("open").trigger("hidden.bs.mck-dropdown",r)))}))}function o(t){var n=t.attr("data-target");n||(n=t.attr("href"),n=n&&/#[A-Za-z]/.test(n)&&n.replace(/.*(?=#[^\s]*$)/,""));var o=n&&e(n);return o&&o.length?o:t.parent()}function i(t){return this.each(function(){var n=e(this),o=n.data("bs.mck-dropdown");o||n.data("bs.mck-dropdown",o=new s(this)),"string"==typeof t&&o[t].call(n)})}var r=".dropdown-backdrop",a='[data-toggle="mckdropdown"]',s=function(t){e(t).on("click.bs.mck-dropdown",this.toggle)};s.VERSION="3.3.2",s.prototype.toggle=function(i){var r=e(this);if(!r.is(".disabled, :disabled")){var a=o(r),s=a.hasClass("open");if(n(),!s){"ontouchstart"in t.documentElement&&!a.closest(".navbar-nav").length&&e('<div class="dropdown-backdrop"/>').insertAfter(e(this)).on("click",n);var l={relatedTarget:this};if(a.trigger(i=e.Event("show.bs.mck-dropdown",l)),i.isDefaultPrevented())return;r.trigger("focus").attr("aria-expanded","true"),a.toggleClass("open").trigger("shown.bs.mck-dropdown",l)}return!1}},s.prototype.keydown=function(t){if(/(38|40|27|32)/.test(t.which)&&!/input|textarea/i.test(t.target.tagName)){var n=e(this);if(t.preventDefault(),t.stopPropagation(),!n.is(".disabled, :disabled")){var i=o(n),r=i.hasClass("open");if(!r&&27!=t.which||r&&27==t.which)return 27==t.which&&i.find(a).trigger("focus"),n.trigger("click");var s=" li:not(.divider):visible a",l=i.find('[role="menu"]'+s+', [role="listbox"]'+s);if(l.length){var c=l.index(t.target);38==t.which&&c>0&&c--,40==t.which&&c<l.length-1&&c++,~c||(c=0),l.eq(c).trigger("focus")}}}};var l=e.fn.mckDropdown;e.fn.mckDropdown=i,e.fn.mckDropdown.Constructor=s,e.fn.mckDropdown.noConflict=function(){return e.fn.mckDropdown=l,this},e(t).on("click.bs.mck-dropdown.data-api",n).on("click.bs.mck-dropdown.data-api",".mck-dropdown form",function(e){e.stopPropagation()}).on("click.bs.mck-dropdown.data-api",a,s.prototype.toggle).on("keydown.bs.mck-dropdown.data-api",a,s.prototype.keydown).on("keydown.bs.mck-dropdown.data-api",'[role="menu"]',s.prototype.keydown).on("keydown.bs.mck-dropdown.data-api",'[role="listbox"]',s.prototype.keydown)}(jQuery,document);