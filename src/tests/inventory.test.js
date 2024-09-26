const redisPubSubService = require('../services/redisPubSub.service')


class InventoryServiceTest {
    constructor() {
        redisPubSubService.subscribe('purchase_events', (channel, message) => {
            console.log('Receive message: ', message)
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(productId, quantity) {
        console.log(`[0001]: Update Inventory ${productId} with quantity ${quantity}`)
    }
}


module.exports = new InventoryServiceTest()