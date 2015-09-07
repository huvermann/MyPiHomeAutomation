function Viewmodel_Item(pageName) {

    var selectedItem = null;
    var self = this;
    var pageInfo = null;

    onSelectItem = function (event, message) {
        selectedItem = message;
    }

    onSelectGroup = function (event, message) {
        selectedGroup = message;
    }
    onPageListResponse = function (event, message) {
        if (message.data) {
            pageInfo = message.data.pages;
        }
    }

    onBeforeShow = function(){
        var details = $('#itemdetailscontent').empty();
        var itemData = pageInfo[selectedGroup].Items[selectedItem];
        var html = self.renderItemData(itemData);
        details.append(html);
        $('#itemdetaillistview').listview().listview("refresh");
    }

    renderItemData = function(item) {
        var html = '<ul data-role="listview" id="itemdetaillistview">';
        html += "<h2>Funktionseigenschaften</h2>";
        for (key in item) {
            html += '<li>';
            html += key + ": " + item[key];
            html += '</li>';
        }
        
        html += '</ul>';
        return html;
    }

    $(document).on('selectitem', self.onSelectItem);
    $(document).on('selectgroup', self.onSelectGroup);

    $(document).bind("onPageListResponse", this.onPageListResponse);
    $("#itemdetail").on('pagebeforeshow', this.onBeforeShow);
}