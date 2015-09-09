function Viewmodel_mapping(pageName) {
    inherits(ViewModelBase, this);
    ViewModelBase.call(this, pageName);


    this.onMappingClickNew = function () {
        var groupname = $("#newgroupname").val();
        console.log("groupname: " + groupname);
        
        if (groupname.length > 0) {
            var newGroup = {
                "ID": groupname,
                "Items": [],
                "PageName": groupname

            };
            $("#newgroupname").val('');
            self.pageInfo.pages.push(newGroup);
            self.mappingRefresh();
        }
        
        $("#dlgaddgroup").popup("close");
        return false;
    }

    this.onMappingClickSave = function () {
        $('#dlgsave').popup("close");
        // send save message
        $('#mainmenue').servicemenuwidget().servicemenuwidget("sendSavePages", self.pageInfo);
        return false;
    }

    this.onViewPageCreate = function () {
        $('#mainmenue').servicemenuwidget().servicemenuwidget("sendMappingInfoRequest");
        // Assign buttons
        $("#mapping_newroom").on("click", self.onMappingClickNew);
        $("#mapping_save").on("click", self.onMappingClickSave);
    }

    this.mappingRefresh = function(){
        self.render_listview();
        $('#mappinglistview').listview("refresh");
    }

    this.onViewBeforeShow = function (event, message) {
        self.mappingRefresh();
    }

    this.onMappingInfoResponse = function (event, message, senderElement) {
        if (message.data) {
            self.mappingInfo = message.data;
        }
    }

    this.render_listview = function () {
        var listview = $('#mappinglistview');
        var html = '<li data-role="list-divider">Gruppen</li>';

        var groups = self.pageInfo.pages;
        for (group in groups) {
            cmd = 'onclick="$(document).trigger(\'selectgroup\', ' + group + ');" ';
            html += '<li><a href="#mappingdetail" ' + cmd + '>' + groups[group].PageName + '</a></li>';
        }

        listview.empty();
        listview.append(html);
        listview.listview().listview('refresh');
    }

    $("#mapping").on('pagecreate', this.onViewPageCreate);

    return this;
}