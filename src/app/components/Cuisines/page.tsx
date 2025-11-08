// src/app/components/Cuisines/page.tsx
"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Action from "./action";
import OrderPopup from "./popup";
import styles from "./cuisine.module.css";
import {
  GET_PRODUCT_PAGINATION,
  Product,
  GetProductWithPaginationResponse,
} from "../../schema/product";
import { useQuery } from "@apollo/client/react";
import { normalizeId, safeString } from "../../utils/normalize";

const CUISINE_OPTIONS = ["South Korea", "Japan", "Cambodia", "Fast Food"];
const PRODUCTS_PER_PAGE = 6;

const mapCuisineToCategory = (cuisine: string) => {
  switch (cuisine) {
    case "South Korea":
      return "KOREAN";
    case "Japan":
      return "JAPANESE";
    case "Cambodia":
      return "KHMER";
    case "Fast Food":
      return "FAST_FOOD";
    default:
      return null;
  }
};

export default function CuisinePage() {
  return <CuisineClient />;
}

function CuisineClient() {
  const router = useRouter();

  // Client-side state
  const [selectedCuisine, setSelectedCuisine] = useState("South Korea");
  const [page, setPage] = useState(1);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync URL query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialPage = Number(params.get("page")) || 1;
    const initialCuisine = params.get("cuisine") || "South Korea";
    setSelectedCuisine(initialCuisine);
    setPage(initialPage);
  }, []);

  // Update URL whenever page or cuisine changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("cuisine", selectedCuisine);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, selectedCuisine, router]);

  // Apollo query
  const { data, loading, error } = useQuery<GetProductWithPaginationResponse>(
    GET_PRODUCT_PAGINATION,
    {
      variables: {
        page,
        limit: PRODUCTS_PER_PAGE,
        pagination: true,
        category: mapCuisineToCategory(selectedCuisine),
      },
      fetchPolicy: "network-only",
    }
  );

  const products = data?.getProductWithPagination?.data || [];
  const totalPages = data?.getProductWithPagination?.paginator?.totalPages || 0;
  const effectiveTotalPages =
    totalPages === 0 && products.length > 0 ? 1 : totalPages;

  const openPopup = (product: Product) => {
    setSelectedProduct(product);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Cuisine selector */}
      <div className={styles.cuisineSelectorBar}>
        {CUISINE_OPTIONS.map((c) => (
          <button
            key={c}
            className={`${styles.cuisineButton} ${
              selectedCuisine === c ? styles.active : ""
            }`}
            onClick={() => {
              setSelectedCuisine(c);
              setPage(1);
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Loading / Error */}
      {loading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {!loading && products.length === 0 && <div>No dishes found.</div>}

      {/* Product grid */}
      <div className={styles.container}>
        {products.map((product) => (
          <div key={normalizeId(product._id)} className={styles.box}>
            {product.imageUrl ? (
              <Image
                src={safeString(product.imageUrl)}
                alt={safeString(product.name)}
                width={440}
                height={300}
                className={styles.image}
              />
            ) : (
              <div className={styles.image}>Image Missing</div>
            )}
            <div className={styles.pricecontainer}>
              <div className={styles.text}>{safeString(product.name)}</div>
              <div className={styles.price}>
                ${Number(product.price || 0).toFixed(2)}
              </div>
            </div>
            <Action onOpen={() => openPopup(product)} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className={styles.paginationControls}>
        <button
          onClick={() => page > 1 && setPage(page - 1)}
          disabled={page <= 1}
          className={styles.paginationButton}
        >
          Previous
        </button>
        <span className={styles.pageInfo}>
          Page {page} of {effectiveTotalPages}
        </span>
        <button
          onClick={() => page < effectiveTotalPages && setPage(page + 1)}
          disabled={page >= effectiveTotalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>

      {/* Order popup */}
      {selectedProduct && (
        <OrderPopup
          open={popupOpen}
          onClose={closePopup}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
