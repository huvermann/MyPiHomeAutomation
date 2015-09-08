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
            //loading('show');
            this.servicelocator = new Injector(this.configure);
            inputElement = this.element;
            var opts = $.extend(this.options, inputElement.data("options"));
            $(document).trigger("servicemenuwidgetcreate");
            inputElement.empty().append(this._initContent());
            
            // start MessageManager:
            var mm = this.servicelocator.MessageManager;
            this.registerMessages(mm);
            mm.open(this.options.url);

            // Onclick Event auf logon-Button
            $("#LogonBtn").on("click", function () {
                
                var username = $("#un").val();
                var password = $("#pw").val();
                var credentials = {
                    username: username,
                    password: password
                };
                $('#popupLogin').popup("close");
                $("#mainmenue").servicemenuwidget("logon", credentials);

                return false;

            });
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

        logon: function(credentials){
            loading("show"); // Loading indicator
            var message = {
                "messagetype": "logon",
                "data": credentials
            };
            this.servicelocator.MessageManager.sendMessage(JSON.stringify(message));

        },

        _initContent: function () {
            //html='        <div data-role="popup" id="popupLogin" data-theme="a" class="ui-corner-all">'+
            //'<form>'+
            //    '<div style="padding:10px 20px;">'+
            //       '<h3>Anmelden</h3>'+
            //        '<label for="un" class="ui-hidden-accessible">Benutzername:</label>'+
            //        '<input type="text" name="user" id="un" value="" placeholder="Benutzername" data-theme="a">'+
            //        '<label for="pw" class="ui-hidden-accessible">Password:</label>'+
            //        '<input type="password" name="pass" id="pw" value="" placeholder="Passwort" data-theme="a">'+
            //        '<button type="submit" class="ui-btn ui-corner ui-shadow ui-bnt-b ui-btn-icon-left ui-icon-check">Anmelden</button>'+
            //        '</div>'+
            //    '</form>'+
            //'</div>';
            //return html;
            return 'Not connected!';
        },

        registerMessages: function (messageManager) {
            messageManager.registerMessage("LogonResult", this.onLogonResult, this.element);
            messageManager.registerMessage("LogonRequired", this.onLogonRequired, this.element);

            messageManager.registerMessage("PageList", this.onPageList, this.element);
            messageManager.registerMessage("Hardware", this.onHardwareMessage, this.element);
            messageManager.registerMessage("Chat", this.onChatMessage, this.element);
            messageManager.registerMessage("MappingInfo", this.onMappingInfoResponse, this.element);
        },

        onLogonResult: function(message, targetElement){
            success = false;
            loading("hide");
            if (message.data) {
                if (message.data.success == true) {
                    success = true;
                }
            }
            if (success) {
                // require page
                targetElement.servicemenuwidget("sendPageRequest");
            } else {
                $("#loginMessage").empty().append('Login gescheitert!');
                // show logon popup again:
                $("#popupLogin").popup("open");
            }
        },

        onMappingInfoResponse: function(message, targetElement){
            if (message.data) {
                $(document).trigger("onMappingInfoResponse", message, targetElement);
            }
        },

        sendPageRequest: function () {
            this.servicelocator.MessageManager.requestPages();
        },

        sendMappingInfoRequest: function(){
            this.servicelocator.MessageManager.requestMappingInfo()
        },

        onLogonRequired: function(message, targetElement){
            refreshJQueryComponents(targetElement);
            loading("hide");
            $("#popupLogin").popup("open");
        },

        onPageList: function (message, targetElement) {
            if (message.data) {
                pagesToCollapsible(message.data.pages, targetElement);
            }
            refreshJQueryComponents(targetElement);
            targetElement.servicemenuwidget("pullUpdates");
            $(document).trigger("onPageListResponse", message);
            loading("hide");
        },

        // User saves the changed group/page list.
        sendSavePages: function (data) {
            console.log("sendSavePages");
            console.log(data);
            if (data) {
                this.servicelocator.MessageManager.savePageList(data);
            }
        },

        // Pull updates from message bus / broker
        pullUpdates: function () {
            var message = {
                "messagetype": "pullupdates",
                "data": {}
            };
            this.servicelocator.MessageManager.sendMessage(JSON.stringify(message));
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
            var hwid = message.data.hwid;
            var value = message.data.value;

            if (typeof hwid !== "undefined" && typeof value !== "undefined") {
                $('[hardwareId="' + hwid + '"]').each(function () {

                    elementType = targetElement.servicemenuwidget('getElementType', this);
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