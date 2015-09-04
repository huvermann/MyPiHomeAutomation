import unittest
import sys
import json
sys.path.append("..\ThingsConnector")
from ThingsConnectorBase import ThingsConectorBase
#from .. import module # Import module from a higher directory.
from ThingsItemBase import ThingsItemBase

class FunctionMock(object):
    def __init__(self, ):
        self.mockCalled = False
        self.dummyCalled = False
        self.mockSendHandwareInfoCalled = False

        return super(FunctionMock, self).__init__()

    def mockHandleUIMessage(self, ws, message):
        self.mockCalled = True

    def mockRefresh(self):
        self.mockCalled = True
    def mockDummy(self):
        self.dummyCalled = True
        pass

    def mockSendHandwareInfo(self):
        self.mockSendHandwareInfoCalled = True


class WebsocketMock(object):
    def send(self, msg):
        self.message = msg
        pass


class Test_ThingsConnectorBaseTests(unittest.TestCase):
    def test_authHardwareSendsMessage(self):
        wsmock = WebsocketMock()

        connector = ThingsConectorBase("testid", "node", "descr", 1)
        connector.ws = wsmock
        connector.authHardware()
        self.assertTrue(wsmock.message == '{"data": {"nodeid": "testid", "key": "secretkey"}, "messagetype": "authHardware"}')

    def test_MessageTypeLogonResult_setsAuthenticated(self):
        """Checks if authenticated property is set to true"""
        mock = FunctionMock()
        message = {"messagetype" : "LogonResult", "data" : {"success": True}}
        connector = ThingsConectorBase("testid", "node", "descr", 1)
        connector.cutConnection = mock.mockDummy
        self.assertFalse(connector.authenticated)
        connector.sendNodeInfo = mock.mockSendHandwareInfo
        connector.parseJsonMessage(None, message)
        self.assertTrue(connector.authenticated)

    def test_MessageTypeLogonResult_cuts_Connection(self):
        """Checks if message LogonResult calls cut connection if authentication fails."""
        mock = FunctionMock()
        message = {"messagetype" : "LogonResult", "data" : {"success": False}}
        connector = ThingsConectorBase("testid", "node", "descr", 1)
        connector.cutConnection = mock.mockDummy
        self.assertFalse(connector.authenticated)
        connector.parseJsonMessage(None, message)
        # check if authenticated is false
        self.assertFalse(connector.authenticated)
        # check if cutConnection() was called
        self.assertTrue(mock.dummyCalled)

        

    def test_HandleLogonResultCalls_SendHardwareInfo(self):
        """Checks if handleLogonResult calls sendHardwareInfo()."""
        mock = FunctionMock()
        
        connector = ThingsConectorBase("testid", "node", "descr", 1)
        message = {"messagetype" : "LogonResult", "data" : {"success": True}}
        connector.cutConnection = mock.mockDummy
        connector.sendNodeInfo = mock.mockSendHandwareInfo
        self.assertFalse(mock.mockSendHandwareInfoCalled)
        connector.handleLogonResult(None, message)
        self.assertTrue(mock.mockSendHandwareInfoCalled)


    def test_MessageTypeUIMessage(self):
        """Checks if UI-Message calls handleUiMessage."""
        mock = FunctionMock()
        connector = ThingsConectorBase("testid", "node", "descr", 1)
        connector.cutConnection = mock.mockDummy

        message = {"messagetype" : "UI-Message", "data" : ""}
        connector.handleUIMessage = mock.mockHandleUIMessage
        self.assertFalse(mock.mockCalled)
        connector.parseJsonMessage(None, message)
        self.assertTrue(mock.mockCalled)

    def test_MessageTypeRefresh(self):
        """Checks if Refresh message calls prepareRefresh"""
        mock = FunctionMock()
        message = {"messagetype" : "Refresh", "data" : ""}
        connector = ThingsConectorBase("testid", "node", "descr", 1)
        connector.prepareRefresh = mock.mockRefresh
        connector.parseJsonMessage(None, message)
        self.assertTrue(mock.mockCalled)

    def test_sendNodeInfo(self):
        """Checks if sendNodeInfo works."""
        mock = FunctionMock()
        wsmock = WebsocketMock()

        connector = ThingsConectorBase("nodeid", "nodename", "nodedescr", 1)
        connector.ws = wsmock
        testItem = ThingsItemBase("testid", "type1", "descr")
        connector.addItem(testItem)
        connector.sendNodeInfo()
        message = json.loads(wsmock.message.encode('utf-8'))
        self.assertTrue(message["messagetype"] == 'nodeinfo')
        

    def test_sendNodeInfoSendsNodeId(self):
        mock = FunctionMock()
        wsmock = WebsocketMock()

        connector = ThingsConectorBase("nodeid", "nodename", "nodedescr", 1)
        connector.ws = wsmock
        testItem = ThingsItemBase("testid", "type1", "descr")
        connector.addItem(testItem)
        connector.sendNodeInfo()
        message = json.loads(wsmock.message.encode('utf-8'))
        data = message["data"]
        self.assertEqual(data['nodeid'], "nodeid")
        self.assertEqual(data['description'], "nodedescr")

    def test_sendNodeInfoSendsHardwareInfo(self):
        mock = FunctionMock()
        wsmock = WebsocketMock()

        connector = ThingsConectorBase("nodeid", "nodename", "nodedescr", 1)
        connector.ws = wsmock
        testItem = ThingsItemBase("testid", "type1", "descr")
        connector.addItem(testItem)
        connector.sendNodeInfo()
        message = json.loads(wsmock.message.encode('utf-8'))
        hardware = message["data"]["hardwareinfo"][0]
        self.assertEqual(hardware['id'], "testid")
        self.assertEqual(hardware['type'], "type1")
        self.assertEqual(hardware['description'], "descr")







        







        

if __name__ == '__main__':
    unittest.main()