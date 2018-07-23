/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {com.lyft.payment.Redemption} tx
 * @transaction
 */
async function exchange(tx) {
    oldValue_from = tx.from.value
    tx.from.value -= tx.transafer_value;
    oldValue_to = tx.to.value
    tx.to.value += tx.transafer_value;
    

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('com.lyft.payment.PointAccount');
    console.log(assetRegistry);

    // Update the asset in the asset registry.
    await assetRegistry.update(tx.from);
    console.log(assetRegistry);
    
    await assetRegistry.update(tx.to);
    // Emit an event for the modified asset.
    let event = getFactory().newEvent('com.lyft.payment', 'RedeemEvent');
    event.account = tx.from;
    event.oldValue = oldValue_from;
    event.newValue = tx.from.value;
    emit(event);
    // Emit an event for the modified asset.
    event = getFactory().newEvent('com.lyft.payment', 'RedeemEvent');
    event.account = tx.to;
    event.oldValue = oldValue_to;
    event.newValue = tx.to.value;
    emit(event);
}
