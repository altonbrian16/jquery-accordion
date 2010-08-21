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
            "handle": "h3",
            "panel": ".panel"
        };
        
        if (config) $.extend(defaults, config);
        
        this.each(function(){
            var accordion   = $(this),
                panels      = accordion.find(">li>" + defaults.panel)
                                .each(function(){
                                    var el = $(this);
                                    el
                                        .data("dimensions", {
                                            height: el.css("height"),
                                            marginTop: el.css("marginTop"),
                                            marginBottom: el.css("marginBottom"),
                                            paddingTop: el.css("paddingTop"),
                                            paddingBottom: el.css("paddingBottom")
                                        })
                                        .bind("panel-open", function(e, clickedLi){
                                            var panel = $(this);
                                            panel
                                                .css({
                                                    height: 0,
                                                    marginTop: 0,
                                                    marginBottom: 0,
                                                    paddingTop: 0,
                                                    paddingBottom: 0,
                                                    overflow: "hidden"
                                                })
                                                .show()
                                                .animate({
                                                    height: panel.data("dimensions").height,
                                                    marginTop: panel.data("dimensions").marginTop,
                                                    marginBottom: panel.data("dimensions").marginBottom,
                                                    paddingTop: panel.data("dimensions").paddingTop,
                                                    paddingBottom: panel.data("dimensions").paddingBottom
                                                }, {
                                                    duration:   "normal",
                                                    complete:   function(){
                                                        panel.addClass("open");
                                                        clickedLi.addClass("active");
                                                    }
                                                });
                                        })
                                        .bind("panel-close", function(e, clickedLi){
                                            var panel = $(this);
                                            panel
                                                .css({
                                                    overflow: "hidden"
                                                })
                                                .animate({
                                                    height: 0,
                                                    marginTop: 0,
                                                    marginBottom: 0,
                                                    paddingTop: 0,
                                                    paddingBottom: 0
                                                }, {
                                                    duration:   "normal",
                                                    complete:   function(){
                                                        panel.removeClass("open").hide();
                                                        clickedLi.removeClass("active");
                                                    }
                                                })
                                        });
                                        
                                    return el;
                                })
                                .hide(),
                handles     = accordion.find(">li>" + defaults.handle)
                                .wrapInner('<a class="opener" href="#open-panel" />');
            
            accordion.delegate(".opener", "click", function(e){
                e.preventDefault();
                e.stopImmediatePropagation();
                
                var clicked     = $(this),
                    clickedLi   = clicked.closest("li"),
                    panel       = clickedLi.find(">" + defaults.panel).first();
                
                if (panel.is(":visible")) {
                    panel.trigger("panel-close", [clickedLi]);
                } else {
                    panel.trigger("panel-open", [clickedLi]);
                }
            });
        });
        
        return this;
    };
})(jQuery);