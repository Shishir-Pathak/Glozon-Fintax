import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../context/ContentContext";
import { getAssetUrl } from "../utils/assets";

const FALLBACK_SERVICES = [
  {
    name: "Accounting & Financial Reporting",
    path: "/services/accounting-financial-reporting",
  },
  {
    name: "Taxation & Regulatory Advisory",
    path: "/services/taxation-regulatory-advisory",
  },
  {
    name: "Audit Support & Assurance",
    path: "/services/audit-support-assurance",
  },
  {
    name: "Corporate Secretarial & Entity Formation",
    path: "/services/corporate-secretarial",
  },
  {
    name: "Payroll Processing & Administration",
    path: "/services/payroll-processing",
  },
  {
    name: "Strategic Advisory & Corporate Finance",
    path: "/services/strategic-advisory",
  },
  {
    name: "Human Capital & Professional Development",
    path: "/services/human-capital-professional-development",
  },
];

const MotionLink = motion(Link);

const mobileNavLinkClass = (active) =>
  `flex w-full min-h-[48px] items-center px-5 py-3.5 text-left text-sm font-bold uppercase tracking-wide transition-colors ${
    active
      ? "bg-blue-50 text-blue-600"
      : "text-slate-800 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-50"
  }`;

const mobileSubLinkClass = (active) =>
  `flex min-h-[44px] items-center px-4 py-2.5 text-sm font-normal normal-case transition-colors ${
    active
      ? "bg-blue-50 font-medium text-blue-600"
      : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
  }`;

const desktopLinkClass = (active) =>
  `inline-flex items-center border-b-2 px-1.5 py-2 text-[13px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${
    active
      ? "border-blue-500 text-blue-600"
      : "border-transparent text-slate-700 hover:border-blue-300 hover:text-blue-600"
  }`;

