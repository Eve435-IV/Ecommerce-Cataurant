"use client";

import React from "react";
import {
  Loader2,
  ShoppingCart,
  Lock,
  ArrowRight,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import Image from "next/image";

import { useAuthStore, AuthStore } from "../../../hooks/AuthStore";
import { AuthForm } from "../../signup/layout";
import styles from "./orderonline.module.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface GetProductWithPaginationResponse {
  getProductWithPagination: {
    data: Product[];
    paginator: any;
  };
}

const GET_PRODUCT_PAGINATION =
  require("../../schema/product").GET_PRODUCT_PAGINATION;

const GRAPHQL_URI = "http://localhost:4000/graphql";
const FEATURED_LIMIT = 1 && 2;

const CUISINE_CATEGORIES: { name: string; category: string }[] = [
  { name: "Cambodia", category: "KHMER" },
  { name: "South Korea", category: "KOREAN" },
  { name: "Japan", category: "JAPANESE" },
  { name: "Fast Food", category: "FAST_FOOD" },
];

const httpLink = new HttpLink({ uri: GRAPHQL_URI });
const client = new ApolloClient({ link: httpLink, cache: new InMemoryCache() });

const useFeaturedProducts = () => {
  const results = CUISINE_CATEGORIES.map(({ category }) =>
    useQuery<GetProductWithPaginationResponse>(GET_PRODUCT_PAGINATION, {
      variables: {
        page: 1,
        limit: FEATURED_LIMIT,
        pagination: true,
        keyword: null,
        category: category,
      },
      fetchPolicy: "cache-and-network",
    })
  );

  const products: { categoryName: string; product: Product }[] = [];
  let loading = false;
  let error = null;

  results.forEach((res, index) => {
    if (res.loading) loading = true;
    if (res.error) error = res.error;

    const featuredDish = res.data?.getProductWithPagination?.data[0];

    if (featuredDish) {
      products.push({
        categoryName: CUISINE_CATEGORIES[index].name,
        product: featuredDish,
      });
    }
  });

  return { products, loading, error };
};

const OrderForm = () => {
  const { products, loading, error } = useFeaturedProducts();

  if (loading) {
    return (
      <div className={`${styles.orderForm} ${styles.centerContent}`}>
        <Loader2 className={`${styles.loadingIcon} ${styles.iconSmall}`} />
        <p className={styles.loadingText}>Loading today's featured dishes...</p>
      </div>
    );
  }

  return (
    <div className={styles.orderForm}>
      <div className={styles.orderHeader}>
        <ShoppingCart className={styles.orderIcon} />
        <h2 className={styles.orderTitle}>Welcome Back! Start Your Order.</h2>
        <p className={styles.orderSubtitle}>
          Feast your eyes on today's top dishes from across all our cuisines!
        </p>
      </div>

      <div className={styles.productList}>
        <h3 className={styles.productCategory}>Today's Featured Dishes</h3>

        {error && (
          <div className={`${styles.promptCard} ${styles.errorCard}`}>
            <AlertTriangle className={styles.lockIcon} />
            <p className={styles.promptMessage}>
              Error loading featured items: {error.message}
            </p>
          </div>
        )}

        {!error && products.length === 0 && (
          <div className={`${styles.promptCard} ${styles.infoCard}`}>
            <p className={styles.promptMessage}>
              No featured items found right now.
            </p>
          </div>
        )}
        {!error &&
          products.map(({ categoryName, product }) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productInfo}>
                <div
                  style={{
                    position: "relative",
                    width: "60px",
                    height: "60px",
                    marginRight: "1rem",
                  }}
                >
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-lg"
                    />
                  ) : (
                    <DollarSign className={styles.productPriceIcon} />
                  )}
                </div>

                <div>
                  <p className={styles.productName}>{product.name}</p>
                  <p className={styles.productDescription}>
                    {categoryName} Cuisine |{" "}
                    {product.description?.substring(0, 50)}
                    {product.description && product.description.length > 50
                      ? "..."
                      : ""}
                  </p>
                </div>
              </div>
              <div className={styles.productActions}>
                <span className={styles.productPrice}>
                  ${product.price.toFixed(2)}
                </span>
                <button className={styles.addButton}>+ Add</button>
              </div>
            </div>
          ))}
      </div>

      <button className={styles.checkoutButton}>
        Review Cart & Checkout
        <ArrowRight className={styles.checkoutIcon} />
      </button>
    </div>
  );
};

export default function OrderOnline() {
  const { user, isInitialized } = useAuthStore() as AuthStore;

  if (!isInitialized) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.loadingIcon} />
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  return (
    <ApolloProvider client={client}>
      <div className={styles.pageContainer}>
        {user ? (
          <OrderForm />
        ) : (
          <div className={styles.promptContainer}>
            <div className={styles.promptCard}>
              <Lock className={styles.lockIcon} />
              <h1 className={styles.promptTitle}>Order Online</h1>
              <p className={styles.promptMessage}>
                You must be logged in to view and place an order.
              </p>
              <p className={styles.promptAction}>
                Please Sign Up or Log In below.
              </p>
            </div>

            <AuthForm />
          </div>
        )}
      </div>
    </ApolloProvider>
  );
}
