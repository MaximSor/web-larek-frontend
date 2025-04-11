import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrder, IOrderSuccess, ILarekAPI } from '../types';

export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;

	constructor(baseUrl: string, cdn: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	async getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	async getProduct(id: string): Promise<IProduct> {
		return (await this.get(`/product/${id}`)) as IProduct;
	}

	async createOrder(order: IOrder): Promise<IOrderSuccess> {
		return (await this.post('/order', order)) as IOrderSuccess;
	}
}
