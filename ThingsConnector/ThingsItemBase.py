class ThingsItemBase(object):
    """description of class"""
    def __init__(self, id, itemType, description):
        self.itemId = id
        self.itemType = itemType
        self.description = description
        self.hasChangedCallback = None
        self.lastError = None

    
    def getItemValue(self):
        """Returns the value of the item..."""
        return self.value
    
    def getItemType(self):
        return self.itemType

    def getLastError(self):
        return self.lastError;

    def checkItemHasChanged(self):
        """Returns a tuple: (bool: ItemHasChanged, var Value).""" 
        return (True, self.getItemValue())


    def setItemValue(self, value):
        """Set the value of the item."""
        if (self.value != value):
            self.value = value
            if (self.hasChangedCallback != None):
                self.hasChangedCallback(self)
    def getId(self):
        return self.itemId




        



