import { gql } from "@apollo/client";

export const GET_CART_BY_USER = gql`
query GetCartByUser($userId: ID!) {
  getCartByUser(userId: $userId) {
    _id
    id
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
    items {
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
    }
    status
    createdAt
    updatedAt
  }
}
}
`
export const ADD_TO_CART = gql`
mutation AddToCart($userId: ID!, $productId: ID!, $quantity: Int!, $cuisine: Category!, $flavour: [String], $sideDish: [String]) {
  addToCart(userId: $userId, productId: $productId, quantity: $quantity, cuisine: $cuisine, flavour: $flavour, sideDish: $sideDish) {
    isSuccess
    messageKh
    messageEn
    success
    message
  }
}
}`

export const REMOVE_FROM_CART = gql`
mutation RemoveFromCart($userId: ID!, $productId: ID!) {
  removeFromCart(userId: $userId, productId: $productId) {
    isSuccess
    messageKh
    messageEn
    success
    message
  }
}
}`

export const CONFIRM_CART = gql`
mutation ConfirmCart($userId: ID!) {
  confirmCart(userId: $userId) {
    isSuccess
    messageKh
    messageEn
    success
    message
  }
}
}`

export const CLEAR_CART = gql`
mutation ClearCart($userId: ID!) {
  clearCart(userId: $userId) {
    isSuccess
    messageKh
    messageEn
    success
    message
  }
}
}`