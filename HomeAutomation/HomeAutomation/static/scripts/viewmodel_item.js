function Viewmodel_Item(pageName) {

    var selectedItem = null;
    var self = this;
    var pageInfo = null;


    this.onRemoveItemClick = function() {
        alert("Remove item");
        popup = $("#dialogYesNo").popup("open");
        return false;
    }

    this.onItemViewPageCreate = function () {
        // Assign button click event
        $("#itemdetailremove").on("click", self.onRemoveItemClick);
    }

    this.onSelectItem = function (event, message) {
        selectedItem = message;
    }

    this.onSelectGroup = function (event, message) {
        selectedGroup = message;
    }
    this.onPageListResponse = function (event, message) {
        if (message.data) {
            pageInfo = message.data.pages;
        }
    }

    this.onBeforeShow = function(){
        var details = $('#itemdetailscontent').empty();
        var itemData = pageInfo[selectedGroup].Items[selectedItem];
        var html = self.renderItemData(itemData);
        details.append(html);
        $('#itemdetaillistview').listview().listview("refresh");
    }

    this.renderItemData = function(item) {
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

    $("#itemdetail").on('pagecreate', this.onItemViewPageCreate);
    $("#itemdetail").on('pagebeforeshow', this.onBeforeShow);

    $(document).bind("onPageListResponse", this.onPageListResponse);
    
    return this;
}