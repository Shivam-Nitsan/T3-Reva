import React from "react";
import "../style/Footer.css";

interface FooterProps {
  footerBlocks: any[];
  footerNavigation: any[];
}

const Footer: React.FC<FooterProps> = ({ footerBlocks, footerNavigation }) => {
  if (!footerBlocks || footerBlocks.length === 0) {
    return null;
  }

  const block = footerBlocks[0]; 
  const fourCols = block.content?.items?.[0]?.contentElements?.[0]; 
  const columns = fourCols?.content?.items || [];

  return (
    <footer className="footer">
      <div className="footer-header">
        {footerNavigation?.length > 0 && (
          <div className="footer-topnav">
            {footerNavigation.map((link: any) => (
              <a key={link.title} href={link.link || "#"}>
                {link.title}
              </a>
            ))}
          </div>
        )}
        
        <div className="footer-social">
          <a href="#" aria-label="X (Twitter)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="#" aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-main">
        <div className="footer-brand">
          {columns[0]?.contentElements?.map((el: any) => {
            if (el.type === "image") {
              const imageUrl =
                el.content?.gallery?.rows?.[1]?.columns?.[1]?.publicUrl;
              return (
                <img key={el.id} src={imageUrl} alt="Brand" />
              );
            }
            if (el.type === "text") {
              return (
                <p key={el.id}
                   dangerouslySetInnerHTML={{ __html: el.content?.bodytext }} />
              );
            }
            return null;
          })}
        </div>

        <div className="footer-links">
          {columns.slice(1, 3).map((col: any, idx: number) => {
            const menu = col.contentElements?.[0];
            return (
              <div className="footer-section" key={idx}>
                <h4>{menu?.content?.header}</h4>
                <ul>
                  {menu?.content?.menu?.map((item: any, i: number) => (
                    <li key={i}>
                      <a href={item.link}>{item.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="footer-newsletter">
          {columns[3]?.contentElements?.map((el: any) => {
            if (el.type === "form_formframework") {
              const header =
                el.content?.form_additional?.header || "Subscribe to Our Newsletter";
              const fields = el.content?.form?.elements || [];
              const actionUrl = el.content?.link?.href;

              const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

              const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                setStatus("loading");

                const formData = new FormData(e.currentTarget);

                try {
                  const res = await fetch(actionUrl, {
                    method: "POST",
                    body: formData,
                  });

                  if (res.ok) {
                    setStatus("success");
                    e.currentTarget.reset();
                  } else {
                    throw new Error("Submission failed");
                  }
                } catch (err) {
                  console.error("Newsletter error:", err);
                  setStatus("error");
                }
              };

              return (
                <div key={el.id}>
                  <h4>{header}</h4>
                  <form onSubmit={handleSubmit} className="newsletter-form">
                    <div className="newsletter-input-row">
                      {fields.map((field: any, idx: number) => {
                        if (field.type === "Email") {
                          return (
                            <input
                              key={idx}
                              type="email"
                              name={field.name}
                              placeholder={
                                field.properties?.fluidAdditionalAttributes?.placeholder ||
                                "Enter your email"
                              }
                              required={!!field.properties?.fluidAdditionalAttributes?.required}
                            />
                          );
                        }
                        if (field.type === "Hidden") {
                          return (
                            <input
                              key={idx}
                              type="hidden"
                              name={field.name}
                              value={field.defaultValue || ""}
                            />
                          );
                        }
                        return null;
                      })}
                      
                      <button type="submit" disabled={status === "loading"}>
                        {status === "loading" ? "Subscribing..." :
                          el.content?.form_additional?.renderingOptions?.submitButtonLabel || "Subscribe"}
                      </button>
                    </div>

                    {fields.map((field: any, idx: number) => {
                      if (field.type === "Checkbox") {
                        return (
                          <label key={idx} className="footer-newsletter-consent">
                            <input
                              type="checkbox"
                              name={field.name}
                              required={!!field.properties?.fluidAdditionalAttributes?.required}
                            />
                            {field.label}
                          </label>
                        );
                      }
                      return null;
                    })}

                    {status === "success" && (
                      <p className="newsletter-success">🎉 Thanks for subscribing!</p>
                    )}
                    {status === "error" && (
                      <p className="newsletter-error">⚠ Something went wrong. Try again.</p>
                    )}
                  </form>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      <div className="footer-copyright">
        © {new Date().getFullYear()} T3 - Reva by T3Planet with Love. All Right Reserved.
      </div>
    </footer>
  );
};

export default Footer;