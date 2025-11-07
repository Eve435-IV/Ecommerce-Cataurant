import React from "react";
import Banner from "./components/banner/Banner";
import HomePage from "./components/homepage/Homepage";
import Searchbar from "./components/searchbar/Searchbar";

export default function Home() {
  return (
    <div>
      <Banner />
      <HomePage />
    </div>
  );
}
