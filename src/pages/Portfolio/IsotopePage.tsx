import React, { useState } from "react";
import "../../style/Isotope.css";

interface IsotopeLayoutPageProps {
  data: any;
}

const IsotopeLayoutPage: React.FC<IsotopeLayoutPageProps> = ({ data }) => {

  const colPos0 = data.content?.colPos0 || data.page?.content?.colPos0 || [];
  const colPos1 = data.content?.colPos1 || data.page?.content?.colPos1 || [];

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
          <div key={el.id} className="iso-intro">
            <div
              className="iso-intro-body"
              dangerouslySetInnerHTML={{ __html: el.content?.bodytext || "" }}
            />
          </div>
        ))
      )
    );

  const filteredEntries = allEntries.filter((entry: any) => {
    if (activeCategory === "all") return true;
    return entry.categories?.listCategories?.some(
      (cat: any) => cat.slug === activeCategory
    );
  });

  return (
    <div className="iso-layout-page">
      <section className="iso-intro-section">{renderBodyText()}</section>

      <nav className="iso-filter">
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

      <div className="iso-grid">
        {filteredEntries.map((entry: any) => {
          const imgUrl =
            entry.featuredImage?.[0]?.images?.defaultImage?.publicUrl;
          const title = entry.title || "Untitled";
          const detailUrl = entry.detail || "#";

          return (
            <a
              key={entry.uid}
              href={detailUrl}
              className="iso-card"
              data-title={title}
            >
              {imgUrl && <img src={imgUrl} alt={title} />}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default IsotopeLayoutPage;
