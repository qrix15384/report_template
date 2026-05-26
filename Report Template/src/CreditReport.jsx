import React from 'react'
import logo from './assets/xdsdata-logo.png'

const facilityRows = [
  {
    lender: 'Absa Bank Ghana',
    type: 'Personal Loan',
    approved: 'GHS 80,000',
    outstanding: 'GHS 42,000',
    status: 'Performing',
    dpd: '0',
    refi: 'Med',
  },
  {
    lender: 'MTN Momo Loan',
    type: 'Digital Loan',
    approved: 'GHS 10,000',
    outstanding: 'GHS 4,500',
    status: 'Performing',
    dpd: '0',
    refi: 'Low',
  },
  {
    lender: 'Savings & Loans Inst.',
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
      {/* Sidebar Navigation Panel */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="xdsdata logo" className="sidebar-logo" />
          <div className="sidebar-brand-name">
            XDS Data
            <span className="sidebar-brand-sub">Ghana Ltd.</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#summary" className="nav-item">
            <span>📊</span> Executive Summary
          </a>
          <a href="#identity" className="nav-item">
            <span>👤</span> Borrower Identity
          </a>
          <a href="#demographics" className="nav-item">
            <span>👥</span> Demographic History
          </a>
          <a href="#history" className="nav-item">
            <span>📅</span> Payment History
          </a>
          <a href="#facilities" className="nav-item">
            <span>💳</span> Active Facilities
          </a>
          <a href="#joint-loans" className="nav-item">
            <span>🤝</span> Joint Loans
          </a>
          <a href="#affordability" className="nav-item">
            <span>💰</span> Cashflow & Affordability
          </a>
          <a href="#risk-compliance" className="nav-item">
            <span>🛡️</span> Risk & Compliance
          </a>
          <a href="#cheques-judgements" className="nav-item">
            <span>🚫</span> Dud Cheques & Judgements
          </a>
          <a href="#enquiries" className="nav-item">
            <span>🔍</span> Enquiry History
          </a>
          <a href="#ai-insights" className="nav-item">
            <span>⚡</span> AI Insights & Decisions
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">AA</div>
            <div className="user-info">
              <span className="user-name">Abena Amponsah</span>
              <span className="user-role">RM Officer</span>
            </div>
          </div>
          <button className="btn-print" onClick={() => window.print()}>
            <span>🖨️</span> Export PDF / Print
          </button>
        </div>
      </aside>

      {/* Main Report Dashboard Content */}
      <main className="main-content">
        {/* Top Report Header Metadata bar */}
        <header className="report-header">
          <div className="header-meta">
            <div className="meta-item">
              <span className="meta-label">Report ID</span>
              <span className="meta-value">CR-2026-000123</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Date Issued</span>
              <span className="meta-value">17 May 2026 | 3:46 PM</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Requesting Bank</span>
              <span className="meta-value">ABC Rural Bank Ltd.</span>
            </div>
          </div>
          <div className="header-badge">CONFIDENTIAL CREDIT ASSESSMENT</div>
        </header>

        {/* Section 1: Executive Summary & Dashboard */}
        <section id="summary" className="report-section section-card">
          <div className="section-title">
            SECTION 1 — EXECUTIVE DECISION DASHBOARD
            <span className="section-subtitle-tag">Bureau Status: Active</span>
          </div>

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
                <p className="panel-note">Approve with conditions</p>
                <p className="small-note">Score trend: Improving ↑</p>
              </div>

              <div className="dashboard-panel">
                <span className="panel-caption">Prob. of Default</span>
                <h2>3.8%</h2>
                <p className="panel-note">12-month forecast</p>
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

        {/* Section 2: Borrower Profile */}
        <section id="identity" className="report-section section-card">
          <div className="section-title">
            SECTION 2 — BORROWER IDENTITY
            <span className="section-subtitle-tag">Source Verified</span>
          </div>

          <div className="details-grid">
            <div className="detail-column">
              <div className="detail-row">
                <span>Full Name</span>
                <strong>Kwame Mensah</strong>
              </div>
              <div className="detail-row">
                <span>National ID (Ghana Card)</span>
                <strong>GHA-*****789-1</strong>
              </div>
              <div className="detail-row">
                <span>Residential Address</span>
                <strong>Ablekuma, Accra, Ghana</strong>
              </div>
              <div className="detail-row">
                <span>Phone (Primary)</span>
                <strong>0244 *** ***</strong>
              </div>
            </div>

            <div className="detail-column">
              <div className="detail-row">
                <span>Date of Birth</span>
                <strong>14 March 1985</strong>
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
          <div className="section-title">
            SECTION 2B — DEMOGRAPHIC HISTORY
            <span className="section-subtitle-tag">Audit Trail</span>
          </div>

          <div className="demographics-grid">
            {/* i. Name History */}
            <div className="demographics-card">
              <h4>Name History</h4>
              <div className="table-responsive">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Name (Main Subject)</th>
                      <th>Type</th>
                      <th>Last Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Kwame Mensah</strong></td>
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
              <div className="table-responsive">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>ID Number (Main Subject)</th>
                      <th>Type</th>
                      <th>Last Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>GHA-721098421-3</strong></td>
                      <td>Ghana Card (National ID)</td>
                      <td>14 Feb 2022</td>
                    </tr>
                    <tr>
                      <td>GHA-551201948-2</td>
                      <td>Ghana Card (Expired)</td>
                      <td>10 Jan 2018</td>
                    </tr>
                    <tr>
                      <td>DL-092813-A</td>
                      <td>Accra Drivers License</td>
                      <td>05 Aug 2021</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* iii. Telephone History */}
            <div className="demographics-card">
              <h4>Telephone History</h4>
              <div className="table-responsive">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Telephone (Main Subject)</th>
                      <th>Type</th>
                      <th>Last Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>+233 24 412 3456</strong></td>
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
              <div className="table-responsive">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Address (Main Subject)</th>
                      <th>Type</th>
                      <th>Last Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>H/No 45, Ablekuma, Accra</strong></td>
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
          <div className="section-title">
            SECTION 3 — CREDIT HEALTH & PAYMENT ANALYSIS
            <span className="section-subtitle-tag">24-Month History</span>
          </div>

          <div className="table-responsive" style={{ marginBottom: '30px' }}>
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
          <div className="section-title">
            SECTION 4 — TOTAL EXPOSURE & FACILITY STRUCTURE
            <span className="section-subtitle-tag">Active Liability Accounts</span>
          </div>

          <div className="table-responsive">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Lender / Institution</th>
                  <th>Facility Type</th>
                  <th>Approved</th>
                  <th>Outstanding</th>
                  <th>Status</th>
                  <th>DPD</th>
                  <th>Refi Opp.</th>
                </tr>
              </thead>
              <tbody>
                {facilityRows.map((row) => (
                  <tr key={row.lender}>
                    <td><strong>{row.lender}</strong></td>
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
                  <td colSpan={2}>TOTAL</td>
                  <td>3 active facilities</td>
                  <td>GHS 118,000</td>
                  <td></td>
                  <td>0 DPD</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Account Detail 1 */}
          <div className="facility-account">
            <div className="facility-account-header">
              <span>Absa Bank Ghana | Personal Loan — Unsecured</span>
              <span className="status-pill success">Performing</span>
            </div>

            <div className="facility-details-horizontal">
              <div className="metric-box">
                <span>Approved Amount</span>
                <strong>GHS 80,000</strong>
              </div>
              
              <div className="metric-box">
                <span>Lender Name</span>
                <strong>Absa Bank Ghana</strong>
              </div>
              <div className="metric-box">
                <span>Outstanding Balance</span>
                <strong>GHS 42,000</strong>
              </div>
              <div className="metric-box">
                <span>Last Payment Status</span>
                <strong>On Time</strong>
              </div>
              <div className="metric-box">
                <span>Current Arrears DPD</span>
                <strong>0 DPD</strong>
              </div>
              <div className="metric-box">
                <span>Interest Profile</span>
                <strong>Standard</strong>
              </div>
              <div className="metric-box">
                <span>Refinance Opportunity</span>
                <strong>MEDIUM</strong>
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
          <div className="facility-account">
            <div className="facility-account-header">
              <span>MTN Momo Loan | Digital Revolving Loan</span>
              <span className="status-pill success">Performing</span>
            </div>

            <div className="facility-details-horizontal">
              <div className="metric-box">
                <span>Approved Amount</span>
                <strong>GHS 10,000</strong>
              </div>
              <div className="metric-box">
                <span>Outstanding Balance</span>
                <strong>GHS 4,500</strong>
              </div>
              <div className="metric-box">
                <span>Last Payment Status</span>
                <strong>On Time</strong>
              </div>
              <div className="metric-box">
                <span>Current Arrears DPD</span>
                <strong>0 DPD</strong>
              </div>
              <div className="metric-box">
                <span>Interest Profile</span>
                <strong>High</strong>
              </div>
              <div className="metric-box">
                <span>Refinance Opportunity</span>
                <strong>LOW</strong>
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
          <div className="facility-account">
            <div className="facility-account-header">
              <span>Savings & Loans Institution | SME Business-linked Loan</span>
              <span className="status-pill success">Performing</span>
            </div>

            <div className="facility-details-horizontal">
              <div className="metric-box">
                <span>Approved Amount</span>
                <strong>GHS 160,000</strong>
              </div>
              <div className="metric-box">
                <span>Outstanding Balance</span>
                <strong>GHS 71,500</strong>
              </div>
              <div className="metric-box">
                <span>Last Payment Status</span>
                <strong>On Time</strong>
              </div>
              <div className="metric-box">
                <span>Current Arrears DPD</span>
                <strong>0 DPD</strong>
              </div>
              <div className="metric-box">
                <span>Interest Profile</span>
                <strong>High</strong>
              </div>
              <div className="metric-box">
                <span>Refinance Opportunity</span>
                <strong>HIGH</strong>
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
          <div className="section-title">
            SECTION 4B — JOINT LOAN ACCOUNT DETAILS
            <span className="section-subtitle-tag">Co-Borrower Liabilities</span>
          </div>

          <div className="table-responsive">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Co-Borrower Name</th>
                  <th>Date of Birth</th>
                  <th>Account Number</th>
                  <th>Joint Loan Amount</th>
                  <th>Arrear Amount</th>
                  <th>Months in Arrears</th>
                  <th>Date of Final Payment</th>
                  <th>Cash Received</th>
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
                  <td>GHS 12,500 / mo</td>
                </tr>
                <tr>
                  <td><strong>Kojo Amponsah</strong></td>
                  <td>10 Oct 1980</td>
                  <td>JL-559128B</td>
                  <td>GHS 120,000</td>
                  <td>GHS 4,200</td>
                  <td>1 month</td>
                  <td>30 May 2026</td>
                  <td>GHS 5,000 / mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Affordability & Cashflow Analysis */}
        <section id="affordability" className="report-section section-card">
          <div className="section-title">
            SECTION 5 — AFFORDABILITY & CASHFLOW ANALYSIS
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
                <p>DSR of 34% is below the 40% caution limit threshold.</p>
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
          <div className="table-responsive">
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

          <div className="double-card-grid">
            {/* Dud Cheques Info */}
            <div className="sub-section-card">
              <h4>Dud Cheque Information</h4>
              <div className="table-responsive">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Cheque No.</th>
                      <th>Issuing Bank</th>
                      <th>Cheque Amount</th>
                      <th>Return Reason</th>
                      <th>Date Returned</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>CHQ-99881</strong></td>
                      <td>Standard Chartered</td>
                      <td>GHS 15,000</td>
                      <td>Insufficient Funds</td>
                      <td>12 Jan 2025</td>
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
                <span>Prob. of Default (PD)</span>
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
          <div style={{ background: '#ffffff', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '24px', marginBottom: '40px' }}>
            <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', color: 'var(--green-950)', fontSize: '0.9rem' }}>
              AI Executive Narrative — For Relationship Manager Reference
            </p>
            <p style={{ fontSize: '0.82rem', lineHeight: '1.6', color: 'var(--gray-800)', margin: '0 0 12px 0' }}>
              Kwame Mensah demonstrates highly consistent payment behavior with an improving streak over the past 14 consecutive months. Total aggregate debt exposure is distributed across three discrete institutions (commercial bank, digital fintech lender, and SME microfinance), creating a total Debt Service Ratio (DSR) of 34%. This is well-managed and below the critical 40% warning limit.
            </p>
            <p style={{ fontSize: '0.82rem', lineHeight: '1.6', color: 'var(--gray-800)', margin: '0 0 12px 0' }}>
              The primary risk signal is a slight spike in credit inquiries, which can indicate that the customer is seeking additional capital. Relationship managers must confirm whether any newly approved loans have been finalized before discounting new funds to prevent over-leverage. Identification audits and synthetic fraud screens are entirely verified and clean.
            </p>
            <p style={{ fontSize: '0.82rem', lineHeight: '1.6', color: 'var(--gray-800)', margin: 0 }}>
              <strong>Lending Directive:</strong> APPROVE WITH CONDITIONS. Verify income statements and confirm competitors' outstanding debt margins prior to final disbursement. Implement monthly bureau automated event monitoring.
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
      </main>
    </div>
  )
}
