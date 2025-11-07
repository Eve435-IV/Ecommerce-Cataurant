"use client";

import React, { useState } from "react";
import styles from "./navbar.module.css";
import { Badge, IconButton, Typography, Box } from "@mui/material";
import Link from "next/link";
import { RiShoppingCart2Line } from "react-icons/ri";
import { FaSignInAlt, FaUserCircle } from "react-icons/fa";
import { useCart, CartItem } from "../../../context/cartContext";
import { useAuthStore } from "../../../hooks/AuthStore";

import Info from "./public/information.png";
import Menu1 from "./public/menu.png";
import OrderOnline from "./public/online-order.png";
import Booking from "./public/calendar.png";
import History from "./public/history.png";

export default function Navbar() {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { user } = useAuthStore();
  const isLoggedIn = !!user;
  const [cartOpen, setCartOpen] = useState(false);

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const increaseQty = (item: CartItem) => addToCart({ ...item, quantity: 1 });
  const decreaseQty = (item: CartItem) => {
    if (item.quantity === 1) return;
    addToCart({ ...item, quantity: -1 });
  };

  const getFlavourColor = (flavour: string) => {
    const lower = flavour.toLowerCase();
    if (lower.includes("spicy")) return styles.flavourSpicy;
    if (lower.includes("sweet")) return styles.flavourSweet;
    if (lower.includes("salty")) return styles.flavourSalty;
    return "";
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftcontainer}>
        <Link href="/" className={styles.mainlogo}>
          Cātaurant
        </Link>
      </div>

      <div className={styles.midcontainer}>
        <Link href="/components/about" className={styles.link}>
          <img src={Info.src} alt="About Us" className={styles.icon} />
          About Us
        </Link>
        <Link href="/components/Cuisines" className={styles.link}>
          <img src={Menu1.src} alt="Menu" className={styles.icon} />
          Menu
        </Link>
        <Link href="/components/orderonline" className={styles.link}>
          <img
            src={OrderOnline.src}
            alt="Order Online"
            className={styles.icon}
          />
          Order Online
        </Link>
        <Link href="/components/booktable" className={styles.link}>
          <img src={Booking.src} alt="Book a Table" className={styles.icon} />
          Book a Table
        </Link>
        <Link href="/pages/myorders" className={styles.link}>
          <img src={History.src} alt="Book a Table" className={styles.icon} />
          My Orders
        </Link>
      </div>

      <div className={styles.rightcontainer}>
        {isLoggedIn && (
          <>
            <IconButton
              onClick={() => setCartOpen(!cartOpen)}
              style={{ position: "relative", color: "red" }}
            >
              <RiShoppingCart2Line size={34} />
              <Badge
                badgeContent={cartItems.length}
                color="error"
                style={{ position: "absolute", top: 0, right: 0 }}
              />
            </IconButton>
            {cartOpen && (
              <Box
                sx={{
                  position: "absolute",
                  right: 10,
                  top: "110px",
                  width: 282,
                  maxHeight: "87vh",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "white",
                  borderRadius: 2,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                  zIndex: 0,
                  overflow: "hidden",
                }}
              >
                {cartItems.length === 0 ? (
                  <Box sx={{ p: 3 }}>
                    <Typography textAlign="center" color="textSecondary">
                      Your cart is empty
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ flex: 1, overflowY: "auto", p: 2, pr: 1 }}>
                      {cartItems.map((item: CartItem, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mb: 2,
                            borderBottom: "1px solid #eee",
                            pb: 1,
                          }}
                        >
                          <div className={styles.cartWrapper}>
                            <div className={styles.cartName}>{item.name}</div>
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                width={70}
                                height={70}
                                style={{
                                  borderRadius: 6,
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </div>
                          <div className={styles.cartPreview}>
                            <div className={styles.cartQuantityContainer}>
                              <div className={styles.cartname}>Qty:</div>
                              <div className={styles.cartQuantity}>
                                {item.quantity}
                              </div>
                            </div>
                            <div className={styles.cartPriceContainer}>
                              <div className={styles.cartname}>Price:</div>
                              <div className={styles.cartPrice}>
                                {(item.price * item.quantity).toFixed(2)} $
                              </div>
                            </div>
                            {item.flavour.length > 0 && (
                              <div className={styles.cartFlavourContainer}>
                                <div className={styles.cartname}>Flavours:</div>
                                <div className={styles.cartFlavour}>
                                  {item.flavour.map((f, i) => (
                                    <span
                                      key={i}
                                      className={`${
                                        styles.flavourItem
                                      } ${getFlavourColor(f)}`}
                                    >
                                      {f}
                                      {i < item.flavour.length - 1 ? ", " : ""}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {item.sideDish.length > 0 && (
                              <div className={styles.cartSidedishContainer}>
                                <div className={styles.cartname}>Sides:</div>
                                <div className={styles.cartSidedish}>
                                  {item.sideDish.join(", ")}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className={styles.quantity}>
                            <div className={styles.addminusContainer}>
                              <div
                                className={`${styles.minus} ${
                                  item.quantity === 1 ? styles.disabled : ""
                                }`}
                                onClick={() => {
                                  if (item.quantity > 1) decreaseQty(item);
                                }}
                              >
                                -
                              </div>
                              <div
                                className={styles.plus}
                                onClick={() => increaseQty(item)}
                              >
                                +
                              </div>
                            </div>
                            <div
                              className={styles.remove}
                              onClick={() =>
                                removeFromCart(
                                  item.productId,
                                  item.flavour,
                                  item.sideDish
                                )
                              }
                            >
                              Remove
                            </div>
                          </div>
                        </Box>
                      ))}
                    </Box>
                    <Box
                      sx={{
                        borderTop: "1px solid #ddd",
                        p: 2,
                        bgcolor: "white",
                        position: "sticky",
                        bottom: 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <div className={styles.checkoutTotal}>Total:</div>
                        <div className={styles.checkoutPrice}>
                          ${totalPrice}
                        </div>
                      </Box>
                      <div
                        className={styles.checkoutBtn}
                        onClick={() =>
                          (window.location.href = "/pages/checkout")
                        }
                      >
                        Checkout
                      </div>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </>
        )}
        {isLoggedIn ? (
          <Link href="/profile">
            <FaUserCircle size={34} color="red" />
          </Link>
        ) : (
          <Link href="/signup">
            <FaSignInAlt size={34} color="red" />
          </Link>
        )}
      </div>
    </nav>
  );
}
