﻿from Core import ThingsItemBase
from Core import ItemTypes


class SampleSliderItem(ThingsItemBase):
    """description of class"""
    def __init__(self, id, initValue, description):
        itemType = ItemTypes.Slider
        self.itemId = id
        self.value = initValue
        return super(SampleSliderItem, self).__init__(id, itemType, description)

    def getItemValue(self):
        """Returns the value of the item..."""
        return self.value



