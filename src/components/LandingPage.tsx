import React, { useEffect, useState } from "react";
import parse, { domToReact, type HTMLReactParserOptions } from "html-react-parser";
import "../style/LandingPage.css";
import useLazyLoad from "../hooks/useLazyLoad";
import Counter from "../hooks/Counter";

/* -------------------- Types -------------------- */
interface RotatorBlock {
  rotatorText: string;
}

interface TextRotatorContent {
  preText?: string;
  rotatorBlock?: RotatorBlock[];
}

interface LandingPageProps {
  content: any; 
}

/* ==================================================
   Landing Page Component
================================================== */
const LandingPage: React.FC<LandingPageProps> = ({ content }) => {
  /* -------------------- Hero Section -------------------- */
  const heroElements =
    content?.colPos0?.[0]?.content?.items?.[0]?.contentElements?.[0]?.content
      ?.items?.[0]?.contentElements || [];

  const textRotator: TextRotatorContent | undefined = heroElements.find(
    (el: any) => el.type === "mask_ns_text_rotator"
  )?.content;

  const headlineBlock = heroElements.find((el: any) => el.id === 2639)?.content;
  const buttonBlock = heroElements.find((el: any) => el.id === 2638)?.content;

  /* -------------------- Pre-Built Websites Section -------------------- */
  const preBuiltSection =
    content?.colPos0?.[1]?.content?.items?.[0]?.contentElements?.[0]?.content || null;

  /* -------------------- Collect Nested Elements -------------------- */
  const collectElements = (elements: any[]): any[] => {
  let result: any[] = [];
  elements.forEach((el) => {
    if (
      el.type === "ns_base_container" ||
      el.type === "ns_base_2Cols" ||
      el.type === "ns_base_3Cols" ||
      el.type === "ns_base_4Cols"
    ) {
      el.content?.items?.forEach((sub: any) => {
        result.push(...collectElements(sub.contentElements || []));
      });
    } else {
      result.push(el);
    }
  });
  return result;
};


  /* -------------------- Counters Section -------------------- */
  const section6 = content?.colPos0?.[6]?.content?.items?.[0]?.contentElements || [];
  const countersData = collectElements(section6);

  /* -------------------- State -------------------- */
  const [showAll, setShowAll] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  /* -------------------- Lazy Load -------------------- */
  const prebuiltLazy = useLazyLoad();
  const fourColsLazy = useLazyLoad();
  const countersLazy = useLazyLoad();

  /* -------------------- Text Rotator Animation -------------------- */
  useEffect(() => {
    if (textRotator?.rotatorBlock?.length && textRotator.rotatorBlock.length > 1) {
      const interval = setInterval(() => {
        setIsAnimatingOut(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % textRotator.rotatorBlock!.length);
          setIsAnimatingOut(false);
        }, 600);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [textRotator]);

  /* -------------------- HTML Parse Options -------------------- */
  const parseOptions: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      if (domNode.name === "h1") {
        return <>{domToReact(domNode.children, parseOptions)}</>;
      }

      if (domNode.name === "span" && domNode.attribs) {
        const cls = domNode.attribs.class || "";
        if (cls.includes("highlight-underline")) {
          return <span className="hero-highlight">{domToReact(domNode.children)}</span>;
        }
        if (cls.includes("secondary-color")) {
          return <span className="hero-body">{domToReact(domNode.children)}</span>;
        }
      }

      if (domNode.name === "a" && domNode.attribs?.class?.includes("btn__gradient")) {
        return (
          <a href={domNode.attribs.href} className="hero-button">
            {domToReact(domNode.children)}
          </a>
        );
      }
    },
  };

  /* -------------------- Demo Install Section -------------------- */
  const demoInstallSection =
    content?.colPos0?.[7]?.content?.items?.[0]?.contentElements || [];

  const demoText = demoInstallSection.find((el: any) => el.type === "text")?.content;
  const demoSteps = demoInstallSection.find(
    (el: any) => el.type === "mask_ns_process_steps"
  )?.content;

  /* -------------------- Content Tabs Section -------------------- */
  const contentTabsSection =
    content?.colPos0?.[8]?.content?.items?.[0]?.contentElements || [];

  const contentTabsText = contentTabsSection.find((el: any) => el.type === "text")?.content;
  const contentTabsBlock = contentTabsSection.find(
    (el: any) => el.type === "mask_ns_content_tabs"
  )?.content;

  const [activeTab, setActiveTab] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const handleTabClick = (index: number) => {
    if (index === activeTab) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveTab(index);
      setIsFading(false);
    }, 300);
  };

  /* -------------------- Products Section -------------------- */
  const productsBlock = content?.colPos0?.[9]?.content?.items?.[0]?.contentElements || [];

  const productsHeading = productsBlock.find((el: any) => el.type === "text")?.content;
  const products3Cols = productsBlock.find((el: any) => el.type === "ns_base_3Cols");

  const productCards =
    products3Cols?.content?.items?.flatMap((col: any) => col.contentElements) || [];

