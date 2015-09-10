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
        if (self.selectedGroup != null) {
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
        self.refresh();
    }

    this.refresh = function() {
        var html = "";
        var listview = $('#mappingdetail-listview');
        if (self.selectedGroup != null) {
            var groupname = self.pageInfo.pages[self.selectedGroup].PageName;
            $("#mappinggroupname").empty().append(groupname);
            // Listview aktualisieren
            
            listview.empty();
            html = self.renderList();
        }
        listview.append(html);
        listview.listview("refresh");

        var functionListview = $("#popfunctionlistview");
        var html = this.renderEmptyPopupListview();
        functionListview.empty().append(html);
        functionListview.listview("refresh");
        // Request für Liste absetzen
        $('#mainmenue').servicemenuwidget().servicemenuwidget("sendMappingInfoRequest");
    }

    this.renderEmptyPopupListview = function () {
        var html = "";
        html += '<li data-role="list-divider">...lade funktionsliste</li>';
        return html;
    }

    this.renderNodeInfoPopupList = function (data) {
        var html = "";
        html += '<li data-role="list-divider">Welche Komponenten sollen in dieser Gruppe angezeigt werden?</li>';
        for (node in data) {
            html += '<li data-role="list-divider" data-theme="a">' + data[node].description + '</li>';
            for (hardware in data[node].hardwareinfo) {
                html += '<li><a href="#">';
                html += data[node].hardwareinfo[hardware].description;
                html += '</a></li>';
            }
        }
        
        return html;
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

    this.onMappingInfoResponse = function (event, message, senderElement) {
        console.log(message);
        if (message.data) {
            var functionListview = $("#popfunctionlistview");
            var html = self.renderNodeInfoPopupList(message.data);
            functionListview.empty().append(html);
            functionListview.listview("refresh");
        }
    }
    // on select group event:
    $(document).on('selectgroup', self.onSelectGroup);
    $("#mappingdetail").on('pagebeforeshow', this.onBeforeShow);
    $("#mappingdetail").on('pagecreate', this.onViewPageCreate);
    $(document).bind("onPageListResponse", this.onPageListResponse);
    $(document).bind("onMappingInfoResponse", this.onMappingInfoResponse);
}