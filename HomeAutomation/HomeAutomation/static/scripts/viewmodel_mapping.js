﻿function Viewmodel_mapping(pageName) {
    inherits(ViewModelBase, this);
    ViewModelBase.call(this, pageName);


    onViewPageCreate = function () {
        $('#mainmenue').servicemenuwidget().servicemenuwidget("sendMappingInfoRequest");

    }

    onViewBeforeShow = function (event, message) {
        self.render_listview();
        $('#mappinglistview').listview("refresh");

    }

    onMappingInfoResponse = function (event, message, senderElement) {
        if (message.data) {
            self.mappingInfo = message.data;
        }
    }

    render_listview = function () {
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

    return this;
}