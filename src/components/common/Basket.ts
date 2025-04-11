import { Component } from '../base/Component';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { EventsSelectors } from '../../utils/constants';
import { IBasketView } from '../../types';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price') as HTMLElement;
		this._button = this.container.querySelector(
			'.basket__button'
		) as HTMLButtonElement;

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit(EventsSelectors.orderOpen);
			});
		}

		this.items = [];
		this.setDisabled(this._button, true);
	}

	toggleButton(isDisabled: boolean) {
		if (this._button) {
			this.setDisabled(this._button, isDisabled);
		}
	}

	set items(items: HTMLElement[]) {
		const content = items.length
			? [...items]
			: [
					createElement<HTMLParagraphElement>('p', {
						textContent: 'Корзина пуста',
					}),
			  ];

		this._list.replaceChildren(...content);
	}

	set total(total: number) {
		this.setText(this._total, `${total.toString()} синапсов`);
	}
}
