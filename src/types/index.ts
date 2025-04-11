export interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	price: number;
	image: string;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export interface IOrder {
	items: string[];
	total: number;
	email: string;
	phone: string;
	address: string;
	payment: string;
}

export interface ICards extends IProduct {
	index?: string;
	buttonTitle?: string;
}

export interface IOrderForm {
	payment: string;
	address: string;
}

export interface IModalData {
	content: HTMLElement;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderSuccess {
	id: string;
	total: number;
}

export interface IOrderResult extends IOrder {
	id: string;
	errors?: string;
}

export interface IPage {
	counter: number;
	gallery: HTMLElement[];
	locked: boolean;
}

export interface IContacts {
	email: string;
	phone: string;
}

export interface ISuccess {
	total: number;
}

export interface ILarekAPI {
	getProductList: () => Promise<IProduct[]>;
	getProduct: (id: string) => Promise<IProduct>;
	createOrder: (order: IOrder) => Promise<IOrderSuccess>;
}

export interface IAppState {
	catalog: IProduct[];
	selectedProduct: IProduct | null;
	order: IOrder | null;
	basket: string[] | null;
	preview: string | null;
	formErrors: FormErrors;

	setCatalog(): Promise<IProduct[]>;
	orderProduct(): Promise<IOrderSuccess>;

	clearBasket(): void;
	clearOrder(): void;
	validateOrder(data: FormErrors): boolean;

	selectProduct(id: string): void;
	addProduct(id: string): void;
	removeProduct(id: string): void;
}
