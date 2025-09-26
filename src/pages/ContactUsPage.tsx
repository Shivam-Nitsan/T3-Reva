import React from "react";
import parse from "html-react-parser";
import "../style/contactus.css"

interface ContactUsPageProps {
  data: any;
}

/* -------------------- Helpers -------------------- */
const collectElements = (node: any): any[] => {
  if (!node) return [];

  if (
    ["text", "form_formframework", "mask_ns_map", "mask_ns_icon_box"].includes(
      node.type
    )
  ) {
    return [node];
  }

  if (node.type?.startsWith("ns_base_")) {
    return (
      node.content?.items?.flatMap((i: any) =>
        (i.contentElements || []).flatMap((el: any) => collectElements(el))
      ) || []
    );
  }

  return [];
};

/* -------------------- Renderers -------------------- */
const renderText = (el: any) => {
  if (!el?.content?.bodytext) return null;
  return (
    <div key={el.id} className="contact-text">
      {parse(el.content.bodytext)}
    </div>
  );
};

const placeholderMap: Record<string, string> = {
  text: "Enter your name",
  email: "Enter your email",
  textarea: "Write your message",
};

const renderForm = (el: any) => {
  const form = el.content?.form;
  const header = el.content?.form_additional?.header;
  const subheader = el.content?.form_additional?.subheader;
  const submitLabel =
    el.content?.form_additional?.renderingOptions?.submitButtonLabel || "Submit";

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formEl = e.currentTarget;

  const inputs = formEl.querySelectorAll<
    HTMLInputElement | HTMLTextAreaElement
  >("input, textarea");

  formEl.querySelectorAll(".error-message").forEach((el) => el.remove());
  formEl.querySelectorAll(".error").forEach((el) => el.classList.remove("error"));

  let valid = true;

inputs.forEach((input) => {
  if (input.type === "hidden") return;

  if (input instanceof HTMLInputElement && input.type === "checkbox") {
    if (!input.checked) {
      const error = document.createElement("p");
      error.className = "error-message";
      error.innerText = "You must agree before submitting.";
      input.parentElement?.insertAdjacentElement("afterend", error);
      input.classList.add("error");
      valid = false;
    }
    return;
  }

  if (!input.value.trim()) {
    const error = document.createElement("p");
    error.className = "error-message";
    error.innerText = "This field is required.";
    input.insertAdjacentElement("afterend", error);
    input.classList.add("error");
    valid = false;
    return;
  }

  if (
    input instanceof HTMLInputElement &&
    input.type === "email" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)
  ) {
    const error = document.createElement("p");
    error.className = "error-message";
    error.innerText = "Please enter a valid email.";
    input.insertAdjacentElement("afterend", error);
    input.classList.add("error");
    valid = false;
  }
});


  if (valid) {
    alert("Form submitted successfully!");
    formEl.reset();
  }
};



  const fields = [...(form?.elements || [])].sort((a, b) =>
    a.type === "checkbox" ? -1 : b.type === "checkbox" ? 1 : 0
  );

  return (
    <div key={el.id} className="contact-form-wrapper">
      {header && <h3 className="form-header">{header}</h3>}
      {subheader && <p className="form-subheader">{subheader}</p>}
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        {fields.map((field: any, idx: number) => {
          const name = field.identifier || `field-${idx}`;
          const placeholder =
            placeholderMap[field.type?.toLowerCase()] || placeholderMap.default;

          if (field.type === "checkbox") {
            return (
              <div key={idx} className="form-field checkbox-field">
                <label>
                  <input type="checkbox" id={name} name={name} />{" "}
                  {field.label || "I agree"}
                </label>
              </div>
            );
          }

          if (field.type === "textarea") {
            return (
              <div key={idx} className="form-field">
                {field.label && <label htmlFor={name}>{field.label}</label>}
                <textarea
                  id={name}
                  name={name}
                  placeholder={placeholder}
                  className="form-input"
                />
              </div>
            );
          }

          return (
            <div key={idx} className="form-field">
              {field.label && <label htmlFor={name}>{field.label}</label>}
              <input
                id={name}
                type={field.type?.toLowerCase() || "text"}
                name={name}
                placeholder={placeholder}
                className="form-input"
              />
            </div>
          );
        })}
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
      </form>
    </div>
  );
};

