import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";

import { HomePage } from "@/pages/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import { PortfolioPage } from "@/pages/PortfolioPage";
import { PortfolioDetailPage } from "@/pages/PortfolioDetailPage";
import { SkillsPage } from "@/pages/SkillsPage";
import { CertificationsPage } from "@/pages/CertificationsPage";
import { CollaboratePage } from "@/pages/CollaboratePage";

import { LoginPage } from "@/pages/LoginPage";
import { AdminPage } from "@/pages/AdminPage";
import { SetupPage } from "@/pages/SetupPage";

import { useStore } from "@/store/useStore";
import FirebaseSync from "@/components/FirebaseSync";

export function App() {
  const { isSetupComplete, isAuthenticated } = useStore();

  return (
    <FirebaseSync>
      <BrowserRouter>
        {isSetupComplete ? (
          <Layout>
            <Routes>

              {/* ✅ PUBLIC ROUTES */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/certifications" element={<CertificationsPage />} />
              <Route path="/collaborate" element={<CollaboratePage />} />

              {/* ✅ LOGIN PAGE */}
              <Route
                path="/login"
                element={
                  isAuthenticated
                    ? <Navigate to="/admin" replace />
                    : <LoginPage />
                }
              />

              {/* ✅ ADMIN PROTECTED */}
              <Route
                path="/admin"
                element={
                  isAuthenticated
                    ? <AdminPage />
                    : <Navigate to="/login" replace />
                }
              />

              {/* setup disabled after complete */}
              <Route path="/setup" element={<Navigate to="/" replace />} />

              {/* fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </Layout>
        ) : (
          <Routes>
            <Route path="/setup" element={<SetupPage />} />
            <Route path="*" element={<Navigate to="/setup" replace />} />
          </Routes>
        )}
      </BrowserRouter>
    </FirebaseSync>
  );
}
