import React from "react";
import Banner from "./components/banner/Banner";
import HomePage from "./components/homepage/Homepage";
import Searchbar from "./components/searchbar/Searchbar";

import MyOrdersPage from "../app/pages/myorders/page";

export default function Home() {
  return (
    <div>
      <Banner />
      <HomePage />
      <MyOrdersPage />
    </div>
  );
}
