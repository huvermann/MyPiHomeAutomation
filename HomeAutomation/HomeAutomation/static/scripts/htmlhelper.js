
function loading(showOrHide) {
    setTimeout(function () {
        $.mobile.loading(showOrHide);
    }, 1);
}

function refreshJQueryComponents(targetElement) {
    var instance = targetElement.servicemenuwidget().servicemenuwidget('instance');
    console.log("components refresh");
    $('div[data-role=collapsible]').collapsible();
    $('select[data-role=flipswitch]').flipswitch();

    $('select[data-role=flipswitch]').on("change", instance.onUserChangedSwitch);
    $('input[data-type=range]').on('slidestop', instance.onUserChangedSlider);
    $('input[data-type=range]').slider().slider("refresh");
    refreshGauge();
    $('#mainpage').trigger('create');
    
}

function refreshGauge() {
    // refresh gauge
    $('canvas[data-role=gauge]').each(function () {
        // this ist the gauge
        var min = (this.attributes['gauge-min']) ? this.attributes['gauge-min'].value : 0;
        var max = (this.attributes['gauge-max']) ? this.attributes['gauge-max'].value : 100;
        var unit = (this.attributes['gauge-unit']) ? this.attributes['gauge-unit'].value : "°C";
        var value = (this.attributes['value']) ? this.attributes['value'].value : 0;
        var options = {
            min: min,
            max: max,
            unit: unit,
            color: '#3366FF',
            colorAlpha: 1,
            bgcolor: '#00FF99', //"#222",
            type: "halfcircle"
        };
        var id = '#' + this.attributes['id'].value;
        $(id).gauge(value, options);

    })
}
function itemToUnknownComponent(item){
    html = "Unknown component type: " + item.type;
    return html;
}

function itemToTemperatureComponent(item){
    var html = itemToUnknownComponent(item);
    return html;
}

function itemToSliderComponent(item, messageComponentId) {
    var html = '<div style="max-width: 300px">';
    html += '<label for="' + item.id + '">' + item.customName + '</label>';
    html += '<input data-type="range" name="' + item.id + '" id="' + item.id + '" ';
    html += 'min="' + item.min + '" ';
    html += 'max=' + item.max + '" ';
    html += 'value="' + item.value + '" ';
    html += 'data-show-value="true" ';
    html += 'messagecomponent="' + messageComponentId + '" ';
    html += 'hardwareId="' + item.id + '" ';
    html += '></div>';
    return html;
}

function itemToSwitchComponent(item, messageComponentId){
    var html = '<label for="' + item.id + '">';
    html += item.customName;
    html += '</label>';
    html += '<select data-role="flipswitch" id="' + item.id + '" messagecomponent="' + messageComponentId + '" ';
    html += 'hardwareId="' + item.id + '" ';
    html += '>'; // select
    html += '<option value="0">Aus</option> ';
    html += '<option value="1">An</option>';
    html += '</select>';
    html += '';
    
    return html;
}

function itemToGaugeComponent(item) {
    var html = '<label for="' + item.id + '" >' + item.customName + '</label>';
    html += '<canvas id="' + item.id + '" width="100" height="60" data-role="gauge" ';
    html += 'gauge-min="' + item.min +'" ';
    html += 'gauge-max="' + item.max + '" ';
    html += 'gauge-unit="' + item.unit + '" ';
    html += 'value="' + item.value + '" ';
    html += 'hardwareId="' + item.id + '" ';
    html += '></canvas>';
    return html;
}

function itemToChatComponent(item) {
    var html = ' <form>';
    html += '<label for="chatoutput">Chat messages:</label>';
    html += '<textarea name="chatoutput" rows="20" cols="50"></textarea>';
    html += '<label for="chatinput">Eingabe:</label>';
    html += '<textarea name="chatinput" cols="50"></textarea>';
    html += '<input type="button" name=sendButton value="Send" onClick="sendChatText();">';
    html += '<input type="button" name=clearButton value="Clear" onClick="clearChatText();">';
    html += '</form>'
    return html;
}

function itemsToComponents(items, messageComponentId) {
    var html = "<form>";
    for (var item in items) {
        if (items[item].type) {
            switch (items[item].type) {
                case "switch":
                    html += itemToSwitchComponent(items[item], messageComponentId);
                    break;
                case "slider":
                    html += itemToSliderComponent(items[item], messageComponentId);
                    break;
                case "gauge":
                    html += itemToGaugeComponent(items[item], messageComponentId);
                    break;
                case "chat":
                    html += itemToChatComponent(items[item], messageComponentId);
                    break;

                default:
                    html += itemToUnknownComponent(items[item], messageComponentId);
            }
        }
    }
    html += "<form>"
    return html;
}
///
/// Generates collapsibles from page list.
///
function pagesToCollapsible(pages, targetElement) {
    var html = "";
    for (var page in pages) {
        html += '<div data-role="collapsible" id="coll_page_' + pages[page].ID + '">';
        html += '<h4>' + pages[page].PageName+ '</h4>';
        if (pages[page].Items) {
            html += itemsToComponents(pages[page].Items, $(targetElement).attr("id"));
        } else {
            html += "no items found";
        }
        
        html += '</div>';
    }
    targetElement.empty().append(html);
}