import { Component } from './base/Component';
import { ICards } from '../types';
import { ensureElement } from '../utils/utils';

const ProductCategory: Record<string, string> = {
	'софт-скил': 'card__category_soft',
	'хард-скил': 'card__category_hard',
	кнопка: 'card__category_button',
	дополнительное: 'card__category_additional',
	другое: 'card__category_other',
};

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICards> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _category?: HTMLElement;
	protected _id?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._image = container.querySelector('.card__image') as HTMLImageElement;
		this._button = container.querySelector(
			'.card__button'
		) as HTMLButtonElement;
		this._description = container.querySelector('.card__text') as HTMLElement;
		this._category = container.querySelector('.card__category') as HTMLElement;
		this._id = container.querySelector('.basket__item-index') as HTMLElement;

		if (actions?.onClick) {
			(this._button ?? container).addEventListener('click', actions.onClick);
		}
	}

	disableButton(value: number | null) {
		if (value === null && this._button) {
			this.setDisabled(this._button, true);
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set buttonText(value: string) {
		if (this._button) this.setText(this._button, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: number | null) {
		const text = value ? `${value} синапсов` : 'Бесценно';
		this.setText(this._price, text);
		this.disableButton(value);
	}

	get price(): number {
		const match = this._price.textContent?.match(/\d+/);
		return match ? Number(match[0]) : 0;
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, ProductCategory[value], true);
	}

	get category(): string {
		return this._category?.textContent || '';
	}

	set index(value: string) {
		this.setText(this._id, value);
	}

	get index(): string {
		return this._id?.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	render(props: Partial<ICards>) {
		Object.assign(this, props);
		return this.container;
	}
}
