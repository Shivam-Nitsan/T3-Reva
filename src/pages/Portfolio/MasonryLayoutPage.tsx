import React, { useState } from "react";
import Masonry from "react-masonry-css";
import "../../style/Masonry.css";

interface MasonryLayoutPageProps {
  data: any;
}

const MasonryLayoutPage: React.FC<MasonryLayoutPageProps> = ({ data }) => {

  const colPos1 = data.content?.colPos1 || data.page?.content?.colPos1 || [];
  const colPos0 = data.content?.colPos0 || data.page?.content?.colPos0 || [];

  const allEntries = colPos0.flatMap((block: any) =>
    block.content?.items?.flatMap((item: any) =>
      item.contentElements?.flatMap(
        (el: any) => el.content?.data?.list || []
      )
    )
  );

  const allCategories: { id: number; slug: string; title: string }[] = [];
  allEntries.forEach((entry: any) => {
    entry.categories?.listCategories?.forEach((cat: any) => {
      if (!allCategories.some((c) => c.slug === cat.slug)) {
        allCategories.push(cat);
      }
    });
  });

  const [activeCategory, setActiveCategory] = useState<string>("all");

  const renderBodyText = () =>
    colPos1.flatMap((block: any) =>
      block.content?.items?.flatMap((item: any) =>
        item.contentElements?.map((el: any) => (
          <div key={el.id} className="masonry-section">
            <div
              className="masonry-body"
              dangerouslySetInnerHTML={{ __html: el.content?.bodytext || "" }}
            />
          </div>
        ))
      )
    );

  const renderPortfolioItems = () =>
    allEntries
      .filter((entry: any) => {
        if (activeCategory === "all") return true;
        return entry.categories?.listCategories?.some(
          (cat: any) => cat.slug === activeCategory
        );
      })
      .map((entry: any) => {
        const imgUrl =
          entry.featuredImage?.[0]?.images?.defaultImage?.publicUrl;
        const title = entry.title || "Untitled";
        const detailUrl = entry.detail || "#";

        return (
          <a
            key={entry.uid}
            href={detailUrl}
            className="portfolio-card"
            data-title={title}
          >
            {imgUrl && <img src={imgUrl} alt={title} />}
          </a>
        );
      });

  // Breakpoint setup for react-masonry-css
  const breakpointColumnsObj = {
    default: 3, 
    992: 2,     
    600: 1      
  };

  return (
    <div className="masonry-layout-page">
      <section className="intro">{renderBodyText()}</section>

      <nav className="portfolio-filter">
        <ul>
          <li
            className={activeCategory === "all" ? "active" : ""}
            onClick={() => setActiveCategory("all")}
          >
            All
          </li>
          {allCategories.map((cat) => (
            <li
              key={cat.id}
              className={activeCategory === cat.slug ? "active" : ""}
              onClick={() => setActiveCategory(cat.slug)}
            >
              {cat.title}
            </li>
          ))}
        </ul>
      </nav>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {renderPortfolioItems()}
      </Masonry>
    </div>
  );
};

export default MasonryLayoutPage;
