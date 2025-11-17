import { gql } from '@apollo/client';

// =======================
// GRAPHQL QUERIES / MUTATIONS
// =======================

// Get all orders for the logged-in user
export const GET_MY_ORDERS = gql`
  query GetMyOrders($page: Int, $limit: Int, $isCompleted: Boolean) {
  getMyOrders(page: $page, limit: $limit, isCompleted: $isCompleted) {
    data {
      batchId
      orderDate
      orders {
        _id
        userId {
          _id
          firstName
          lastName
          email
          role
          profileImage
          isActive
          createdAt
        }
        productId {
          _id
          name
          category
          imageUrl
          desc
          price
        }
        quantity
        flavour
        sideDish
        cuisine
        status
        isCompleted
        batchId
        orderDate
      }
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

// Create orders
export const CREATE_ORDERS = gql`
  mutation CreateOrders($inputs: [OrderInput!]!) {
    createOrders(inputs: $inputs) {
      success
      message
      orders {
        _id
        userId {
          _id
          firstName
          lastName
          email
          role
          profileImage
          isActive
          createdAt
        }
        productId {
          _id
          name
          category
          imageUrl
          desc
          price
        }
        quantity
        flavour
        sideDish
        cuisine
        status
        isCompleted
        batchId
        orderDate
      }
    }
  }
`;

// =======================
// ENUMS
// =======================

export enum Category {
  KHMER = "KHMER",
  KOREAN = "KOREAN",
  JAPANESE = "JAPANESE",
  FAST_FOOD = "FAST_FOOD",
}

export enum OrderStatus {
  Pending = "Pending",
  Accepted = "Accepted",
  Declined = "Declined",
}

// =======================
// TYPESCRIPT TYPES
// =======================

// User type
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
}

// Product type
export interface Product {
  _id: string;
  name: string;
  category: Category;
  imageUrl?: string;
  desc?: string;
  price: number;
}

// Order type
export interface Order {
  _id: string;
  userId: User;
  productId: Product;
  quantity: number;
  flavour?: string[];
  sideDish?: string[];
  cuisine: Category;
  status?: OrderStatus;
  isCompleted: boolean;
  batchId: string;
  orderDate: string;
}

// Batch type
export interface OrderBatch {
  batchId: string;
  orderDate: string;
  orders: Order[];
}

// Query response types
export interface GetMyOrdersResponse {
  getMyOrders: OrderBatch[];
}

// Mutation input types
export interface OrderInput {
  productId: string;
  quantity: number;
  flavour?: string[];
  sideDish?: string[];
  cuisine: Category;
}

// Mutation response type
export interface CreateOrdersResponse {
  createOrders: {
    success: boolean;
    message: string;
    orders: Order[];
  };
}
