"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useAuthStore, UserFragment } from "../../hooks/AuthStore";
import { useRouter } from "next/navigation";
import {
  GetMyOrdersResponse,
  OrderBatch,
  Order,
  OrderStatus,
} from "../schema/order";
import styles from "./profile.module.css";

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

const GET_MY_ORDERS = gql`
  query GetMyOrders {
    getMyOrders {
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
        currentPage
        totalPages
        totalDocs
      }
    }
  }
`;

const statusColors: Record<string, string> = {
  Pending: "#FFC107",
  Accepted: "#4CAF50",
  Declined: "#F44336",
  Completed: "#2196F3",
};

function SkeletonCircle({ size = 150 }: { size?: number }) {
  return (
    <div
      className={styles.skeletonCircle}
      style={{ width: size, height: size }}
    />
  );
}
function SkeletonLine({
  width = "100%",
  height = 14,
  style = {},
}: {
  width?: string | number;
  height?: number;
  style?: any;
}) {
  return (
    <div className={styles.skeletonLine} style={{ width, height, ...style }} />
  );
}

export default function UserProfilePage() {
  const { user, login, logout, isInitialized } = useAuthStore();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showImageButton, setShowImageButton] = useState(false);
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
          setShowChangePassword(false);
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

  const {
    data,
    loading: ordersLoading,
    error: ordersError,
  } = useQuery<GetMyOrdersResponse>(GET_MY_ORDERS, {
    fetchPolicy: "network-only",
    skip: !isInitialized, // don't request orders until auth initialized
  });

  // Only completed orders
  const completedOrders: OrderBatch[] =
    data?.getMyOrders?.data
      ?.map((batch) => ({
        ...batch,
        orders: batch.orders.filter((order) => order.isCompleted),
      }))
      .filter((batch) => batch.orders.length > 0) || [];

  useEffect(() => {
    if (user)
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName || "",
        email: user.email,
        profileImage: user.profileImage || "",
      });
    if (!isInitialized) return;
    if (!user) {
      // keep the shell but show message if no user
      // optionally route to signup after a timeout — but we keep current behavior
    }
    if (feedback && !feedback.isError) {
      const timer = setTimeout(() => setFeedback(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [user, isInitialized, feedback]);

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
    if (!user?._id || updating) return;
    updateUser({ variables: { id: user._id, input: formData } });
  };
  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
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

  // Render: always render container shell. Show skeletons while !isInitialized
  const showSkeletons = !isInitialized;

  return (
    <div className={styles.container}>
      {/* left column: profile */}
      <div className={styles.profileColumn}>
        <h2>{isEditing ? "Edit Profile" : "Profile Details"}</h2>

        {feedback && (
          <div
            className={`${styles.message} ${
              feedback.isError ? styles.messageError : styles.messageSuccess
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className={styles.profileCard}>
          <div className={styles.avatarWrapper}>
            {showSkeletons ? (
              <>
                <SkeletonCircle />
                <SkeletonLine
                  width="60%"
                  height={18}
                  style={{ marginTop: 8 }}
                />
                <SkeletonLine
                  width="80%"
                  height={14}
                  style={{ marginTop: 6 }}
                />
              </>
            ) : (
              <>
                {preview || user?.profileImage ? (
                  <img
                    src={preview || user?.profileImage || ""}
                    className={styles.profileImage}
                    alt="Profile"
                    onClick={() => setShowImageButton(!showImageButton)}
                  />
                ) : (
                  <div
                    className={styles.emptyAvatarStatic}
                    onClick={() => setShowImageButton(!showImageButton)}
                  >
                    {user.firstName.charAt(0)}
                  </div>
                )}
                {showImageButton && (
                  <button
                    type="button"
                    className={styles.forgotPassword}
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                  >
                    Change Profile Picture
                  </button>
                )}
              </>
            )}
          </div>

          {!showSkeletons && (
            <>
              <div className={styles.usernameDisplay}>
                <p>
                  <strong>
                    {user.firstName} {user.lastName || ""}
                  </strong>
                </p>
                <p>{user.email}</p>
              </div>
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </>
          )}

          {/* Actions / Form */}
          {showSkeletons ? (
            <div className={styles.buttonGroup}>
              <SkeletonLine width="100%" height={44} />
              <SkeletonLine width="100%" height={44} />
            </div>
          ) : !isEditing ? (
            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={styles.editProfile}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className={styles.LogoutProfile}
              >
                Logout
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.dataLabel}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <label className={styles.dataLabel}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              {showChangePassword && (
                <>
                  <label className={styles.dataLabel}>Old Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                  />
                  <label className={styles.dataLabel}>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <label className={styles.dataLabel}>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </>
              )}
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.saveChanges}>
                  {updating || changingPassword ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className={styles.forgotPassword}
                  onClick={() => setShowChangePassword(!showChangePassword)}
                >
                  Change Password
                </button>
                {preview && (
                  <button
                    type="button"
                    className={styles.forgotPassword}
                    onClick={handleRemoveImage}
                  >
                    Remove Profile Image
                  </button>
                )}
                <button
                  type="button"
                  className={styles.forgotPassword}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* right column: history */}
      <div className={styles.profileHistory}>
        <h2>Completed Orders History</h2>

        {showSkeletons ? (
          // skeleton list
          <div className={styles.completedOrdersList}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={styles.batchCard}>
                <SkeletonLine
                  width="45%"
                  height={16}
                  style={{ marginBottom: 12 }}
                />
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <SkeletonLine width="70%" height={14} />
                  <SkeletonLine width="60%" height={14} />
                  <SkeletonLine width="40%" height={14} />
                </div>
              </div>
            ))}
          </div>
        ) : ordersLoading ? (
          <div className={styles.loading}>
            <div className={styles.loaderRing}></div>
          </div>
        ) : ordersError ? (
          <p className={styles.messageError}>{ordersError.message}</p>
        ) : completedOrders.length === 0 ? (
          <p>No completed orders found.</p>
        ) : (
          <div className={styles.completedOrdersList}>
            {completedOrders.map((batch) => (
              <div key={batch.batchId} className={styles.batchCard}>
                <p>
                  <strong>Batch ID:</strong> {batch.batchId} |{" "}
                  <strong>Date:</strong>{" "}
                  {batch.orderDate
                    ? new Date(batch.orderDate).toLocaleString()
                    : "N/A"}
                </p>
                <ul className={styles.orderList}>
                  {batch.orders.map((order: Order) => {
                    const status: OrderStatus | "Completed" = order.isCompleted
                      ? "Completed"
                      : order.status || OrderStatus.Pending;
                    const color = statusColors[status] || "#000";
                    return (
                      <li key={order._id} className={styles.orderItem}>
                        <span>
                          {order.productId?.name || "Unknown"} ×{" "}
                          {order.quantity} — $
                          {(order.productId?.price * order.quantity).toFixed(2)}
                        </span>
                        {(order.flavour?.length ||
                          order.sideDish?.length ||
                          order.cuisine) && (
                          <span className={styles.orderExtras}>
                            {order.flavour?.length
                              ? `Flavours: ${order.flavour.join(", ")}`
                              : ""}
                            {order.flavour?.length && order.sideDish?.length
                              ? " | "
                              : ""}
                            {order.sideDish?.length
                              ? `Sides: ${order.sideDish.join(", ")}`
                              : ""}
                            {order.cuisine
                              ? ` | Cuisine: ${order.cuisine}`
                              : ""}
                          </span>
                        )}
                        <span className={styles.orderStatus} style={{ color }}>
                          {status}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
        {/* if initialized but no user, friendly message */}
        {isInitialized && !user && (
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <p>Please login to access your profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}
