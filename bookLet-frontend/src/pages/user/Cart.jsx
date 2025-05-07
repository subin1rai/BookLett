import React, { useContext } from "react";
import CartCard from "../../components/user/cart/CartCard";
import CartSummary from "../../components/user/cart/CartSummary";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/basic components/Loading";

const Cart = () => {
  const { cart } = useContext(AppContext) || { cart: [] };

  const mergedCart = Object.values(
    cart.reduce((acc, item) => {
      if (!acc[item.bookId]) {
        acc[item.bookId] = { ...item, quantity: item.quantity || 1 };
      } else {
        acc[item.bookId].quantity += item.quantity || 1;
      }
      return acc;
    }, {})
  );

  return cart ? (
    <div className="bg-web-background px-24">
      <h1 className="text-4xl mb-4 pl-20 font-bold">Cart</h1>
      <div className="flex flex-row justify-between px-28">
        <div className="flex flex-col gap-2">
          {mergedCart.map((carts) => (
            <CartCard key={carts.bookId} carts={carts} />
          ))}
        </div>
        <CartSummary mergedCart={mergedCart} />
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Cart;