const desktopCtaClass = (active) =>
  `inline-flex items-center rounded-md px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.16em] transition-all duration-200 ${
    active
      ? "bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)]"
      : "bg-blue-500 text-white hover:bg-blue-600 shadow-[0_10px_24px_rgba(59,130,246,0.22)]"
  }`;

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const {
    settings,
    services: dynamicServices,
  } = useContent();

  const [isServicesOpen, setIsServicesOpen] =
    useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [isMobileServicesOpen, setIsMobileServicesOpen] =
    useState(false);

  const [isMounted, setIsMounted] =
    useState(false);

  const services =
    dynamicServices &&
    dynamicServices.length > 0
      ? dynamicServices.map((s) => ({
          name: s.title || s.name,
          path: s.path || `/services/${s.id}`,
        }))
      : FALLBACK_SERVICES;

  const isServicesSection =
    pathname.startsWith("/services");

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
  };

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const prev =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mobileMenu = (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[9999] lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px]"
            onClick={closeMobileMenu}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.28,
            }}
            className="absolute right-0 top-0 flex h-[100dvh] w-[min(100%,21rem)] max-w-[90%] flex-col bg-white shadow-[-12px_0_40px_rgba(15,23,42,0.18)]"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <span className="text-sm font-bold uppercase tracking-wide text-slate-900">
                Menu
              </span>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600"
              >
                ✕
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-2">

              {/* HOME */}

              <Link
                to="/"
                onClick={closeMobileMenu}
                className={mobileNavLinkClass(false)}
              >
                Home
              </Link>

              {/* ABOUT */}

              <Link
                to="/"
                state={{ scrollTo: "about" }}
                onClick={closeMobileMenu}
                className={mobileNavLinkClass(false)}
              >
                About
              </Link>

              {/* SERVICES */}

              <button
                type="button"
                onClick={() =>
                  setIsMobileServicesOpen(
                    (o) => !o
                  )
                }
                className={`${mobileNavLinkClass(
                  isServicesSection ||
                    isMobileServicesOpen
                )} justify-between`}
              >
                <span>Services</span>

                <span
                  className={`transition-transform ${
                    isMobileServicesOpen
                      ? "rotate-180"
                      : ""
                  }`}
                >
                  ⌄
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isMobileServicesOpen && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="ml-5 border-l-2 border-blue-300 py-1 pl-4 pr-3">

                      {services.map(
                        (service) => (
                          <Link
                            key={service.path}
                            to={service.path}
                            onClick={
                              closeMobileMenu
                            }
                            className={mobileSubLinkClass(
                              pathname ===
                                service.path
                            )}
                          >
                            {service.name}
                          </Link>
                        )
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CAREER */}

              <Link
                to="/career"
                onClick={closeMobileMenu}
                className={mobileNavLinkClass(
                  pathname === "/career"
                )}
              >
                Career
              </Link>

              {/* CONTACT */}

              <Link
                to="/contact-us"
                onClick={closeMobileMenu}
                className={mobileNavLinkClass(
                  pathname === "/contact-us"
                )}
              >
                Contact
              </Link>

              {/* CLIENT ONBOARDING */}
              {/* Direct link - no Individual/Company dropdown */}

              <Link
                to="/client-onboarding"
                onClick={closeMobileMenu}
                className={mobileNavLinkClass(
                  pathname === "/client-onboarding"
                )}
              >
                Client Onboarding
              </Link>

            </nav>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between px-4 py-3 lg:px-8">

          {/* LOGO */}

          <MotionLink
            to="/"
            className="flex items-center gap-3"
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <img
              src={getAssetUrl(
                settings?.logo ||
                  "/Logo.png"
              )}
              alt="GFA Logo"
              className="h-10 w-auto object-contain sm:h-12"
            />

            <div className="hidden sm:flex flex-col leading-tight">

              <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.28em]">

                <span
                  style={{
                    color: "#036B09",
                  }}
                >
                  Glozon
                </span>{" "}

                <span
                  style={{
                    color: "#2A17B4",
                  }}
                >
                  FinTax
                </span>{" & "}

                <span
                  style={{
                    color: "#FFAB09",
                  }}
                >
                  Advisory
                </span>

              </span>

              <span className="text-xs text-slate-500">
                {settings?.tagline ||
                  "Your Trust, Our Commitment"}
              </span>

            </div>
          </MotionLink>

          {/* DESKTOP NAV */}

          <div className="hidden lg:flex items-center gap-5">

            {/* HOME */}

            <Link
              to="/"
              className={desktopLinkClass(false)}
            >
              Home
            </Link>

            {/* ABOUT */}

            <Link
              to="/"
              state={{
                scrollTo: "about",
              }}
              className={desktopLinkClass(false)}
            >
              About
            </Link>

            {/* SERVICES */}

            <div
              className="relative"
              onMouseEnter={() =>
                setIsServicesOpen(true)
              }
              onMouseLeave={() =>
                setIsServicesOpen(false)
              }
            >
              <button
                type="button"
                className={desktopLinkClass(
                  isServicesSection
                )}
              >
                Services

                <span
                  className={`ml-1 transition-transform ${
                    isServicesOpen
                      ? "rotate-180"
                      : ""
                  }`}
                >
                  ⌄
                </span>
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="absolute left-0 top-full mt-3 w-80 rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)] overflow-hidden"
                  >

                    <div className="border-b border-slate-100 px-4 py-3">

                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">
                        Services
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Practical support across
                        compliance, reporting,
                        and growth.
                      </p>

                    </div>

                    <ul className="max-h-[70vh] overflow-y-auto py-2">

                      {services.map(
                        (service) => (
                          <li
                            key={service.path}
                          >
                            <Link
                              to={service.path}
                              className={`block px-4 py-3 text-sm transition-colors ${
                                pathname ===
                                service.path
                                  ? "bg-blue-50 text-blue-600"
                                  : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                              }`}
                              onClick={() =>
                                setIsServicesOpen(
                                  false
                                )
                              }
                            >
                              {service.name}
                            </Link>
                          </li>
                        )
                      )}

                    </ul>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CAREER */}

            <Link
              to="/career"
              className={desktopLinkClass(
                pathname === "/career"
              )}
            >
              Career
            </Link>

            {/* CONTACT */}

            <Link
              to="/contact-us"
              className={desktopCtaClass(
                pathname === "/contact-us"
              )}
            >
              Contact
            </Link>

            {/* CLIENT ONBOARDING */}
            {/* Direct link - no dropdown */}

            <Link
              to="/client-onboarding"
              className={desktopCtaClass(
                pathname === "/client-onboarding"
              )}
            >
              Client Onboarding
            </Link>

          </div>

          {/* MOBILE BUTTONS */}

          <div className="lg:hidden flex items-center gap-2">

            <a
              href={`mailto:${settings.primaryEmail}`}
              className="flex h-11 w-11 items-center justify-center rounded-full text-slate-600 hover:bg-blue-50 hover:text-blue-600"
            >
              ✉
            </a>

            <button
              type="button"
              onClick={() =>
                setIsMobileMenuOpen(true)
              }
              className="flex h-11 w-11 items-center justify-center rounded-full text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              ☰
            </button>

          </div>

        </div>
      </header>

      {isMounted &&
        createPortal(
          mobileMenu,
          document.body
        )}
    </>
  );
};

export default Navbar;