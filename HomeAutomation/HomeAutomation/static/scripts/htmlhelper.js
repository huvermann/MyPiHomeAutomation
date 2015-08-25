function refreshJQueryComponents(jq) {
    jq('div[data-role=collapsible]').collapsible();
    jq('input[data-role=flipswitch]').flipswitch();
    jq('#mainpage').trigger('create');
    refreshGauge(jq);
}

function refreshGauge(jq) {
    // refresh gauge
    jq('canvas[data-role=gauge]').each(function () {
        console.log(this);
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

function itemToSliderComponent(item){
    var html = '<div style="max-width: 300px">';
    html += '<label for="' + item.id + '">' + item.customName + '</label>';
    html += '<input type="range" name="' + item.id + ' id="' + item.id + '" ';
    html += 'min="' + item.min + '" ';
    html += 'max=' + item.max + '" ';
    html += 'value="' + item.value + '" ';
    html += 'data-show-value="true" ';
    html += '></div>';
    return html;
}

function itemToSwitchComponent(item){
    var html = '<label for="' + item.id + '">';
    html += item.customName;
    html += '</label>';
    html += '<input type="checkbox" data-role="flipswitch" id="' + item.id + '">';
    html += '';
    
    return html;
}

function itemToGaugeComponent(item) {
    var html = '<label for="' + item.id + '" >' + item.customName + '</label>';
    html += '<canvas id="' + item.id + '" width="100" height="60" data-role="gauge" ';
    html += 'gauge-min="' + item.min +'" ';
    html += 'gauge-max="' + item.max + '" ';
    html += 'gauge-unit="' + item.unit + '" ';
    html += 'value="' + item.value + '"></canvas>';
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

function itemsToComponents(items) {
    console.log('itemsToComponents');
    var html = "<form>";
    for (var item in items) {
        if (items[item].type) {
            switch (items[item].type) {
                case "switch":
                    html += itemToSwitchComponent(items[item]);
                    break;
                case "slider":
                    html += itemToSliderComponent(items[item]);
                    break;
                case "gauge":
                    html += itemToGaugeComponent(items[item]);
                    break;
                case "chat":
                    html += itemToChatComponent(items[item]);
                    break;

                default:
                    html += itemToUnknownComponent(items[item]);
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
            html += itemsToComponents(pages[page].Items);
        } else {
            html += "no items found";
        }
        
        html += '</div>';
    }
    targetElement.empty().append(html);
}