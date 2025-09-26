import React, { useEffect, useState } from "react";
import "../style/Header.css";
import { Search, X, Menu, ChevronDown } from "lucide-react";

interface NavItem {
  title: string;
  link: string;
  target?: string;
  active?: number;
  children?: NavItem[];
}

interface HeaderProps {
  data: {
    mainNavigation: NavItem[];
  };
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

const Header: React.FC<HeaderProps> = ({ data }) => {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [openMobileKey, setOpenMobileKey] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 991px)");

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  if (!data || !Array.isArray(data.mainNavigation)) return null;

  const handleMouseEnter = (idx: number) => setOpenMenu(idx);
  const handleMouseLeave = () => setOpenMenu(null);

  const toggleMobileKey = (key: string) => {
    setOpenMobileKey((prev) => (prev === key ? null : key));
  };

  const renderMobileChildren = (items: NavItem[], parentKey: string | number) => (
    <ul className="mobile-submenu">
      {items.map((it, i) => {
        const key = `${parentKey}-${i}`;
        const hasChildren = Array.isArray(it.children) && it.children.length > 0;
        return (
          <li key={key} className={`mobile-sub-item ${openMobileKey === key ? "open" : ""}`}>
            <div className="mobile-sub-item-row">
              <a
                href={it.link}
                target={it.target || "_self"}
                onClick={() => setIsMobileOpen(false)}
              >
                {it.title}
              </a>
              {hasChildren && (
                <button
                  aria-expanded={openMobileKey === key ? "true" : "false"}
                  className="mobile-expand"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMobileKey(key);
                  }}
                >
                  <ChevronDown size={16} className={`chev ${openMobileKey === key ? "open" : ""}`} />
                </button>
              )}
            </div>
            {hasChildren && openMobileKey === key && renderMobileChildren(it.children!, key)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <a href="/">
            <img
              src="https://t3-reva.t3planet.com/fileadmin/ns_theme_t3reva/Logo/T3_Reva_Final_Logo.svg"
              alt="T3 REVA"
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          <ul>
            {data.mainNavigation.map((item, idx) => (
              <li
                key={idx}
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={handleMouseLeave}
                className={`${item.children ? "has-children" : ""} ${
                  item.title === "Elements" ? "active" : ""
                }`}
              >
                <a href={item.link} target={item.target || "_self"}>
                  {item.title}
                </a>

                {/* Mega menu */}
                {item.title === "Elements" && item.children && openMenu === idx && (
                  <div className="mega-menu">
                    <div className="mega-menu-content">
                      {item.children.map((category, cIdx) => (
                        <div className="mega-category" key={cIdx}>
                          <h4>{category.title}</h4>
                          {category.children && (
                            <div className="mega-items">
                              {category.children.map((menuItem, mIdx) => (
                                <div className="mega-item" key={mIdx}>
                                  <a href={menuItem.link} target={menuItem.target || "_self"}>
                                    {menuItem.title}
                                  </a>
                                  {menuItem.children && (
                                    <div className="mega-sub-items">
                                      {menuItem.children.map((subItem, sIdx) => (
                                        <a
                                          key={sIdx}
                                          href={subItem.link}
                                          target={subItem.target || "_self"}
                                        >
                                          {subItem.title}
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.title !== "Elements" && item.children && openMenu === idx && (
                  <ul className="submenu">
                    {item.children.map((sub, sIdx) => (
                      <li key={sIdx}>
                        <a href={sub.link} target={sub.target || "_self"}>
                          {sub.title}
                        </a>
                        {sub.children && (
                          <ul className="sub-submenu">
                            {sub.children.map((ssc, ssIdx) => (
                              <li key={ssIdx}>
                                <a href={ssc.link} target={ssc.target || "_self"}>
                                  {ssc.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <div className="action-item">
            {isSearchOpen ? (
              <X className="icon-btn" onClick={() => setIsSearchOpen(false)} />
            ) : (
              <Search className="icon-btn" onClick={() => setIsSearchOpen(true)} />
            )}
            {isSearchOpen && (
              <div className="search-dropdown">
                <div className="search-box">
                  <input type="text" placeholder="Search ..." />
                  <Search className="icon-btn" />
                </div>
              </div>
            )}
          </div>

          <div className="action-item">
            <img
              onClick={() => setIsLangOpen(!isLangOpen)}
              src="https://t3-reva.vercel.app/_next/static/media/US.89d51ae2.png"
              className="lang-flag"
              alt="lang"
            />
            {isLangOpen && (
              <div className="lang-dropdown">
                <img
                  src="https://t3-reva.vercel.app/_next/static/media/US.89d51ae2.png"
                  className="lang-flag"
                  alt="lang"
                />
                <img
                  src="https://t3-reva.vercel.app/_next/static/media/DE.e6358f84.png"
                  className="lang-flag"
                  alt="lang"
                />
              </div>
            )}
          </div>
        </div>

        <div className="header-right">
          {isMobile && (
            <div className="mobile-actions-inline">
              <div className="action-item">
                {isSearchOpen ? (
                  <X className="icon-btn" onClick={() => setIsSearchOpen(false)} />
                ) : (
                  <Search className="icon-btn" onClick={() => setIsSearchOpen(true)} />
                )}
                {isSearchOpen && (
                  <div className="mobile-search-dropdown">
                    <input type="text" placeholder="Search ..." />
                  </div>
                )}
              </div>

              <div className="action-item">
                <div className="lang-toggle" onClick={() => setIsLangOpen(!isLangOpen)}>
                  <img
                    src="https://t3-reva.vercel.app/_next/static/media/US.89d51ae2.png"
                    className="lang-flag"
                    alt="lang"
                  />
                </div>
                {isLangOpen && (
                  <div className="mobile-lang-dropdown">
                    <img
                      src="https://t3-reva.vercel.app/_next/static/media/US.89d51ae2.png"
                      alt="US"
                    />
                    <img
                      src="https://t3-reva.vercel.app/_next/static/media/DE.e6358f84.png"
                      alt="DE"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            className="mobile-toggle"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMobileOpen((s) => !s)}
          >
            {isMobileOpen ? <X className="icon-btn" /> : <Menu className="icon-btn" />}
          </button>
        </div>
      </div>

      <div
        className={`mobile-overlay ${isMobileOpen ? "open" : ""}`}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside className={`mobile-menu ${isMobileOpen ? "open" : ""}`} role="dialog" aria-modal="true">
        <div className="mobile-menu-inner">
          <div className="mobile-menu-header">
            <a href="/" className="mobile-logo" onClick={() => setIsMobileOpen(false)}>
              <img
                src="https://t3-reva.t3planet.com/fileadmin/ns_theme_t3reva/Logo/T3_Reva_Final_Logo.svg"
                alt="logo"
              />
            </a>
            <button
              className="mobile-close"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close"
            >
              <X className="icon-btn" />
            </button>
          </div>

          <nav className="mobile-nav">
            <ul>
              {data.mainNavigation.map((item, idx) => {
                const key = `top-${idx}`;
                const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                return (
                  <li key={idx} className={`mobile ${openMobileKey === key ? "open" : ""}`}>
                    <div className="mobile-row">
                      <a
                        href={item.link}
                        target={item.target || "_self"}
                        onClick={() => {
                          if (!hasChildren) setIsMobileOpen(false);
                        }}
                      >
                        {item.title}
                      </a>
                      {hasChildren && (
                        <button
                          className="mobile-expand"
                          aria-expanded={openMobileKey === key ? "true" : "false"}
                          onClick={() => toggleMobileKey(key)}
                        >
                          <ChevronDown
                            size={16}
                            className={`chev ${openMobileKey === key ? "open" : ""}`}
                          />
                        </button>
                      )}
                    </div>
                    {hasChildren && openMobileKey === key && (
                      <div className="mobile-children-wrap">
                        {item.children!.some(
                          (c) => Array.isArray(c.children) && c.children.length > 0
                        ) ? (
                          item.children!.map((cat, cIdx) => (
                            <div key={cIdx} className="mobile-category">
                              <h4>{cat.title}</h4>
                              {cat.children &&
                                renderMobileChildren(cat.children, `${key}-cat-${cIdx}`)}
                            </div>
                          ))
                        ) : (
                          renderMobileChildren(item.children!, key)
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </header>
  );
};

export default Header;
