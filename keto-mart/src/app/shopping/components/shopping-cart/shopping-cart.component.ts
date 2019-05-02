import { Component, OnInit } from "@angular/core";
import { ShoppingCartService } from "shared/services/shopping-cart.service";

@Component({
  selector: "app-shopping-cart",
  templateUrl: "./shopping-cart.component.html",
  styleUrls: ["./shopping-cart.component.css"]
})
export class ShoppingCartComponent implements OnInit {
  cart$;
  discount: number = 1;
  promo: string = "";
  discountCode: string[] = ["NYC2019", "DISCOUNT10NYC"];
  isPromoCodeButtonSelected: boolean = false;
  isCouponCodeApplied: boolean = false;
  message: string = "";
  error: boolean = false;

  constructor(private shoppingCartService: ShoppingCartService) {}

  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart();
    console.log("cart observable", this.cart$);
    this.cart$.subscribe(cart => {
      this.isCouponCodeApplied = cart.discount.isCouponApplied;
      console.log("isCouponCodeApplied", this.isCouponCodeApplied);
      console.log("cart", cart);
    });
  }
  clearCart() {
    this.shoppingCartService.clearCart();
  }
  togglePromoCode(): void {
    this.isPromoCodeButtonSelected = !this.isPromoCodeButtonSelected;
  }
  submitCoupon(): void {
    if (this.discountCode.includes(this.promo)) {
      this.discount = 0.9;
      console.log("discount is applied");
      this.isCouponCodeApplied = true;
      this.shoppingCartService.UpdateDiscount(
        this.isCouponCodeApplied,
        this.discount
      );
      this.message = `Coupon code ${this.promo} has been applied`;
    } else {
      this.shoppingCartService.UpdateDiscount(
        this.isCouponCodeApplied,
        this.discount
      );
      console.log("promo code is invalid");
      this.error = true;
      this.message = `Coupon code ${this.promo} is invalid`;
    }
    this.togglePromoCode();
  }
}
