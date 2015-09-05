import unittest
import sys
import json
sys.path.append("..\HomeAutomation")
import MessageBroker
from MessageBroker import MessageBroker as MessBro


class MessMock(object):
    def __init__(self):
        self.mockNodeInfoCalled = False;
        self.mockCalled = False
        self.param = None
        return super(MessMock, self).__init__()

    def mockNodeInfo(self, message):
        self.message = message
        self.mockNodeInfoCalled = True;

    def mockMethodWithOutParams(self):
        self.mockCalled = True

    def mockMethodWithOneParam(self, param):
        self.mockCalled = True
        self.param = param

class NodeMock(object):
    def __init__(self, clientType, hardwareInfo):
        self._hardware = hardwareInfo
        self._clientType = clientType

        return super(NodeMock, self).__init__()




class Test_MessageBrokerTests(unittest.TestCase):

    def setUp(self):
        MessageBroker.clients = []
        pass

    def tearDown(self):
        MessageBroker.clients = []
        pass

    def test_MessageBrokerNullMessage(self):
        mbroker = MessBro(None, None, "")
        message = {}
        mbroker.parseJsonMessage(None)

    def test_NodeInfoMessage(self):
        """MessageBroker handles messageType nodeinfo."""
        mock = MessMock()

        message = {"messagetype" : "nodeinfo",
                   "data" : {}}
        mbroker = MessBro(None, None, "")
        mbroker.nodeInfo = mock.mockNodeInfo
        mbroker.parseJsonMessage(message)
        self.assertTrue(mock.mockNodeInfoCalled)
        self.assertEqual(message, mock.message)

    def test_NodeInfoStoresNodeData(self):
        """Checks if node info data are stored in messageBroker instance."""

        message = {"messagetype" : "nodeinfo",
                   "data" : [{"nodeid" : "testnodeid", "description" : "testdescr"}]}
        mbroker = MessBro(None, None, "")
        mbroker.nodeInfo(message)
        self.assertEqual(message["data"], mbroker._hardware)

    def test_MessageTypeSendMappingInfoIsHandled(self):
        """Checks if message type getMappingInfo calls sendMappingInfo."""
        mock = MessMock()

        message = {"messagetype" : "getMappingInfo"}
        mbroker = MessBro(None, None, "")
        mbroker.sendMappingInfo = mock.mockMethodWithOutParams
        self.assertFalse(mock.mockCalled)
        mbroker.parseJsonMessage(message)
        self.assertTrue(mock.mockCalled)

    def test_sendMappingInfoCallsSendMessage(self):
        """Checks if sendMappingInfo calls sendMessage."""
        mock = MessMock()
        mbroker = MessBro(None, None, "")
        mbroker.sendMessage = mock.mockMethodWithOneParam
        self.assertFalse(mock.mockCalled)
        mbroker.sendMappingInfo()
        self.assertTrue(mock.mockCalled)

    def test_sendMappingInfo_CreatesMessage(self):
        """Checks if sendMappingInfo creates correct message type"""
        mock = MessMock()
        mbroker = MessBro(None, None, "")
        mbroker.sendMessage = mock.mockMethodWithOneParam
        mbroker.sendMappingInfo()
        message = json.loads(mock.param.encode('utf-8'))
        self.assertTrue(message["messagetype"] == 'MappingInfo')
        self.assertEqual(message["data"], [])

    def test_sendPappingInfo_sendsNodeInfos(self):
        """Checks if sendMappingInfo creates message containing node infos."""
        mock = MessMock()
        hardwareInfo = {"hardwareInfo" : None}
        mockHardwareClient = NodeMock("hardware", hardwareInfo)
        mockBrowserClient = NodeMock("browser", None)

        mbroker = MessBro(None, None, "")
        # setup client items
        MessageBroker.clients.append(mockHardwareClient)
        MessageBroker.clients.append(mockBrowserClient)
        mbroker.sendMessage = mock.mockMethodWithOneParam
        mbroker.sendMappingInfo()
        message = json.loads(mock.param.encode('utf-8'))
        # check if message contains node data
        self.assertTrue(message["messagetype"] == "MappingInfo")
        self.assertTrue(message["data"][0] == hardwareInfo)
        self.assertEqual(len(message["data"]), 1)
        
        

        











        


if __name__ == '__main__':
    unittest.main()