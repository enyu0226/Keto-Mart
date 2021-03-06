import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import {
  AngularFireDatabase,
  FirebaseObjectObservable
} from "angularfire2/database";
import { Product } from "shared/models/product";
import "rxjs/add/operator/take";
import "rxjs/add/operator/map";

import { ShoppingCart } from "shared/models/shopping-cart";

@Injectable()
export class ShoppingCartService {
  constructor(private db: AngularFireDatabase) {}

  async getCart(): Promise<Observable<ShoppingCart>> {
    var discount;
    let cartId = await this.getOrCreateCartId();
    this.db
      .object("/shopping-carts/discount/")
      // .object("/shopping-carts/discount/" + cartId) **
      .subscribe(discountObj => (discount = discountObj));
    return this.db
      .object("/shopping-carts/" + cartId)
      .map(x => new ShoppingCart(x.items, discount));
  }

  async addToCart(product: Product) {
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }

  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object("/shopping-carts/" + cartId + "/items").remove();
  }

  async UpdateDiscount(
    isCouponCodeApplied: boolean = false,
    discountRate: number = 1
  ) {
    return this.db.object("/shopping-carts/discount").update({
      isCouponApplied: isCouponCodeApplied,
      discountRate: discountRate
    });
  }

  private create() {
    return this.db.list("/shopping-carts").push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object("/shopping-carts/" + cartId + "/items/" + productId);
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem("cartId");

    if (cartId) return cartId;

    let result = await this.create();
    localStorage.setItem("cartId", result.key);
    return result.key;
  }

  private async updateItem(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId();
    let items$ = this.getItem(cartId, product.$key);
    items$.take(1).subscribe(item => {
      let quantity = (item.quantity || 0) + change;
      if (quantity === 0) items$.remove();
      else
        items$.update({
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: quantity
        });
    });
  }
}
