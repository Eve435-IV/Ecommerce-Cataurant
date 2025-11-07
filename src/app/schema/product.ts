import { gql } from "@apollo/client";

export interface Product {
    _id: string;
    name: string;
    category: string;
    imageUrl: string;
    desc: string;
    price: number;
}

export interface Paginator {
    slNo: number;
    prev: number;
    next: number;
    perPage: number;
    totalPosts: number;
    totalPages: number; 
    currentPage: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    totalDocs: number; 
}

export interface GetProductWithPaginationResponse {
    getProductWithPagination: {
        data: Product[];
        paginator: Paginator;
    };
}

export const GET_PRODUCT_PAGINATION = gql`
  query GetProductWithPagination(
    $page: Int
    $limit: Int
    $pagination: Boolean
    $keyword: String
    $category: Category
  ) {
    getProductWithPagination(
      page: $page
      limit: $limit
      pagination: $pagination
      keyword: $keyword
      category: $category
    ) {
      data {
        _id
        name
        category
        imageUrl
        desc
        price
      }
      paginator {
        slNo
        prev
        next
        perPage
        totalPosts
        totalPages
        currentPage
        hasPrevPage
        hasNextPage
        totalDocs
      }
    }
  }
`;