/* -------------------- New Section -------------------- */
const section10Raw =
  content?.colPos0?.[10]?.content?.items?.flatMap((item: any) => item.contentElements) || [];

const newSection = collectElements(section10Raw);

/* -------------------- New Section 11 -------------------- */
const section11Container = content?.colPos0?.[11];

const section11Raw =
  section11Container?.content?.items?.flatMap((item: any) => item.contentElements || []) || [];

const newSection11 = collectElements(section11Raw);

/* -------------------- New Section 12 -------------------- */
const section12Container = content?.colPos0?.[12];

const section12Raw =
  section12Container?.content?.items?.flatMap((item: any) => item.contentElements || []) || [];

const newSection12 = collectElements(section12Raw);

/* -------------------- New Section 13 -------------------- */
const section13Container = content?.colPos0?.[13];

const section13Raw =
  section13Container?.content?.items?.flatMap((item: any) => item.contentElements || []) || [];

const newSection13 = collectElements(section13Raw);

const reviewsHeading = newSection13.find((el: any) => el.type === "text")?.content?.bodytext;

const reviewsData =
  newSection13.find((el: any) => el.type === "mask_ns_reviews")?.content?.reviewBlock || [];

  /* -------------------- New Section 14 -------------------- */
const section14Container = content?.colPos0?.[14];

const section14Raw =
  section14Container?.content?.items?.flatMap((item: any) => item.contentElements || []) || [];

const newSection14 = collectElements(section14Raw);

/* -------------------- New Section 15 -------------------- */
const section15Container = content?.colPos0?.[15];

const section15Raw =
  section15Container?.content?.items?.flatMap((item: any) => item.contentElements || []) || [];

const newSection15 = collectElements(section15Raw);

const faqHeading = newSection15.find((el: any) => el.type === "text")?.content?.bodytext || "";

const faqAccordions = newSection15.filter((el: any) => el.type === "mask_ns_accordion");

const [openFaq, setOpenFaq] = useState<string | null>(null);

const toggleFaq = (id: string) => {
  setOpenFaq(openFaq === id ? null : id);
};

/* -------------------- New Section 16 -------------------- */
const section16Container = content?.colPos0?.[16];

const section16Raw =
  section16Container?.content?.items?.flatMap((item: any) => item.contentElements || []) || [];

const newSection16 = collectElements(section16Raw);

