import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { useEffect } from "react";

// =====================================================
// PUBLIC COMPONENTS
// =====================================================

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import WhyChooseUs from "./components/WhyChooseUs";
import MissionStatement from "./components/MissionStatement";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";

// =====================================================
// PUBLIC FORMS / AUTH
// =====================================================

import Login from "./pages/auth/Login";
import ClientOnboardingForm from "./components/ClientOnboardingForm";
import CareerForm from "./components/CareerForm";
import PartnerForm from "./components/PartnerForm";

// =====================================================
// ADMIN PAGES
// =====================================================

import Dashboard from "./pages/admin/Dashboard";
import ServicesPage from "./pages/admin/ServicesPage";
import InquiriesPage from "./pages/admin/InquiriesPage";
import TeamPage from "./pages/admin/TeamPage";
import ClientOnBoardingPage from "./pages/admin/ClientOnBoardingPage";
import PartnerPage from "./pages/admin/PartnerPage";

import PartnerSubmissionPage from "./pages/admin/PartnerSubmissionPage";

import CareersPage from "./pages/admin/CareersPage";
import TestimonialsPage from "./pages/admin/TestimonialsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import ServiceDetail from "./pages/ServiceDetail";


// =====================================================
// ADMIN LAYOUT
// =====================================================

import AdminLayout from "./layouts/AdminLayout";

// =====================================================
// CONTEXT
// =====================================================

import { ContentProvider } from "./context/ContentContext";

// =====================================================
// HOME PAGE
// =====================================================

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo === "about") {
      const element = document.getElementById("about");

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
        });
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [location]);

  return (
    <div id="top">
      <Hero />
      <About />
      <Services />
      <WhyChooseUs />
      <MissionStatement />
      <Testimonials />
    </div>
  );
}

// =====================================================
// APP CONTENT
// =====================================================

function AppContent() {
  const location = useLocation();

  // ===================================================
  // HIDE PUBLIC NAVBAR / FOOTER
  // ===================================================

  const hidePublicLayout =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login";

  // ===================================================
  // GET USER ROLE FROM JWT (SAFE PARSING)
  // ===================================================

  let role = null;

  try {
    const token = localStorage.getItem("token");

    // Token exists AND looks like a JWT (3 parts separated by dots)
    if (
      token &&
      typeof token === "string" &&
      token.split(".").length === 3
    ) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        role = payload?.role || null;
      } catch (parseError) {
        // JWT payload is not valid JSON → remove corrupted token
        console.warn("Corrupted JWT payload — removing token.");
        localStorage.removeItem("token");
        role = null;
      }
    } else if (token) {
      // Token exists but is not a valid JWT → remove it
      console.warn("Invalid token format — removing token.");
      localStorage.removeItem("token");
      role = null;
    }
  } catch (error) {
    console.error("Token parse error:", error);
    localStorage.removeItem("token"); // self-heal
    role = null;
  }

  // ===================================================
  // RETURN APP
  // ===================================================

  return (
    <>
      {/* PUBLIC NAVBAR */}
      {!hidePublicLayout && <Navbar />}

      <Routes>

        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={<HomePage />}
        />

        {/* =================================================
            SERVICE DETAIL
        ================================================= */}

        <Route
          path="/services/:id"
          element={<ServiceDetail />}
        />

        {/* =================================================
            CLIENT ONBOARDING
        ================================================= */}

        <Route
          path="/client-onboarding"
          element={<ClientOnboardingForm />}
        />

        <Route
          path="/client-onboarding/individual"
          element={<ClientOnboardingForm />}
        />

        <Route
          path="/client-onboarding/company"
          element={<ClientOnboardingForm />}
        />

        {/* =================================================
            CAREER
        ================================================= */}

        <Route
          path="/career"
          element={<CareerForm />}
        />

        {/* =================================================
            PARTNER FORM
        ================================================= */}

        <Route
          path="/partner/:slug"
          element={<PartnerForm />}
        />

        {/* =================================================
            CONTACT
        ================================================= */}

        <Route
          path="/contact-us"
          element={<Contact />}
        />

        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =================================================
            ADMIN
        ================================================= */}

        <Route
          path="/admin"
          element={
            role === "admin" ? (
              <AdminLayout />
            ) : (
              <NotFound />
            )
          }
        >

          {/* ADMIN DASHBOARD */}

          <Route
            index
            element={<Dashboard />}
          />

          {/* SERVICES */}

          <Route
            path="services"
            element={<ServicesPage />}
          />

          {/* INQUIRIES */}

          <Route
            path="inquiries"
            element={<InquiriesPage />}
          />

          {/* TEAM */}

          <Route
            path="team"
            element={<TeamPage />}
          />

          {/* CLIENT ONBOARDING */}

          <Route
            path="client-onboarding"
            element={<ClientOnBoardingPage />}
          />

          {/* PARTNERS */}

          <Route
            path="partners"
            element={<PartnerPage />}
          />

          {/* PARTNER SUBMISSIONS */}

          <Route
            path="partners/:partnerId/submissions"
            element={<PartnerSubmissionPage />}
          />

          {/* CAREERS */}

          <Route
            path="careers"
            element={<CareersPage />}
          />

          {/* TESTIMONIALS */}

          <Route
            path="testimonials"
            element={<TestimonialsPage />}
          />

          {/* SETTINGS */}

          <Route
            path="settings"
            element={<SettingsPage />}
          />

        </Route>

        {/* =================================================
            404
        ================================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

      {/* PUBLIC FOOTER */}
      {!hidePublicLayout && <Footer />}
    </>
  );
}

// =====================================================
// MAIN APP
// =====================================================

export default function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
        <AppContent />
      </ContentProvider>
    </BrowserRouter>
  );
}