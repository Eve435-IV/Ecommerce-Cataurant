"use client";

import { useQuery } from "@apollo/client/react";
import {  gql } from "@apollo/client";

export interface ProductFragment {
  _id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  desc?: string;
}

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    getAllproducts {
      _id
      name
      price
      category
      imageUrl
      desc
    }
  }
`;

export const useProducts = () => {
  const { data, loading, error, refetch } = useQuery<{ getAllproducts: ProductFragment[] }>(GET_ALL_PRODUCTS);
  return { products: data?.getAllproducts || [], loading, error, refetch };
};
