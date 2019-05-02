import { ShoppingCartItem } from "./shopping-cart-item";
import { Product } from "./product";

export class ShoppingCart {
  items: ShoppingCartItem[] = [];
  discountRate: number = 1;

  constructor(
    private itemsMap: { [productId: string]: ShoppingCartItem },
    public discount: any = { discountRate: 1, isCouponApplied: false }
  ) {
    this.itemsMap = itemsMap || {};
    for (let productId in itemsMap) {
      let item = itemsMap[productId];
      this.items.push(new ShoppingCartItem({ ...item, $key: productId }));
    }
    this.discount = discount || { discountRate: 1, isCouponApplied: false };
    // console.log(this.totalDiscount());
    //should possess value in shopping summary page
  }

  getQuantity(product: Product) {
    let item = this.itemsMap[product.$key];
    return item ? item.quantity : 0;
  }

  totalPrice() {
    let sum = 0;
    for (let productId in this.items) sum += this.items[productId].totalPrice;
    return sum;
  }

  get totalItemsCount() {
    let count = 0;
    for (let productId in this.itemsMap)
      count += this.itemsMap[productId].quantity;
    return count;
  }

  private discountRateAdjustment() {
    if (this.discount.isCouponApplied) {
      this.discountRate = this.discount.discountRate;
    }
  }

  get totalDiscount(): number {
    this.discountRateAdjustment();
    let totalPrice = this.totalPrice();
    let discount: number = Number(this.discountRate);
    return totalPrice * (1 - discount);
  }

  get totalPriceAferDiscount(): number {
    this.discountRateAdjustment();
    let totalPrice = this.totalPrice();
    let discount: number = Number(this.discountRate);
    return totalPrice * discount;
  }
}
