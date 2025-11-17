import { gql } from "@apollo/client";

export interface UserFragment {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  // phoneNumber?: string;
  role: "ADMIN" | "MANAGER" | "STAFF" | "CUSTOMER" | "GUEST"; 
  isActive: boolean;
  profileImage?: string;
  createdAt?: string;
}

export interface AuthFormData {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface AuthStore {
  user: UserFragment | null;
  token: string | null;
  login: (userData: UserFragment, authToken: string) => void;
  logout: () => void;
  isInitialized: boolean;
}

export interface SignupCustomerInput extends AuthFormData {}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupResponse {
  signupCustomer: {
    token: string;
    user: UserFragment;
  };
}

export interface LoginResponse {
  login: {
    token: string;
    user: UserFragment;
  };
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

export interface UpdateUserResponse {
  updateUser: {
    isSuccess: boolean;
    messageKh?: string;
    messageEn?: string;
  };
}
