import React, { useState, useEffect } from 'react'
import logo from './assets/xdsdata-logo.png'

// Print utility function
const handlePrint = () => {
  // Add print classes before printing
  document.body.classList.add('printing');
  
  // Trigger print dialog
  window.print();
  
  // Remove print classes after printing
  setTimeout(() => {
    document.body.classList.remove('printing');
  }, 1000);
};

// Add print keyboard shortcut (Ctrl+P or Cmd+P)
const setupPrintShortcut = () => {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      handlePrint();
    }
  });
};

const facilityRows = [
  {
    lender: 'Absa Bank Ghana',
    id: 'facility-absa',
    number: <center>1</center>,
    type: 'Personal Loan',
    approved: 'GHS 80,000',
    outstanding: 'GHS 42,000',
    status: 'Performing',
    dpd: '0',
    refi: 'Med',
  },
  {
    lender: 'MTN Momo Loan',
    id: 'facility-mtn',
    number: <center>1</center>,
    type: 'Digital Loan',
    approved: 'GHS 10,000',
    outstanding: 'GHS 4,500',
    status: 'Performing',
    dpd: '0',
    refi: 'Low',
  },
  {
    lender: 'Bayport Savings & Loans',
    id: 'facility-bayport',
    number: <center>1</center>,
    type: 'SME-linked Loan',
    approved: 'GHS 160,000',
    outstanding: 'GHS 71,500',
    status: 'Performing',
    dpd: '0',
    refi: 'HIGH',
  },
]

// Detailed 24-month payment history statuses for each account
// C = Current (On-time), L = Late (1-30 DPD), M = Missed (30+ DPD), X = No data
const historyAccount1 = Array(24).fill('C');

const historyAccount2 = Array(24).fill('C');
historyAccount2[12] = 'L'; // One minor delay in month 13

const historyAccount3 = Array(24).fill('C');
historyAccount3[6] = 'L';   // One delay in month 7
historyAccount3[18] = 'M';  // One missed payment in month 19
historyAccount3[19] = 'L';  // Delayed catchup

