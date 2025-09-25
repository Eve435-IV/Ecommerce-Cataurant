import React, { useState } from "react";
import {
  Drawer,
  Stack,
  Typography,
  Divider,
  IconButton,
  TextField,
  Button,
  Checkbox,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import styles from "./southkoreacuisine.module.css";
import Image from "next/image";
import Pickle from "./public/pickles.png";
import Sugar from "./public/sugar.png";
import Salt from "./public/salt.png";
import Spicy from "./public/hotsauce.png";
import Kimchi from "./public/kimchi.png";
import Salad from "./public/salad.png";
import Cheese from "./public/cheese.png";
import Cancel from "./public/cancel.png";
import Confirm from "./public/yes.png";

type PopupProps = {
  open: boolean;
  close: () => void;
};

type FormValues = {
};

export default function Popup({ open, close }: PopupProps) {
  const [formValues, setFormValues] = useState<FormValues>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted Values:", formValues);
    close(); // Close drawer after submit
  };

  return (
    <>
      <div></div>
      <Drawer
        open={open}
        onClose={close}
        hideBackdrop={false}
        sx={{
          "& .MuiDrawer-paper": {
            position: "fixed",
            top: "11%",
            left: "30%",
            // transform: "translate(-50%, -50%)",
            width: "700px",
            height: "auto",
            borderRadius: "7px",
            // display: "flex",
            justifyContent: "center",
            alignContent: "center",
          },
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            height: "auto",
            display: "flex",
            flexDirection: "column",
            
          }}
        >
          <Stack>
            {/* Header */}
            <div className={styles.topcolumn} style={{backgroundColor:"red"}}>
              <Typography
                variant="h4"
                style={{
                  paddingLeft: "30px",
                  
                }}
              >
                Select Your Preference
              </Typography>
            </div>

            <Divider />

            {/* Form Fields */}
            <Stack>
              <div className={styles.midcolumn}>
                <div className={styles.content}>
                  <div className={styles.maintext}>Choose Flavour</div>
                  <div className={styles.checkbox}>
                    <Checkbox />
                    <Image className={styles.logo} src={Spicy} alt="pickle" />
                    <div className={styles.smalltext}>Spicy</div>
                  </div>
                  <div className={styles.checkbox}>
                    <Checkbox />
                    <Image className={styles.logo} src={Sugar} alt="pickle" />
                    <div className={styles.smalltext}>Sweet</div>
                  </div>
                  <div className={styles.checkbox}>
                    <Checkbox />
                    <Image className={styles.logo} src={Salt} alt="pickle" />
                    <div className={styles.smalltext}>Salty</div>
                  </div>
                </div>
                <Divider />
                <div className={styles.content}>
                  <div className={styles.maintext}>Choose Side dishes</div>
                  <div className={styles.checkbox}>
                    <Checkbox />
                    <Image className={styles.logo} src={Pickle} alt="pickle" />
                    <div className={styles.smalltext}>Pickle</div>
                  </div>
                  <div className={styles.checkbox}>
                    <Checkbox />
                    <Image className={styles.logo} src={Kimchi} alt="pickle" />
                    <div className={styles.smalltext}>Kimchi</div>
                  </div>
                  <div className={styles.checkbox}>
                    <Checkbox />
                    <Image className={styles.logo} src={Salad} alt="pickle" />
                    <div className={styles.smalltext}>Salad</div>
                  </div>
                  <div className={styles.checkbox}>
                    <Checkbox />
                    <Image className={styles.logo} src={Cheese} alt="pickle" />
                    <div className={styles.smalltext}>Cheese</div>
                  </div>
                </div>
                <Divider />
                <div className={styles.remark}>
                  <div className={styles.maintext}>Special Inctructions</div>
                  <TextField
                    size="small"
                    rows={2}
                    multiline
                    fullWidth
                    placeholder="Input request..."
                  />
                </div>
              </div>
            </Stack>

            <Divider />

            {/* Footer Button */}
            <Grid className={styles.botcolumn}>
              <div
                onClick={close}
                className={styles.close}
                style={{ height: "55px", width: "40px" }}
              >
                <Image className={styles.logo} src={Cancel} alt="pickle" />
                <div className={styles.smalltext}>Cancel</div>
              </div>
              <div
                onClick={close}
                className={styles.order}
                style={{
                  height: "55px",
                  width: "40px",
                }}
              >
                <Image className={styles.logo} src={Confirm} alt="pickle" />
                <div className={styles.smalltext}>Confirm</div>
              </div>
            </Grid>
          </Stack>
        </form>
      </Drawer>
    </>
  );
}
