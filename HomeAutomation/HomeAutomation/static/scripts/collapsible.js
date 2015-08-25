// globals
var container = null;

function bootstrap() {
    this.jqm = $;
    this.console = console;
    this.messageManager = new MessageManagerII(this);

}

///
/// Hanlde UpdateItems
function onUpdateItems(message) {
    
}

///
/// Handle on PageList message received.
///
function onPageList(message) {
    if (message.data) {
        var targetElement = $('#CollapsibleContent');
        pagesToCollapsible(message.data.pages, targetElement);
        refreshJQueryComponents($);
    }

}

function onChatMessage(message) {
    if (message.data) {
        var textmessage = message.data.chatMessage;
        if (textmessage) {
            $('#chatoutput').val($('#chatoutput').val()+textmessage);
        }
    }
}

function sendChatText() {
    var text = $('#chatinput').val();
    alert(text);
}

function clearChatText() {
    alert("clearChatText");
}
///
/// Register the messages on message manager.
///
function registerMessages(messageManager) {
    messageManager.registerMessage("PageList", onPageList);
    messageManager.registerMessage("UpdateItems", onUpdateItems);
    messageManager.registerMessage("Chat", onChatMessage)
}



///
/// Initialize everything
///
function initCollapsiblePage() {
    container = new Injector(bootstrap);
    registerMessages(container.messageManager);
    url = 'ws://' + location.hostname + ':8000/';
    //container.messageManager.open(url);
}