const section16Texts = newSection16.filter((el: any) => el.type === "text");


  /* ==================================================
     Render
  ================================================== */
  return (
    <>
      {/* Hero Section --> 0 */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-grid">
            <div className="hero-text">
              <h1 className="hero-title">
                {textRotator?.preText}{" "}
                <span className="hero-rotator">
                  {textRotator?.rotatorBlock && (
                    <span
                      key={currentIndex}
                      className={`hero-rotator-text ${
                        isAnimatingOut ? "animate-slide-out" : "animate-slide-in"
                      }`}
                    >
                      {textRotator.rotatorBlock[currentIndex].rotatorText}
                    </span>
                  )}
                </span>
              </h1>

              {headlineBlock?.bodytext && parse(headlineBlock.bodytext, parseOptions)}

              {buttonBlock?.bodytext && (
                <div className="hero-button-wrapper">
                  {parse(buttonBlock.bodytext, parseOptions)}
                </div>
              )}
            </div>

            <div className="hero-image-wrapper">
              <img
                src="https://t3-reva.t3planet.de/fileadmin/_processed_/1/8/csm_reva_hero_1_513e8c265d.png"
                alt="Hero Preview"
                className="hero-image"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Built Websites Section --> 1 */}
      <section ref={prebuiltLazy.ref} className="prebuilt-section">
        {prebuiltLazy.isVisible && preBuiltSection?.bodytext && (
          <div className="container">{parse(preBuiltSection.bodytext, parseOptions)}</div>
        )}
      </section>

      {/* Four Cols Section --> 2 to 5 */}
      <section ref={fourColsLazy.ref} className="fourcols-section">
        {fourColsLazy.isVisible && (
          <>
            <div className="container fourcols-grid">
              {(content?.colPos0
                ?.slice(2)
                .flatMap((section: any) =>
                  section?.content?.items?.map((item: any, idx: number) => {
                    const contentEl = item?.contentElements?.[0]?.content;
                    if (!contentEl?.contentLinkText) return null;

                    return {
                      id: `${section.id}-${idx}`,
                      href: contentEl.contentLink?.href,
                      title: contentEl.contentLinkText,
                      imageUrl: contentEl.icon?.[0]?.publicUrl || "",
                    };
                  })
                )
                .filter(Boolean) as {
                id: string;
                href: string;
                title: string;
                imageUrl: string;
              }[]).slice(
                0,
                window.innerWidth <= 768 && !showAll ? 8 : undefined
              )
                .map((card) => (
                  <a
                    key={card.id}
                    href={card.href}
                    className="fourcols-card"
                    data-title={card.title}
                  >
                    {card.imageUrl && (
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="fourcols-icon"
                        loading="lazy"
                      />
                    )}
                    <span className="fourcols-title">{card.title}</span>
                  </a>
                ))}
            </div>

            {window.innerWidth <= 768 &&
              content?.colPos0?.slice(2).length > 8 && (
                <div className="show-more-container">
                  <button
                    className="show-more-btn"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? "Show Less" : "Show More"}
                  </button>
                </div>
              )}
          </>
        )}
      </section>

      {/* Counters Section --> 6 */}
      <section ref={countersLazy.ref} className="counters-section">
        {countersLazy.isVisible && (
          <div className="container counters-grid">
            <div className="counters-left">
              {countersData[0]?.type === "text" && (
                <div className="counters-text">
                  {parse(countersData[0].content?.bodytext || "", parseOptions)}
                </div>
              )}

              <div className="counters-row">
                {countersData.map((el: any, idx: number) => {
                  if (el.type === "mask_ns_counters") {
                    const nextEl = countersData[idx + 1];
                    const description =
                      nextEl?.type === "text" ? nextEl.content?.bodytext : "";

                    return (
                      <div key={el.id} className="counter-box">
                        <h3 className="counter-value">
                          <Counter
                            value={parseInt(el.content.counterData)}
                            suffix={el.content.counterAppendeg}
                            start={countersLazy.isVisible}
                          />
                        </h3>
                        <p className="counter-label">{el.content.header}</p>
                        {description && (
                          <div className="counter-desc">
                            {parse(description, parseOptions)}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            <div className="counters-right">
              {countersData.map((el: any) => {
                if (el.type === "image" && el.content?.gallery?.rows) {
                  const firstRow = el.content.gallery.rows["1"];
                  const firstColumn = firstRow?.columns?.["1"];
                  const imageUrl = firstColumn?.publicUrl;

                  if (imageUrl) {
                    return (
                      <div key={el.id} className="counters-image">
                        <img src={imageUrl} alt="Counters Illustration" loading="lazy" />
                      </div>
                    );
                  }
                }
                return null;
              })}
            </div>
          </div>
        )}
      </section>

      {/* Demo Install Section --> 7 */}
      <section className="demo-install-section">
        <div className="container">
          {demoText?.bodytext && (
            <div className="demo-text">{parse(demoText.bodytext, parseOptions)}</div>
          )}
          {demoSteps?.processBlock && (
            <div className="demo-steps">
              {demoSteps.processBlock.map((step: any, idx: number) => (
                <div key={idx} className="demo-step">
                  <div className="demo-step-number">{step.processNumber}</div>
                  <div className="demo-step-text">
                    {parse(step.processText || "", parseOptions)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content Tabs Section --> 8 */}
<section className="content-tabs-section">
  <div className="container">
    {contentTabsText?.bodytext && (
      <div className="content-tabs-text">
        {parse(contentTabsText.bodytext, parseOptions)}
      </div>
    )}

    {/* Desktop Tabs */}
    {contentTabsBlock?.contentTabBlock && (
      <div className="tabs-desktop">
        <div className="tabs-wrapper">
          {contentTabsBlock.contentTabBlock.map((tab: any, idx: number) => (
            <button
              key={idx}
              className={`tab-button ${activeTab === idx ? "active" : ""}`}
              onClick={() => handleTabClick(idx)}
            >
              {tab.contentTabText}
            </button>
          ))}
        </div>

        {contentTabsBlock.contentTabBlock?.[activeTab] && (
          <div
            className={`tab-content-wrapper ${isFading ? "fade-out" : "fade-in"}`}
          >
            <div className="tab-content-left">
              {parse(
                contentTabsBlock.contentTabBlock[activeTab].contentBlock?.[0]
                  ?.contentText || "",
                parseOptions
              )}
            </div>
            <div className="tab-content-right">
              {contentTabsBlock.contentTabBlock[activeTab].contentBlock?.[0]
                ?.contentImage?.[0]?.publicUrl && (
                <img
                  src={
                    contentTabsBlock.contentTabBlock[activeTab].contentBlock[0]
                      .contentImage[0].publicUrl
                  }
                  alt={contentTabsBlock.contentTabBlock[activeTab].contentTabText}
                  loading="lazy"
                />
              )}
            </div>
          </div>
        )}
      </div>
    )}

    {/* Mobile Accordion */}
    {contentTabsBlock?.contentTabBlock && (
      <div className="tabs-mobile">
        {contentTabsBlock.contentTabBlock.map((tab: any, idx: number) => {
          const isOpen = activeTab === idx;
          return (
            <div key={idx} className={`mobile-item ${isOpen ? "open" : ""}`}>
              <button
                className="mobile-header"
                onClick={() =>
                  setActiveTab(isOpen ? -1 : idx) 
                }
              >
                {tab.contentTabText}
                <span className="mobile-icon">{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <div className="mobile-content">
                  <div className="mobile-text">
                    {parse(tab.contentBlock?.[0]?.contentText || "", parseOptions)}
                  </div>
                  {tab.contentBlock?.[0]?.contentImage?.[0]?.publicUrl && (
                    <div className="mobile-image">
                      <img
                        src={tab.contentBlock[0].contentImage[0].publicUrl}
                        alt={tab.contentTabText}
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
  </div>
</section>


      {/* Products Section --> 9*/}
      <section className="products-section">
        <div className="container">
          {productsHeading?.bodytext && (
            <div className="products-heading">
              {parse(productsHeading.bodytext, parseOptions)}
            </div>
          )}
          <div className="products-grid">
            {productCards.map((card: any) => {
              if (card.type === "mask_ns_icon_box") {
                const data = card.content;
                return (
                  <a
                    key={card.id}
                    href={data.link?.href}
                    target={data.link?.target || "_self"}
                    rel={data.link?.additionalAttributes?.rel || "noreferrer"}
                    className="product-card"
                  >
                    {data.icon?.[0]?.publicUrl && (
                      <img
                        src={data.icon[0].publicUrl}
                        alt={data.iconTitle}
                        className="product-icon"
                        loading="lazy"
                      />
                    )}
                    <h3 className="product-title">{data.header}</h3>
                    <p className="product-text">{data.text}</p>
                    {data.linkText && <span className="product-link">{data.linkText}</span>}
                  </a>
                );
              }
              return null;
            })}
          </div>
        </div>
      </section>

 {/* New Section --> 10 */}
<section className="new-section">
  <div className="container">
    {/* Left Column */}
    <div className="new-left">
      {newSection.find((el: any) => el.type === "text") && (
        <>
          
            {parse(
              newSection.find((el: any) => el.type === "text")?.content?.header || "",
              parseOptions
            )}
          
          <div className="new-subtext">
            {parse(
              newSection.find((el: any) => el.type === "text")?.content?.bodytext || "",
              parseOptions
            )}
          </div>
        </>
      )}

      <div className="new-features">
        {newSection
          .filter((el: any) => el.type === "mask_ns_icon_box")
          .map((el: any) => {
            const data = el.content;
            return (
              <div key={el.id} className="new-feature">
                {data.icon?.[0]?.publicUrl && (
                  <img
                    src={data.icon[0].publicUrl}
                    alt={data.iconTitle}
                    loading="lazy"
                  />
                )}
                <h3>{data.header}</h3>
                <div className="new-feature-text">
                  {parse(data.text || "", parseOptions)}
                </div>
              </div>
            );
          })}
      </div>
    </div>

    <div className="new-right">
      {newSection
        .filter((el: any) => el.type === "mask_ns_photo_group")
        .flatMap((el: any) => el.content.image)
        .map((img: any, idx: number) => (
          <img
            key={idx}
            src={img.publicUrl}
            alt={img.properties?.title || "Mockup"}
            className={`new-mockup ${idx === 0 ? "front" : "back"}`}
            loading="lazy"
          />
        ))}
    </div>
  </div>
</section>

{/* New Section --> 11 */}
<section className="new-section-11">
  <div className="container">
    {newSection11
      .filter((el: any) => el.type === "text")
      .map((el: any) => (
        <div key={el.id} className="new11-text">
          {parse(el.content?.header || "", parseOptions)}
          {parse(el.content?.bodytext || "", parseOptions)}
        </div>
      ))}

    <div className="new11-features">
      {newSection11
        .filter((el: any) => el.type === "mask_ns_featured_boxes")
        .map((el: any) => {
          const data = el.content;
          return (
            <div key={el.id} className="new11-feature">
              {data.image?.[0]?.publicUrl && (
                <img
                  src={data.image[0].publicUrl}
                  alt={data.image[0]?.properties?.title || ""}
                  loading="lazy"
                />
              )}
              <div className="new11-feature-text">
                {parse(data.featuredText || "", parseOptions)}
              </div>
            </div>
          );
        })}
    </div>
  </div>
</section>

{/* New Section --> 12 */}
<section className="new-section-12">
  <div className="container">
    {newSection12
      .filter((el: any) => el.type === "text")
      .map((el: any) => (
        <div key={el.id} className="new12-text">
          {parse(el.content?.bodytext || "", parseOptions)}
        </div>
      ))}

    <div className="new12-grid">
      {newSection12
        .filter((el: any) => el.type === "mask_ns_icon_box")
        .map((el: any) => {
          const data = el.content;
          return (
            <div key={el.id} className="new12-card">
              {data.icon?.[0]?.publicUrl && (
                <img
                  src={data.icon[0].publicUrl}
                  alt={data.iconTitle}
                  className="new12-icon"
                  loading="lazy"
                />
              )}
              <h3 className="new12-title">{data.header}</h3>
              <p className="new12-desc">{data.text}</p>
            </div>
          );
        })}
    </div>
  </div>
</section>

{/* New Section --> 13 */}
<section className="new-section-13">
  <div className="container">
    {reviewsHeading && (
      <div className="reviews-heading">
        {parse(reviewsHeading, parseOptions)}
      </div>
    )}

    <div className="reviews-track">
  {reviewsData.concat(reviewsData).map((review: any, idx: number) => {
    const rating = parseFloat(review.reviewStar);
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div key={idx} className="review-card">
        <div className="review-header">
          <div className="review-author">
            <strong>{review.reviewName}</strong>
            <span className="review-designation">{review.reviewDesignation}</span>
          </div>
          <div className="review-rating">
            <span className="rating-value">{rating.toFixed(1)}</span>
            <span className="review-stars">
              {"★".repeat(fullStars)}
              {halfStar && <span className="half-star">★</span>}
              {"☆".repeat(emptyStars)}
            </span>
          </div>
        </div>

        <p className="review-text">"{review.reviewText}"</p>
      </div>
    );
  })}
</div>

  </div>
</section>

{/* New Section --> 14 */}
<section className="new-section-14">
  <div className="container">
    {newSection14
      .filter((el: any) => el.type === "text")
      .map((el: any) => (
        <div key={el.id} className="new14-text">
          {parse(el.content?.bodytext || "", parseOptions)}
        </div>
      ))}

    <div className="new14-grid">
      {newSection14
        .filter((el: any) => el.type === "mask_ns_icon_box")
        .map((el: any) => {
          const data = el.content;
          return (
            <div key={el.id} className="new14-card">
              {data.icon?.[0]?.publicUrl && (
                <img
                  src={data.icon[0].publicUrl}
                  alt={data.iconTitle}
                  className="new14-icon"
                  loading="lazy"
                />
              )}
              <h3 className="new14-title">{data.header}</h3>
              <p className="new14-text-block">{data.text}</p>

              {data.listBlock && (
                <ul className="new14-list">
                  {data.listBlock.map((li: any, idx: number) => (
                    <li key={idx}>{li.list}</li>
                  ))}
                </ul>
              )}

              {data.linkText && (
                <a
                  href={data.link?.href}
                  target={data.link?.target || "_self"}
                  rel={data.link?.additionalAttributes?.rel || "noreferrer"}
                  className="hero-button"
                >
                  {data.linkText}
                </a>
              )}
            </div>
          );
        })}
    </div>
  </div>
</section>

{/* New Section --> 15 (FAQ) */}
<section className="new-section-15">
  <div className="container">
    {faqHeading && (
      <div className="faq-heading">
        {parse(faqHeading, parseOptions)}
      </div>
    )}
<div className="faq-grid">
  {faqAccordions.map((accordion: any, accIdx: number) => (
    <div key={accIdx} className="faq-column">
      {accordion.content?.accordionItem?.map((item: any, idx: number) => {
        const id = `${accIdx}-${idx}`;
        const isOpen = openFaq === id;
        return (
          <div
            key={id}
            className={`faq-item ${isOpen ? "open" : ""}`}
            onClick={() => toggleFaq(id)}
          >
            <div className="faq-question">
              {item.title}
              <span className="faq-icon">{isOpen ? "−" : "+"}</span>
            </div>
            <div
              className="faq-answer"
              style={{
                maxHeight: isOpen ? "1000px" : "0px", 
              }}
            >
              <div className="faq-answer-inner">
                {parse(item.content || "", parseOptions)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ))}
</div>

  </div>
</section>

{/* New Section --> 16 */}
<section className="new-section-16">
  <div className="container">
    {section16Texts.map((el: any) => (
      <div key={el.id} className="new16-block">
        {parse(el.content?.bodytext || "", parseOptions)}
      </div>
    ))}
  </div>
</section>


    </>
  );
};

export default LandingPage;
