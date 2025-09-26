import React, { useEffect, useState } from "react";
import { getMyData } from "../api/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StyleSwitcher from "../components/StyleSwitcher";
import LandingPage from "../components/LandingPage";
import ContactUsPage from "./ContactUsPage";
import MasonryLayoutPage from "./Portfolio/MasonryLayoutPage";
import PortfolioGrid from "./Portfolio/PortfolioGridPage";
import IsotopeLayoutPage from "./Portfolio/IsotopePage";
import CarouselPage from "./Portfolio/Carousel";

interface ApiResponse {
  page?: {
    mainNavigation?: any[];
    footerNavigation?: any[];
    content?: {
      colPos0?: any[];
      colPos1?: any[];
      colPos2?: any[];
    };
  };
  content?: {
    colPos0?: any[];
    colPos1?: any[];
    colPos2?: any[];
  };
}

const Loader: React.FC = () => <div id="wifi-loader">{/* loader SVG */}</div>;

const Page: React.FC<{ slug: string }> = ({ slug }) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const json = await getMyData(slug, "remote");

        console.log("Fetched data for slug:", slug, json);

        setData(json);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching data for slug:", slug, err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found</div>;

  const heroContent = data.page?.content?.colPos0 || data.content?.colPos0 || [];
  const footerBlocks = data.page?.content?.colPos2 || data.content?.colPos2 || [];
  const footerNavigation = data.page?.footerNavigation || [];

  return (
    <div>
      <Header data={{ mainNavigation: data.page?.mainNavigation || [] }} />

      {slug === "/" || slug === "home" ? (
  <LandingPage content={{ colPos0: heroContent }} />
) : slug === "/portfolio/masonry-layout" ? (
  <MasonryLayoutPage data={data} />
) : slug === "/portfolio/portfolio-grid" ? (
  <PortfolioGrid data={data} />
) : slug === "/contact-us" ? (
  <ContactUsPage data={data} />
) : slug === "/portfolio/isotope-view" ? (
  <IsotopeLayoutPage data={data} /> 
) : slug === "/portfolio/masonry-minimal" ? (
  <CarouselPage data={data} /> 
):(
  <main style={{ textAlign: "center" }}>404: Page not found</main>
)}

      <StyleSwitcher />
      <Footer footerBlocks={footerBlocks} footerNavigation={footerNavigation} />
    </div>
  );
};

export default Page;
