import { Form } from './common/Form';
import { ensureElement } from '../utils/utils';
import { IEvents } from '../components/base/events';
import { IOrderForm } from '../types';

interface IOrderActions {
	onClick: (event: MouseEvent) => void;
}

export class Order extends Form<IOrderForm> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;

	constructor(
		container: HTMLFormElement,
		events: IEvents,
		actions?: IOrderActions
	) {
		super(container, events);

		this._card = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			this.container
		);
		this._cash = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			this.container
		);
		this.toggleClass(this._card, 'button_alt-active');

		if (actions?.onClick) {
			this.addButtonClickHandler(actions.onClick);
		}
	}

	private addButtonClickHandler(onClick?: (event: MouseEvent) => void) {
		if (onClick) {
			this._card.addEventListener('click', onClick);
			this._cash.addEventListener('click', onClick);
		}
	}
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	toggleButtons(toggleOn: HTMLElement) {
		this.toggleClass(this._card, 'button_alt-active', toggleOn === this._card);
		this.toggleClass(this._cash, 'button_alt-active', toggleOn === this._cash);
	}
}
