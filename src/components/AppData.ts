import {
	FormErrors,
	IAppState,
	IOrder,
	IOrderForm,
	IContacts,
	IProduct,
} from '../types';
import { EventsSelectors } from '../utils/constants';
import { Model } from './base/Model';

export type CatalogChangeEvent = {
	catalog: Product[];
};

export class Product extends Model<IProduct> {
	id: string;
	title: string;
	category: string;
	image: string;
	price: number;
	description: string;
}

export class Order extends Model<IOrder> {
	items: string[];
	total: number;
	address: string;
	payment: string;
	email: string;
	phone: string;
}

export class AppState extends Model<IAppState> {
	catalog: IProduct[];
	selectedProduct: IProduct | null;
	order: IOrder = {
		items: [],
		total: 0,
		address: '',
		payment: 'online',
		email: '',
		phone: '',
	};
	basket: IProduct[] | null = [];
	preview: string | null;
	formErrors: FormErrors = {};

	selectProduct(item: IProduct): void {
		this.preview = item.id;
		this.emitChanges(EventsSelectors.previewChanged, item);
	}
	addProduct(item: IProduct): void {
		if (this.basket?.includes(item)) return;
		this.basket?.push(item);
		this.refreshBasket();
	}
	removeProduct(item: IProduct): void {
		if (this.basket?.includes(item)) {
			const index = this.basket.indexOf(item);
			this.basket.splice(index, 1);
		}
		this.refreshBasket();
	}

	refreshBasket(): void {
		this.emitChanges(EventsSelectors.counterChanged, this.basket);
		this.emitChanges(EventsSelectors.basketChanged, this.basket);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		if (this.validateOrder()) {
			this.events.emit(EventsSelectors.orderReady, this.order);
		}
	}

	setContactField(field: keyof IContacts, value: string) {
		this.order[field] = value;
		if (this.validateContact()) {
			this.events.emit(EventsSelectors.contactReady, this.order);
		}
	}

	clearBasket(): void {
		this.basket = [];
		this.refreshBasket();
	}

	clearOrder(): void {
		this.order = {
			items: [],
			total: 0,
			address: '',
			payment: 'online',
			email: '',
			phone: '',
		};
	}

	validateContact() {
		const validPhone = /[+78][0-9]{10,11}/;
		const validEmail =
			/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;

		const errors: typeof this.formErrors = {};
		if (!this.order.email || !validEmail.test(this.order.email)) {
			errors.email = 'укажите корректный email';
		}

		if (!this.order.phone || !validPhone.test(this.order.phone)) {
			errors.phone = 'введите корректный номер';
		}
		this.formErrors = errors;
		this.events.emit(EventsSelectors.formErrorsChange, this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}
		this.formErrors = errors;
		this.events.emit(EventsSelectors.formErrorsChange, this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setCatalog(items: IProduct[]) {
		this.catalog = [...items];
		this.emitChanges('items:changed', { catalog: this.catalog });
	}
}
