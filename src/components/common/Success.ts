import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { ISuccess } from '../../types';

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement('.order-success__close', this.container);
		this._description = ensureElement(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}
	get description(): string | null {
		return this._description.textContent;
	}
	set description(value: string) {
		this.setText(this._description, `Списано ${value} синапсов`);
	}
}
