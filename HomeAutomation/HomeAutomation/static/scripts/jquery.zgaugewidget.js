// Widget to wrap gauge2.js
(function ($) {
    $.widget("homeautomation.gaugewidget", $.mobile.widget, {
        /** Available options for the widget are specified here, along with default values. */
        options: {
            lines: 12, // The number of lines to draw
            angle: 0.28, // The length of each line
            lineWidth: 0.32, // The line thickness
            pointer: {
                length: 0.88, // The radius of the inner circle
                strokeWidth: 0.055, // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',   // If true, the pointer will not go past the end of the gauge
            colorStart: '#CFCBC9',   // Colors
            colorStop: '#DA1168',    // just experiment with them
            strokeColor: '#E0E0E0',   // to see which ones work best for you
            generateGradient: true,
            maxValue : 100,
            animationSpeed: 32,
            hardwareId: null,
            messagecomponent: null,
            height: 30,
            width: 30

        },

        _gaugeInstance: null,

        /** Mandatory method - automatically called by jQuery Mobile to initialise the widget. */
        _create: function () {
            console.log("gaugewidget startet..");
            console.log(this);
            var inputElement = this.element;
            var opts = $.extend(this.options, inputElement.data("options"));
            $(document).trigger("gaugewidgetcreate");
            // write content
            this.element.empty().append(this._initContent());
            
            


            //var gauge = new Gauge(gaugeElement).setOptions(opts); // create sexy gauge!
            //gauge.set(50); // set actual value
            //this._gaugeInstance = gauge;
        },
        /** Custom method to handle updates. */
        _update: function () {
            console.log("gaugewidget update..");
            var inputElement = this.element;
            var opts = $.extend(this.options, inputElement.data("options"));
            $(document).trigger("gaugewidgetupdate");
            this.find("canvas").each(function () {
                var gauge = new gauge(this[0]).setOptions(opts);
                gauge.maxValue = 100
                gauge.animationSpeed = 32;
                gauge.set(50);
            });
            // implement update
            //this._gaugeInstance.set(50);
        },
        /* Externally callable method to force a refresh of the widget. */
        refresh: function () {
            return this._update();
        },

        _initContent: function () {
            var html = '<canvas width=100 height=50 usedby="gaugewidget">';
            var html =+ '<div>Label</div>';
            return html;
        }
    });
    /* Handler which initialises all widget instances during page creation. */
    $(document).bind("pagecreate", function (e) {
        $(document).trigger("gaugewidgetbeforecreate");
        return $(":jqmData(role='gaugewidget')", e.target).gaugewidget();
    });
})(jQuery);