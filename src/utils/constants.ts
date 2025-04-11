export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};

export enum EventsSelectors {
    orderSubmit = 'order:submit',
    formErrorsChange = 'formErrors:change',
    cardSelect = 'card:select',
    previewChanged = 'preview:changed',
    modalOpen = 'modal:open',
    modalClose = 'modal:close',
    productAdd = 'product:add',
    productDelete = 'product:delete',
    productToggle = 'product:toggle',
    counterChanged = 'counter:changed',
    basketOpen = 'basket:open',
    basketChanged = 'basket:changed',
    orderOpen = 'order:open',
    orderReady = 'order:ready',
    paymentToggle = 'payment:toggle',
    contactReady = 'contact:ready',
    contactsSubmit = 'contacts:submit',
}