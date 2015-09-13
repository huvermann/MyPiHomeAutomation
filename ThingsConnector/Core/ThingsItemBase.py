class ThingsItemBase(object):
    """description of class"""
    def __init__(self, id, itemType, description):
        self.itemId = id
        self.itemType = itemType
        self.description = description
        self.hasChangedCallback = None
        self.lastError = None
        self.lastValue = None

    
    def getItemValue(self):
        """Returns the value of the item..."""
        return self.value
    
    def getItemType(self):
        return self.itemType

    def getLastError(self):
        return self.lastError;

    def refresh(self):
        """
        Is called when consumer requires an update.
        it sets the lastValue to None.
        """
        print "==== ThingsItemBase,Refresh!!"
        self.lastValue = None
        return self

    def checkItemHasChanged(self):
        """Returns a tuple: (bool: ItemHasChanged, var Value).""" 
        val = self.getItemValue()
        changed = (val != self.lastValue)
        self.lastValue = val
        return (changed, val)


    def setItemValue(self, value):
        """Set the value of the item."""
        if (self.value != value):
            self.value = value
            if (self.hasChangedCallback != None):
                self.hasChangedCallback(self)
    def getId(self):
        return self.itemId

    def getItemInfo(self):
        """Returns the item hardware info."""
        result = {"id" : self.itemId,
                  "type" : self.itemType,
                  "description" : self.description
                  }
        return result




        



