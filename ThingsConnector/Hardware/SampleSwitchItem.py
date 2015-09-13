from Core import ThingsItemBase
from Core import ItemTypes


class SampleSwitchItem(ThingsItemBase):
    """SimpleSwitch Class"""
    def __init__(self, id, initValue, description):
        itemType = ItemTypes.Switch
        self.itemId = id
        self.value = int(initValue)
        return super(SampleSwitchItem, self).__init__(id, itemType, description)

