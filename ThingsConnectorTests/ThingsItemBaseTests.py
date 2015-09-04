import unittest
import sys
sys.path.append("..\ThingsConnector")
from ThingsItemBase import ThingsItemBase

class Test_ThingsItemBaseTests(unittest.TestCase):
    def test_ItemGetItemInfo(self):
        """Tests if GetItemInfo returns correct hardware info."""
        id = "testId"
        itemType = "TestType"
        description = "TestDescription"

        item = ThingsItemBase(id, itemType, description)
        actual = item.getItemInfo()
        self.assertEqual(id, actual['id'])

if __name__ == '__main__':
    unittest.main()