/* -------------------- Other Renders (Map + Icon Box) -------------------- */
const renderMap = (el: any) => {
  const mapUrl = el.content?.mapFrame?.href;
  if (!mapUrl) return null;
  return (
    <div key={el.id} className="contact-map">
      <iframe
        src={mapUrl}
        width="100%"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        title="Google Map"
      />
    </div>
  );
};

const renderIconBox = (el: any) => {
  const iconUrl = el.content?.icon?.[0]?.publicUrl;
  const header = el.content?.header || el.content?.iconTitle;
  const text = el.content?.text;

  return (
    <div key={el.id} className="icon-box">
      {iconUrl && (
        <div className="icon">
          <img src={iconUrl} alt={header} />
        </div>
      )}
      {header && <h4>{header}</h4>}
      {text && <p>{text}</p>}
    </div>
  );
};

/* -------------------- Main -------------------- */
const ContactUsPage: React.FC<ContactUsPageProps> = ({ data }) => {
  if (!data) return <p>No data available</p>;

  const colPos0 = data.content?.colPos0 || [];
  const colPos1 = data.content?.colPos1 || [];

  const intro = colPos1
    .flatMap((sec: any) => collectElements(sec))
    .filter((el: any) => el.type === "text" && el.content?.bodytext);

  const allColPos0 = colPos0.flatMap((sec: any) => collectElements(sec));

  const newsletterText = allColPos0.find(
    (el: any) =>
      el.type === "text" &&
      el.content?.bodytext?.includes("Subscribe to our newsletter")
  );
  const newsletterForm = allColPos0.find(
    (el: any) =>
      el.type === "form_formframework" &&
      el.content?.form_additional?.identifier === "newsletter"
  );

  const mapHeading = allColPos0.find(
    (el: any) =>
      el.type === "text" &&
      el.content?.bodytext?.includes("Google map with contact form")
  );
  const map = allColPos0.find((el: any) => el.type === "mask_ns_map");
  const mapForm = allColPos0.find(
    (el: any) =>
      el.type === "form_formframework" &&
      el.content?.form_additional?.identifier === "contactus" &&
      el.id === 1453
  );

  const contactHeading = allColPos0.find(
    (el: any) =>
      el.type === "text" &&
      el.content?.bodytext?.includes("Contact form with icon boxes")
  );
  const contactForm = allColPos0.find(
    (el: any) =>
      el.type === "form_formframework" &&
      el.content?.form_additional?.identifier === "contactus" &&
      el.id === 1418
  );
  const iconBoxes = allColPos0.filter((el: any) => el.type === "mask_ns_icon_box");

  return (
    <div className="contact-us-page">
      {intro.length > 0 && (
        <section className="contact-section intro-section">
          <div className="container">{intro.map((el: any) => renderText(el))}</div>
        </section>
      )}

      {(newsletterText || newsletterForm) && (
        <section className="contact-section newsletter-section">
          <div className="container newsletter-layout">
            <div>{newsletterText && renderText(newsletterText)}</div>
            <div>{newsletterForm && renderForm(newsletterForm)}</div>
          </div>
        </section>
      )}

      {(mapHeading || map || mapForm) && (
        <section className="contact-section map-section">
          <div className="container">
            {mapHeading && renderText(mapHeading)}
            <div className="map-layout">
              {map && renderMap(map)}
              {mapForm && renderForm(mapForm)}
            </div>
          </div>
        </section>
      )}

      {(contactHeading || contactForm || iconBoxes.length > 0) && (
        <section className="contact-section contactus-section">
          {contactHeading && renderText(contactHeading)}
          <div className="container contactus-layout">
            <div className="icon-boxes">
              {iconBoxes.map((box: any) => renderIconBox(box))}
            </div>
            <div>{contactForm && renderForm(contactForm)}</div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ContactUsPage;