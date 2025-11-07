import React from "react";
import styles from "./about.module.css";
import cambodia from "./public/cambodia.png";
import south_korea from "./public/southkorea.png";
import japanese from "./public/japanese.png";
import fast_food from "./public/hamburger (1).png";

const CuisineCard = ({
  title,
  description,
  iconPath,
}: {
  title: any;
  description: any;
  iconPath: any;
}) => (
  <div className={styles.cuisineCard}>
    <div className={styles.iconContainer}>
      <img
        src={iconPath || "https://placehold.co/80x80/2d3748/ffffff?text=Icon"}
        alt={title}
        className={styles.cuisineIcon}
      />
    </div>
    <h3 className={styles.cardTitle}>{title}</h3>
    <p className={styles.cardDescription}>{description}</p>
    <a
      href={`/components/Cuisine?page=1&cuisine=${title
        .replace(/\s/g, "")
        .toUpperCase()}`}
      className={styles.cardLink}
    >
      View Menu &rarr;
    </a>
  </div>
);

export default function AboutLayout() {
  return (
    <div className={styles.pageWrapper}>
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>The Cātaurant Story</h1>
          <p className={styles.heroSubtitle}>
            A Culinary Journey Across Continents
          </p>
        </div>
      </header>
      <section className={styles.missionSection}>
        <h2 className={styles.sectionHeading}>Our Philosophy</h2>
        <div className={styles.missionGrid}>
          <p className={styles.missionText}>
            Cātaurant was founded on a simple, yet ambitious idea: to create a
            single dining destination that authentically celebrates the boldest
            flavors from around the globe. We believe that great food transcends
            borders, and our mission is to deliver an exceptional, multi-faceted
            culinary experience right to your table. We focus on quality
            ingredients, traditional techniques, and innovative presentation.
          </p>
          <p className={styles.missionText}>
            Our chefs are masters of their craft, trained in the distinct
            traditions of Khmer, Korean, and Japanese kitchens. This diverse
            expertise allows us to maintain the integrity of each cuisine while
            offering the speed and convenience of modern service. Whether you're
            craving the depth of Cambodian Amok or the savory comfort of Korean
            BBQ, Cātaurant is your gateway to global gastronomy.
          </p>
        </div>
      </section>

      <section className={styles.showcaseSection}>
        <h2 className={styles.sectionHeading}>Our Culinary Pillars</h2>
        <p className={styles.showcaseSubtitle}>
          We specialize in four distinct traditions, each prepared with
          precision and passion.
        </p>
        <div className={styles.cuisineGrid}>
          <CuisineCard
            title="Cambodia"
            iconPath="https://media.istockphoto.com/id/1462922520/vector/modern-round-cambodian-flag-icon-kingdom-of-cambodia-vector.jpg?s=612x612&w=0&k=20&c=EbQpGe6d0FU_xkkhO3MX62doBlwR9GRWBAyQn59XSKU="
            description="Experience the vibrant, aromatic, and fresh flavors of Khmer cuisine, from traditional fish amok to nom banh chok street eats."
          />
          <CuisineCard
            title="South Korea"
            iconPath="https://media.istockphoto.com/id/1445565161/vector/vector-illustration-of-flat-round-shaped-of-south-korea-flag-official-national-flag-in.jpg?s=612x612&w=0&k=20&c=VZwwOm7iQMMmRJ8WuBYDDiwfAcamh_Jcq1OyfUA-zrw="
            description="From classic Kimchi Jjigae to fiery Bulgogi, enjoy the dynamic and comforting taste of Korea's K-Food culture."
          />
          <CuisineCard
            title="Japan"
            iconPath="https://media.istockphoto.com/id/2174737496/vector/vector-round-icon-flag-of-japan.jpg?s=612x612&w=0&k=20&c=4tTWzRUz9qYnHAj0M7dzEOfDetJCO6Gi47miz_Rg9gk="
            description="Savor the artistry and elegance of Japanese cooking, focusing on fresh sushi, sashimi, and perfectly balanced ramen broths."
          />
          <CuisineCard
            title="Fast Food"
            iconPath="https://media.istockphoto.com/id/1184633031/vector/cartoon-burger-vector-isolated-illustration.jpg?s=612x612&w=0&k=20&c=Z66WFszea0EkDxLe2179qxjBi4zvsOVvQsZ3AbQRjB8="
            description="High-quality, globally-inspired comfort food made with speed, ensuring a delicious and quick meal without sacrificing flavor."
          />
        </div>
      </section>
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to explore?</h2>
        <p className={styles.ctaText}>
          Visit our menu to start your cross-cultural food journey today. We
          look forward to serving you.
        </p>
        <a
          href="/components/Cuisines?page=1&cuisine=South+Korea"
          className={styles.ctaButton}
        >
          Explore Menu
        </a>
      </section>
    </div>
  );
}
