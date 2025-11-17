import { gql } from '@apollo/client';

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

export interface Product {
  _id: string;
  name: string;
  category: Category;
  imageUrl?: string;
  desc?: string;
  price: number;
}

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

export interface OrderBatch {
  batchId: string;
  orderDate: string;
  orders: Order[];
}

export interface Paginator {
  slNo: number;
  prev: number | null;
  next: number | null;
  perPage: number;
  totalPosts?: number; 
  totalPages: number;
  currentPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  totalDocs?: number;
}

export interface GetMyOrdersResponse {
  getMyOrders: {
    data: OrderBatch[];
    paginator: Paginator;
  };
}

export interface OrderInput {
  productId: string;
  quantity: number;
  flavour?: string[];
  sideDish?: string[];
  cuisine: Category;
}

export interface CreateOrdersResponse {
  createOrders: {
    success: boolean;
    message: string;
    orders: Order[];
  };
}
