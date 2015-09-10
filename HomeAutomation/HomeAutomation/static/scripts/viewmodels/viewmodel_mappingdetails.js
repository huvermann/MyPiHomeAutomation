function Viewmodel_mappingdetails(pageName) {
    //inherits(ViewModelBase, this);
    //ViewModelBase.call(this, pageName);

    var selectedGroup = null;
    var pageName = pageName;
    var nodeData = null;
    var self = this;

    this.onSelectGroup = function(event, message) {
        self.selectedGroup = message;
    }

    this.onSelectHardwareFunction = function (event, hwindex) {
        console.log("onSelectHardwareFunction");
        if (nodeData != null) {
            self.addNodeFunction(nodeData[hwindex.node].hardwareinfo[hwindex.hardwareinfo]);
        }
    }

    this.addNodeFunction = function (nodeFunction) {
        var itemGroup = self.pageInfo.pages[self.selectedGroup].Items;
        //group.Items.push(nodeFunction);
        //self.refresh(group);
        console.log("Expected item:");
        console.log(itemGroup);
        console.log("Actual item:");
        console.log(nodeFunction);

        // Convert nodeFunction to group item
        if (!this.itemsGroupContains(itemGroup, nodeFunction.id)) {
            var newItem = {
                "id": nodeFunction.id,
                "customName": nodeFunction.description,
                "type": nodeFunction.type,
                "host": "hostname",
                "name": nodeFunction.description,
                "value": null

            }
            // item einfügen
            itemGroup.push(newItem);
            self.refresh(self.pageInfo.pages[self.selectedGroup]);
        } else {
            // Item existiert schon, also entfernen
            for (i in itemGroup) {
                if (itemGroup[i].id == nodeFunction.id) {
                    itemGroup.splice(i, 1);

                }
                self.refresh(self.pageInfo.pages[self.selectedGroup]);
            }
        }

    }

    this.itemsGroupContains = function (itemGroup, id) {
        var result = false;
        for (i in itemGroup) {
            if (itemGroup[i].id == id) {
                result = true;
            }
        }
        return result;
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
        self.refresh(self.pageInfo.pages[self.selectedGroup]);
    }

    this.refresh = function(group) {
        var html = "";
        var listview = $('#mappingdetail-listview');
        if (group) {
            //var groupname = self.pageInfo.pages[self.selectedGroup].PageName;
            $("#mappinggroupname").empty().append(group.PageName);
            // Listview aktualisieren
            
            listview.empty();
            html = self.renderList(group);
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

    // Returns html output to create a listview of hardware node descriptions
    // for the hardware functionlist popup.
    this.renderNodeInfoPopupList = function (data) {
        console.log("renderNodeInfoPopupList");
        var html = "";
        if (data.length > 0) {
            html += '<li data-role="list-divider">Welche Komponenten sollen in dieser Gruppe angezeigt werden?</li>';
            for (node in data) {
                html += '<li data-role="list-divider" data-theme="a">' + data[node].description + '</li>';
                for (hardware in data[node].hardwareinfo) {
                    var cmd = 'onclick="$(document).trigger(\'selecthardwarefunction\', {\'node\':' + node + ', \'hardwareinfo\':' + hardware + '});" ';
                    var line = '<li><a href="#" ' + cmd + '>';
                    html += line;
                    console.log(line);
                    html += data[node].hardwareinfo[hardware].description;
                    html += '</a></li>';
                }
            }
        } else {
            html += '<li data-role="list-divider">Konnten keine Komponenten gefunden werden!</li>';
        }
        
        return html;
    }


    this.renderList = function (group) {
        //var group = self.pageInfo.pages[self.selectedGroup];
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
            nodeData = message.data;
            var functionListview = $("#popfunctionlistview");
            var html = self.renderNodeInfoPopupList(message.data);
            functionListview.empty().append(html);
            functionListview.listview("refresh");
        } else {
            nodeData = null;
        }
    }
    // on select group event:
    $(document).on('selectgroup', self.onSelectGroup);
    $(document).on('selecthardwarefunction', self.onSelectHardwareFunction);
    $("#mappingdetail").on('pagebeforeshow', this.onBeforeShow);
    $("#mappingdetail").on('pagecreate', this.onViewPageCreate);
    $(document).bind("onPageListResponse", this.onPageListResponse);
    $(document).bind("onMappingInfoResponse", this.onMappingInfoResponse);
}