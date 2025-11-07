import { gql } from "@apollo/client";

export const CREATE_ORDERS = gql`
  mutation CreateOrders($inputs: [OrderInput!]!) {
    createOrders(inputs: $inputs) {
      success
      message
    }
  }
`;

export const GET_ORDER_PAGINATION = gql`
 query GetOrderWithPagination($page: Int, $limit: Int, $pagination: Boolean, $isCompleted: Boolean) {
  getOrderWithPagination(page: $page, limit: $limit, pagination: $pagination, isCompleted: $isCompleted) {
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

export type CuisineType = "KHMER" | "KOREAN" | "JAPANESE" | "FAST_FOOD";
export type OrderStatus = "Pending" | "Accepted" | "Declined";

export interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  profileImage?: string;
  createdAt?: string;
}

export interface ProductType {
  _id: string;
  name: string;
  category: string;
  imageUrl: string;
  desc: string;
  price: number;
}

export interface Order {
  _id: string;
  userId: UserType;
  productId: ProductType;
  quantity: number;
  flavour: string[];
  sideDish: string[];
  cuisine: CuisineType;
  status: OrderStatus;
  isCompleted: boolean;
  batchId: string;
  orderDate: string;
}

export interface OrderInput {
  productId: string;
  quantity: number;
  flavour: string[];
  sideDish: string[];
  cuisine: CuisineType;
  status?: OrderStatus;
  isCompleted?: boolean;
  batchId?: string;
  orderDate?: string;
}

export interface CreateOrdersResponse {
  createOrders: {
    success: boolean;
    message: string;
  };
}

export interface UpdateOrderResponse {
  updateOrder: {
    success: boolean;
    message: string;
    order: Order;
  };
}

export interface DeleteOrderResponse {
  deleteOrder: {
    success: boolean;
    message: string;
  };
}

export interface OrderBatch {
  batchId: string;
  orderDate: string;
  orders: Order[];
}

export interface Paginator {
  slNo?: number;
  prev?: number;
  next?: number;
  perPage?: number;
  totalPosts?: number;
  totalPages?: number;
  currentPage: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  totalDocs?: number;
}

export interface OrderBatchPaginator {
  getOrderWithPagination: {
    data: OrderBatch[];
    paginator: Paginator;
  };
}
