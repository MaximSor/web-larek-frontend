import './scss/styles.scss';
import { LarekAPI } from './components/LarekApi';
import { API_URL, CDN_URL, EventsSelectors } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, CatalogChangeEvent, Product } from './components/AppData';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { IOrder, IOrderForm, IContacts } from './types';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/common/Success';

const paymentVariants: Record<string, string> = {
	card: 'online',
	cash: 'cash',
};

const events = new EventEmitter();
const api = new LarekAPI(API_URL, CDN_URL);

function attachDebugLogger() {
	events.onAll(({ eventName, data }) => {
		console.log(`[DEBUG: ${eventName}]`, data);
	});
}
attachDebugLogger();

const templates = {
	catalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
	preview: ensureElement<HTMLTemplateElement>('#card-preview'),
	basket: ensureElement<HTMLTemplateElement>('#card-basket'),
	success: ensureElement<HTMLTemplateElement>('#success'),
	basketRoot: ensureElement<HTMLTemplateElement>('#basket'),
	orderForm: ensureElement<HTMLTemplateElement>('#order'),
	contacts: ensureElement<HTMLTemplateElement>('#contacts'),
};

const model = new AppState({}, events);
const rootPage = new Page(document.body, events);
const popup = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const successMsg = new Success(cloneTemplate(templates.success), {
	onClick: () => popup.close(),
});
const shoppingCart = new Basket(cloneTemplate(templates.basketRoot), events);
const orderForm = new Order(cloneTemplate(templates.orderForm), events, {
	onClick: (e: Event) => events.emit(EventsSelectors.paymentToggle, e.target),
});
const contactsForm = new Contacts(cloneTemplate(templates.contacts), events);

function trySubmitOrder() {
	if (model.basket.length > 0) {
		api
			.createOrder(model.order)
			.then((res) => {
				model.clearBasket();
				model.clearOrder();
				successMsg.description = res.total.toString();
				popup.render({ content: successMsg.render({}) });
			})
			.catch((err) => {
				console.error('Ошибка заказа:', err);
				events.emit('order:error', { message: err.message });
			});
	}
}

function updatePreview(item: Product) {
	const productCard = new Card(cloneTemplate(templates.preview), {
		onClick: () => {
			events.emit(EventsSelectors.productToggle, item);
			productCard.buttonText = model.basket.includes(item)
				? 'Удалить из корзины'
				: 'Купить';
		},
	});

	const inCart = model.basket.includes(item);
	productCard.buttonText = inCart ? 'Удалить из корзины' : 'Купить';

	popup.render({
		content: productCard.render({
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			category: item.category,
			buttonTitle: productCard.buttonText,
		}),
	});
}

// Обработчики глобальных событий
function attachEventListeners() {
	events.on<CatalogChangeEvent>('items:changed', () => {
		rootPage.gallery = model.catalog.map((product) => {
			const cardComponent = new Card(cloneTemplate(templates.catalog), {
				onClick: () => events.emit(EventsSelectors.cardSelect, product),
			});
			return cardComponent.render({
				title: product.title,
				image: product.image,
				price: product.price,
				category: product.category,
			});
		});
	});

	events.on(EventsSelectors.orderSubmit, () => {
		popup.render({
			content: contactsForm.render({
				email: '',
				phone: '',
				valid: false,
				errors: [],
			}),
		});
	});

	events.on(EventsSelectors.formErrorsChange, (errs: Partial<IOrder>) => {
		const hasItems = model.basket.length > 0;
		orderForm.valid = hasItems && !errs.payment && !errs.address;
		contactsForm.valid = !errs.email && !errs.phone;
		orderForm.errors = Object.values({
			payment: errs.payment,
			address: errs.address,
		})
			.filter(Boolean)
			.join('; ');
		contactsForm.errors = Object.values({
			email: errs.email,
			phone: errs.phone,
		})
			.filter(Boolean)
			.join('; ');
	});

	events.on(
		/^order\..*:change/,
		({ field, value }: { field: keyof IOrderForm; value: string }) => {
			model.setOrderField(field, value);
		}
	);

	events.on(
		/^contacts\..*:change/,
		({ field, value }: { field: keyof IContacts; value: string }) => {
			model.setContactField(field, value);
		}
	);

	events.on(EventsSelectors.cardSelect, (item: Product) =>
		model.selectProduct(item)
	);
	events.on(EventsSelectors.previewChanged, updatePreview);
	events.on(EventsSelectors.modalOpen, () => (rootPage.locked = true));
	events.on(EventsSelectors.modalClose, () => (rootPage.locked = false));

	events.on(EventsSelectors.productAdd, (item: Product) =>
		model.addProduct(item)
	);
	events.on(EventsSelectors.productDelete, (item: Product) =>
		model.removeProduct(item)
	);

	events.on(EventsSelectors.productToggle, (item: Product) => {
		if (model.basket.includes(item)) {
			events.emit(EventsSelectors.productDelete, item);
		} else {
			events.emit(EventsSelectors.productAdd, item);
		}
	});

	events.on(EventsSelectors.basketChanged, (products: Product[]) => {
		shoppingCart.items = products.map((product, idx) => {
			const card = new Card(cloneTemplate(templates.basket), {
				onClick: () => events.emit(EventsSelectors.productDelete, product),
			});
			return card.render({
				index: `${idx + 1}`,
				title: product.title,
				price: product.price,
			});
		});

		const totalPrice = products.reduce((acc, item) => acc + item.price, 0);
		shoppingCart.total = totalPrice;
		model.order.total = totalPrice;
		shoppingCart.toggleButton(totalPrice === 0);
	});

	events.on(EventsSelectors.counterChanged, () => {
		rootPage.counter = model.basket.length;
	});

	events.on(EventsSelectors.basketOpen, () => {
		popup.render({ content: shoppingCart.render({}) });
	});

	events.on(EventsSelectors.orderOpen, () => {
		if (!model.basket.length) return;
		popup.render({
			content: orderForm.render({
				payment: '',
				address: '',
				valid: false,
				errors: [],
			}),
		});
		model.order.items = model.basket.map((i) => i.id);
	});

	events.on(EventsSelectors.paymentToggle, (target: HTMLElement) => {
		if (!target.classList.contains('button_alt-active')) {
			orderForm.toggleButtons(target);
			const method = target.getAttribute('name');
			if (method && paymentVariants[method]) {
				model.order.payment = paymentVariants[method];
			}
		}
	});

	events.on(EventsSelectors.orderReady, () => (orderForm.valid = true));
	events.on(EventsSelectors.contactReady, () => (contactsForm.valid = true));
	events.on(EventsSelectors.contactsSubmit, trySubmitOrder);
}
attachEventListeners();

function init() {
	api
		.getProductList()
		.then((productList) => model.setCatalog(productList))
		.catch(console.error);
}

init();
