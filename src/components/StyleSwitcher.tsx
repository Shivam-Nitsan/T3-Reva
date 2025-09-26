import React, { useEffect, useState } from "react";
import styles from "../style/StyleSwitcher.module.css";
import { getMyData } from "../api/api";

interface ThemeSetting {
  label: string;
  value: string;
  type: string;
  labelValueArray?: { label: string; value: string; selected?: boolean }[];
  trueValue?: string;
}

const StyleSwitcher: React.FC = () => {
  const [themeSettings, setThemeSettings] = useState<Record<string, ThemeSetting>>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getMyData("/", "remote"); 
        const settings = data?.page?.constants?.ns_style || {};

        if (!settings || Object.keys(settings).length === 0) {
          console.warn("No style settings found");
          return;
        }

        setThemeSettings(settings);

        Object.keys(settings).forEach((key) => {
          if (settings[key].type === "color") {
            document.documentElement.style.setProperty(`--${key}`, settings[key].value);
          }
        });

        if (settings.bg_dark?.value === settings.bg_dark?.trueValue) {
          document.body.classList.add("dark-mode");
          document.documentElement.style.setProperty(
            "--background_color",
            settings.secondary_color?.value || "#61dcdf"
          );
        } else {
          document.documentElement.style.setProperty("--background_color", "#ffffff");
        }

        if (settings.boxed_layout?.value === settings.boxed_layout?.trueValue) {
          document.body.classList.add("boxed-layout");
        }
      } catch (error) {
        console.error("Error fetching theme settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    const setting = themeSettings[key];

    if (!setting) return;

    if (setting.type === "color") {
      document.documentElement.style.setProperty(`--${key}`, value);
    }

    if (key === "bg_dark") {
      if (value === (setting.trueValue || "1")) {
        document.body.classList.add("dark-mode");
        document.documentElement.style.setProperty(
          "--background_color",
          themeSettings.secondary_color?.value || "#61dcdf"
        );
      } else {
        document.body.classList.remove("dark-mode");
        document.documentElement.style.setProperty("--background_color", "#ffffff");
      }
    }

    if (key === "boxed_layout") {
      if (value === (setting.trueValue || "1")) {
        document.body.classList.add("boxed-layout");
        document.body.classList.remove("wide-layout");
      } else {
        document.body.classList.remove("boxed-layout");
        document.body.classList.add("wide-layout");
      }
    }

    if (key === "enable_search") {
      document.body.setAttribute("data-search", value === "1" ? "on" : "off");
    }

    if (key === "enable_language") {
      document.body.setAttribute("data-language", value === "1" ? "on" : "off");
    }

    if (key === "page_stripe_option") {
      document.body.setAttribute("data-stripe", value === "1" ? "on" : "off");
    }

    window.dispatchEvent(new CustomEvent("themeChange", { detail: { key, value } }));

    setThemeSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  const renderField = (key: string, setting: ThemeSetting) => {
    if (setting.type === "color") {
      return (
        <label key={key} className={styles.field}>
          {setting.label}
          <input
            type="color"
            value={setting.value}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        </label>
      );
    }

    if (setting.type === "options" && setting.labelValueArray) {
      return (
        <label key={key} className={styles.field}>
          {setting.label}
          <select
            value={setting.value}
            onChange={(e) => handleChange(key, e.target.value)}
          >
            {setting.labelValueArray.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      );
    }

    if (setting.type === "boolean") {
      const isChecked = setting.value === (setting.trueValue || "1");
      return (
        <div key={key} className={styles.field}>
          <div className={styles.toggleGroup}>
            <button
              type="button"
              className={isChecked ? styles.activeBtn : ""}
              onClick={() => handleChange(key, setting.trueValue || "1")}
            >
              Show
            </button>
            <button
              type="button"
              className={!isChecked ? styles.activeBtn : ""}
              onClick={() => handleChange(key, "0")}
            >
              Hide
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <button className={styles.gearBtn} onClick={() => setIsOpen(!isOpen)}>
        ⚙
      </button>

      {isOpen && (
        <div className={styles.switcher}>
          <h3>Theme Color</h3>
          {["primary_color", "secondary_color", "text_color", "teritory_color", "gray_color"].map(
            (key) => themeSettings[key] && renderField(key, themeSettings[key])
          )}

          <h3>Header Menu</h3>
          {themeSettings.headerLayout && renderField("headerLayout", themeSettings.headerLayout)}

          <h3>Footer Menu</h3>
          {themeSettings.footerLayout && renderField("footerLayout", themeSettings.footerLayout)}

          <h3>Main Font Family</h3>
          {themeSettings.site_font_family_name &&
            renderField("site_font_family_name", themeSettings.site_font_family_name)}

          <h3>Layouts Switcher</h3>
          {themeSettings.boxed_layout && renderField("boxed_layout", themeSettings.boxed_layout)}

          <h3>Background Color</h3>
          {themeSettings.bg_dark && renderField("bg_dark", themeSettings.bg_dark)}

          <h3>Search Type</h3>
          {themeSettings.enable_search && renderField("enable_search", themeSettings.enable_search)}

          <h3>Language Type</h3>
          {themeSettings.enable_language && renderField("enable_language", themeSettings.enable_language)}

          <h3>Page Stripe</h3>
          {themeSettings.page_stripe_option &&
            renderField("page_stripe_option", themeSettings.page_stripe_option)}

          <div className={styles.actions}>
            <button type="button" onClick={() => alert("✅ Settings Applied")}>
              Submit
            </button>
            <button type="button" onClick={() => window.location.reload()}>
              Reset
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StyleSwitcher;
