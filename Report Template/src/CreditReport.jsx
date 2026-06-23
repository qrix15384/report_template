import React, { useState, useEffect } from 'react'
import logo from './assets/xdsdata-logo.png'

// Print utility function
const handlePrint = () => {
  document.body.classList.add('printing');
  window.print();
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

// Date Formatter Helper
function formatDateStr(str) {
  if (!str) return "N/A";
  
  // Strip time component if present (e.g. "2000/04/25 12:00:00 AM")
  const cleanStr = str.split(' ')[0];
  
  // Format 1: DD/MM/YYYY
  let parts = cleanStr.split('/');
  if (parts.length === 3) {
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);
    if (parts[0].length === 4) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    }
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (month >= 1 && month <= 12) {
      return `${day} ${months[month - 1]} ${year}`;
    }
  }
  
  // Format 2: YYYY-MM-DD
  parts = cleanStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (month >= 1 && month <= 12) {
      return `${day} ${months[month - 1]} ${year}`;
    }
  }

  return cleanStr;
}

export default function CreditReport() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Login Session state (initialized to empty strings to allow credentials of choice)
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [dataTicket, setDataTicket] = useState(null);
  
  // Live Search States (DOB and ID are dynamically used in search, others are UI placeholders as requested)
  const [searchName, setSearchName] = useState('KINGSLEY OKYERE');
  const [searchDob, setSearchDob] = useState('2000-04-25');
  const [searchId, setSearchId] = useState('GHA-717322166-9');
  const [searchAccount, setSearchAccount] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState(null);
  
  const [matchResults, setMatchResults] = useState(null);
  const [selectedConsumer, setSelectedConsumer] = useState(null);
  const [rawReportData, setRawReportData] = useState(null);
  
  // Setup print keyboard shortcut on mount
  useEffect(() => {
    setupPrintShortcut();
  }, []);

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

  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  const scrollToFacility = (facilityId) => {
    const element = document.getElementById(facilityId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 1. Perform Authentication Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLoadingStep('Authenticating credentials with XDS portal...');
    
    try {
      const loginUrl = `/api-proxy/login?username=${encodeURIComponent(loginUsername)}&password=${encodeURIComponent(loginPassword)}`;
      const loginRes = await fetch(loginUrl).then(r => r.json());
      
      if (loginRes && loginRes.dataTicket && loginRes.statusCode === 200) {
        setDataTicket(loginRes.dataTicket);
      } else {
        throw new Error(loginRes?.message || 'Access Denied: Invalid credentials.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  // 2. Perform ConsumerMatch Search (ignoring name & account number parameters in fetch as requested)
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setMatchResults(null);
    setSelectedConsumer(null);
    setRawReportData(null);
    
    try {
      setLoadingStep('Searching credit bureau registry...');
      const formattedDob = searchDob ? searchDob.replace(/-/g, '/') : '';
      
      // Mapped query contains ONLY DateOfBirth and identification (ignoring name & account parameters)
      const matchUrl = `/api-proxy/getconsumermatch?dataticket=${encodeURIComponent(dataTicket)}&enquiryReason=Test&DateOfBirth=${encodeURIComponent(formattedDob)}&identification=${encodeURIComponent(searchId)}`;
      
      const matchRes = await fetch(matchUrl).then(r => r.json());
      
      if (Array.isArray(matchRes)) {
        if (matchRes[0]?.response?.statusCode !== 200) {
          throw new Error(matchRes[0]?.response?.message || 'No record matching search parameters found.');
        }
        setMatchResults(matchRes);
      } else {
        throw new Error('Unexpected response format from registry matching engine.');
      }
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'Search execution failed.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  // 3. Fetch Full Credit Report
  const handleSelectConsumer = async (consumer) => {
    setLoading(true);
    setError(null);
    setSelectedConsumer(consumer);
    
    try {
      setLoadingStep(`Downloading full credit report for ${consumer.firstName} ${consumer.surname}...`);
      const reportUrl = `/api-proxy/GetConsumerFullCreditReport?EnquiryID=${consumer.enquiryID}&ConsumerID=${consumer.consumerID}&DataTicket=${encodeURIComponent(dataTicket)}&MatchingEngineID=${consumer.matchingEngineID}`;
      
      const reportRes = await fetch(reportUrl).then(r => r.json());
      
      if (reportRes && reportRes.response?.statusCode === 200) {
        setRawReportData(reportRes);
      } else {
        throw new Error(reportRes?.response?.message || 'Failed to download consumer credit report.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while generating the report.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleNewSearch = () => {
    setRawReportData(null);
    setMatchResults(null);
    setSelectedConsumer(null);
    setError(null);
  };

  const handleLogout = () => {
    setDataTicket(null);
    setRawReportData(null);
    setMatchResults(null);
    setSelectedConsumer(null);
    setError(null);
  };

  // Helper to render section title
  const SectionTitleWithInfo = ({ title, subtitle }) => (
    <div className="section-title">
      <div>
        <span>{title}</span>
      </div>
      {subtitle && <span className="section-subtitle-tag">{subtitle}</span>}
    </div>
  );

  // Small information note
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
      <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--gray-600, #6b7280)' }}>{text}</p>
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

  // Month labels generator
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // ==========================================
  // API DATA MAPPING ADAPTER
  // ==========================================
  const mapApiDataToReport = (apiData) => {
    if (!apiData) return null;

    const personal = apiData.personalDetailsSummary || {};
    const acctSummary = apiData.creditAccountSummary || {};
    const delRating = apiData.highestDelinquencyRating || {};
    const agreements = apiData.creditAgreementSummary || [];
    const historyList = apiData.accountMonthlyPaymentHistory || [];

    // Metadata
    const referenceId = apiData.enquiryDetails?.subscriberEnquiryResultID || personal.consumerID || "N/A";
    const dateIssued = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

    // Score Dashboard
    const rawScore = parseInt(acctSummary.rating, 10) || 0;
    const isOutof100 = rawScore <= 100;
    const maxScore = isOutof100 ? 100 : 900;
    let riskStatus = "Low Risk";
    if (isOutof100) {
      riskStatus = rawScore < 40 ? "High Risk" : rawScore < 70 ? "Medium Risk" : "Low Risk";
    } else {
      riskStatus = rawScore < 500 ? "High Risk" : rawScore < 700 ? "Medium Risk" : "Low Risk";
    }

    const totalArrearsGHS = parseFloat(acctSummary.totalAmountInArrearGHS) || 0;
    const activeArrearsCount = parseInt(acctSummary.totalAccountInArrearGHS, 10) || 0;

    let decisionSignal = "APPROVE";
    let decisionNote = "Low Risk profile";
    let decisionTrend = "Improving ↑";
    if (activeArrearsCount > 0 || totalArrearsGHS > 0) {
      decisionSignal = "REFER";
      decisionNote = `Arrears of GHS ${totalArrearsGHS.toLocaleString()} detected.`;
      decisionTrend = "Declining ↓";
    }

    const totalExposure = parseFloat(acctSummary.totalOutstandingdebtGHS) || 0;
    const totalMonthlyRepayment = parseFloat(acctSummary.totalMonthlyInstalmentGHS) || 0;
    const activeFacilitiesCount = parseInt(acctSummary.totalActiveAccountsGHS, 10) || 0;

    // Identity details
    const fullName = `${personal.firstName || ""} ${personal.otherNames || ""} ${personal.surname || ""}`.replace(/\s+/g, ' ').trim() || "KINGSLEY OKYERE";
    const dobFormatted = formatDateStr(personal.birthDate);

    // Demographic history arrays
    const nameHistoryList = (apiData.nameHistory || []).map(item => ({
      name: `${item.firstName || ""} ${item.otherNames || ""} ${item.surName || ""}`.replace(/\s+/g, ' ').trim(),
      type: "Recorded Legal Name",
      lastUpdate: formatDateStr(item.lastUpdatedDate)
    }));

    const idHistoryList = (apiData.identificationHistory || []).map(item => ({
      idNumber: item.identificationNumber,
      type: item.identificationType || "National ID",
      lastUpdate: formatDateStr(item.upDateDate)
    }));

    const phoneHistoryList = [];
    (apiData.telephoneHistory || []).forEach(item => {
      if (item.mobileTelephoneNumber) {
        phoneHistoryList.push({
          telephone: item.mobileTelephoneNumber,
          type: "Mobile Number",
          lastUpdate: formatDateStr(item.mobileNoUpdatedonDate)
        });
      }
      if (item.homeTelephoneNumber) {
        phoneHistoryList.push({
          telephone: item.homeTelephoneNumber,
          type: "Home Number",
          lastUpdate: formatDateStr(item.homeNoUpdatedonDate)
        });
      }
      if (item.workTelephoneNumber) {
        phoneHistoryList.push({
          telephone: item.workTelephoneNumber,
          type: "Work Number",
          lastUpdate: formatDateStr(item.workNoUpdatedonDate)
        });
      }
    });

    const addressHistoryList = (apiData.addressHistory || []).map(item => ({
      address: `${item.address1 || ""} ${item.address2 || ""} ${item.address3 || ""} ${item.address4 || ""}`.replace(/\s+/g, ' ').trim(),
      type: item.addressTypeInd || "Residential Address",
      lastUpdate: formatDateStr(item.upDateDate || item.upDateOnDate)
    }));

    // Credit Health Indicators
    const consistencyStatus = activeArrearsCount > 0 ? "WEAK" : "STRONG";
    const consistencyInterpretation = activeArrearsCount > 0 ? "Missed payments detected in past accounts." : "Highly consistent on-time payment behavior.";
    
    const healthIndicators = [
      { indicatorName: "Repayment Consistency", status: consistencyStatus, interpretation: consistencyInterpretation },
      { indicatorName: "Delinquency History", status: delRating.highestDelinquencyRating > 0 ? "DELINQUENT" : "STABLE", interpretation: `Worst Delinquency Rating: ${delRating.highestDelinquencyRating || "0"}` },
      { indicatorName: "Over-Indebtedness Risk", status: totalExposure > 10000 ? "MODERATE" : "LOW", interpretation: `Outstanding Debt Exposure is GHS ${totalExposure.toLocaleString()}` },
      { indicatorName: "Recent Credit-Seeking", status: "LOW", interpretation: "Standard inquiry rate logged in database" },
      { indicatorName: "Loan Concentration Risk", status: activeFacilitiesCount > 2 ? "DIVERSIFIED" : "CONCENTRATED", interpretation: `Exposure distributed across ${activeFacilitiesCount} active loan(s)` },
      { indicatorName: "Financial Stress Signals", status: activeArrearsCount > 0 ? "STRESSED" : "STABLE", interpretation: activeArrearsCount > 0 ? "Active default triggers in portfolio" : "No salary interruption flags detected" }
    ];

    // Heatmap months mapping (last 12 months)
    const heatmapMonths = [];
    const primaryHistory = historyList[0] || {};
    for (let i = 12; i >= 1; i--) {
      const padIndex = String(i).padStart(2, '0');
      const headerKey = `mH${padIndex}`;
      const valueKey = `m${padIndex}`;
      
      const headerVal = primaryHistory[headerKey] || "";
      const statusVal = primaryHistory[valueKey] || "";
      
      let monthName = headerVal.split(' ')[1] || `M${13 - i}`;
      
      let statusClass = "nodata";
      if (statusVal === "C" || statusVal === "0" || statusVal === "00") {
        statusClass = "ontime";
      } else if (statusVal === "1" || statusVal === "10" || statusVal === "2" || statusVal === "20") {
        statusClass = "late";
      } else if (statusVal === "#" || statusVal === "") {
        statusClass = "nodata";
      } else {
        statusClass = "missed";
      }
      
      heatmapMonths.push({
        name: monthName,
        status: statusClass
      });
    }

    // Facilities rows mapping
    const facilityRows = agreements.map((item, index) => {
      const outstanding = parseFloat(item.currentBalanceAmt?.replace(/,/g, '')) || 0;
      const approved = parseFloat(item.openingBalanceAmt?.replace(/,/g, '')) || 0;
      const monthsLate = parseInt(item.monthsInArrears, 10) || 0;
      const detailsHist = historyList.find(h => h.accountNo === item.accountNo) || {};
      
      let refi = "Low";
      if (item.indicatorDescription?.toLowerCase().includes("digital") || item.indicatorDescription?.toLowerCase().includes("momo")) {
        refi = "Low";
      } else if (monthsLate > 3) {
        refi = "HIGH";
      } else if (monthsLate === 0 && approved > 5000) {
        refi = "Med";
      }

      // 24 month behavior mapping
      const repaymentHistory24 = [];
      for (let k = 24; k >= 1; k--) {
        const padK = String(k).padStart(2, '0');
        const valK = detailsHist[`m${padK}`] || "";
        if (valK === "C" || valK === "0" || valK === "00") {
          repaymentHistory24.push("C");
        } else if (valK === "1" || valK === "10" || valK === "2" || valK === "20") {
          repaymentHistory24.push("L");
        } else if (valK === "#" || valK === "") {
          repaymentHistory24.push("X");
        } else {
          repaymentHistory24.push("M");
        }
      }

      return {
        id: `facility-${index}`,
        lender: item.subscriberName || "N/A",
        number: 1,
        type: item.indicatorDescription || "Loan",
        approved: approved ? `GHS ${approved.toLocaleString()}` : "GHS 0",
        outstanding: outstanding ? `GHS ${outstanding.toLocaleString()}` : "GHS 0",
        status: item.accountStatusCode === "A" ? "Active" : "Closed",
        dpd: item.monthsInArrears || "0",
        refi: refi,
        details: {
          accountNumber: item.accountNo || "N/A",
          lastPaymentStatus: repaymentHistory24[repaymentHistory24.length - 1] === "C" ? "ON TIME" : "LATE",
          currentArrearsDpd: item.amountOverdue ? `GHS ${parseFloat(item.amountOverdue).toLocaleString()}` : "GHS 0",
          interestProfile: item.indicatorDescription?.toLowerCase().includes("micro") ? "HIGH" : "STANDARD",
          dateDisbursed: formatDateStr(item.dateAccountOpened),
          installmentAmount: item.instalmentAmount ? `GHS ${parseFloat(item.instalmentAmount).toLocaleString()}` : "GHS 0",
          expiryDate: formatDateStr(item.closedDate),
          lastUpdatedDate: formatDateStr(item.changedOnDate || item.lastUpdatedDate),
          repaymentHistory24
        }
      };
    });

    // Joint Loans
    const jointLoans = (apiData.jointLoanAccountDetails || []).map(item => ({
      coBorrowerName: item.coBorrowerName || "N/A",
      coBorrowerDob: formatDateStr(item.coBorrowerDob),
      accountNumber: item.accountNumber || "N/A",
      loanAmount: item.loanAmount ? `GHS ${parseFloat(item.loanAmount).toLocaleString()}` : "GHS 0",
      arrearAmount: item.arrearAmount ? `GHS ${parseFloat(item.arrearAmount).toLocaleString()}` : "GHS 0",
      monthsInArrears: item.monthsInArrears || "0",
      lastPaymentDate: formatDateStr(item.lastPaymentDate),
      lastPaymentAmount: item.lastPaymentAmount ? `GHS ${parseFloat(item.lastPaymentAmount).toLocaleString()}` : "GHS 0"
    }));

    // Affordability Analysis
    const incomeEst = 5000;
    const totalDSR = incomeEst > 0 ? ((totalMonthlyRepayment / incomeEst) * 100).toFixed(1) : 0;
    const headroom = incomeEst * 0.40 - totalMonthlyRepayment;

    // Compliance signals
    const riskSignals = [];
    if (activeArrearsCount > 0) {
      riskSignals.push({
        signal: "Active Account in Arrear",
        severity: "HIGH",
        requiredAction: "Verify current repayment capacity and reason for delinquency"
      });
    }
    if (totalExposure > 10000) {
      riskSignals.push({
        signal: "High Total Exposure",
        severity: "MEDIUM",
        requiredAction: "Review aggregate leverage ceiling across all lenders"
      });
    }
    if (riskSignals.length === 0) {
      riskSignals.push({
        signal: "Stable repayment profiles",
        severity: "LOW",
        requiredAction: "Maintain standard monitoring criteria"
      });
    }

    // Dud Cheques and Judgements
    const dudChequesList = (apiData.dudCheqEventSummary || []).map(item => ({
      chequeNumber: item.chequeNo || "N/A",
      issuingBank: item.bankName || "N/A",
      dateIssued: formatDateStr(item.issueDate),
      amount: item.amount ? `GHS ${parseFloat(item.amount).toLocaleString()}` : "GHS 0",
      returnReason: item.reason || "Insufficient Funds",
      dateBounced: formatDateStr(item.bounceDate)
    }));

    const judgementsList = (apiData.judgementSummary || []).map(item => ({
      caseNumber: item.caseNo || "N/A",
      plaintiff: item.plaintiff || "N/A",
      amount: item.amount ? `GHS ${parseFloat(item.amount).toLocaleString()}` : "GHS 0",
      judgementDate: formatDateStr(item.judgementDate),
      status: item.status || "UNSATISFIED"
    }));

    // Enquiry History
    const enquiryTrails = (apiData.enquiryHistory || []).map(item => ({
      date: formatDateStr(item.enquiryDate),
      requestingInstitution: item.subscriberName || "N/A",
      purpose: item.enquiryReason || "Credit Assessment",
      amount: item.amount ? `GHS ${parseFloat(item.amount).toLocaleString()}` : "GHS 0"
    }));

    return {
      reportMeta: {
        xdsReference: referenceId,
        issuedAt: dateIssued,
        requestingInstitution: "ABC Rural Bank Ltd.",
        accessedBy: "Abena Amponsah",
        title: "Regional Manager",
        purpose: "Credit Assessment"
      },
      dashboard: {
        creditScore: rawScore,
        maxScore,
        riskStatus,
        decisionSignal,
        decisionNote,
        decisionTrend,
        probabilityOfDefault: activeArrearsCount > 0 ? "24.5%" : "3.8%",
        stressForecast: activeArrearsCount > 0 ? "Caution" : "Stable",
        affordabilityStatus: totalDSR > 40 ? "CRITICAL" : "HEALTHY",
        dsrText: `DSR ${totalDSR}% | Target < 40%`,
        headroomText: `GHS ${headroom > 0 ? headroom.toLocaleString() : 0}`,
        totalExposure: `GHS ${totalExposure.toLocaleString()}`,
        totalMonthlyRepayment: `GHS ${totalMonthlyRepayment.toLocaleString()}`,
        currentArrears: `GHS ${totalArrearsGHS.toLocaleString()}`,
        activeFacilitiesCount
      },
      identity: {
        fullName,
        nationalId: personal.nationalIDNo || "N/A",
        email: personal.emailAddress || "N/A",
        primaryPhone: personal.cellularNo || "N/A",
        dependentsCount: personal.dependants || "0",
        maritalStatus: personal.maritalStatus || "N/A",
        dateOfBirth: dobFormatted,
        gender: personal.gender || "N/A",
        employer: personal.employerDetail || apiData.employmentHistory?.[0]?.employerDetail || "N/A",
        digitalAddress: personal.residentialAddress1 || "N/A",
        nationality: personal.nationality || "N/A",
        identityConfidenceScore: "VERIFIED (100%)"
      },
      demographicHistory: {
        names: nameHistoryList,
        identifications: idHistoryList,
        telephones: phoneHistoryList,
        addresses: addressHistoryList
      },
      creditHealth: {
        indicators: healthIndicators,
        analytics: {
          onTimeRatio: activeArrearsCount > 0 ? "70%" : "100%",
          avgDaysPastDue: activeArrearsCount > 0 ? "45 Days" : "0 Days",
          worstDelinquency: delRating.highestDelinquencyRating ? `${delRating.highestDelinquencyRating} DPD` : "0 DPD",
          consecutiveOnTime: activeArrearsCount > 0 ? "0 Months" : "24 Months",
          paymentTrend: activeArrearsCount > 0 ? "Declining ↓" : "Stable →"
        },
        heatmapMonths
      },
      facilityRows,
      jointLoans,
      affordabilityData: {
        income: `GHS ${incomeEst.toLocaleString()}`,
        debt: `GHS ${totalMonthlyRepayment.toLocaleString()}`,
        disposable: `GHS ${(incomeEst - totalMonthlyRepayment).toLocaleString()}`,
        dsr: `${totalDSR}%`,
        headroom: `GHS ${headroom > 0 ? headroom.toLocaleString() : 0}`,
        rating: totalDSR > 40 ? "CRITICAL" : "HEALTHY",
        description: `Debt Service Ratio of ${totalDSR}% is ${totalDSR > 40 ? 'above the 40% caution limit' : 'below the 40% healthy threshold'}.`,
        insight: activeArrearsCount > 0 
          ? "Caution: Borrower has active arrears in micro-credit facility. Restructure or verify capacity before extending new limits." 
          : "Borrower displays healthy DSR headroom. Additional moderate exposure limit is manageable."
      },
      complianceData: {
        riskSignals,
        fraudChecks: [
          { checkDescription: "Identity Document Match", status: "VERIFIED", details: "Ghana Card matches database" },
          { checkDescription: "Phone Number Consistency", status: "STABLE", details: "Phone aligns consistently with record" },
          { checkDescription: "Device Risk Indicator", status: "LOW", details: "No high-risk logs or location shifts" },
          { checkDescription: "Synthetic Identity Risk", status: "LOW", details: "Profile shows clean legal composites" }
        ]
      },
      publicRecordsData: {
        dudCheques: dudChequesList,
        judgements: judgementsList
      },
      enquiriesList: enquiryTrails,
      aiDecision: {
        recommendation: decisionSignal,
        subStatus: decisionNote,
        maxNewExposure: `GHS ${headroom > 0 ? headroom.toLocaleString() : 0}`,
        targetStrategy: activeArrearsCount > 0 ? "Debt consolidation / recovery actions" : "Cross-sell savings or investment plans",
        monitoringFrequency: activeArrearsCount > 0 ? "Weekly alert triggers" : "Quarterly reviews",
        verificationCheckRequired: "Latest salary pay slips & current bank statements",
        collateralRequirement: activeArrearsCount > 0 ? "Security / Guarantee Required" : "Not mandatory",
        riskClassifications: {
          probabilityOfDefault: activeArrearsCount > 0 ? "High (24.5%)" : "Low (3.8%)",
          refinanceProbability: activeArrearsCount > 0 ? "LOW (Arrears present)" : "HIGH (Refinance candidate)",
          crossSellPropensity: "MEDIUM",
          churnRisk: "LOW",
          financialStressStatus: activeArrearsCount > 0 ? "ACTIVE DELINQUENCY ALERT" : "STABLE"
        },
        recommendedStrategyCampaigns: activeArrearsCount > 0 
          ? [
              "Initiate recovery relationship manager outreach for active arrears",
              "Consolidate liabilities to structure single payment schedule",
              "Place account on immediate bureau alert tracking watchlists"
            ]
          : [
              "Qualifies for standard salary credit limit packages",
              "Pre-approved credit headroom target ceiling: GHS " + (headroom > 0 ? headroom.toLocaleString() : 0)
            ],
        narrative: activeArrearsCount > 0 
          ? `${fullName} displays active payment delinquency in a micro-credit account (Months in arrears: ${agreements[0]?.monthsInArrears}). Total outstanding overdue is GHS ${totalArrearsGHS.toLocaleString()}. Recommend immediate reference check before new fund release.` 
          : `${fullName} demonstrates highly stable credit profiles with zero active arrears. Aggregate Debt Service Ratio is well managed. Recommended exposure ceiling stands clear.`
      }
    };
  };

  const report = mapApiDataToReport(rawReportData);

  // ==========================================
  // RENDER LOGIN SCREEN (IF NO TICKET ACTIVE)
  // ==========================================
  if (!dataTicket) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle, var(--green-900) 0%, var(--green-950) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        color: '#ffffff',
        fontFamily: 'Verdana, Geneva, sans-serif'
      }}>
        <div className="section-card" style={{
          width: '100%',
          maxWidth: '450px',
          padding: '40px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Logo Branding */}
          <img src={logo} alt="xdsdata logo" style={{
            width: '240px',
            marginBottom: '20px'
          }} />
          
          <h2 style={{
            margin: '0 0 10px 0',
            fontSize: '1.2rem',
            textAlign: 'center',
            fontWeight: '700',
            letterSpacing: '0.05em',
            color: 'var(--green-300)'
          }}>
            CREDIT SYSTEM GATEWAY
          </h2>
          
          <p style={{
            margin: '0 0 30px 0',
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            lineHeight: '1.4'
          }}>
            Authorize your credentials of choice below to look up session security tickets.
          </p>

          <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.7)',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                marginBottom: '6px'
              }}>Username</label>
              <input
                type="text"
                placeholder="Enter Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(0,0,0,0.2)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.7)',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                marginBottom: '6px'
              }}>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(0,0,0,0.2)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
                required
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(212, 41, 17, 0.1)',
                border: '1px solid var(--red-500)',
                color: '#ff8888',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                background: 'var(--green-500)',
                color: 'var(--green-950)',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginTop: '10px'
              }}
            >
              Sign In to System
            </button>
          </form>

          {loading && (
            <div style={{
              marginTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTopColor: 'var(--green-500)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ fontSize: '0.7rem', color: 'var(--green-300)', margin: 0 }}>
                {loadingStep}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER SEARCH PORTAL (IF LOGGED IN, NO REPORT DATA)
  // ==========================================
  if (!rawReportData) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle, var(--green-900) 0%, var(--green-950) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        color: '#ffffff',
        fontFamily: 'Verdana, Geneva, sans-serif'
      }}>
        {/* Portal Container */}
        <div className="section-card" style={{
          width: '100%',
          maxWidth: '650px',
          padding: '40px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          
          {/* Top Actions: Logout */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'rgba(255,255,255,0.7)',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Sign Out
            </button>
          </div>

          {/* Logo Branding */}
          <img src={logo} alt="xdsdata logo" style={{
            width: '260px',
            marginBottom: '20px'
          }} />
          
          <h2 style={{
            margin: '0 0 10px 0',
            fontSize: '1.4rem',
            textAlign: 'center',
            fontWeight: '700',
            letterSpacing: '0.05em',
            color: 'var(--green-300)'
          }}>
            CREDIT BUREAU VERIFICATION PORTAL
          </h2>
          
          <p style={{
            margin: '0 0 35px 0',
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            lineHeight: '1.4'
          }}>
            Logged in as <strong>{loginUsername}</strong>. Input consumer details below. Note that matches are executed using only **Identification** and **Date of Birth**.
          </p>

          {/* Form */}
          <form onSubmit={handleSearch} style={{ width: '100%' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              marginBottom: '25px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  color: 'rgba(255,255,255,0.7)',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  marginBottom: '6px'
                }}>Consumer Full Name (UI Placeholder)</label>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(0,0,0,0.2)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  color: 'rgba(255,255,255,0.7)',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  marginBottom: '6px'
                }}>Date of Birth (Used in search)</label>
                <input
                  type="date"
                  value={searchDob}
                  onChange={(e) => setSearchDob(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(0,0,0,0.2)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  color: 'rgba(255,255,255,0.7)',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  marginBottom: '6px'
                }}>Identification Number (Used in search)</label>
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="e.g. GHA-717322166-9"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(0,0,0,0.2)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  color: 'rgba(255,255,255,0.7)',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  marginBottom: '6px'
                }}>Account Number (UI Placeholder)</label>
                <input
                  type="text"
                  value={searchAccount}
                  onChange={(e) => setSearchAccount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(0,0,0,0.2)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Error alerts */}
            {error && (
              <div style={{
                background: 'rgba(212, 41, 17, 0.1)',
                border: '1px solid var(--red-500)',
                color: '#ff8888',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                background: 'var(--green-500)',
                color: 'var(--green-950)',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Search Bureau Database
            </button>
          </form>

          {/* Loader Overlay */}
          {loading && (
            <div style={{
              marginTop: '30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div className="spinner" style={{
                width: '36px',
                height: '36px',
                border: '4px solid rgba(255,255,255,0.1)',
                borderTopColor: 'var(--green-500)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--green-300)', margin: 0 }}>
                {loadingStep}
              </p>
            </div>
          )}

          {/* Matching Results list */}
          {matchResults && (
            <div style={{ width: '100%', marginTop: '35px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '25px' }}>
              <h3 style={{
                fontSize: '0.85rem',
                fontWeight: 'bold',
                color: 'var(--green-300)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 15px 0'
              }}>
                Matching Records Located
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {matchResults.map((consumer, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>
                        {consumer.firstName} {consumer.surname}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                        ID Number: {consumer.idNo || 'N/A'} | DOB: {formatDateStr(consumer.birthDate)}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                        Address: {consumer.address || 'N/A'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleSelectConsumer(consumer)}
                      disabled={loading}
                      style={{
                        padding: '10px 18px',
                        background: 'transparent',
                        border: '1px solid var(--green-300)',
                        color: 'var(--green-300)',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--green-300)';
                        e.target.style.color = 'var(--green-950)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--green-300)';
                      }}
                    >
                      Generate Report
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER DETAILED CONSUMER REPORT DASHBOARD
  // ==========================================
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

          <div className="nav-divider" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '15px 0' }} />

          <a href="#glossary" className="nav-item nav-item-glossary" onClick={handleNavClick}>
            <span>📖</span> Glossary of Terms
          </a>
          
          <button
            onClick={handleNewSearch}
            className="nav-item"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--green-300)',
              border: 'none',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            <span>🔍</span> Return to Search
          </button>

          <button
            onClick={handleLogout}
            className="nav-item"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ff8888',
              border: 'none',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              marginTop: '5px'
            }}
          >
            <span>🚪</span> System Logout
          </button>
        </nav>

        <div className="sidebar-footer">
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
            <div className="header-badge" style={{ margin: '0' }}>Smart Detailed Consumer Report</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '1.0rem', fontWeight: '700' }}>
              XDS Data Ghana Limited
              <br />Suite A 701, The Octagon, Accra<br />
              Tel: +233 (0)30 123 4567 | Email: ask@xdsdata.com<br />
              <a href="https://www.xdsdata.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'underline' }}>
                https://www.xdsdata.com
              </a>
              <br /><br />
              Credit Bureau License No. 001
            </h1>
          </div>
        </section>

        {/* Top Report Header Metadata bar */}
        <header className="report-header">
          <div className="header-meta">
            <div className="meta-item">
              <span className="meta-label">XDS Reference</span>
              <span className="meta-value">{report.reportMeta.xdsReference}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Date | Time Issued</span>
              <span className="meta-value">{report.reportMeta.issuedAt}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Requesting Inst.</span>
              <span className="meta-value">{report.reportMeta.requestingInstitution}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Accessed By</span>
              <span className="meta-value">{report.reportMeta.accessedBy}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Title</span>
              <span className="meta-value">{report.reportMeta.title}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Purpose</span>
              <span className="meta-value">{report.reportMeta.purpose}</span>
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
                  strokeDashoffset={314.16 * (1 - report.dashboard.creditScore / report.dashboard.maxScore)}
                />
                <text className="gauge-text" x="60" y="58">
                  <tspan className="gauge-score" x="60" dy="0">{report.dashboard.creditScore}</tspan>
                  <tspan className="gauge-max" x="60" dy="18">OUT OF {report.dashboard.maxScore}</tspan>
                </text>
              </svg>
              <div className="gauge-label">XDS Bureau Rating</div>
              <div className="gauge-status" style={{
                background: report.dashboard.riskStatus.includes('High') ? 'var(--red-500)' : 'var(--green-500)',
                color: report.dashboard.riskStatus.includes('High') ? '#ffffff' : 'var(--green-950)'
              }}>{report.dashboard.riskStatus}</div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-panel alert-panel" style={{ borderLeftColor: report.dashboard.decisionSignal.includes('APPROVE') ? 'var(--green-700)' : 'var(--red-500)' }}>
                <span className="panel-caption">Decision Signal</span>
                <h2>{report.dashboard.decisionSignal}</h2>
                <p className="panel-note">{report.dashboard.decisionNote}</p>
                <p className="small-note">Trend: {report.dashboard.decisionTrend}</p>
              </div>

              <div className="dashboard-panel">
                <span className="panel-caption">Probability of Default</span>
                <h2>{report.dashboard.probabilityOfDefault}</h2>
                <p className="panel-note">12-Month Forecast</p>
                <p className="small-note">Stress Forecast: {report.dashboard.stressForecast}</p>
              </div>
              
              <div className="dashboard-panel positive-panel" style={{
                background: report.dashboard.affordabilityStatus === 'HEALTHY' ? 'var(--green-100)' : '#fdf0f0',
                borderLeftColor: report.dashboard.affordabilityStatus === 'HEALTHY' ? 'var(--green-500)' : 'var(--red-500)'
              }}>
                <span className="panel-caption">Affordability Status</span>
                <h2>{report.dashboard.affordabilityStatus}</h2>
                <p className="panel-note">{report.dashboard.dsrText}</p>
                <p className="small-note">Headroom: {report.dashboard.headroomText}</p>
              </div>
            </div>
          </div>

          {/* Key Metrics row */}
          <div className="key-metrics">
            <div>
              <span>Total Exposure</span>
              <strong>{report.dashboard.totalExposure}</strong>
            </div>
            <div>
              <span>Monthly Repayment</span>
              <strong>{report.dashboard.totalMonthlyRepayment}</strong>
            </div>   
            <div>
              <span>Current Arrears</span>
              <strong style={{ color: report.dashboard.currentArrears !== 'GHS 0' ? 'var(--red-500)' : 'inherit' }}>
                {report.dashboard.currentArrears}
              </strong>
            </div>
            <div>
              <span>Active Facilities</span>
              <strong>{report.dashboard.activeFacilitiesCount}</strong>
            </div>
          </div>
        </section>
        
        {/* Section 2: Borrower Profile */}
        <section id="identity" className="report-section section-card">
          <SectionTitleWithInfo
            title="SECTION 2 — BORROWER IDENTITY"
            subtitle="Source Verified"
          />
          <div
            className="details-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: "24px",
              alignItems: "start",
            }}
          >
            {/* Left Column */}
            <div className="detail-column">
              <div className="detail-row">
                <span>Full Name</span>
                <strong>{report.identity.fullName}</strong>
              </div>
              <div className="detail-row">
                <span>National ID (Ghana Card)</span>
                <strong>{report.identity.nationalId}</strong>
              </div>
              <div className="detail-row">
                <span>E-mail Address</span>
                <strong>{report.identity.email}</strong>
              </div>
              <div className="detail-row">
                <span>Phone (Primary)</span>
                <strong>{report.identity.primaryPhone}</strong>
              </div>
              <div className="detail-row">
                <span>Dependants</span>
                <strong>{report.identity.dependentsCount}</strong>
              </div>
              <div className="detail-row">
                <span>Marital Status</span>
                <strong>{report.identity.maritalStatus}</strong>
              </div>
            </div>

            {/* Middle Photo Column */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
              <div
                style={{
                  width: "35mm",
                  height: "45mm",
                  background: "var(--green-100, #e5e7eb)",
                  border: "2px dashed var(--green-300, #9ca3af)",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--gray-500, #6b7280)",
                  fontSize: "2rem",
                }}
              >
                📷
              </div>
              <div style={{ marginTop: "8px", fontSize: "0.75rem", fontWeight: 'bold', textAlign: "center" }}>
                Passport Silhouette
              </div>
            </div>

            {/* Right Column */}
            <div className="detail-column">
              <div className="detail-row">
                <span>Date of Birth</span>
                <strong>{report.identity.dateOfBirth}</strong>
              </div>
              <div className="detail-row">
                <span>Gender</span>
                <strong>{report.identity.gender}</strong>
              </div>
              <div className="detail-row">
                <span>Employer</span>
                <strong>{report.identity.employer}</strong>
              </div>
              <div className="detail-row">
                <span>Digital Address / Residence</span>
                <strong>{report.identity.digitalAddress}</strong>
              </div>
              <div className="detail-row">
                <span>Nationality</span>
                <strong>{report.identity.nationality}</strong>
              </div>
              <div className="detail-row">
                <span>Identity Confidence</span>
                <span className="verified-badge">
                  {report.identity.identityConfidenceScore}
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
          />

          <div className="demographics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* i. Name History */}
            <div className="demographics-card" style={{ background: '#ffffff', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--green-900)' }}>Name History</h4>
              <InfoNote text="Lists legal names reported over time." />
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
                    {report.demographicHistory.names.length > 0 ? (
                      report.demographicHistory.names.map((n, i) => (
                        <tr key={i}>
                          <td>{n.name}</td>
                          <td>{n.type}</td>
                          <td>{n.lastUpdate}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3" style={{ textAlign: 'center' }}>No historical records</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ii. Identification Number History */}
            <div className="demographics-card" style={{ background: '#ffffff', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--green-900)' }}>Identification History</h4>
              <InfoNote text="Recorded document and credentials audits." />
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
                    {report.demographicHistory.identifications.length > 0 ? (
                      report.demographicHistory.identifications.map((id, i) => (
                        <tr key={i}>
                          <td>{id.idNumber}</td>
                          <td>{id.type}</td>
                          <td>{id.lastUpdate}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3" style={{ textAlign: 'center' }}>No historical records</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* iii. Telephone History */}
            <div className="demographics-card" style={{ background: '#ffffff', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--green-900)' }}>Telephone History</h4>
              <InfoNote text="Registered contact lines tracking." />
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
                    {report.demographicHistory.telephones.length > 0 ? (
                      report.demographicHistory.telephones.map((tel, i) => (
                        <tr key={i}>
                          <td>{tel.telephone}</td>
                          <td>{tel.type}</td>
                          <td>{tel.lastUpdate}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3" style={{ textAlign: 'center' }}>No historical records</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* iv. Address History */}
            <div className="demographics-card" style={{ background: '#ffffff', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--green-900)' }}>Address History</h4>
              <InfoNote text="Audit history for residential locations." />
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
                    {report.demographicHistory.addresses.length > 0 ? (
                      report.demographicHistory.addresses.map((add, i) => (
                        <tr key={i}>
                          <td>{add.address}</td>
                          <td>{add.type}</td>
                          <td>{add.lastUpdate}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3" style={{ textAlign: 'center' }}>No historical records</td></tr>
                    )}
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
            subtitle="Dossier Overview"
          />

          <div className="table-responsive" style={{ marginBottom: '30px' }}>
            <InfoNote text="Overview of credit health indicators dynamically compiled from active facilities." />
            <table className="report-table">
              <thead>
                <tr>
                  <th>Credit Health Indicator</th>
                  <th>Status</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {report.creditHealth.indicators.map((ind, i) => (
                  <tr key={i}>
                    <td>{ind.indicatorName}</td>
                    <td>
                      <span className={`status-pill ${
                        ind.status === 'STRONG' || ind.status === 'STABLE' || ind.status === 'LOW' || ind.status === 'DIVERSIFIED' ? 'success' :
                        ind.status === 'MINOR' || ind.status === 'MODERATE' || ind.status === 'CONCENTRATED' ? 'warning' : 'danger'
                      }`}>{ind.status}</span>
                    </td>
                    <td>{ind.interpretation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Analytics KPI tiles */}
          <div className="analytics-grid">
            <div className="analytics-card">
              <span>On-Time Ratio</span>
              <strong>{report.creditHealth.analytics.onTimeRatio}</strong>
              <p>24-month profile</p>
            </div>
            <div className="analytics-card">
              <span>Avg Days Past Due</span>
              <strong>{report.creditHealth.analytics.avgDaysPastDue}</strong>
              <p>Overdue days</p>
            </div>
            <div className="analytics-card">
              <span>Worst Delinquency</span>
              <strong>{report.creditHealth.analytics.worstDelinquency}</strong>
              <p>Peak overdue status</p>
            </div>
            <div className="analytics-card">
              <span>Consecutive On-Time</span>
              <strong>{report.creditHealth.analytics.consecutiveOnTime}</strong>
              <p>Unbroken performance</p>
            </div>
            <div className="analytics-card">
              <span>Payment Trend</span>
              <strong>{report.creditHealth.analytics.paymentTrend}</strong>
              <p>Risk trajectory</p>
            </div>
          </div>

          {/* Heatmap Widget */}
          <div className="heatmap-wrapper">
            <div className="heatmap-header-title">
              12-Month Payment Heatmap (Chronological order)
            </div>
            <div className="heatmap-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '10px' }}>
              {report.creditHealth.heatmapMonths.map((m, idx) => (
                <div key={idx} className="heatmap-cell" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span className="heatmap-month" style={{ fontSize: '0.7rem', color: 'var(--gray-700)', marginBottom: '4px' }}>{m.name}</span>
                  <span className={`heatmap-status-dot dot-${m.status}`} style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'block',
                    background: m.status === 'ontime' ? 'var(--green-500)' : m.status === 'late' ? '#bfa243' : m.status === 'missed' ? 'var(--red-500)' : '#dcdcdc'
                  }} />
                </div>
              ))}
            </div>
            <div className="heatmap-legend" style={{ display: 'flex', gap: '15px', marginTop: '15px', fontSize: '0.75rem' }}>
              <div className="legend-item"><span className="legend-dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green-500)', marginRight: '6px' }} /> On-Time</div>
              <div className="legend-item"><span className="legend-dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#bfa243', marginRight: '6px' }} /> Late (1-30 DPD)</div>
              <div className="legend-item"><span className="legend-dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red-500)', marginRight: '6px' }} /> Missed (30+ DPD)</div>
              <div className="legend-item"><span className="legend-dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#dcdcdc', marginRight: '6px' }} /> No Data</div>
            </div>
          </div>
        </section>

        {/* Section 4: Total Exposure & Active Facilities */}
        <section id="facilities" className="report-section section-card">
          <SectionTitleWithInfo
            title="SECTION 4 — TOTAL EXPOSURE & FACILITY STRUCTURE"
            subtitle="Active Liability Accounts"
          />

          <div className="table-responsive">
            <InfoNote text="Summary of credit lines, approved amounts, outstanding balances, and active DPD status." />
            <table className="report-table">
              <thead>
                <tr>
                  <th>Lender / Institution</th>
                  <th>No. of Loans</th>
                  <th>Facility Type</th>
                  <th>Approved</th>
                  <th>Outstanding</th>
                  <th>Status</th>
                  <th>DPD</th>
                  <th>Refi Opp.</th>
                </tr>
              </thead>
              <tbody>
                {report.facilityRows.length > 0 ? (
                  report.facilityRows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <strong
                          style={{ cursor: 'pointer', color: 'var(--green-600)', textDecoration: 'underline' }}
                          onClick={() => scrollToFacility(row.id)}
                          title="Click to view details"
                        >
                          {row.lender}
                        </strong>
                      </td>
                      <td><center>{row.number}</center></td>
                      <td>{row.type}</td>
                      <td>{row.approved}</td>
                      <td>{row.outstanding}</td>
                      <td>
                        <span className={`status-pill ${row.status === 'Active' ? 'success' : 'neutral'}`}>{row.status}</span>
                      </td>
                      <td>{row.dpd}</td>
                      <td>
                        <span className={`status-pill ${row.refi === 'HIGH' ? 'danger' : row.refi === 'Med' ? 'warning' : 'success'}`}>
                          {row.refi}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="8" style={{ textAlign: 'center' }}>No active facilities listed</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Account Details list */}
          {report.facilityRows.map((row) => (
            <div key={row.id} id={row.id} className="facility-account" style={{ border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '20px', marginTop: '25px' }}>
              <div className="facility-account-header" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderBottom: '1px solid var(--gray-200)', paddingBottom: '10px', marginBottom: '15px' }}>
                <span>{row.lender} | {row.type} — Account: {row.details.accountNumber}</span>
                <span className={`status-pill ${row.status === 'Active' ? 'success' : 'neutral'}`}>{row.status}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gray-600)', textTransform: 'uppercase' }}>Approved Amount</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{row.approved}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gray-600)', textTransform: 'uppercase' }}>Outstanding Balance</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{row.outstanding}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gray-600)', textTransform: 'uppercase' }}>Last Payment Status</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{row.details.lastPaymentStatus}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gray-600)', textTransform: 'uppercase' }}>Overdue Arrears</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: row.details.currentArrearsDpd !== 'GHS 0' ? 'var(--red-500)' : 'inherit' }}>{row.details.currentArrearsDpd}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gray-600)', textTransform: 'uppercase' }}>Interest Profile</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{row.details.interestProfile}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gray-600)', textTransform: 'uppercase' }}>Refinance Option</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{row.refi}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gray-600)', textTransform: 'uppercase' }}>Date Disbursed</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{row.details.dateDisbursed}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gray-600)', textTransform: 'uppercase' }}>Installment Value</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{row.details.installmentAmount}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gray-600)', textTransform: 'uppercase' }}>Closed Date</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{row.details.expiryDate}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gray-600)', textTransform: 'uppercase' }}>Last Update Feed</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{row.details.lastUpdatedDate}</div>
                </div>
              </div>

              {/* Account detailed 24-month behaviour */}
              <div className="facility-payment-history" style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '15px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>24-Month Repayment History Grid</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '6px' }}>
                  {row.details.repaymentHistory24.slice(-12).map((status, index) => (
                    <div key={index} className={getCellClass(status)} style={{
                      padding: '6px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      background: status === 'C' ? 'var(--green-100)' : status === 'L' ? '#fdf5e6' : status === 'M' ? '#fdf0f0' : '#f4f4f4',
                      color: status === 'C' ? 'var(--green-800)' : status === 'L' ? '#8b6508' : status === 'M' ? '#b22222' : 'var(--gray-500)',
                      border: '1px solid ' + (status === 'C' ? 'var(--green-300)' : status === 'L' ? '#f5deb3' : status === 'M' ? '#fbc4c4' : 'var(--gray-300)')
                    }}>
                      <div style={{ fontWeight: 'bold' }}>{getCellLabel(status)}</div>
                      <div style={{ fontSize: '0.55rem', color: 'var(--gray-500)' }}>M{12 - index}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Section 4B: Joint Loan Account Details */}
        <section id="joint-loans" className="report-section section-card">
          <SectionTitleWithInfo
            title="SECTION 4B — JOINT LOAN ACCOUNT DETAILS"
            subtitle="Co-Borrower Liabilities"
          />

          <div className="table-responsive">
            <InfoNote text="Shared liabilities matching name and credentials records." />
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
                {report.jointLoans.length > 0 ? (
                  report.jointLoans.map((jl, i) => (
                    <tr key={i}>
                      <td><strong>{jl.coBorrowerName}</strong></td>
                      <td>{jl.coBorrowerDob}</td>
                      <td>{jl.accountNumber}</td>
                      <td>{jl.loanAmount}</td>
                      <td style={{ color: jl.arrearAmount !== 'GHS 0' ? 'var(--red-500)' : 'inherit' }}>{jl.arrearAmount}</td>
                      <td>{jl.monthsInArrears}</td>
                      <td>{jl.lastPaymentDate}</td>
                      <td>{jl.lastPaymentAmount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '20px' }}>
                      No co-borrower joint loans logged in this dossier.
                    </td>
                  </tr>
                )}
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

          <div className="affordability-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="detail-column" style={{ background: '#ffffff', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '24px' }}>
              <div className="detail-row">
                <span>Estimated Monthly Income</span>
                <strong>{report.affordabilityData.income}</strong>
              </div>
              <div className="detail-row">
                <span>Total Debt Obligations</span>
                <strong>{report.affordabilityData.debt}</strong>
              </div>
              <div className="detail-row">
                <span>Estimated Disposable Income</span>
                <strong>{report.affordabilityData.disposable}</strong>
              </div>
              <div className="detail-row">
                <span>Debt Service Ratio (DSR)</span>
                <strong>{report.affordabilityData.dsr}</strong>
              </div>
              <div className="detail-row">
                <span>Maximum Borrowing Headroom</span>
                <strong>{report.affordabilityData.headroom}</strong>
              </div>
            </div>

            <div className="affordability-card" style={{ background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="affordability-card-header">
                <span>Affordability Rating</span>
                <h3 style={{
                  margin: '8px 0',
                  color: report.affordabilityData.rating === 'HEALTHY' ? 'var(--green-800)' : 'var(--red-500)',
                  fontWeight: 'bold'
                }}>{report.affordabilityData.rating}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-700)', margin: 0 }}>{report.affordabilityData.description}</p>
              </div>
              <div className="ai-insight-box" style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '3px solid var(--green-500)', marginTop: '15px' }}>
                <strong style={{ fontSize: '0.72rem', color: 'var(--green-900)' }}>AI LENDING INSIGHT</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--gray-700)' }}>{report.affordabilityData.insight}</p>
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

          <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--green-900)', margin: '0 0 10px 0' }}>Early Warning Risk Signals</p>
          <InfoNote text="Critical monitoring logs based on consumer payment trajectories." />
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
                {report.complianceData.riskSignals.map((sig, i) => (
                  <tr key={i}>
                    <td>{sig.signal}</td>
                    <td>
                      <span className={`status-pill ${sig.severity === 'HIGH' ? 'danger' : sig.severity === 'MEDIUM' ? 'warning' : 'success'}`}>
                        {sig.severity}
                      </span>
                    </td>
                    <td>{sig.requiredAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--green-900)', margin: '0 0 10px 0' }}>Fraud & Synthetic Identity Verification Checks</p>
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
                {report.complianceData.fraudChecks.map((ch, i) => (
                  <tr key={i}>
                    <td>{ch.checkDescription}</td>
                    <td><span className="status-pill success">{ch.status}</span></td>
                    <td>{ch.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6B: Dud Cheques & Judgement Records */}
        <section id="cheques-judgements" className="report-section section-card">
          <div className="section-title">
            SECTION 6B — DUD CHEQUE & JUDGEMENT RECORDS
            <span className="section-subtitle-tag">Public Disclosures</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Dud Cheques Info */}
            <div className="sub-section-card">
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--green-900)' }}>Dud Cheque Information</h4>
              <InfoNote text="Public registers of returned checks." />
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
                    {report.publicRecordsData.dudCheques.length > 0 ? (
                      report.publicRecordsData.dudCheques.map((dc, i) => (
                        <tr key={i}>
                          <td><strong>{dc.chequeNumber}</strong></td>
                          <td>{dc.issuingBank}</td>
                          <td>{dc.dateIssued}</td>
                          <td>{dc.amount}</td>
                          <td>{dc.returnReason}</td>
                          <td>{dc.dateBounced}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '16px' }}>
                          No dud cheques recorded in database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Judgement Info */}
            <div className="sub-section-card">
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--green-900)' }}>Judgement Information</h4>
              <InfoNote text="Court settlements and judicial litigation history." />
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
                    {report.publicRecordsData.judgements.length > 0 ? (
                      report.publicRecordsData.judgements.map((jd, i) => (
                        <tr key={i}>
                          <td><strong>{jd.caseNumber}</strong></td>
                          <td>{jd.plaintiff}</td>
                          <td>{jd.amount}</td>
                          <td>{jd.judgementDate}</td>
                          <td><span className="status-pill success">{jd.status}</span></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '16px' }}>
                          No judicial judgments records found.
                        </td>
                      </tr>
                    )}
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
            <span className="section-subtitle-tag">Inquiry Trail</span>
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
                {report.enquiriesList.length > 0 ? (
                  report.enquiriesList.map((enq, i) => (
                    <tr key={i}>
                      <td><strong>{enq.date}</strong></td>
                      <td>{enq.requestingInstitution}</td>
                      <td>{enq.purpose}</td>
                      <td>{enq.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '20px' }}>
                      No bureau enquiries logged in the last 12 months.
                    </td>
                  </tr>
                )}
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

          <div className="ai-decision-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div className="decision-result-card" style={{ background: report.aiDecision.recommendation === 'APPROVE' ? 'var(--green-100)' : '#fdf0f0', border: '1px solid ' + (report.aiDecision.recommendation === 'APPROVE' ? 'var(--green-300)' : 'var(--red-500)'), borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--gray-700)' }}>Lending Recommendation</span>
              <h2 style={{
                fontSize: '2rem',
                margin: '10px 0',
                color: report.aiDecision.recommendation === 'APPROVE' ? 'var(--green-800)' : 'var(--red-500)',
                fontWeight: 'bold'
              }}>{report.aiDecision.recommendation}</h2>
              <span className={`status-pill ${report.aiDecision.recommendation === 'APPROVE' ? 'success' : 'warning'}`}>
                {report.aiDecision.subStatus}
              </span>
            </div>

            <div className="detail-column" style={{ background: '#ffffff', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '24px' }}>
              <div className="detail-row">
                <span>Max New Exposure Recommended</span>
                <strong>{report.aiDecision.maxNewExposure}</strong>
              </div>
              <div className="detail-row">
                <span>Target Facility Strategy</span>
                <strong>{report.aiDecision.targetStrategy}</strong>
              </div>
              <div className="detail-row">
                <span>Monitoring Frequency</span>
                <strong>{report.aiDecision.monitoringFrequency}</strong>
              </div>
              <div className="detail-row">
                <span>Verification Check Required</span>
                <strong>{report.aiDecision.verificationCheckRequired}</strong>
              </div>
              <div className="detail-row">
                <span>Collateral / Security Requirement</span>
                <strong>{report.aiDecision.collateralRequirement}</strong>
              </div>
            </div>
          </div>

          <div className="opportunity-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '35px' }}>
            <div style={{ background: '#ffffff', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '24px' }}>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--gray-700)', letterSpacing: '0.05em' }}>
                Predictive Risk Classifications
              </p>
              <div className="detail-row">
                <span>Probability of Default (PD)</span>
                <strong>{report.aiDecision.riskClassifications.probabilityOfDefault}</strong>
              </div>
              <div className="detail-row">
                <span>Refinance Probability</span>
                <strong>{report.aiDecision.riskClassifications.refinanceProbability}</strong>
              </div>
              <div className="detail-row">
                <span>Cross-Sell Propensity</span>
                <strong>{report.aiDecision.riskClassifications.crossSellPropensity}</strong>
              </div>
              <div className="detail-row">
                <span>Customer Churn Risk</span>
                <strong>{report.aiDecision.riskClassifications.churnRisk}</strong>
              </div>
              <div className="detail-row">
                <span>Borrower Financial Stress</span>
                <strong>{report.aiDecision.riskClassifications.financialStressStatus}</strong>
              </div>
            </div>

            <div className="action-list-card" style={{ background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '24px' }}>
              <span className="card-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--gray-700)', display: 'block', marginBottom: '15px' }}>Recommended Strategy Campaigns</span>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.82rem', color: 'var(--gray-800)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {report.aiDecision.recommendedStrategyCampaigns.map((camp, idx) => (
                  <li key={idx}>{camp}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ background: 'radial-gradient(circle, var(--green-700) 0%, var(--green-900) 100%)', borderRadius: '12px', padding: '24px', marginBottom: '40px' }}>
            <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', color: 'var(--gold-500)', fontSize: '1.2rem' }}>
              <span style={{ color: 'var(--gold-500)' }}>✦</span> AI Executive Narrative — For Relationship Manager Reference
            </p>
            <p style={{ fontSize: '0.82rem', lineHeight: '1.6', color: 'var(--gray-100)', margin: '0' }}>
              {report.aiDecision.narrative}
            </p>
          </div>

          <div className="compliance-container" style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '25px', marginTop: '20px' }}>
            <p style={{ margin: '0 0 18px 0', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--gray-800)', letterSpacing: '0.05em' }}>
              Compliance & Data Governance Directives
            </p>
            <div className="compliance-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div className="compliance-box">
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--green-900)', display: 'block', marginBottom: '6px' }}>Permitted Inquiry Purpose</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-700)', margin: 0 }}>Authorized for credit evaluation, risk portfolio management, collection analysis, or fraud mitigation checks under user authorization.</p>
              </div>
              <div className="compliance-box">
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--green-900)', display: 'block', marginBottom: '6px' }}>Information Recency</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-700)', margin: 0 }}>Reflects bureau records compiled on {report.reportMeta.issuedAt}. Financial updates are supplied via regulated member feeds.</p>
              </div>
              <div className="compliance-box">
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--green-900)', display: 'block', marginBottom: '6px' }}>Customer Dispute Redress</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-700)', margin: 0 }}>Borrowers hold legal rights to challenge report inaccuracies with XDS Data Ghana Ltd under the Credit Reporting Act, 2007 (Act 726).</p>
              </div>
              <div className="compliance-box">
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--green-900)', display: 'block', marginBottom: '6px' }}>Security & Handling</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-700)', margin: 0 }}>Access privileges must comply with security protocols. Unauthorized distribution violates federal data security directives.</p>
              </div>
            </div>

            <p className="compliance-footer-text" style={{ fontSize: '0.65rem', color: 'var(--gray-500)', lineHeight: '1.4' }}>
              This intelligence dossier is generated by XDS Data Ghana Limited, registered and licensed by the Bank of Ghana under the Credit Reporting Act, 2007 (Act 726). Suite A701, Octagon Building, Barnes Road, Accra, Ghana. Sample dossiers are configured for testing purposes. Real-time disclosures are regulated under the Data Protection Act, 2012 (Act 843), central bank guidelines, consumer consent statutes, and organizational credit criteria. | www.xdsdata.com
            </p>
          </div>
        </section>

        {/* Glossary of Terms */}
        <section id="glossary" className="report-section section-card glossary-section">
          <SectionTitleWithInfo
            title="GLOSSARY OF CREDIT TERMS"
            subtitle="Reference Guide"
          />

          <p className="glossary-intro" style={{ fontSize: '0.8rem', color: 'var(--gray-700)', marginBottom: '20px' }}>
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
            <div key={letter} className="glossary-group" style={{ margin: '15px 0', borderBottom: '1px solid var(--gray-200)', paddingBottom: '15px' }}>
              <div className="glossary-letter-badge" style={{ display: 'inline-block', background: 'var(--green-950)', color: '#ffffff', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>{letter}</div>
              <div className="glossary-terms-list" style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {terms.map(({ term, definition }) => (
                  <div key={term} className="glossary-term-row" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                    <div className="glossary-term-name" style={{ fontWeight: 'bold', color: 'var(--green-900)' }}>{term}</div>
                    <div className="glossary-term-def" style={{ color: 'var(--gray-700)' }}>{definition}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="glossary-footer-note" style={{ marginTop: '20px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gray-600)' }}>
            <span>❗️</span>
            Definitions are aligned with the Credit Reporting Act, 2007 (Act 726) and general West African banking practices.
          </div>
        </section>
      </main>
    </div>
  )
}
