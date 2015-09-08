function inherits(parent, child) {
    function f() { }
    f.prototype = parent;
    child.prototype = new f();
}

function ViewModelBase(pageName) {

    var pageName = pageName;

    var pageElement = $(pageName);

    var self = this;

    var mappingInfo = null;

    _onViewPageCreate = function () {
        self.onViewPageCreate();
    }

    onViewPageCreate = function () {
    }

    /////
    _onMappingInfoResponse = function (event, message, senderElement) {
        self.onMappingInfoResponse(event, message, senderElement);
    }

    onMappingInfoResponse = function (event, message, senderElement) {
        if (message.data) {
            self.mappingInfo = message.data;
        }
    }

    //////////////
    _onPageListResponse = function (event, message) {
        self.onPageListResponse(event, message);
    };

    onPageListResponse = function (event, message) {
        if (message.data) {
            self.pageInfo = message.data;
        }
    }

    ///////
    _onViewBeforeShow = function (event, message){
        self.onViewBeforeShow()
    }
    onViewBeforeShow = function (event, message) {
        //console.log("test: event on element: onMappingBeforeShow");
    }

    // register events

    $(pageName).bind('pagebeforeshow', this._onViewBeforeShow);;
    $(pageName).bind('pagecreate', this._onViewPageCreate);

    // SocketEvents
    $(document).bind("onMappingInfoResponse", this._onMappingInfoResponse);
    $(document).bind("onPageListResponse", this._onPageListResponse);

    return this;
}