import { Form } from './common/Form';
import { IEvents } from '../components/base/events';
import { IContacts } from '../types';

export class Contacts extends Form<IContacts> {
	private _inputPhone: HTMLInputElement;
	private _inputEmail: HTMLInputElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._inputPhone = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
		this._inputEmail = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;
	}

	get phone(): string {
		return this._inputPhone.value;
	}

	set phone(value: string) {
		this._inputPhone.value = value;
	}

	get email(): string {
		return this._inputEmail.value;
	}

	set email(value: string) {
		this._inputEmail.value = value;
	}
}
