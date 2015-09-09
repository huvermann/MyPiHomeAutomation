function Viewmodel_mappingdetails(pageName) {
    //inherits(ViewModelBase, this);
    //ViewModelBase.call(this, pageName);

    var selectedGroup = null;
    var pageName = pageName; 
    var self = this;

    this.onSelectGroup = function(event, message) {
        self.selectedGroup = message;
    }

    this.onPageListResponse = function (event, message) {
        if (message.data) {
            self.pageInfo = message.data;
        }
    }

    this.onClickNew = function () {
        alert("todo implement new function.");
        //Todo: implement
        return false;
    }

    this.onClickSave = function () {
        $('#dlgSaveMappingDetail').popup("close");
        // send save message
        $('#mainmenue').servicemenuwidget().servicemenuwidget("sendSavePages", self.pageInfo);
        return false;
    }

    this.removeSelectedGroup = function () {
        if (self.selectedGroup) {
            self.pageInfo.pages.splice(self.selectedGroup, 1);
            self.selectedGroup = null;
        }
    }

    this.onClickRemoveGroup = function () {
        $('#dlgDeleteMappingDetail').popup("close");
        self.removeSelectedGroup();
        return true;
    }

    this.onViewPageCreate = function () {
        // Assign buttons
        $("#mappingdetail_new_function").on("click", self.onClickNew);
        $("#mappingdetail_save").on("click", self.onClickSave);
        $("#mappingdetail_removegroup").on("click", self.onClickRemoveGroup);
    }

    this.onBeforeShow = function(event, message) {
        var html = "";
        var listview = $('#mappingdetail-listview');
        if (self.selectedGroup) {
            var groupname = self.pageInfo.pages[self.selectedGroup].PageName;
            $("#mappinggroupname").empty().append(groupname);
            // Listview aktualisieren
            
            listview.empty();
            html = self.renderList();
        }
        listview.append(html);
        listview.listview("refresh");
    }

    this.renderList = function () {
        var group = self.pageInfo.pages[self.selectedGroup];
        //var html = '<li data-role="list-divider">'+group.PageName+'</li>';
        var html = '';
        for (item in group.Items) {
            cmd = 'onclick="$(document).trigger(\'selectitem\', ' + item + ');" ';
            html += '<li><a href="#itemdetail" ' + cmd + '>';
            html += group.Items[item].customName;
            html += '</a></li>';
        }
        return html;
    }
    // on select group event:
    $(document).on('selectgroup', self.onSelectGroup);
    $("#mappingdetail").on('pagebeforeshow', this.onBeforeShow);
    $("#mappingdetail").on('pagecreate', this.onViewPageCreate);

    $(document).bind("onPageListResponse", this.onPageListResponse);
}