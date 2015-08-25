(function ($) {
    $.widget("homeautomation.servicemenuwidget", $.mobile.widget, {
        options: {
            height: 200,
            url: 'ws://' + location.hostname + ':8000/'
        },

        configure: function(){
            this.jqm = $;
            this.console = console;
            this.MessageManager = new MessageManagerII(this); 
        },

        servicelocator: null,

        /** Constructor **/
        _create: function () {
            this.servicelocator = new Injector(this.configure);
            inputElement = this.element;
            console.log(inputElement);
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
            console.log("_update from servicemenuwidget");
            var inputElement = this.element;
            var opts = $.extend(this.options, inputElement.data("options"));
            $(document).trigger("servicemenuwidgetupdate");
            refreshJQueryComponents($);

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
            messageManager.registerMessage("Chat", this.onChatMessage, this.element);
        },

        onPageList: function (message, targetElement) {
            console.log("On page list from Widget");
            console.log(targetElement);
            if (message.data) {
                pagesToCollapsible(message.data.pages, targetElement);
            }
            //$('div[data-role=servicemenuwidget]').servicemenuwidget();
            refreshJQueryComponents($);
        },

        onChatMessage: function (message) {
            console.log("OnChatMessage from widget");
        }
    });

    /* Handler which initialises all widget instances during page creation. */
    $(document).bind("pagecreate", function (e) {
        $(document).trigger("servicemenuwidgetbeforecreate");
        return $(":jqmData(role='servicemenuwidget')", e.target).servicemenuwidget();
    });

})(jQuery);