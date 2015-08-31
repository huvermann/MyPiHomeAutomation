from ThingsItemBase import *
import ItemTypes

class SampleSliderItem(ThingsItemBase):
    """description of class"""
    def __init__(self, id, initValue, description):
        itemType = ItemTypes.Slider
        self.itemId = id
        return super(SampleSliderItem, self).__init__(id, itemType, description)



