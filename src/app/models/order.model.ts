import { CartItem } from './cart-item.model';
import { Customer } from './customer.model';

export class Order {
  constructor(
    public customer: Customer | null = null,
    public items: CartItem[] | null = null,
    public total: number | null = null,
    public status: string = '',
    public number: string = '',
    public date: string = new Date().toISOString().split('T')[0],
    public shippingMethod: string = '',
    public paymentMethod: string = ''
  ) { }
}
