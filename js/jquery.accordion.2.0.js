/*!
 * jQuery Accordion widget
 * http://nefariousdesigns.co.uk/projects/widgets/accordion/
 * 
 * Source code: http://github.com/nefarioustim/jquery-accordion/
 *
 * Copyright © 2010 Tim Huegdon
 * http://timhuegdon.com
 */
 
(function($) {
    var debugMode = true;
    
    function debug(msg) {
        if(debugMode && window.console && window.console.log){
            window.console.log(msg);
        } else {
            alert(msg);
        }
    }
    
    $.fn.accordion = function(config) {
        var defaults = {
            "handle":           "h3",
            "panel":            ".panel",
            "speed":            200,
            "easing":           "swing",
            "accordion":        true,
            "toggle":           false,
            "activeClassPanel": "open",
            "activeClassLi":    "active",
            "lockedClass":      "locked"
        };
        
        if (config) $.extend(defaults, config);
        
        this.each(function() {
            var accordion   = $(this),
                reset       = {
                    height: 0,
                    marginTop: 0,
                    marginBottom: 0,
                    paddingTop: 0,
                    paddingBottom: 0
                },
                panels      = accordion.find(">li>" + defaults.panel)
                                .each(function() {
                                    var el = $(this);
                                    el
                                        .data("dimensions", {
                                            height: el.css("height"),
                                            marginTop: el.css("marginTop"),
                                            marginBottom: el.css("marginBottom"),
                                            paddingTop: el.css("paddingTop"),
                                            paddingBottom: el.css("paddingBottom")
                                        })
                                        .bind("accordion-panel-open", function(e, clickedLi) {
                                            var panel = $(this);
                                            panel
                                                .css($.extend({overflow: "hidden"}, reset))
                                                .show()
                                                .animate($.extend({opacity: 1}, panel.data("dimensions")), {
                                                    duration:   defaults.speed,
                                                    easing:     defaults.easing,
                                                    queue:      false,
                                                    complete:   function(e) {
                                                        panel.addClass(defaults.activeClassPanel);
                                                        clickedLi.addClass(defaults.activeClassLi);
                                                    }
                                                });
                                        })
                                        .bind("accordion-panel-close", function(e) {
                                            var panel = $(this);
                                            panel
                                                .css({
                                                    overflow: "hidden"
                                                })
                                                .animate($.extend({opacity: 0}, reset), {
                                                    duration:   defaults.speed,
                                                    easing:     defaults.easing,
                                                    queue:      false,
                                                    complete:   function(e) {
                                                        panel.removeClass(defaults.activeClassPanel).hide();
                                                        panel.closest("li").removeClass(defaults.activeClassLi);
                                                    }
                                                });
                                        });
                                        
                                    return el;
                                })
                                .hide(),
                handles     = accordion.find(
                                " > li > "
                                + defaults.handle
                            )
                                .wrapInner('<a class="accordion-opener" href="#open-panel" />');
            
            accordion
                .find(
                    " > li."
                    + defaults.activeClassLi
                    + " > "
                    + defaults.panel
                    + ", > li."
                    + defaults.lockedClass
                    + " > "
                    + defaults.panel
                )
                .show()
                .addClass(defaults.activeClassPanel);
            
            var active = accordion.find(
                " > li."
                + defaults.activeClassLi
                + ", > li."
                + defaults.lockedClass
            );
            
            if (!defaults.toggle && active.length < 1) {
                accordion
                    .find(" > li")
                    .first()
                    .addClass(defaults.activeClassLi)
                    .find(" > " + defaults.panel)
                    .addClass(defaults.activeClassPanel)
                    .show();
            }
            
            accordion.delegate(".accordion-opener", "click", function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                
                var clicked     = $(this),
                    clickedLi   = clicked.closest("li"),
                    panel       = clickedLi.find(">" + defaults.panel).first(),
                    open        = accordion.find(
                        " > li:not(."
                        + defaults.lockedClass
                        + ") > "
                        + defaults.panel
                        + "."
                        + defaults.activeClassPanel
                    );
                
                if (!clickedLi.hasClass(defaults.lockedClass)) {
                    if (panel.is(":visible")) {
                        if (defaults.toggle) panel.trigger("accordion-panel-close");
                    } else {
                        panel.trigger("accordion-panel-open", [clickedLi]);
                        if (defaults.accordion) open.trigger("accordion-panel-close");
                    }
                }
            });
        });
        
        return this;
    };
})(jQuery);