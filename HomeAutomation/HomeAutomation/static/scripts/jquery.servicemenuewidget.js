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

        getElementType: function (element) {
            var result = null;
            if ($(element).attr("data-role") == "flipswitch") {
                return "FlipSwitch";
            }
            if ($(element).attr("data-type") == "range") {
                return "Slider";
            };
            if ($(element).attr("data-role") == "gauge") {
                return "Gauge";
            }
            return result;
        },

        changeFlipSwitch: function(flipswitch, value){
            var flip = $(flipswitch).flipswitch();
            flip.flipswitch({disabled: false});
           
            var actual = flip.val();
            if (actual != value) {
                // Change flipswitch value and refresh.
                flip.val(parseInt(value));
                $(flipswitch).flipswitch("refresh");
            } else {
                console.log("Not updated, value is unchanged!");
            }
        },

        changeSlider: function (slider, value) {
            var sli = $(slider).slider();
            sli.slider('enable');
            current = sli.val();
            if (current != value) {
                sli.val(value);
                $(slider).slider("refresh");
            }
        },

        changeGauge: function (gauge, value) {
            // this ist the gauge
            var min = (gauge.attributes['gauge-min']) ? gauge.attributes['gauge-min'].value : 0;
            var max = (gauge.attributes['gauge-max']) ? gauge.attributes['gauge-max'].value : 100;
            var unit = (gauge.attributes['gauge-unit']) ? gauge.attributes['gauge-unit'].value : "°C";
            //var value = (gauge.attributes['value']) ? gauge.attributes['value'].value : 0;
            var options = {
                min: min,
                max: max,
                unit: unit,
                color: '#3366FF',
                colorAlpha: 1,
                bgcolor: '#00FF99', //"#222",
                type: "halfcircle"
            };
            $(gauge).gauge(value, options);

            
        },

        onHardwareMessage: function(message, targetElement){
            console.log("Hardware message received");
            console.log(message);
            var hwid = message.data.hwid;
            var value = message.data.value;

            if (typeof hwid !== "undefined" && typeof value !== "undefined") {
                $('[hardwareId="' + hwid + '"]').each(function () {

                    elementType = targetElement.servicemenuwidget('getElementType', this);
                    console.log("ElementType: " + elementType);
                    // Update all items assigned to specific hardware id
                    switch (elementType) {
                        case "FlipSwitch":
                            // set flipswitch()
                            targetElement.servicemenuwidget('changeFlipSwitch', this, value);
                            break;
                        case "Slider":
                            // set slider
                            targetElement.servicemenuwidget('changeSlider', this, value);
                            break;
                        case "Gauge":
                            // set gauge
                            targetElement.servicemenuwidget('changeGauge', this, value);
                            break;
                        default:
                            // unknown element
                            console.error("unknown element: " + elementType, this);

                    }// switch

                   
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