export default function CreditReport() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Setup print keyboard shortcut on mount
  useEffect(() => {
    setupPrintShortcut();
  }, []);

  // Close sidebar when a nav link is clicked
  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  // Manage body class and click outside handling
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('sidebar-open');
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.classList.remove('sidebar-open');
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth <= 1150) {
        const sidebar = document.querySelector('.sidebar');
        const hamburger = document.querySelector('.hamburger-btn');
        if (sidebar && hamburger && !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
          setSidebarOpen(false);
        }
      }
    };

    if (sidebarOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [sidebarOpen]);

  // Handle scrolling to facility account
  const scrollToFacility = (facilityId) => {
    const element = document.getElementById(facilityId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Helper to render section title (removed inline info icon)
  const SectionTitleWithInfo = ({ title, subtitle }) => (
    <div className="section-title">
      <div>
        <span>{title}</span>
      </div>
      {subtitle && <span className="section-subtitle-tag">{subtitle}</span>}
    </div>
  );

  // Small information note to appear under tables/subsections
  const InfoNote = ({ text }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '8px 0 14px 0' }} className="info-note">
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'var(--green-100, #e6f4ea)',
        color: 'var(--green-800, #0b6b3b)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.65rem',
        flexShrink: 0
      }}>ℹ</div>
      <p style={{  margin: 0, fontSize: '0.65rem', color: 'var(--gray-600, #6b7280)' }}>{text}</p>
    </div>
  );

  // Helper to render repayment cell classes
  const getCellClass = (status) => {
    switch (status) {
      case 'C': return 'behaviour-cell ontime';
      case 'L': return 'behaviour-cell late';
      case 'M': return 'behaviour-cell missed';
      default: return 'behaviour-cell nodata';
    }
  };

  const getCellLabel = (status) => {
    switch (status) {
      case 'C': return '✔';
      case 'L': return '30';
      case 'M': return '60+';
      default: return '-';
    }
  };

  const heatmapMonths = [
    { name: 'May', status: 'ontime' },
    { name: 'Jun', status: 'ontime' },
    { name: 'Jul', status: 'ontime' },
    { name: 'Aug', status: 'ontime' },
    { name: 'Sep', status: 'ontime' },
    { name: 'Oct', status: 'ontime' },
    { name: 'Nov', status: 'ontime' },
    { name: 'Dec', status: 'ontime' },
    { name: 'Jan', status: 'late' },
    { name: 'Feb', status: 'ontime' },
    { name: 'Mar', status: 'ontime' },
    { name: 'Apr', status: 'ontime' }
  ];

  // Helper for month-year labels
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const getMonthYear = (index) => {
    const startYear = 2021; // base year for month 0 -> Jan 2021
    const month = index % 12;
    const year = startYear + Math.floor(index / 12);
    return `${monthNames[month]} ${year}`;
  };

  return (
    <div className="app-container">
      {/* Hamburger Menu Button (Mobile) */}
      <button 
        className="hamburger-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
        style={{
          display: 'none',
          position: 'fixed',
          top: '12px',
          left: '12px',
          zIndex: 999,
          background: 'var(--green-950)',
          color: '#ffffff',
          border: 'none',
          width: '44px',
          height: '44px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1.2rem',
          padding: '8px',
        }}
      >
        ☰
      </button>

      {/* Sidebar Navigation Panel */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
         <img src={logo} alt="xdsdata logo" className="sidebar-logo" />
        </div>

        <nav className="sidebar-nav">
          <a href="#summary" className="nav-item" onClick={handleNavClick}>
            <span>📊</span> Executive Summary
          </a>
          <a href="#identity" className="nav-item" onClick={handleNavClick}>
            <span>👤</span> Borrower Identity
          </a>
          <a href="#demographics" className="nav-item" onClick={handleNavClick}>
            <span>👥</span> Demographic History
          </a>
          <a href="#history" className="nav-item" onClick={handleNavClick}>
            <span>📅</span> Payment History
          </a>
          <a href="#facilities" className="nav-item" onClick={handleNavClick}>
            <span>💳</span> Active Facilities
          </a>
          <a href="#joint-loans" className="nav-item" onClick={handleNavClick}>
            <span>🤝</span> Joint Loans
          </a>
          <a href="#affordability" className="nav-item" onClick={handleNavClick}>
            <span>💰</span> Cashflow & Affordability
          </a>
          <a href="#risk-compliance" className="nav-item" onClick={handleNavClick}>
            <span>🛡️</span> Risk & Compliance
          </a>
          <a href="#cheques-judgements" className="nav-item" onClick={handleNavClick}>
            <span>🚫</span> Dud Cheques & Judgements
          </a>
          <a href="#enquiries" className="nav-item" onClick={handleNavClick}>
            <span>🔍</span> Enquiry History
          </a>
          <a href="#ai-insights" className="nav-item" onClick={handleNavClick}>
            <span>⚡</span> AI Insights & Decisions
          </a>

          <div className="nav-divider" />

          <a href="#glossary" className="nav-item nav-item-glossary" onClick={handleNavClick}>
            <span>📖</span> Glossary of Terms
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            
            <div className="user-info">
            </div>
          </div>
          <button className="btn-print" onClick={handlePrint} title="Print report (Ctrl+P)">
            <span>🖨️</span> Export PDF / Print
          </button>
        </div>
      </aside>

      {/* Main Report Dashboard Content */}
      <main className="main-content">
        {/* Report Overview Banner Section */}
        <section 
          style={{
            background: 'radial-gradient(circle, var(--green-700) 0%, var(--green-900) 100%)',
            color: '#ffffff',
            padding: '30px 24px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '30px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <img 
              src={logo} 
              alt="XDS Data Ghana Limited logo" 
              style={{
                width: '280px',
                height: 'auto',
                flexShrink: 0,
                backgroundColor: 'transparent'
              }} 
            />
            <div className="header-badge" style={{margin: '0'}}>Smart Detailed Credit Report</div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '1.0rem', fontWeight: '700' }}>
              XDS Data Ghana Limited
              <br />Suite A 701, The Octagon, Accra<br></br>
              Tel: +233 (0)30 123 4567 | Email: ask@xdsdata.com<br></br>
              <a href="https://www.xdsdata.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'underline' }}>
                https://www.xdsdata.com
              </a>
              <br></br>
              <br></br>
              Credit Bureau License No. 001
              <a href="https://www.xdsdata.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'underline' }}></a>
            </h1>
          </div>
        </section>

        {/* Top Report Header Metadata bar */}
        <header className="report-header">
          <div className="header-meta">
            <div className="meta-item">
              <span className="meta-label">XDS Reference</span>
              <span className="meta-value">123456</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Date | Time Issued</span>
              <span className="meta-value">17 May 2026 | 3:46 PM</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Requesting Inst.</span>
              <span className="meta-value">ABC Rural Bank Ltd.</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Accessed By</span>
              <span className="meta-value">Abena Amponsah</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Title</span>
              <span className="meta-value">Regional Manager</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Purpose</span>
              <span className="meta-value">Credit Assessement</span>
              </div> 
             <div className="meta-item">
              <span className="meta-label"></span>
              <span className="status-pill danger" style={{ background: '#fdf0f0', border: '1px solid #fbc4c4', color: '#b22222', padding: '2px 8px' }}>CONFIDENTIAL</span>
              </div> 
          

          </div>
          
        </header>

        {/* Section 1: Executive Summary & Dashboard */}
        <section id="summary" className="report-section section-card">
          <SectionTitleWithInfo
            title="SECTION 1 — EXECUTIVE DECISION DASHBOARD"
            subtitle="Bureau Status: Active"
            tooltip="AI-powered credit decision with risk score, default probability, and affordability assessment."
          />

          <div className="score-dashboard-wrapper">
            {/* Score circular gauge */}
            <div className="gauge-card">
              <svg className="score-gauge-svg" viewBox="0 0 120 120">
                <circle className="gauge-bg" cx="60" cy="60" r="50" />
                <circle
                  className="gauge-fill"
                  cx="60"
                  cy="60"
                  r="50"
                  strokeDasharray="314.16"
                  strokeDashoffset={314.16 * (1 - 742 / 900)}
                />
                <text className="gauge-text" x="60" y="58">
                  <tspan className="gauge-score" x="60" dy="0">742</tspan>
                  <tspan className="gauge-max" x="60" dy="18">OUT OF 900</tspan>
                </text>
              </svg>
              <div className="gauge-label">XDS Credit Score</div>
              <div className="gauge-status">Low Risk</div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-panel alert-panel">
                <span className="panel-caption">Decision Signal</span>
                <h2>APPROVE</h2>
                <p className="panel-note">With Conditions</p>
                <p className="small-note">Trend: Improving ↑</p>
              </div>

              <div className="dashboard-panel">
                <span className="panel-caption">Probability of Default</span>
                <h2>3.8%</h2>
                <p className="panel-note">12-Month Forecast</p>
                <p className="small-note">Stress Forecast: Stable</p>
              </div>
              <div className="dashboard-panel positive-panel">
                <span className="panel-caption">Affordability Status</span>
                <h2>HEALTHY</h2>
                <p className="panel-note">DSR 34% | Below 40% cap</p>
                <p className="small-note">Headroom: GHS 45,000</p>
              </div>
            </div>
          </div>

          {/* Key Metrics row */}
          <div className="key-metrics">
            <div>
              <span>Total Exposure</span>
              <strong>GHS 118,000</strong>
            </div>
            <div>
              <span>Monthly Repayment</span>
              <strong>GHS 8,500</strong>
            </div>
            <div>
              <span>Current Arrears</span>
              <strong>GHS 0</strong>
            </div>
            <div>
              <span>Active Facilities</span>
              <strong>3</strong>
            </div>
          </div>
        </section>

        {/* Borrower Portrait Card */}
        <section className="report-section section-card" style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '24px',
          padding: '20px 24px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}>
            <h3 style={{
              margin: '0',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: 'var(--gray-950)'
            }}>Borrower Portrait</h3>
            <div style={{
              width: '35mm',
              height: '45mm',
              background: 'var(--gray-200, #e5e7eb)',
              border: '2px dashed var(--gray-400, #9ca3af)',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gray-500, #6b7280)',
              fontSize: '2rem'
            }}>
              📷
            </div>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--gray-500, #6b7280)',
              fontStyle: 'italic'
            }}>Passport Size: 35x45mm</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px 32px',
            flex: 1
          }}>
            <div>
              <span style={{fontSize: '0.8rem', color: 'var(--gray-700)', display: 'block', marginBottom: '4px'}}>Total Exposure</span>
              <strong style={{fontSize: '0.95rem', color: 'var(--gray-950)'}}>GHS 118,000</strong>
            </div>
            <div>
              <span style={{fontSize: '0.8rem', color: 'var(--gray-700)', display: 'block', marginBottom: '4px'}}>Monthly Repayment</span>
              <strong style={{fontSize: '0.95rem', color: 'var(--gray-950)'}}>GHS 8,500</strong>
            </div>
            <div>
              <span style={{fontSize: '0.8rem', color: 'var(--gray-700)', display: 'block', marginBottom: '4px'}}>Current Arrears</span>
              <strong style={{fontSize: '0.95rem', color: 'var(--gray-950)'}}>GHS 0</strong>
            </div>
            <div>
              <span style={{fontSize: '0.8rem', color: 'var(--gray-700)', display: 'block', marginBottom: '4px'}}>Active Facilities</span>
              <strong style={{fontSize: '0.95rem', color: 'var(--gray-950)'}}>3</strong>
            </div>
          </div>
        </section>

        {/* Section 2: Borrower Profile */}
        <section id="identity" className="report-section section-card">
          <SectionTitleWithInfo
            title="SECTION 2 — BORROWER IDENTITY"
            subtitle="Source Verified"
            tooltip="Verified personal information including identity, contact details, and demographic profile."
          />

          <div className="details-grid">
            <div className="detail-column">
              <div className="detail-row">
                <span>Full Name</span>
                <strong>Kwame Mensah</strong>
              </div>
              <div className="detail-row">
                <span>National ID (Ghana Card)</span>
                <strong>GHA-123456789-1</strong>
              </div>
              <div className="detail-row">
                <span>E-mail Address</span>
                <strong>odmosm@gmail.com</strong>
              </div>
              <div className="detail-row">
                <span>Phone (Primary)</span>
                <strong>0244 123 456</strong>
                </div>
                 <div className="detail-row">
                <span>Dependants</span>
                <strong>3</strong>
                </div>
                 <div className="detail-row">
                <span>Marital Status</span>
                <strong>Married</strong>
                </div>
            </div>

            <div className="detail-column">
              <div className="detail-row">
                <span>Date of Birth</span>
                <strong>14 Mar 1985</strong>
              </div>
              <div className="detail-row">
                <span>Gender</span>
                <strong>Male</strong>
              </div>
              <div className="detail-row">
                <span>Employer</span>
                <strong>Self-Employed / SME</strong>
              </div>
               <div className="detail-row">
                <span>Digital Address</span>
                <strong>GS-234-2345</strong>
                </div>
                 <div className="detail-row">
                <span>Nationality</span>
                <strong>Ghanaian</strong>
                </div>
              <div className="detail-row">
                <span>Identity Confidence</span>
                <span className="verified-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  VERIFIED (100%)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2b: Demographic History */}
        <section id="demographics" className="report-section section-card">
          <SectionTitleWithInfo
            title="SECTION 2B — DEMOGRAPHIC HISTORY"
            subtitle="Audit Trail"
            tooltip="Historical changes to borrower information tracked for compliance and audit purposes."
          />

          <div className="demographics-grid">
            {/* i. Name History */}
            <div className="demographics-card">
              <h4>Name History</h4>
              <InfoNote text="Lists recorded legal and prior names with the last update date." />
              <div className="table-responsive">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Last Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Kwame Mensah</td>
                      <td>Current Legal Name</td>
                      <td>17 May 2026</td>
                    </tr>
                    <tr>
                      <td>Kwame Agyapong Mensah</td>
                      <td>Alias / Prior Name</td>
                      <td>12 Mar 2023</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ii. Identification Number History */}
            <div className="demographics-card">
              <h4>Identification Number History</h4>
              <InfoNote text="Shows national and other ID numbers, their type and last update for verification." />
              <div className="table-responsive">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>ID Number</th>
                      <th>Type</th>
                      <th>Last Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>GHA-721098421-3</td>
                      <td>Ghana Card (National ID)</td>
                      <td>14 Feb 2022</td>
                    </tr>
                    <tr>
                      <td>H123456789</td>
                      <td>Passport ID (Expired)</td>
                      <td>10 Jan 2018</td>
                    </tr>
                    <tr>
                      <td>DL-092813-A</td>
                      <td>Drivers License</td>
                      <td>05 Aug 2021</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* iii. Telephone History */}
            <div className="demographics-card">
              <h4>Telephone History</h4>
              <InfoNote text="Primary and secondary contact numbers recorded with last update timestamps." />
              <div className="table-responsive">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Telephone</th>
                      <th>Type</th>
                      <th>Last Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>+233 24 412 3456</td>
                      <td>Primary Mobile</td>
                      <td>17 May 2026</td>
                    </tr>
                    <tr>
                      <td>+233 20 811 9988</td>
                      <td>Secondary Mobile</td>
                      <td>04 Nov 2024</td>
                    </tr>
                    <tr>
                      <td>+233 30 222 1100</td>
                      <td>Residential Landline</td>
                      <td>18 Sep 2020</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* iv. Address History */}
            <div className="demographics-card">
              <h4>Address History</h4>
              <InfoNote text="Residential and mailing address changes tracked for audit and contact purposes." />
              <div className="table-responsive">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Address</th>
                      <th>Type</th>
                      <th>Last Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>H/No 45, Ablekuma, Accra</td>
                      <td>Primary Residential</td>
                      <td>17 May 2026</td>
                    </tr>
                    <tr>
                      <td>Apt 2B, East Legon, Accra</td>
                      <td>Previous Residential</td>
                      <td>11 Dec 2024</td>
                    </tr>
                    <tr>
                      <td>P.O. Box GP 192, Accra</td>
                      <td>Mailing Address</td>
                      <td>14 Feb 2022</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Credit Health Summary & Payment Heatmap */}
        <section id="history" className="report-section section-card">
          <SectionTitleWithInfo
            title="SECTION 3 — CREDIT HEALTH & PAYMENT ANALYSIS"
            subtitle="24-Month History"
            tooltip="Summary of credit accounts, payment history heatmap, and repayment behavior analysis."
          />

          <div className="table-responsive" style={{ marginBottom: '30px' }}>
            <InfoNote text="Overview of credit health indicators and a short interpretation for each metric." />
            <table className="report-table">
              <thead>
                <tr>
                  <th>Credit Health Indicator</th>
                  <th>Status</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Repayment Consistency</td>
                  <td>
                    <span className="status-pill success">STRONG</span>
                  </td>
                  <td>93% on-time payment rate over 24 months</td>
                </tr>
                <tr>
                  <td>Delinquency History</td>
                  <td>
                    <span className="status-pill warning">MINOR</span>
                  </td>
                  <td>Worst DPD: 30 days (historic). No current arrears.</td>
                </tr>
                <tr>
                  <td>Over-Indebtedness Risk</td>
                  <td>
                    <span className="status-pill success">LOW</span>
                  </td>
                  <td>DSR 34% — below the 40% caution threshold</td>
                </tr>
                <tr>
                  <td>Recent Credit-Seeking</td>
                  <td>
                    <span className="status-pill warning">MODERATE</span>
                  </td>
                  <td>High enquiry volume in past 90 days — verify new facilities</td>
                </tr>
                <tr>
                  <td>Loan Concentration Risk</td>
                  <td>
                    <span className="status-pill success">DIVERSIFIED</span>
                  </td>
                  <td>Exposure spread across bank, fintech and savings & loans</td>
                </tr>
                <tr>
                  <td>Financial Stress Signals</td>
                  <td>
                    <span className="status-pill success">STABLE</span>
                  </td>
                  <td>No salary interruption or digital stress borrowing detected</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Analytics KPI tiles */}
          <div className="analytics-grid">
            <div className="analytics-card">
              <span>On-Time Ratio</span>
              <strong>93%</strong>
              <p>24-month average</p>
            </div>
            <div className="analytics-card">
              <span>Avg Days Past Due</span>
              <strong>4 Days</strong>
              <p>Grace period aligned</p>
            </div>
            <div className="analytics-card">
              <span>Worst Delinquency</span>
              <strong>30 DPD</strong>
              <p>Historical only</p>
            </div>
            <div className="analytics-card">
              <span>Consecutive On-Time</span>
              <strong>14 Months</strong>
              <p>Unbroken streak</p>
            </div>
            <div className="analytics-card">
              <span>Payment Trend</span>
              <strong>Improving ↑</strong>
              <p>Positive trajectory</p>
            </div>
          </div>

          {/* Heatmap Widget */}
          <div className="heatmap-wrapper">
            <div className="heatmap-header-title">
              12-Month Payment Heatmap (May 2025 – Apr 2026)
            </div>
            <div className="heatmap-grid">
              {heatmapMonths.map((m) => (
                <div key={m.name} className="heatmap-cell">
                  <span className="heatmap-month">{m.name}</span>
                  <span className={`heatmap-status-dot dot-${m.status}`} />
                </div>
              ))}
            </div>
            <div className="heatmap-legend">
              <div className="legend-item">
                <span className="legend-dot dot-ontime" /> On-Time
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-late" /> Late (1-30 DPD)
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-missed" /> Missed (30+ DPD)
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-nodata" /> No Data
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Total Exposure & Active Facilities */}
        <section id="facilities" className="report-section section-card">
          <SectionTitleWithInfo
            title="SECTION 4 — TOTAL EXPOSURE & FACILITY STRUCTURE"
            subtitle="Active Liability Accounts"
            tooltip="Detailed breakdown of all active loans and facilities with outstanding balances and payment history."
          />

          <div className="table-responsive">
            <InfoNote text="Summary of active facilities with approved amounts, outstanding balances, and current status." />
            <table className="report-table">
              <thead>
                <tr>
                  <th>Lender / Institution</th>
                  <th>No. of Loans</th>
                  <th>Facility Type</th>
                  <th>Approved (GHS)</th>
                  <th>Outstanding (GHS)</th>
                  <th>Status</th>
                  <th>DPD</th>
                  <th>Refi Opp.</th>
                </tr>
              </thead>
              <tbody>
                {facilityRows.map((row) => (
                  <tr key={row.lender}>
                    <td>
                      <strong 
                        style={{ cursor: 'pointer', color: 'var(--green-600)', textDecoration: 'underline' }}
                        onClick={() => scrollToFacility(row.id)}
                        title="Click to view details"
                      >
                        {row.lender}
                      </strong>
                    </td>
                    <td>{row.number}</td>
                    <td>{row.type}</td>
                    <td>{row.approved}</td>
                    <td>{row.outstanding}</td>
                    <td>
                      <span className="status-pill success">{row.status}</span>
                    </td>
                    <td>{row.dpd}</td>
                    <td>
                      <span className={`status-pill ${row.refi === 'HIGH' ? 'danger' : row.refi === 'Med' ? 'warning' : 'success'}`}>
                        {row.refi}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="summary-row">
                  <td>TOTAL</td>
                  <td><center>3</center></td>
                  <td></td>
                  <td>250,000</td>
                  <td>118,000</td>
                  <td></td>
                  <td>0</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Account Detail 1 */}
          <div id="facility-absa" className="facility-account">
            <div className="facility-account-header">
              <span>Absa Bank Ghana | Personal Loan — Unsecured | 90981737382</span>
              <span className="status-pill success">Performing</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px', padding: '0' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Approved Amount</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>GHS 80,000</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Outstanding Balance</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>GHS 42,000</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Last Payment Status</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>ON TIME</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Current Arrears DPD</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>0 DPD</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Interest Profile</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>STANDARD</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Refinance Opportunity</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>MEDIUM</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Date Disbursed</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>03 Mar 2022</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Installment Amount</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>GHS 1,200</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Loan Expirey Date</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>03 Mar 2025</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Last Date of Update</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>03 Mar 2023</div>
              </div>
            </div>

            <div className="facility-payment-history">
              <div className="payment-history-header">
                <span className="payment-title">24-Month Repayment History</span>
                <div className="payment-legend">
                  <div className="legend-item">
                    <span className="legend-cell ontime">✔</span>
                    <span>On-Time</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-cell late">30</span>
                    <span>Late (1-30 DPD)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-cell missed">60+</span>
                    <span>Missed (30+ DPD)</span>
                  </div>
                </div>
              </div>
              <div className="behaviour-grid-24">
                {historyAccount1.map((status, index) => (
                  <div key={index} className={getCellClass(status)} title={`${getMonthYear(index)}: ${status === 'C' ? 'On-Time' : status === 'L' ? 'Late (1-30 DPD)' : status === 'M' ? 'Missed (30+ DPD)' : 'No Data'}`}>
                    <div className="cell-label">{getCellLabel(status)}</div>
                    <div className="cell-month">{getMonthYear(index)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Account Detail 2 */}
          <div id="facility-mtn" className="facility-account">
            <div className="facility-account-header">
              <span>MTN Momo Loan | Digital Revolving Loan | 876543 </span>
              <span className="status-pill success">Performing</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px', padding: '0' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Approved Amount</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>GHS 10,000</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Outstanding Balance</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>GHS 4,500</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Last Payment Status</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>On Time</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Current Arrears DPD</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>0 DPD</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Interest Profile</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>HIGH</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Refinance Opportunity</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>LOW</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Date Disbursed</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>03 Mar 2022</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Installment Amount</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>GHS 1,200</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Loan Expirey Date</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>03 Mar 2025</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Last Date of Update</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>03 Mar 2023</div>
              </div>
            </div>

            <div className="facility-payment-history">
              <div className="payment-history-header">
                <span className="payment-title">24-Month Repayment History</span>
                <div className="payment-legend">
                  <div className="legend-item">
                    <span className="legend-cell ontime">✔</span>
                    <span>On-Time</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-cell late">30</span>
                    <span>Late (1-30 DPD)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-cell missed">60+</span>
                    <span>Missed (30+ DPD)</span>
                  </div>
                </div>
              </div>
              <div className="behaviour-grid-24">
                {historyAccount2.map((status, index) => (
                  <div key={index} className={getCellClass(status)} title={`Month ${index + 1}: ${status === 'L' ? '30 Days Late' : 'On-Time'}: ${getMonthYear(index)}`}>
                    <div className="cell-label">{getCellLabel(status)}</div>
                    <div className="cell-month">{getMonthYear(index)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Account Detail 3 */}
          <div id="facility-bayport" className="facility-account">
            <div className="facility-account-header">
              <span>Bayport Savings and Loans | SME Business-linked Loan | LG7787YY5435</span>
              <span className="status-pill success">Performing</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px', padding: '0' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Approved Amount</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>GHS 160,000</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Outstanding Balance</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>GHS 71,500</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Last Payment Status</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>ON TIME</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Current Arrears DPD</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>0 DPD</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Interest Profile</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>HIGH</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Refinance Opportunity</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>HIGH</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Date Disbursed</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>03 Mar 2022</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Installment Amount</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>GHS 1,200</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Loan Expirey Date</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>03 Mar 2025</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: '200' }}>Last Date of Update</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>03 Mar 2023</div>
              </div>
            </div>

            <div className="facility-payment-history">
              <div className="payment-history-header">
                <span className="payment-title">24-Month Repayment History</span>
                <div className="payment-legend">
                  <div className="legend-item">
                    <span className="legend-cell ontime">✔</span>
                    <span>On-Time</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-cell late">30</span>
                    <span>Late (1-30 DPD)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-cell missed">60+</span>
                    <span>Missed (30+ DPD)</span>
                  </div>
                </div>
              </div>
              <div className="behaviour-grid-24">
                {historyAccount3.map((status, index) => (
                  <div key={index} className={getCellClass(status)} title={`${getMonthYear(index)}: ${status === 'C' ? 'On-Time' : status === 'L' ? 'Late (1-30 DPD)' : status === 'M' ? 'Missed (30+ DPD)' : 'No Data'}`}>
                    <div className="cell-label">{getCellLabel(status)}</div>
                    <div className="cell-month">{getMonthYear(index)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4B: Joint Loan Account Details */}
        <section id="joint-loans" className="report-section section-card">
          <SectionTitleWithInfo
            title="SECTION 4B — JOINT LOAN ACCOUNT DETAILS"
            subtitle="Co-Borrower Liabilities"
            tooltip="Details of loans shared with co-borrowers and joint liability obligations."
          />

          <div className="table-responsive">
            <InfoNote text="Lists co-borrowers and joint loan exposures with recent payment details." />
            <table className="report-table">
              <thead>
                <tr>
                  <th>Co-Borrower Name</th>
                  <th>Date of Birth</th>
                  <th>Account Number</th>
                  <th>Joint Loan Amount</th>
                  <th>Arrear Amount</th>
                  <th>Months in Arrears</th>
                  <th>Date of Last Payment</th>
                  <th>Last Payment Received</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Ama Serwaa Mensah</strong></td>
                  <td>22 Jun 1989</td>
                  <td>JL-228192A</td>
                  <td>GHS 250,000</td>
                  <td>GHS 0</td>
                  <td>0</td>
                  <td>15 Dec 2028</td>
                  <td>GHS 12,500</td>
                </tr>
                <tr>
                  <td><strong>Kojo Amponsah</strong></td>
                  <td>10 Oct 1980</td>
                  <td>JL-559128B</td>
                  <td>GHS 120,000</td>
                  <td>GHS 4,200</td>
                  <td>1 month</td>
                  <td>30 May 2026</td>
                  <td>GHS 5,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Affordability & Cashflow Analysis */}
        <section id="affordability" className="report-section section-card">
          <div className="section-title">
            SECTION 5 — AFFORDABILITY & CASHFLOW ANALYSIS (GHS)
            <span className="section-subtitle-tag">Capacity Engine</span>
          </div>

          <div className="affordability-grid">
            <div className="detail-column" style={{ background: '#ffffff', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '24px' }}>
              <div className="detail-row">
                <span>Estimated Monthly Income</span>
                <strong>GHS 25,000</strong>
              </div>
              <div className="detail-row">
                <span>Total Debt Obligations</span>
                <strong>GHS 8,500</strong>
              </div>
              <div className="detail-row">
                <span>Estimated Disposable Income</span>
                <strong>GHS 10,800</strong>
              </div>
              <div className="detail-row">
                <span>Debt Service Ratio (DSR)</span>
                <strong>34%</strong>
              </div>
              <div className="detail-row">
                <span>Maximum Borrowing Headroom</span>
                <strong>GHS 45,000</strong>
              </div>
            </div>

            <div className="affordability-card">
              <div className="affordability-card-header">
                <span>Affordability Rating</span>
                <h3>HEALTHY</h3>
                <p>Debt Service Ratio of 34% is below the 40% caution limit threshold.</p>
              </div>
              <div className="ai-insight-box">
                <strong>AI LENDING INSIGHT</strong>
                <p>Kwame can absorb additional moderate credit exposure safely. Recommended max new facility: GHS 45,000.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Early Warning & Fraud Risk Monitoring */}
        <section id="risk-compliance" className="report-section section-card">
          <div className="section-title">
            SECTION 6 — RISK & FRAUD COMPLIANCE CHECKS
            <span className="section-subtitle-tag">Regulatory Gateways</span>
          </div>

          <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--green-900)', margin: '0 0 14px 0' }}>Early Warning Risk Signals</p>
          <InfoNote text="Early warning indicators to help prioritize institutional review and monitoring actions." />
          <div className="table-responsive" style={{ marginBottom: '30px' }}>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Risk Signal</th>
                  <th>Severity</th>
                  <th>Required Institution Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Increase in credit enquiries</td>
                  <td><span className="status-pill warning">MEDIUM</span></td>
                  <td>Review purpose and timing of recent applications before new approval</td>
                </tr>
                <tr>
                  <td>Short-term digital borrowing</td>
                  <td><span className="status-pill success">LOW</span></td>
                  <td>Monitor for emerging pattern — no immediate action required</td>
                </tr>
                <tr>
                  <td>Exposure growth in last 90 days</td>
                  <td><span className="status-pill warning">MEDIUM</span></td>
                  <td>Verify against declared income and confirm total current obligations</td>
                </tr>
                <tr>
                  <td>Missed payment trend</td>
                  <td><span className="status-pill success">LOW</span></td>
                  <td>Historical only — no current negative trend detected</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--green-900)', margin: '0 0 14px 0' }}>Fraud & Synthetic Identity Verification Checks</p>
          <InfoNote text="Identity verification checks and risk flags to surface potential fraudulent or synthetic profiles." />
          <div className="table-responsive">
            <InfoNote text="Institutional enquiries logged against the borrower in the past 12 months." />
            <table className="report-table">
              <thead>
                <tr>
                  <th>Identity Check Description</th>
                  <th>Status Check</th>
                  <th>Verification Note Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Identity Document Match</td>
                  <td><span className="status-pill success">VERIFIED</span></td>
                  <td>Ghana Card details match national identity database</td>
                </tr>
                <tr>
                  <td>Phone Number Consistency</td>
                  <td><span className="status-pill success">STABLE</span></td>
                  <td>Mobile number correlates consistently with borrower bureau record</td>
                </tr>
                <tr>
                  <td>Device Risk Indicator</td>
                  <td><span className="status-pill success">LOW</span></td>
                  <td>No anomalous device tags or high-risk location logs</td>
                </tr>
                <tr>
                  <td>Synthetic Identity Risk</td>
                  <td><span className="status-pill success">LOW</span></td>
                  <td>History and profiles show zero synthetic composite traits</td>
                </tr>
                <tr>
                  <td>Multi-ID Usage Flag</td>
                  <td><span className="status-pill neutral">NONE</span></td>
                  <td>Zero active instances of duplicate identity credentials</td>
                </tr>
                <tr>
                  <td>Adverse Court Records Check</td>
                  <td><span className="status-pill neutral">NONE</span></td>
                  <td>No active legal judgments, bankruptcies, or court disputes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6B: Dud Cheques & Judgement Records */}
        <section id="cheques-judgements" className="report-section section-card">
          <div className="section-title">
            SECTION 6B — DUD CHEQUE & JUDGEMENT RECORDS
            <span className="section-subtitle-tag">Public Records & Bank Disclosures</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Dud Cheques Info */}
            <div className="sub-section-card">
              <h4>Dud Cheque Information</h4>
              <InfoNote text="Records of returned cheques with reasons and dates for bank disclosure." />
              <div className="table-responsive">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Cheque No.</th>
                      <th>Issuing Bank</th>
                      <th>Date Issued</th>
                      <th>Cheque Amount</th>
                      <th>Return Reason</th>
                      <th>Date Bounced</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>CHQ-99881</strong></td>
                      <td>Standard Chartered</td>
                      <td>10 Jan 2025</td>
                      <td>GHS 15,000</td>
                      <td>Insufficient Funds</td>
                      <td>12 Jan 2025</td>
                    </tr>
                    <tr>
                      <td><strong>GHS-009881</strong></td>
                      <td>Absa Bank Ghana Ltd</td>
                      <td>12 Jun 2024</td>
                      <td>USD 50,000</td>
                      <td>Fraud</td>
                      <td>12 Jun 2024</td>
                    </tr>
                    <tr>
                      
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--gray-500)' }}>
                        No other dud cheques recorded in the last 5 years.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Judgement Info */}
            <div className="sub-section-card">
              <h4>Judgement Information</h4>
              <InfoNote text="Court judgements and their status, useful for legal and recovery reviews." />
              <div className="table-responsive">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Court / Case No.</th>
                      <th>Plaintiff</th>
                      <th>Judgement Amount</th>
                      <th>Judgement Date</th>
                      <th>Status / Resolution</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Accra High Court / H1-992-25</strong></td>
                      <td>Lighthouse Properties Ltd.</td>
                      <td>GHS 85,000</td>
                      <td>14 Oct 2025</td>
                      <td>
                        <span className="status-pill success">SATISFIED</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6C: Enquiry History */}
        <section id="enquiries" className="report-section section-card">
          <div className="section-title">
            SECTION 6C — BUREAU ENQUIRY HISTORY
            <span className="section-subtitle-tag">12-Month Inquiry Trail</span>
          </div>

          <div className="table-responsive">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Enquiry Date</th>
                  <th>Requesting Institution</th>
                  <th>Enquiry Purpose</th>
                  <th>Enquiry Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>17 May 2026 | 3:46 PM</strong></td>
                  <td>ABC Rural Bank Ltd.</td>
                  <td>Credit Assessment</td>
                  <td>GHS 50,000</td>
                </tr>
                <tr>
                  <td><strong>04 May 2026 | 11:20 AM</strong></td>
                  <td>Fidelity Bank Ghana</td>
                  <td>Loan Application Review</td>
                  <td>GHS 100,000</td>
                </tr>
                <tr>
                  <td><strong>18 Apr 2026 | 9:15 AM</strong></td>
                  <td>MTN Momo Loan</td>
                  <td>Revolving Digital Credit Line</td>
                  <td>GHS 10,000</td>
                </tr>
                <tr>
                  <td><strong>12 Mar 2026 | 4:50 PM</strong></td>
                  <td>Ecobank Ghana Ltd.</td>
                  <td>Credit Card Application</td>
                  <td>GHS 25,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 7: AI Opportunity Engine & Lending Decisions */}
        <section id="ai-insights" className="report-section section-card">
          <div className="section-title">
            SECTION 7 — LENDING DECISION ENGINE & PORTFOLIO INSIGHTS
            <span className="section-subtitle-tag">AI-Assisted Assessment</span>
          </div>

          <div className="ai-decision-panel" style={{ marginBottom: '30px' }}>
            <div className="decision-result-card">
              <span>Lending Recommendation</span>
              <h2>APPROVE</h2>
              <span className="status-pill warning" style={{ border: 'none', background: 'rgba(139,101,8,0.1)', color: '#8b6508' }}>
                With Conditions
              </span>
            </div>

            <div className="detail-column" style={{ background: '#ffffff', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '24px' }}>
              <div className="detail-row">
                <span>Max New Exposure Recommended</span>
                <strong>GHS 45,000</strong>
              </div>
              <div className="detail-row">
                <span>Target Facility Strategy</span>
                <strong>Consolidation recommended</strong>
              </div>
              <div className="detail-row">
                <span>Monitoring Frequency</span>
                <strong>Monthly bureau triggers</strong>
              </div>
              <div className="detail-row">
                <span>Verification Check Required</span>
                <strong>Updated primary bank statements</strong>
              </div>
              <div className="detail-row">
                <span>Collateral / Security Requirement</span>
                <strong>Not mandatory</strong>
              </div>
            </div>
          </div>

          <div className="opportunity-wrapper" style={{ marginBottom: '35px' }}>
            {/* Predictive analytics panel */}
            <div style={{ background: '#ffffff', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '24px' }}>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--gray-700)', letterSpacing: '0.05em' }}>
                Predictive Risk Classifications
              </p>
              <div className="detail-row">
                <span>Probability of Default (PD)</span>
                <strong>3.8% (12-month forecast)</strong>
              </div>
              <div className="detail-row">
                <span>Refinance Probability</span>
                <strong>HIGH (Consolidation candidate)</strong>
              </div>
              <div className="detail-row">
                <span>Cross-Sell Propensity</span>
                <strong>VERY HIGH (Salary, insurance)</strong>
              </div>
              <div className="detail-row">
                <span>Customer Churn Risk</span>
                <strong>MEDIUM (RM retention campaigns)</strong>
              </div>
              <div className="detail-row">
                <span>Borrower Financial Stress</span>
                <strong>STABLE (No active triggers)</strong>
              </div>
            </div>

            {/* AI action list cards */}
            <div className="action-list-card">
              <span className="card-label">Recommended Strategy Campaigns</span>
              <ul>
                <li>Offer debt consolidation structure to reduce third-party risk</li>
                <li>Qualifies for pre-approved salary overdraft or business card limit increase</li>
                <li>Cross-sell insurance-backed loan products to hedge exposure</li>
                <li>Assign proactive relationship manager check-ins to handle competitor refinance poaching</li>
                <li>Pre-approved credit headroom ceiling: GHS 45,000</li>
              </ul>
            </div>
          </div>

          {/* AI credit summary narrative paragraph */}
          <div style={{ background: 'radial-gradient(circle, var(--green-700) 0%, var(--green-900) 100%)', borderRadius: '12px', padding: '24px', marginBottom: '40px' }}>
           {/* background: 'radial-gradient(circle, var(--green-700) 0%, var(--green-900) 100%)',*/}
            <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', color: 'var(--gold-500)', fontSize: '1.2rem' }}>
              <span style={{ color: 'var(--gold-500)' }}>✦</span> AI Executive Narrative — For Relationship Manager Reference
            </p>
            <p style={{ fontSize: '0.82rem', lineHeight: '1.6', color: 'var(--gray-100)', margin: '0 0 12px 0' }}>
              Kwame Mensah demonstrates highly consistent payment behavior with an improving streak over the past 14 consecutive months. Total aggregate debt exposure is distributed across three discrete institutions (commercial bank, digital fintech lender, and SME microfinance), creating a total Debt Service Ratio (DSR) of 34%. This is well-managed and below the critical 40% warning limit.
            </p>
            <p style={{ fontSize: '0.82rem', lineHeight: '1.6', color: 'var(--gray-100)', margin: '0 0 12px 0' }}>
              The primary risk signal is a slight spike in credit inquiries, which can indicate that the customer is seeking additional capital. Relationship managers must confirm whether any newly approved loans have been finalized before discounting new funds to prevent over-leverage. Identification audits and synthetic fraud screens are entirely verified and clean.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--gold-500)', margin: 0 }}>
              <strong>Lending Recommendation:</strong> 
            </p>
            <p style={{ fontSize: '0.82rem', lineHeight: '1.6', color: 'var(--gray-100)', margin: 0 }}>
              APPROVE WITH CONDITIONS. Verify income statements and confirm competitors' outstanding debt margins prior to final disbursement. Implement monthly bureau automated event monitoring.
            </p>
          </div>

          {/* Compliance notice boxes */}
          <div className="compliance-container">
            <p style={{ margin: '0 0 18px 0', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--gray-800)', letterSpacing: '0.05em' }}>
              Compliance & Data Governance Directives
            </p>
            <div className="compliance-grid">
              <div className="compliance-box">
                <span>Permitted Inquiry Purpose</span>
                <p>Authorized for credit evaluation, risk portfolio management, collection analysis, or fraud mitigation checks under user authorization.</p>
              </div>
              <div className="compliance-box">
                <span>Information Recency</span>
                <p>Reflects bureau records compiled on 17 May 2026. Financial updates are supplied via regulated member feeds.</p>
              </div>
              <div className="compliance-box">
                <span>Customer Dispute Redress</span>
                <p>Borrowers hold legal rights to challenge report inaccuracies with XDS Data Ghana Ltd under the Credit Reporting Act, 2007 (Act 726).</p>
              </div>
              <div className="compliance-box">
                <span>Security & Handling</span>
                <p>Access privileges must comply with security protocols. Unauthorized distribution violates federal data security directives.</p>
              </div>
            </div>

            <p className="compliance-footer-text">
              This intelligence dossier is generated by XDS Data Ghana Limited, registered and licensed by the Bank of Ghana under the Credit Reporting Act, 2007 (Act 726). Address: Suite A701, Octagon Building, Barnes Road, Accra, Ghana. Sample dossiers are configured for testing purposes. Real-time disclosures are regulated under the Data Protection Act, 2012 (Act 843), central bank guidelines, consumer consent statutes, and organizational credit criteria. XDS Data Ghana Limited is the premier credit bureau in Ghana and West Africa. | www.xdsdata.com
            </p>
          </div>
        </section>
        {/* Glossary of Terms */}
        <section id="glossary" className="report-section section-card glossary-section">
          <SectionTitleWithInfo
            title="GLOSSARY OF CREDIT TERMS"
            subtitle="Reference Guide"
          />

          <p className="glossary-intro">
            The following definitions explain the key credit and financial terms used throughout this report.
            They are provided to assist lenders, relationship managers, and authorised users in accurately
            interpreting the data presented.
          </p>

          {[
            {
              letter: 'A',
              terms: [
                { term: 'Affordability', definition: 'A lender\'s assessment of a borrower\'s capacity to repay a loan based on their income, existing obligations, and living expenses without financial hardship.' },
                { term: 'Arrears', definition: 'The amount of debt that is overdue or unpaid past its scheduled due date. A borrower is "in arrears" when one or more payments have not been made on time.' },
              ],
            },
            {
              letter: 'B',
              terms: [
                { term: 'Bureau Enquiry', definition: 'A formal request made by a lender or institution to the credit bureau to access a borrower\'s credit report. Enquiries are logged and may affect the credit score if excessive.' },
                { term: 'Borrower Identity', definition: 'The verified personal and demographic information of the subject of a credit report, including full name, national ID, date of birth, contact details, and employment.' },
              ],
            },
            {
              letter: 'C',
              terms: [
                { term: 'Credit Score', definition: 'A numerical representation of a borrower\'s creditworthiness, calculated by the bureau using payment history, outstanding debt, credit utilisation, and other financial behaviour indicators. XDS scores range from 0 to 900.' },
                { term: 'Credit Report', definition: 'A comprehensive document compiled by a credit bureau summarising a borrower\'s credit history, active facilities, payment behaviour, public records, and risk indicators.' },
                { term: 'Credit Utilisation', definition: 'The proportion of available credit that a borrower is currently using. High utilisation rates (above 70%) may negatively impact credit scores.' },
                { term: 'Co-Borrower', definition: 'An individual who jointly applies for and shares legal responsibility for repaying a loan alongside the primary borrower. Also referred to as a joint applicant.' },
                { term: 'Consolidation', definition: 'The process of combining multiple existing debts into a single loan, typically to reduce monthly repayment obligations or secure a lower interest rate.' },
              ],
            },
            {
              letter: 'D',
              terms: [
                { term: 'Days Past Due (DPD)', definition: 'The number of calendar days a borrower\'s payment is overdue beyond the scheduled due date. A DPD of 0 means the account is current. DPD thresholds (e.g. 30, 60, 90 days) determine delinquency classifications.' },
                { term: 'Debt Service Ratio (DSR)', definition: 'The percentage of a borrower\'s gross monthly income consumed by total monthly debt repayments. A DSR below 40% is generally considered healthy; above 50% signals over-indebtedness risk.' },
                { term: 'Default', definition: 'The failure to repay a loan or meet the terms of a credit agreement. Typically declared after a sustained period of non-payment (commonly 90+ DPD).' },
                { term: 'Delinquency', definition: 'A loan or credit account that has missed one or more payments and is overdue. Delinquency severity is measured in DPD bands.' },
                { term: 'Demographic History', definition: 'A bureau audit trail tracking changes to a borrower\'s personal information over time, including prior names, phone numbers, addresses, and identification numbers.' },
                { term: 'Digital Loan', definition: 'A short-term credit facility disbursed and managed entirely through a mobile or digital platform (e.g. MTN Mobile Money loan). Often characterised by rapid disbursement and high interest rates.' },
                { term: 'Disposable Income', definition: 'The portion of a borrower\'s monthly income remaining after all mandatory deductions and debt repayments. Used to estimate headroom for new credit.' },
                { term: 'Dud Cheque', definition: 'A cheque that has been returned unpaid by the bank, typically due to insufficient funds, a closed account, or fraud. Also referred to as a bounced cheque.' },
              ],
            },
            {
              letter: 'E',
              terms: [
                { term: 'Exposure', definition: 'The total outstanding amount a lender or set of lenders is at risk of losing if a borrower defaults. Aggregate credit exposure includes all active facilities.' },
              ],
            },
            {
              letter: 'F',
              terms: [
                { term: 'Facility', definition: 'A formal credit arrangement between a lender and a borrower, including loans, overdrafts, credit cards, and revolving credit lines.' },
                { term: 'Financial Stress', definition: 'Indicators suggesting a borrower may be unable to meet their financial obligations. These include missed payments, rapid digital borrowing, and multiple simultaneous credit applications.' },
              ],
            },
            {
              letter: 'J',
              terms: [
                { term: 'Judgement', definition: 'A legally binding court order requiring a borrower to repay a debt to a creditor. Judgements are matters of public record and indicate a serious credit event.' },
                { term: 'Joint Loan', definition: 'A loan held in the name of two or more borrowers, each sharing full legal responsibility for repayment. The credit behaviour of all parties is reflected in each borrower\'s bureau profile.' },
              ],
            },
            {
              letter: 'L',
              terms: [
                { term: 'Lender', definition: 'A financial institution, bank, fintech, or individual that extends credit to a borrower under agreed terms and conditions.' },
                { term: 'Loan Concentration Risk', definition: 'The risk arising when a borrower\'s credit obligations are concentrated with a single lender or in a single product type, reducing resilience to market changes.' },
              ],
            },
            {
              letter: 'O',
              terms: [
                { term: 'On-Time Payment', definition: 'A repayment made in full on or before the scheduled due date. Consistent on-time payments positively impact credit scores.' },
                { term: 'Outstanding Balance', definition: 'The remaining principal amount owed on a loan or credit facility at a given point in time, excluding future interest not yet accrued.' },
                { term: 'Over-Indebtedness', definition: 'A condition where a borrower\'s total debt obligations exceed their sustainable repayment capacity, significantly increasing default risk.' },
              ],
            },
            {
              letter: 'P',
              terms: [
                { term: 'Payment History', definition: 'A chronological record of a borrower\'s loan repayment behaviour, typically displayed over a 24-month window. The single most influential factor in credit scoring.' },
                { term: 'Performing Loan', definition: 'A loan where the borrower is meeting repayment obligations and there are no significant overdue payments (typically 0–30 DPD).' },
                { term: 'Probability of Default (PD)', definition: 'A statistical estimate of the likelihood that a borrower will fail to meet their credit obligations within a specified period (commonly 12 months). Expressed as a percentage.' },
              ],
            },
            {
              letter: 'R',
              terms: [
                { term: 'Refinance Opportunity', definition: 'An assessment of whether a borrower\'s existing loans could be restructured or transferred to achieve better terms, lower rates, or improved cash flow.' },
                { term: 'Repayment Consistency', definition: 'A measure of how regularly and reliably a borrower makes scheduled repayments. High consistency is a strong positive credit signal.' },
                { term: 'Risk Signal', definition: 'An indicator flagged in a credit report that warrants attention from a lender, such as increased enquiries, rapid debt growth, or short-term digital borrowing patterns.' },
              ],
            },
            {
              letter: 'S',
              terms: [
                { term: 'SME Loan', definition: 'A loan extended to a Small or Medium-sized Enterprise, often tied to business operations, payroll, or capital expenditure.' },
                { term: 'Synthetic Identity', definition: 'A fraudulent identity constructed using a combination of real and fabricated personal information to open credit accounts or deceive lenders.' },
              ],
            },
            {
              letter: 'T',
              terms: [
                { term: 'Total Exposure', definition: 'The aggregate outstanding debt owed by a borrower across all active credit facilities from all lenders at a given point in time.' },
              ],
            },
            {
              letter: 'X',
              terms: [
                { term: 'XDS Credit Score', definition: 'The proprietary credit score assigned by XDS Data Ghana Limited. Scored on a scale of 0–900, where higher scores indicate lower credit risk. Scores above 700 are considered low risk.' },
              ],
            },
          ].map(({ letter, terms }) => (
            <div key={letter} className="glossary-group">
              <div className="glossary-letter-badge">{letter}</div>
              <div className="glossary-terms-list">
                {terms.map(({ term, definition }) => (
                  <div key={term} className="glossary-term-row">
                    <div className="glossary-term-name">{term}</div>
                    <div className="glossary-term-def">{definition}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="glossary-footer-note">
            <span>❗️</span>
            Definitions are aligned with the Credit Reporting Act, 2007 (Act 726) and general West African banking practices.
            For regulatory clarifications, contact XDS Data Ghana Limited at ask@xdsdata.com
          </div>
        </section>
      </main>
    </div>
  )
}
