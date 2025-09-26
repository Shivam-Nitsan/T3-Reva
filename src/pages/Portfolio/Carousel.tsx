import React from "react";
import "../../style/Isotope.css"; // ✅ reuse the same CSS

interface CarouselPageProps {
  data: any;
}

const CarouselPage: React.FC<CarouselPageProps> = ({ data }) => {
  if (!data) return <p>No data available</p>;

  const colPos0 = data.content?.colPos0 || data.page?.content?.colPos0 || [];
  const colPos1 = data.content?.colPos1 || data.page?.content?.colPos1 || [];

  const allEntries = colPos0.flatMap((block: any) => {
    if (block.content?.data?.list) {
      return block.content.data.list;
    }
    return (
      block.content?.items?.flatMap((item: any) =>
        item.contentElements?.flatMap(
          (el: any) => el.content?.data?.list || []
        )
      ) || []
    );
  });

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

  return (
    <div className="iso-layout-page">
      <section className="iso-intro-section">{renderBodyText()}</section>

      <div className="iso-grid carousel-mode">
        {allEntries.map((entry: any) => {
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

export default CarouselPage;
