/// <reference types="react-scripts" />

import './assets/styles/index.css';
import React, { JSX, lazy, Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from './stores/store';

import { LogService } from './services/logService';

import { MetaTags } from './components/MetaTags';
import LazyLoading from './components/LazyLoading';

const NotFound = lazy(() => import('./pages/NotFound'));
const Home = lazy(() => import('./pages/Home'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogView = lazy(() => import('./pages/BlogView'));
const Store = lazy(() => import('./pages/Store'));
const ProductView = lazy(() => import('./pages/ProductView'));
const Checkout = lazy(() => import('./pages/Checkout'));
const SuccessPayment = lazy(() => import('./pages/SuccessPayment'));
const FailedPayment = lazy(() => import('./pages/FailedPayment'));
const Downloads = lazy(() => import('./pages/Downloads'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Support = lazy(() => import('./pages/Support'));
const SupportView = lazy(() => import('./pages/SupportView'));
const Faq = lazy(() => import('./pages/FAQ'));
const Status = lazy(() => import('./pages/Status'));
const Login = lazy(() => import('./pages/Login'));
const TwoFactorAuth = lazy(() => import('./pages/2FactorAuth'));

/* Users Routes (Required Authentication) */
const Profile = lazy(() => import('./pages/users/Profile'));
const Settings = lazy(() => import('./pages/users/Settings'));
const Inventory = lazy(() => import("./pages/users/Inventory"));
const Economy = lazy(() => import("./pages/users/Economy"));

/* Dashboard Changed by Role */
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const ControlPanel = lazy(() => import('./pages/controlPanel/ControlPanel'))

/* Guidelines & Terms */
const Guidelines = lazy(() => import('./pages/Guidelines'));
const Imprint = lazy(() => import('./pages/legal/Imprint'));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService'));
const GeneralTermsAndConditions = lazy(() => import('./pages/legal/GeneralTermsAndConditions'));
const TermsOfUse = lazy(() => import('./pages/legal/TermsOfUse'));
const CookiePolicy = lazy(() => import('./pages/legal/CookiePolicy'));

const Documentation = lazy(() => import('./pages/Documentation'));
const Forum = lazy(() => import('./pages/Forum'));
const ForumTopicView = lazy(() => import("./pages/ForumTopicView"));
const Chat = lazy(() => import("./pages/Chat"));

const logService = new LogService();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const LogRouteChanges = () => {
  const location = useLocation();

  useEffect(() => {
    logService.info(`Navigated to ${location.pathname}`, 'Route Changed');
  }, [location]);

  return null;
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const TwoFAProtectionRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user, twoFactorVerified } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.twoFactorEnabled && user?.authenticatorSetup?.isEnabled && !twoFactorVerified) {
    if (location.pathname !== "/2fa") {
      sessionStorage.setItem("redirectAfter2FA", location.pathname);
      return <Navigate to="/2fa" replace />;
    }
  }

  return children;
};

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <LogRouteChanges />
        <Suspense fallback={<LazyLoading />}>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route
              path="/"
              element={
                <MetaTags
                  title="Home Page"
                  description="Welcome to LifeVerse the first Real-Life simulation game in UE5."
                  keywords="home, welcome, lifeverse"
                  author="LifeVerse"
                  image="/images/home.jpg"
                  url="https://www.lifeversegame.com/home"
                >
                  <Home />
                </MetaTags>
              }
            />
            <Route
              path="/news"
              element={
                <MetaTags
                  title="News"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/news"
                >
                  <Blog />
                </MetaTags>
              }
            />
            <Route
              path="/news/:id"
              element={
                <MetaTags
                  title="News"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/news/:id"
                >
                  <BlogView />
                </MetaTags>
              }
            />
            <Route
              path="/store"
              element={
                <MetaTags
                  title="Store"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/store"
                >
                  <Store />
                </MetaTags>
              }
            />
            <Route
              path="/store/:id"
              element={
                <MetaTags
                  title="Store"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/store/:id"
                >
                  <ProductView />
                </MetaTags>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <MetaTags
                    title="Checkout"
                    description="Learn more about our website and our mission."
                    keywords="about, company, mission"
                    author="LifeVerse"
                    image="/images/about.jpg"
                    url="https://www.lifeversegame.com/checkout"
                  >
                    <Checkout />
                  </MetaTags>
                </ProtectedRoute>
              }
            />
            <Route
              path="/success_payment"
              element={
                <MetaTags
                  title="Success Payment"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/success_payment"
                >
                  <SuccessPayment />
                </MetaTags>
              }
            />
            <Route
              path="/failed_payment"
              element={
                <MetaTags
                  title="Failed Payment"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/failed_payment"
                >
                  <FailedPayment />
                </MetaTags>
              }
            />
            <Route
              path="/downloads"
              element={
                <MetaTags
                  title="Downloads"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/downloads"
                >
                  <Downloads />
                </MetaTags>
              }
            />
            <Route
              path="/about"
              element={
                <MetaTags
                  title="About Us"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/about"
                >
                  <About />
                </MetaTags>
              }
            />
            <Route
              path="/contact"
              element={
                <MetaTags
                  title="Contact Us"
                  description="Get in touch with us for any inquiries."
                  keywords="contact, email, inquiries"
                  author="LifeVerse"
                  image="/images/contact.jpg"
                  url="https://www.lifeversegame.com/contact"
                >
                  <Contact />
                </MetaTags>
              }
            />
            <Route
              path="/support"
              element={
                <MetaTags
                  title="Support"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/support"
                >
                  <Support />
                </MetaTags>
              }
            />
            <Route
              path="/support/:ticketId"
              element={
                <MetaTags
                  title="Support"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/support/:ticketId"
                >
                  <SupportView />
                </MetaTags>
              }
            />
            <Route
              path="/faq"
              element={
                <MetaTags
                  title="FAQ"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/faq"
                >
                  <Faq />
                </MetaTags>
              }
            />
            <Route
              path="/status"
              element={
                <MetaTags
                  title="Status"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/status"
                >
                  <Status />
                </MetaTags>
              }
            />
            <Route
              path="/login"
              element={
                <MetaTags
                  title="Login"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/login"
                >
                  <Login />
                </MetaTags>
              }
            />
            <Route
              path="/2fa"
              element={
                <ProtectedRoute>
                  <MetaTags
                    title="Two-Factor Authentication"
                    description="Verify your identity with two-factor authentication"
                    keywords="2fa, security, authentication, verification"
                    author="LifeVerse"
                    image="/images/security.jpg"
                    url={`https://www.lifeversegame.com/2fa`}
                  >
                    <TwoFactorAuth />
                  </MetaTags>
                </ProtectedRoute>
              }
            />

            {/* Users Routes (Required Authentication) */}
            <Route
              path={`/profile/:username`}
              element={
                <ProtectedRoute>
                  <TwoFAProtectionRoute>
                    <MetaTags
                      title="Profile"
                      description="Learn more about our website and our mission."
                      keywords="profile, user, account"
                      author="LifeVerse"
                      image="/images/profile.jpg"
                      url={`https://www.lifeversegame.com/profile/:username`}
                    >
                      <Profile />
                    </MetaTags>
                  </TwoFAProtectionRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path={`/profile/:username/settings`}
              element={
                <ProtectedRoute>
                  <TwoFAProtectionRoute>
                    <MetaTags
                      title="Settings"
                      description="Adjust your account settings on LifeVerse."
                      keywords="settings, account, preferences"
                      author="LifeVerse"
                      image="/images/settings.jpg"
                      url={`https://www.lifeversegame.com/profile/:username/settings`}
                    >
                      <Settings />
                    </MetaTags>
                  </TwoFAProtectionRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path={`/profile/:username/inventory`}
              element={
                <ProtectedRoute>
                  <TwoFAProtectionRoute>
                    <MetaTags
                      title="Inventory"
                      description="Adjust your account settings on LifeVerse."
                      keywords="settings, account, preferences"
                      author="LifeVerse"
                      image="/images/settings.jpg"
                      url={`https://www.lifeversegame.com/profile/:username/inventory`}
                    >
                      <Inventory />
                    </MetaTags>
                  </TwoFAProtectionRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path={`/profile/:username/economy`}
              element={
                <ProtectedRoute>
                  <TwoFAProtectionRoute>
                    <MetaTags
                      title="Economy"
                      description="Adjust your account settings on LifeVerse."
                      keywords="settings, account, preferences"
                      author="LifeVerse"
                      image="/images/settings.jpg"
                      url={`https://www.lifeversegame.com/profile/:username/economy`}
                    >
                      <Economy />
                    </MetaTags>
                  </TwoFAProtectionRoute>
                </ProtectedRoute>
              }
            />

            {/* Dashboard Changed by Role */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <TwoFAProtectionRoute>
                    <MetaTags
                      title="Dashboard"
                      description="Learn more about our website and our mission."
                      keywords="about, company, mission"
                      author="LifeVerse"
                      image="/images/about.jpg"
                      url="https://www.lifeversegame.com/dashboard"
                    >
                      <Dashboard />
                    </MetaTags>
                  </TwoFAProtectionRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/control_panel"
              element={
                <ProtectedRoute>
                  <TwoFAProtectionRoute>
                    <MetaTags
                      title="Control Panel"
                      description="Learn more about our website and our mission."
                      keywords="about, company, mission"
                      author="LifeVerse"
                      image="/images/about.jpg"
                      url="https://www.lifeversegame.com/control_panel"
                    >
                      <ControlPanel />
                    </MetaTags>
                  </TwoFAProtectionRoute>
                </ProtectedRoute>
              }
            />

            {/* Guidelines & Terms */}
            <Route
              path="/guidelines"
              element={
                <MetaTags
                  title="Guidelines"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/guidelines"
                >
                  <Guidelines />
                </MetaTags>
              }
            />
            <Route
              path="/legal/imprint"
              element={
                <MetaTags
                  title="Imprint"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/legal/imprint"
                >
                  <Imprint />
                </MetaTags>
              }
            />
            <Route
              path="/legal/privacy_policy"
              element={
                <MetaTags
                  title="Privacy Policy"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/legal/privacy_policy"
                >
                  <PrivacyPolicy />
                </MetaTags>
              }
            />
            <Route
              path="/legal/terms_of_service"
              element={
                <MetaTags
                  title="Terms of Service"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/legal/terms_of_service"
                >
                  <TermsOfService />
                </MetaTags>
              }
            />
            <Route
              path="/legal/terms_of_use"
              element={
                <MetaTags
                  title="Terms of Use"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/legal/terms_of_use"
                >
                  <TermsOfUse />
                </MetaTags>
              }
            />
            <Route
              path="/legal/general_terms_and_conditions"
              element={
                <MetaTags
                  title="General Terms and Conditions"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/legal/general_terms_and_conditions"
                >
                  <GeneralTermsAndConditions />
                </MetaTags>
              }
            />
            <Route
              path="/legal/cookie_policy"
              element={
                <MetaTags
                  title="Cookie Policy"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/legal/cookie_policy"
                >
                  <CookiePolicy />
                </MetaTags>
              }
            />

            <Route
              path="/docs"
              element={
                <MetaTags
                  title="Documentation"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/docs"
                >
                  <Documentation />
                </MetaTags>
              }
            />
            <Route
              path="/forum"
              element={
                <MetaTags
                  title="Forum"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/forum"
                >
                  <Forum />
                </MetaTags>
              }
            />
            <Route
              path="/forum/topic/:topicId"
              element={
                <MetaTags
                  title="Forum Topic"
                  description="Learn more about our website and our mission."
                  keywords="about, company, mission"
                  author="LifeVerse"
                  image="/images/about.jpg"
                  url="https://www.lifeversegame.com/forum/topic/:topicId"
                >
                  <ForumTopicView />
                </MetaTags>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <TwoFAProtectionRoute>
                    <MetaTags
                      title="Chat"
                      description="Learn more about our website and our mission."
                      keywords="about, company, mission"
                      author="LifeVerse"
                      image="/images/about.jpg"
                      url="https://www.lifeversegame.com/chat"
                    >
                      <Chat />
                    </MetaTags>
                  </TwoFAProtectionRoute>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  </React.StrictMode>
);
