"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Divider,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart, CartItem } from "../../../context/cartContext";
import { Product } from "../../schema/product";
import styles from "./cuisine.module.css";

const CUISINE_SIDE_DISHES: Record<string, string[]> = {
  KOREAN: ["Kimchi", "Cheese", "Salad", "Pickle"],
  JAPANESE: ["Miso Soup", "Tempura", "Seaweed Salad", "Pickled Ginger"],
  KHMER: ["Prahok", "Lettuce Wrap", "Fried Onion", "Boiled Egg"],
  FAST_FOOD: ["French Fries", "Coleslaw", "Mashed Potato", "Onion Rings"],
};

const FLAVOUR_OPTIONS = ["Sweet", "Spicy", "Salty"];
const MAX_QUANTITY = 10;
const MIN_QUANTITY = 1;

interface OrderPopupProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function OrderPopup({
  open,
  onClose,
  product,
}: OrderPopupProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [flavour, setFlavour] = useState<string[]>([]);
  const [sideDish, setSideDish] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");

  if (!product) return null;

  const incrementQuantity = () =>
    setQuantity((q) => Math.min(MAX_QUANTITY, q + 1));
  const decrementQuantity = () =>
    setQuantity((q) => Math.max(MIN_QUANTITY, q - 1));

  const toggleFlavour = (f: string) =>
    setFlavour((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );

  const toggleSideDish = (s: string) =>
    setSideDish((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const handleSubmit = () => {
    if (flavour.length === 0) {
      setError("Please select at least one flavour.");
      return;
    }

    const item: CartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      flavour,
      sideDish,
      cuisine: product.category,
      imageUrl: product.imageUrl,
      // instructions,
    };

    addToCart(item);
    onClose();

    setQuantity(1);
    setFlavour([]);
    setSideDish([]);
    setInstructions("");
    setError("");
  };

  const normalizedCategory = product.category
    ?.trim()
    .replace(/\s+/g, "")
    .toUpperCase();
  const sideDishes = CUISINE_SIDE_DISHES[normalizedCategory] || [];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={styles.titleContainer}>
        <div className={styles.namePopup}>{product.name}</div>
        <div className={styles.pricePopup}>
          ${(product.price * quantity).toFixed(2)}
        </div>
      </DialogTitle>

      <DialogContent className={styles.contentContainer}>
        <div className={styles.stack}>
          <div className={styles.title}>Quantity</div>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              onClick={decrementQuantity}
              disabled={quantity === MIN_QUANTITY}
            >
              <RemoveIcon />
            </IconButton>
            <div>{quantity}</div>
            <IconButton
              onClick={incrementQuantity}
              disabled={quantity === MAX_QUANTITY}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </div>

        <Divider sx={{ my: 2 }} />
        <div className={styles.stack}>
          <div className={styles.title}>Flavours</div>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {FLAVOUR_OPTIONS.map((f) => (
              <FormControlLabel
                key={f}
                control={
                  <Checkbox
                    checked={flavour.includes(f)}
                    onChange={() => toggleFlavour(f)}
                  />
                }
                label={f}
              />
            ))}
          </Box>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </div>

        <Divider sx={{ my: 2 }} />
        <div className={styles.stack}>
          <div className={styles.title}>Side Dishes</div>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {sideDishes.length > 0 ? (
              sideDishes.map((s) => (
                <FormControlLabel
                  key={s}
                  control={
                    <Checkbox
                      checked={sideDish.includes(s)}
                      onChange={() => toggleSideDish(s)}
                    />
                  }
                  label={s}
                />
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No side dishes available for this cuisine
              </Typography>
            )}
          </Box>
        </div>

        <Divider sx={{ my: 2 }} />

        <TextField
          label="Instructions"
          multiline
          rows={3}
          fullWidth
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
        <div onClick={onClose} className={styles.close}>
          Cancel
        </div>
        <div onClick={handleSubmit} className={styles.order}>
          Add to Cart
        </div>
      </DialogActions>
    </Dialog>
  );
}
