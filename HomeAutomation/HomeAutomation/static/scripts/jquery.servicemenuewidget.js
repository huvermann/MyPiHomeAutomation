(function ($) {
    $.widget("homeautomation.servicemenuwidget", $.mobile.widget, {
        options: {
            url: 'ws://' + location.hostname + ':8000/',
            mode: 'default'
        },

        configure: function(){
            this.jqm = $;
            this.console = console;
            this.MessageManager = new MessageManagerII(this);
        },

        servicelocator: null,

        /** Constructor **/
        _create: function () {
            console.log("_create has been called");
            loading('show');
            this.servicelocator = new Injector(this.configure);
            inputElement = this.element;
            var opts = $.extend(this.options, inputElement.data("options"));
            $(document).trigger("servicemenuwidgetcreate");
            inputElement.empty().append(this._initContent());
            // start MessageManager:
            var mm = this.servicelocator.MessageManager;
            this.registerMessages(mm);
            mm.open(this.options.url);
        },

        /** Custom method to handle updates. */
        _update: function () {
            var inputElement = this.element;
            var opts = $.extend(this.options, inputElement.data("options"));
            $(document).trigger("servicemenuwidgetupdate");
            
            refreshJQueryComponents();
        },

        /* Externally callable method to force a refresh of the widget. */
        refresh: function () {
            return this._update();
        },

        _initContent: function () {
            var result = "url:" + this.options.url;
            return result;
        },

        registerMessages: function (messageManager) {
            messageManager.registerMessage("PageList", this.onPageList, this.element);
            messageManager.registerMessage("Hardware", this.onHardwareMessage, this.element);
            messageManager.registerMessage("Chat", this.onChatMessage, this.element);
        },

        onPageList: function (message, targetElement) {
            if (message.data) {
                pagesToCollapsible(message.data.pages, targetElement);
            }
            refreshJQueryComponents(targetElement);
            loading("hide");
        },

        onHardwareMessage: function(message, targetElement){
            console.log("Hardware message received");
            console.log(message);
            var hwid = message.data.hwid;
            var value = message.data.value;
            if (typeof hwid !== "undefined" && typeof value !== "undefined") {
                $('[hardwareId="' + hwid + '"]').each(function () {
                    // Update all items assigned to specific hardware id
                    if ($(this).attr("data-role") == "flipswitch") {
                        console.log("Flipswitch detected!!");
                        var flip = $(this).flipswitch();
                        var actual = flip.val();
                        if (actual != value) {
                            // Change flipswitch value and refresh.
                            flip.val(value);
                            $(this).flipswitch("refresh");
                            console.log("Flipswitch updated!");
                        } else {
                            console.log("Not updated, value is unchanged!");
                        }
                        
                        
                    };
                });

            } else {
                console.log(typeof message.data);
                console.log(typeof value);
                console.error('Invalid hardware message!', message);
            };
        },

        onUserChangedSwitch: function(event, ui){            
            var id = this.id,
            value = this.value;
            console.log(id + " has been changed! " + value);
            var messagecomponent = $(this).attr('messagecomponent');
            $("#" + messagecomponent).servicemenuwidget("sendUIMessage", id, value);
        },

        onUserChangedSlider: function (event, ui) {
            var value = $(this).slider().val();
            var id = this.id;
            var messagecomponent = $(this).attr('messagecomponent');
            $("#" + messagecomponent).servicemenuwidget("sendUIMessage", id, value);
        },


        onChatMessage: function (message) {
            console.log("OnChatMessage from widget");
        },

        sendUIMessage(id, value) {
            console.log("send message***");
            var message = {
                "messagetype": "UI-Message",
                "data": { hwid: id, value: value }
            };
            this.servicelocator.MessageManager.sendMessage(JSON.stringify(message));
        }

        
    });

    /* Handler which initialises all widget instances during page creation. */
    $(document).bind("pagecreate", function (e) {
        $(document).trigger("servicemenuwidgetbeforecreate");
        return $(":jqmData(role='servicemenuwidget')", e.target).servicemenuwidget();
    });

})(jQuery);