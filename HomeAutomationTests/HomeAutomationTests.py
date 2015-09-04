import unittest
import sys
sys.path.append("..\HomeAutomation")
from MessageBroker import MessageBroker

class MessMock(object):
    def __init__(self):
        self.mockNodeInfoCalled = False;
        return super(MessMock, self).__init__()

    def mockNodeInfo(self, message):
        self.message = message
        self.mockNodeInfoCalled = True;


class Test_MessageBrokerTests(unittest.TestCase):
    def test_MessageBrokerTest(self):
        self.fail("Not implemented")

    def test_MessageBrokerNullMessage(self):
        mbroker = MessageBroker(None, None, "")
        message = {}
        mbroker.parseJsonMessage(None)

    def test_NodeInfoMessage(self):
        """MessageBroker handles messageType nodeinfo."""
        mock = MessMock()

        message = {"messagetype" : "nodeinfo",
                   "data" : {}}
        mbroker = MessageBroker(None, None, "")
        mbroker.nodeInfo = mock.mockNodeInfo
        mbroker.parseJsonMessage(message)
        self.assertTrue(mock.mockNodeInfoCalled)
        self.assertEqual(message, mock.message)

    def test_NodeInfoStoresNodeData(self):
        """Checks if node info data are stored in messageBroker instance."""

        message = {"messagetype" : "nodeinfo",
                   "data" : [{"nodeid" : "testnodeid", "description" : "testdescr"}]}
        mbroker = MessageBroker(None, None, "")
        mbroker.nodeInfo(message)
        self.assertEqual(message["data"], mbroker._hardware)




        


if __name__ == '__main__':
    unittest.main()