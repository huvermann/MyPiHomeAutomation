function Viewmodel_mapping(pageName) {
    inherits(ViewModelBase, this);
    ViewModelBase.call(this, pageName);


    this.onMappingClickNew = function () {
        //alert("click new");
        $("#dlgaddgroup").popup("close");
        console.log('$("#dlgaddgroup").popup("close");');
        return false;
    }

    this.onMappingClickSave = function () {
        //alert("save");
        console.log('$("#dlgsave").popup("close");');
        $('#dlgsave').popup("close");
        return false;
    }

    this.onViewPageCreate = function () {
        $('#mainmenue').servicemenuwidget().servicemenuwidget("sendMappingInfoRequest");
        // Assign buttons
        console.log("assign buttons.")
        $("#mapping_newroom").on("click", self.onMappingClickNew);
        $("#mapping_save").on("click", self.onMappingClickSave);


    }

    this.onViewBeforeShow = function (event, message) {
        self.render_listview();
        $('#mappinglistview').listview("refresh");

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