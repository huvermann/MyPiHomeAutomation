from ThingsItemBase import *
import ItemTypes

class SampleSwitchItem(ThingsItemBase):
    """SimpleSwitch Class"""
    def __init__(self, id, initValue, description):
        itemType = ItemTypes.Switch
        self.itemId = id
        return super(SampleSwitchItem, self).__init__(id, itemType, description)

