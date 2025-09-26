import React from "react";
import "../../style/PortfolioGrid.css";

interface PortfolioGridProps {
  data: any;
}

const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  let date: Date;
  if (dateStr.includes("-") && dateStr.length === 8) {
    const [day, month, year] = dateStr.split("-");
    const fullYear = year.length === 2 ? `20${year}` : year;
    date = new Date(`${fullYear}-${month}-${day}`);
  } else {
    date = new Date(dateStr);
  }

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${month} ${day}${getOrdinalSuffix(day)} ${year}`;
};

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ data }) => {
  const blogList: any[] = [];
  if (data?.content?.colPos0?.length) {
    data.content.colPos0.forEach((colBlock: any) => {
      colBlock?.content?.items?.forEach((item: any) => {
        item?.contentElements?.forEach((ce: any) => {
          const list = ce?.content?.data?.list || [];
          blogList.push(...list);
        });
      });
    });
  }

  const introContent =
    data?.content?.colPos1?.[0]?.content?.items?.[0]?.contentElements?.[0]?.content?.bodytext ||
    "";

  return (
    <section className="portfolio-grid">
      {introContent && (
        <div
          className="intro"
          dangerouslySetInnerHTML={{ __html: introContent }}
        />
      )}

      {blogList.length > 0 ? (
        <div className="grid">
          {blogList.map((post: any) => {
            const imageUrl =
              post?.featuredImage?.[0]?.images?.defaultImage?.publicUrl || "";
            const category =
              post?.categories?.listCategories?.[0]?.title || "Uncategorized";
            const publishDate = formatDate(post?.publishDate);
            const author = post?.authors?.listAuthors?.[0]?.name || "Admin";
            const commentsCount = post?.comments?.listComments?.length || 0;

            return (
              <div key={post.uid} className="blog-card">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={post.title}
                    className="blog-image"
                  />
                )}
                <div className="card-body">
                  <span className="category-badge">{category}</span>

                  <h3 className="title">
                    <a href={post.detail}>{post.title}</a>
                  </h3>

                  <div className="meta">
                    <span className="meta-item">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 1024 1024"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                        <path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"></path>
                      </svg>
                      {publishDate}
                    </span>

                    <span className="meta-item">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="Keyboard">
                          <g>
                            <path d="M19.437,18.5H4.562a2.5,2.5,0,0,1-2.5-2.5V8a2.5,2.5,0,0,1,2.5-2.5H19.437a2.5,2.5,0,0,1,2.5,2.5v8A2.5,2.5,0,0,1,19.437,18.5ZM4.562,6.5A1.5,1.5,0,0,0,3.062,8v8a1.5,1.5,0,0,0,1.5,1.5H19.437a1.5,1.5,0,0,0,1.5-1.5V8a1.5,1.5,0,0,0-1.5-1.5Z"></path>
                            <path d="M5.548,16.5h12.9a.5.5,0,0,0,0-1H5.548a.5.5,0,0,0,0,1Z"></path>
                          </g>
                        </g>
                      </svg>
                      {author}
                    </span>

                    <span className="meta-item">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 1024 1024"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M464 512a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm200 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm-400 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 0 0-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 0 0-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 0 0 112 714v152a46 46 0 0 0 46 46h152.1A449.4 449.4 0 0 0 510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 0 0 142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"></path>
                      </svg>
                      {commentsCount}
                    </span>
                  </div>

                  <p className="description">{post.description}</p>
                  
                  <a href={post.detail} className="read-more">
                    Read More 
                  </a>
                  </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-posts">⚠ No blog posts found</p>
      )}
    </section>
  );
};

export default PortfolioGrid;
