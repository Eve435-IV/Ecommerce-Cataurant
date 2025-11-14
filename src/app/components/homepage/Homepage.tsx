"use client";

import React, { useState } from "react";
import styles from "./homepage.module.css";
import Image from "next/image";
import Searchbar from "../searchbar/Searchbar";

import TomYum from "./public/tomyum.png";
import Gelato from "./public/gelato.png";
import Bibimbap from "./public/bibimbap.png";
import Soju from "./public/soju.png";
import Kimchi from "./public/kimchi.png";
import Ramen from "./public/ramen.png";
import Sake from "./public/sake.png";
import Taiyaki from "./public/taiyaki.png";
import Hamburger from "./public/hamburger.png";
import CocaCola from "./public/soda.png";
import FrenchFries from "./public/french-fries.png";
import Beer from "./public/beer.png";
import Delete from "./public/delete.png";
import Filter from "./public/filter.png";
import Paw from "./public/paw.png";
import PawPrint from "./public/pawprint.png";
import Cathead from "./public/burmilla.png";

export default function Homepage() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const ARBITRARY_SIZE = 500;
  const ICON_SIZE = 50;

  return (
    <>
      <Searchbar onToggle={handleToggle} />

      <div className={styles.pageWrapper}>
        {isOpen && (
          <div className={styles.sidebar}>
            <div className={styles.sidebarContainer}>
              <h2 className={styles.sidebarTitle}>
                <Image
                  src={Filter}
                  alt="Filter Icon"
                  className={styles.filter}
                />
                Filter Options
              </h2>
              <div onClick={handleToggle}>
                <Image
                  src={Delete}
                  alt="Close Button"
                  className={styles.closeBtn}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
              </div>
            </div>
            <div className={styles.listTittle}>Sort by</div>
            <ul className={styles.sidebarList}>
              <li>
                <label>
                  <input
                    type="radio"
                    name="sort"
                    value="relevance"
                    defaultChecked
                  />
                  Relevance
                </label>
              </li>
              <li>
                <label>
                  <input type="radio" name="sort" value="fastest" />
                  Fastest delivery
                </label>
              </li>
              <li>
                <label>
                  <input type="radio" name="sort" value="distance" />
                  Distance
                </label>
              </li>
              <li>
                <label>
                  <input type="radio" name="sort" value="toprated" />
                  Top rated
                </label>
              </li>
            </ul>

            <div className={styles.listTittle}>Offers</div>
            <ul className={styles.sidebarList}>
              <li>
                <label>
                  <input type="checkbox" />
                  Free delivery
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" />
                  Accepts vouchers
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" />
                  Deals
                </label>
              </li>
            </ul>
            <div className={styles.listTittle}>Cuisines</div>
            <ul className={styles.sidebarList}>
              <li>
                <label>
                  <input type="checkbox" value="african" />
                  Cambodia
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" value="american" />
                  South Korea
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" value="asian" />
                  Japanese
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" value="bbq" />
                  Fast Food
                </label>
              </li>
            </ul>
          </div>
        )}

        <div
          className={`${styles.mainContainer} ${
            isOpen ? styles.shrink : styles.fullWidth
          }`}
        >
          <div className={styles.banner}>
            <div className={styles.leftBanner}>
              <p>Sign up for free delivery for your first order!</p>
              <button>Sign up</button>
            </div>
            <div className={styles.rightBanner}>
              <Image src={Paw} alt="Paw Icon" className={styles.pawIcon} />
              <Image
                src={Cathead}
                alt="Cat Head Icon"
                className={styles.headIcon}
              />
            </div>
          </div>
          {/* <div className={styles.title}>Daily deals</div>
          <div className={styles.boxContiner}>
            <div className={styles.box}>50%</div>
            <div className={styles.box}>20%</div>
            <div className={styles.box}>Buy 1 Free 1</div>
            <div className={styles.box}>30%</div>
          </div> */}

          <div className={styles.title}>Your Favorite cuisines</div>
          <div className={styles.cambodiaContainer}>
            <div className={styles.textContainer}>
              <div className={styles.mainText}>Cambodia's Popular Dish</div>
              <p className={styles.smallText}>
                Fried rice,beer and ice cream are the most popular in Cambodia
                cuisine.
              </p>
            </div>
            <div className={styles.smallContainer}>
              <div className={styles.titleText}>Best Dish</div>
              <Image
                className={styles.image}
                src={TomYum}
                alt="Tom Yum Soup"
                width={ARBITRARY_SIZE}
                height={ARBITRARY_SIZE}
              />
              <div className={styles.nameText}>Fried Rice</div>
            </div>
            <div className={styles.smallContainer}>
              <div className={styles.titleText}>Best Drinks</div>
              <Image
                className={styles.image}
                src={Beer}
                alt="Beer Glass"
                width={ARBITRARY_SIZE}
                height={ARBITRARY_SIZE}
              />
              <div className={styles.nameText}>Beer</div>
            </div>
            <div className={styles.smallContainer}>
              <div className={styles.titleText}>Best Sidedish</div>
              <Image
                className={styles.image}
                src={Gelato}
                alt="Gelato"
                width={ARBITRARY_SIZE}
                height={ARBITRARY_SIZE}
              />
              <div className={styles.nameText}>Gelato</div>
            </div>
          </div>

          <div className={styles.koreaContainer}>
            <div className={styles.smallContainer}>
              <div className={styles.titleText}>Best Dish</div>
              <Image
                className={styles.image}
                src={Bibimbap}
                alt="Bibimbap"
                width={ARBITRARY_SIZE}
                height={ARBITRARY_SIZE}
              />
              <div className={styles.nameText}>Bibimbap</div>
            </div>
            <div className={styles.smallContainer}>
              <div className={styles.titleText}>Best Drinks</div>
              <Image
                className={styles.image}
                src={Soju}
                alt="Soju Bottle"
                width={ARBITRARY_SIZE}
                height={ARBITRARY_SIZE}
              />
              <div className={styles.nameText}>Soju</div>
            </div>
            <div className={styles.smallContainer}>
              <div className={styles.titleText}>Best Sidedish</div>
              <Image
                className={styles.image}
                src={Kimchi}
                alt="Kimchi"
                width={ARBITRARY_SIZE}
                height={ARBITRARY_SIZE}
              />
              <div className={styles.nameText}>Kimchi</div>
            </div>
            <div className={styles.textContainer}>
              <div className={styles.mainText}>Korea's Popular Dish</div>
              <p className={styles.smallText}>
                Kimchi, bibimbap, and soju are the staples of Korean cuisine.
              </p>
            </div>
          </div>

          <div className={styles.japanContainer}>
            <div className={styles.textContainer}>
              <div className={styles.mainText}>Japan's Popular Dish</div>
              <p className={styles.smallText}>
                Ramen, sake, and taiyaki are beloved Japanese classics.
              </p>
            </div>
            <div className={styles.smallContainer}>
              <div className={styles.titleText}>Best Dish</div>
              <Image
                className={styles.image}
                src={Ramen}
                alt="Ramen"
                width={ARBITRARY_SIZE}
                height={ARBITRARY_SIZE}
              />
              <div className={styles.nameText}>Ramen</div>
            </div>
            <div className={styles.smallContainer}>
              <div className={styles.titleText}>Best Drinks</div>
              <Image
                className={styles.image}
                src={Sake}
                alt="Sake Bottle"
                width={ARBITRARY_SIZE}
                height={ARBITRARY_SIZE}
              />
              <div className={styles.nameText}>Sake</div>
            </div>
            <div className={styles.smallContainer}>
              <div className={styles.titleText}>Best Sidedish</div>
              <Image
                className={styles.image}
                src={Taiyaki}
                alt="Taiyaki Fish-shaped cake"
                width={ARBITRARY_SIZE}
                height={ARBITRARY_SIZE}
              />
              <div className={styles.nameText}>Taiyaki</div>
            </div>
          </div>

          <div className={styles.fastfoodContainer}>
            <div className={styles.smallContainer}>
              <div className={styles.titleText}>Best Dish</div>
              <Image
                className={styles.image}
                src={Hamburger}
                alt="Hamburger"
                width={ARBITRARY_SIZE}
                height={ARBITRARY_SIZE}
              />
              <div className={styles.nameText}>Hamburger</div>
            </div>
            <div className={styles.smallContainer}>
              <div className={styles.titleText}>Best Drinks</div>
              <Image
                className={styles.image}
                src={CocaCola}
                alt="Coca-Cola Soda"
                width={ARBITRARY_SIZE}
                height={ARBITRARY_SIZE}
              />
              <div className={styles.nameText}>CocaCola</div>
            </div>
            <div className={styles.smallContainer}>
              <div className={styles.titleText}>Best Sidedish</div>
              <Image
                className={styles.image}
                src={FrenchFries}
                alt="French Fries"
                width={ARBITRARY_SIZE}
                height={ARBITRARY_SIZE}
              />
              <div className={styles.nameText}>French Fries</div>
            </div>
            <div className={styles.textContainer}>
              <div className={styles.mainText}>Fast Food Favorites</div>
              <p className={styles.smallText}>
                Burgers, fries, and soda — the global fast food icons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
