"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useAuthStore, UserFragment } from "../../hooks/AuthStore";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import { OrderBatchPaginator } from "../schema/order";
// ================== GRAPHQL QUERIES & MUTATIONS ==================
const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $input: UserUpdateInput) {
    updateUser(_id: $id, input: $input) {
      isSuccess
      messageEn
    }
  }
`;

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword(
    $id: ID!
    $oldPassword: String!
    $newPassword: String!
  ) {
    changePassword(
      _id: $id
      oldPassword: $oldPassword
      newPassword: $newPassword
    ) {
      isSuccess
      message
    }
  }
`;

const GET_COMPLETED_ORDERS = gql`
  query GetCompletedOrders(
    $page: Int!
    $limit: Int!
    $pagination: Boolean!
    $isCompleted: Boolean!
  ) {
    getOrderWithPagination(
      page: $page
      limit: $limit
      pagination: $pagination
      isCompleted: $isCompleted
    ) {
      data {
        batchId
        orderDate
        orders {
          _id
          productId {
            name
            price
          }
          quantity
          status
          isCompleted
          flavour
          sideDish
          cuisine
        }
      }
    }
  }
`;

// ================== COMPONENT ==================
export default function UserProfilePage() {
  const { user, login, logout, isInitialized } = useAuthStore();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ================== MUTATIONS ==================
  const [updateUser, { loading: updating }] = useMutation(
    UPDATE_USER_MUTATION,
    {
      onCompleted: (res: any) => {
        const { isSuccess, messageEn } = res.updateUser;
        if (isSuccess && user) {
          const token = localStorage.getItem("auth_token") || "";
          login({ ...user, ...formData } as UserFragment, token);
          setFeedback({
            message: messageEn || "Profile updated successfully!",
            isError: false,
          });
          setIsEditing(false);
        } else {
          setFeedback({
            message: messageEn || "Profile update failed.",
            isError: true,
          });
        }
      },
      onError: (err) => setFeedback({ message: err.message, isError: true }),
    }
  );

  const [changePassword, { loading: changingPassword }] = useMutation(
    CHANGE_PASSWORD_MUTATION,
    {
      onCompleted: (res: any) => {
        if (res.changePassword.isSuccess) {
          setFeedback({
            message: "Password changed successfully! 🔒",
            isError: false,
          });
          setShowChangePassword(false);
          setPasswordForm({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          setFeedback({
            message: res.changePassword.message || "Password change failed.",
            isError: true,
          });
        }
      },
      onError: (err) => setFeedback({ message: err.message, isError: true }),
    }
  );

  // ================== QUERY (✅ with correct type) ==================
  const {
    data: completedData,
    loading: completedLoading,
    error: completedError,
  } = useQuery<OrderBatchPaginator>(GET_COMPLETED_ORDERS, {
    variables: { page: 1, limit: 20, pagination: true, isCompleted: true },
    fetchPolicy: "network-only",
  });

  const completedBatches = completedData?.getOrderWithPagination?.data || [];

  // ================== EFFECTS ==================
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName || "",
        email: user.email,
        profileImage: user.profileImage || "",
      });
      setPreview(user.profileImage || null);
    }

    if (!isInitialized) return;
    if (!user) router.push("/signup");

    if (feedback && !feedback.isError) {
      const timer = setTimeout(() => setFeedback(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [user, isInitialized, feedback]);

  // ================== HANDLERS ==================
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setFormData({ ...formData, profileImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFormData({ ...formData, profileImage: "" });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!user?._id || updating) return;
    const { firstName, lastName, profileImage } = formData;
    updateUser({
      variables: { id: user._id, input: { firstName, lastName, profileImage } },
    });
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setFeedback({ message: "New passwords do not match.", isError: true });
      return;
    }
    if (!user?._id) return;
    changePassword({
      variables: {
        id: user._id,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      },
    });
  };

  const handleCancelEdit = () => {
    if (user)
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName || "",
        email: user.email,
        profileImage: user.profileImage || "",
      });
    setPreview(user?.profileImage || null);
    setIsEditing(false);
    setShowChangePassword(false);
    setFeedback(null);
  };

  const handleLogout = () => {
    logout();
    router.push("/signup");
  };

  // ================== RENDER ==================
  if (!isInitialized) return <p>Loading Authentication...</p>;
  if (!user) return <p>Please login to access your profile.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.profileColumn}>
        <h2>
          {isEditing
            ? "Edit Profile"
            : showChangePassword
            ? "Change Password"
            : "Profile Details"}
        </h2>

        {feedback && (
          <div
            className={`${styles.message} ${
              feedback.isError ? styles.messageError : styles.messageSuccess
            }`}
            style={{ marginBottom: "1.5rem", width: "100%", maxWidth: "350px" }}
          >
            {feedback.message}
          </div>
        )}

        {/* Profile Card */}
        {/* ...same JSX as before... */}
      </div>

      {/* Orders History */}
      <div className={styles.profileHistory}>
        <h2>Orders History</h2>
        {completedLoading ? (
          <p>Loading completed orders...</p>
        ) : completedError ? (
          <p className={styles.messageError}>{completedError.message}</p>
        ) : completedBatches.length === 0 ? (
          <p>No completed orders found.</p>
        ) : (
          <div className={styles.completedOrdersList}>
            {completedBatches.map((batch) => (
              <div key={batch.batchId} className={styles.batchCard}>
                <p>
                  <strong>Batch ID:</strong> {batch.batchId} |
                  <strong>Date:</strong>
                  {batch.orderDate
                    ? (() => {
                        const timestamp = Number(batch.orderDate);
                        const d = new Date(timestamp);
                        return isNaN(d.getTime())
                          ? "Invalid Date"
                          : d.toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            });
                      })()
                    : "N/A"}
                </p>
                <ul className={styles.orderList}>
                  {batch.orders.map((order) => (
                    <li key={order._id} className={styles.orderItem}>
                      <span>
                        {order.productId?.name || "Unknown Product"} ×
                        {order.quantity} — $
                        {(order.productId?.price || 0 * order.quantity).toFixed(
                          2
                        )}
                      </span>
                      {(order.flavour?.length > 0 ||
                        order.sideDish?.length > 0) && (
                        <span className={styles.orderExtras}>
                          {order.flavour?.length > 0 &&
                            `Flavours: ${order.flavour.join(", ")}`}
                          {order.flavour?.length > 0 &&
                            order.sideDish?.length > 0 &&
                            " | "}
                          {order.sideDish?.length > 0 &&
                            `Sides: ${order.sideDish.join(", ")}`}
                          {order.cuisine && ` | Cuisine: ${order.cuisine}`}
                        </span>
                      )}
                      <span className={styles.orderStatus}>
                        {order.isCompleted ? "Completed" : order.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
