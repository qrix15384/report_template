# Smart Detailed Consumer Report - Developer API Integration Guide

This guide describes how to connect the React front-end ([CreditReport.jsx](file:///Users/ChrisAfflu/Downloads/report_template/report_template/Report%20Template/src/CreditReport.jsx)) to backend API services. It documents the proposed endpoints, unified payload structure, and tabulates all UI fields to their JSON representations.

> [!NOTE]
> All sample values in this document reflect the test data of **Kwame Mensah** (XDS Reference: `123456`) in the current UI template.

---

## 1. Unified API Endpoint

We recommend a single REST API endpoint to retrieve the complete credit dossier for a borrower. This avoids multiple round-trips and ensures the report renders atomically.

### Request Details
* **Method:** `GET`
* **Path:** `/api/v1/credit-reports/{referenceId}`
* **Headers:**
  * `Authorization: Bearer <token>` (Required)
  * `Accept: application/json`

---

## 2. Complete JSON Schema Payload Example

Developers should implement their backend responses to match this structure. This payload covers all dynamic sections of the report.

```json
{
  "reportMetadata": {
    "xdsReference": "123456",
    "issuedAt": "2026-05-17T15:46:00Z",
    "requestingInstitution": "ABC Rural Bank Ltd.",
    "accessedBy": {
      "name": "Abena Amponsah",
      "title": "Regional Manager"
    },
    "purpose": "Credit Assessment",
    "confidentiality": "CONFIDENTIAL"
  },
  "scoreDashboard": {
    "creditScore": 742,
    "scoreMax": 900,
    "riskStatus": "Low Risk",
    "decisionSignal": "APPROVE",
    "decisionNote": "With Conditions",
    "decisionTrend": "Improving",
    "probabilityOfDefault": 0.038,
    "stressForecast": "Stable",
    "affordabilityStatus": "HEALTHY",
    "dsrPercentage": 34.0,
    "headroomAmount": 45000.0,
    "totalExposure": 118000.0,
    "totalMonthlyRepayment": 8500.0,
    "currentArrears": 0.0,
    "activeFacilitiesCount": 3
  },
  "borrowerIdentity": {
    "fullName": "Kwame Mensah",
    "nationalId": "GHA-123456789-1",
    "email": "odmosm@gmail.com",
    "primaryPhone": "0244 123 456",
    "dependentsCount": 3,
    "maritalStatus": "Married",
    "dateOfBirth": "1985-03-14",
    "gender": "Male",
    "employer": "Self-Employed / SME",
    "digitalAddress": "GS-234-2345",
    "nationality": "Ghanaian",
    "identityConfidenceScore": 1.0,
    "portraitPhotoUrl": null
  },
  "demographicHistory": {
    "nameHistory": [
      {
        "name": "Kwame Mensah",
        "type": "Current Legal Name",
        "lastUpdated": "2026-05-17"
      },
      {
        "name": "Kwame Agyapong Mensah",
        "type": "Alias / Prior Name",
        "lastUpdated": "2023-03-12"
      }
    ],
    "idHistory": [
      {
        "idNumber": "GHA-721098421-3",
        "type": "Ghana Card (National ID)",
        "lastUpdated": "2022-02-14"
      },
      {
        "idNumber": "H123456789",
        "type": "Passport ID (Expired)",
        "lastUpdated": "2018-01-10"
      },
      {
        "idNumber": "DL-092813-A",
        "type": "Drivers License",
        "lastUpdated": "2021-08-05"
      }
    ],
    "phoneHistory": [
      {
        "telephone": "+233 24 412 3456",
        "type": "Primary Mobile",
        "lastUpdated": "2026-05-17"
      },
      {
        "telephone": "+233 20 811 9988",
        "type": "Secondary Mobile",
        "lastUpdated": "2024-11-04"
      },
      {
        "telephone": "+233 30 222 1100",
        "type": "Residential Landline",
        "lastUpdated": "2020-09-18"
      }
    ],
    "addressHistory": [
      {
        "address": "H/No 45, Ablekuma, Accra",
        "type": "Primary Residential",
        "lastUpdated": "2026-05-17"
      },
      {
        "address": "Apt 2B, East Legon, Accra",
        "type": "Previous Residential",
        "lastUpdated": "2024-12-11"
      },
      {
        "address": "P.O. Box GP 192, Accra",
        "type": "Mailing Address",
        "lastUpdated": "2022-02-14"
      }
    ]
  },
  "creditHealth": {
    "indicators": [
      {
        "indicatorName": "Repayment Consistency",
        "status": "STRONG",
        "interpretation": "93% on-time payment rate over 24 months"
      },
      {
        "indicatorName": "Delinquency History",
        "status": "MINOR",
        "interpretation": "Worst DPD: 30 days (historic). No current arrears."
      },
      {
        "indicatorName": "Over-Indebtedness Risk",
        "status": "LOW",
        "interpretation": "DSR 34% — below the 40% caution threshold"
      },
      {
        "indicatorName": "Recent Credit-Seeking",
        "status": "MODERATE",
        "interpretation": "High enquiry volume in past 90 days — verify new facilities"
      },
      {
        "indicatorName": "Loan Concentration Risk",
        "status": "DIVERSIFIED",
        "interpretation": "Exposure spread across bank, fintech and savings & loans"
      },
      {
        "indicatorName": "Financial Stress Signals",
        "status": "STABLE",
        "interpretation": "No salary interruption or digital stress borrowing detected"
      }
    ],
    "analytics": {
      "onTimeRatio": 93,
      "avgDaysPastDue": 4,
      "worstDelinquency": "30 DPD",
      "consecutiveOnTimeMonths": 14,
      "paymentTrend": "Improving"
    },
    "heatmap": [
      { "month": "May", "status": "ontime" },
      { "month": "Jun", "status": "ontime" },
      { "month": "Jul", "status": "ontime" },
      { "month": "Aug", "status": "ontime" },
      { "month": "Sep", "status": "ontime" },
      { "month": "Oct", "status": "ontime" },
      { "month": "Nov", "status": "ontime" },
      { "month": "Dec", "status": "ontime" },
      { "month": "Jan", "status": "late" },
      { "month": "Feb", "status": "ontime" },
      { "month": "Mar", "status": "ontime" },
      { "month": "Apr", "status": "ontime" }
    ]
  },
  "facilities": [
    {
      "id": "facility-absa",
      "lender": "Absa Bank Ghana",
      "numberOfLoans": 1,
      "type": "Personal Loan",
      "approvedAmount": 80000.0,
      "outstandingBalance": 42000.0,
      "status": "Performing",
      "dpd": 0,
      "refinanceOpportunity": "Med",
      "details": {
        "accountNumber": "90981737382",
        "lastPaymentStatus": "ON TIME",
        "currentArrearsDpd": 0,
        "interestProfile": "STANDARD",
        "dateDisbursed": "2022-03-03",
        "installmentAmount": 1200.0,
        "expiryDate": "2025-03-03",
        "lastUpdatedDate": "2023-03-03",
        "repaymentHistory24": ["C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C"]
      }
    },
    {
      "id": "facility-mtn",
      "lender": "MTN Momo Loan",
      "numberOfLoans": 1,
      "type": "Digital Loan",
      "approvedAmount": 10000.0,
      "outstandingBalance": 4500.0,
      "status": "Performing",
      "dpd": 0,
      "refinanceOpportunity": "Low",
      "details": {
        "accountNumber": "876543",
        "lastPaymentStatus": "ON TIME",
        "currentArrearsDpd": 0,
        "interestProfile": "HIGH",
        "dateDisbursed": "2022-03-03",
        "installmentAmount": 1200.0,
        "expiryDate": "2025-03-03",
        "lastUpdatedDate": "2023-03-03",
        "repaymentHistory24": ["C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "L", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C"]
      }
    },
    {
      "id": "facility-bayport",
      "lender": "Bayport Savings & Loans",
      "numberOfLoans": 1,
      "type": "SME-linked Loan",
      "approvedAmount": 160000.0,
      "outstandingBalance": 71500.0,
      "status": "Performing",
      "dpd": 0,
      "refinanceOpportunity": "HIGH",
      "details": {
        "accountNumber": "LG7787YY5435",
        "lastPaymentStatus": "ON TIME",
        "currentArrearsDpd": 0,
        "interestProfile": "HIGH",
        "dateDisbursed": "2022-03-03",
        "installmentAmount": 1200.0,
        "expiryDate": "2025-03-03",
        "lastUpdatedDate": "2023-03-03",
        "repaymentHistory24": ["C", "C", "C", "C", "C", "C", "L", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "M", "L", "C", "C", "C", "C"]
      }
    }
  ],
  "jointLoans": [
    {
      "coBorrowerName": "Ama Serwaa Mensah",
      "coBorrowerDob": "1989-06-22",
      "accountNumber": "JL-228192A",
      "loanAmount": 250000.0,
      "arrearAmount": 0.0,
      "monthsInArrears": 0,
      "lastPaymentDate": "2028-12-15",
      "lastPaymentAmount": 12500.0
    },
    {
      "coBorrowerName": "Kojo Amponsah",
      "coBorrowerDob": "1980-10-10",
      "accountNumber": "JL-559128B",
      "loanAmount": 120000.0,
      "arrearAmount": 4200.0,
      "monthsInArrears": 1,
      "lastPaymentDate": "2026-05-30",
      "lastPaymentAmount": 5000.0
    }
  ],
  "affordability": {
    "estimatedMonthlyIncome": 25000.0,
    "totalDebtObligations": 8500.0,
    "estimatedDisposableIncome": 10800.0,
    "dsrPercentage": 34.0,
    "maxBorrowingHeadroom": 45000.0,
    "rating": "HEALTHY",
    "ratingDescription": "Debt Service Ratio of 34% is below the 40% caution limit threshold.",
    "aiLendingInsight": "Kwame can absorb additional moderate credit exposure safely. Recommended max new facility: GHS 45,000."
  },
  "compliance": {
    "riskSignals": [
      {
        "signal": "Increase in credit enquiries",
        "severity": "MEDIUM",
        "requiredAction": "Review purpose and timing of recent applications before new approval"
      },
      {
        "signal": "Short-term digital borrowing",
        "severity": "LOW",
        "requiredAction": "Monitor for emerging pattern — no immediate action required"
      },
      {
        "signal": "Exposure growth in last 90 days",
        "severity": "MEDIUM",
        "requiredAction": "Verify against declared income and confirm total current obligations"
      },
      {
        "signal": "Missed payment trend",
        "severity": "LOW",
        "requiredAction": "Historical only — no current negative trend detected"
      }
    ],
    "fraudChecks": [
      {
        "checkDescription": "Identity Document Match",
        "status": "VERIFIED",
        "details": "Ghana Card details match national identity database"
      },
      {
        "checkDescription": "Phone Number Consistency",
        "status": "STABLE",
        "details": "Mobile number correlates consistently with borrower bureau record"
      },
      {
        "checkDescription": "Device Risk Indicator",
        "status": "LOW",
        "details": "No anomalous device tags or high-risk location logs"
      },
      {
        "checkDescription": "Synthetic Identity Risk",
        "status": "LOW",
        "details": "History and profiles show zero synthetic composite traits"
      },
      {
        "checkDescription": "Multi-ID Usage Flag",
        "status": "NONE",
        "details": "Zero active instances of duplicate identity credentials"
      },
      {
        "checkDescription": "Adverse Court Records Check",
        "status": "NONE",
        "details": "No active legal judgments, bankruptcies, or court disputes"
      }
    ]
  },
  "publicRecords": {
    "dudCheques": [
      {
        "chequeNumber": "CHQ-99881",
        "issuingBank": "Standard Chartered",
        "dateIssued": "2025-01-10",
        "amount": 15000.0,
        "currency": "GHS",
        "returnReason": "Insufficient Funds",
        "dateBounced": "2025-01-12"
      },
      {
        "chequeNumber": "GHS-009881",
        "issuingBank": "Absa Bank Ghana Ltd",
        "dateIssued": "2024-06-12",
        "amount": 50000.0,
        "currency": "USD",
        "returnReason": "Fraud",
        "dateBounced": "2024-06-12"
      }
    ],
    "courtJudgements": [
      {
        "caseNumber": "Accra High Court / H1-992-25",
        "plaintiff": "Lighthouse Properties Ltd.",
        "amount": 85000.0,
        "currency": "GHS",
        "judgementDate": "2025-10-14",
        "status": "SATISFIED"
      }
    ]
  },
  "enquiryHistory": [
    {
      "date": "2026-05-17T15:46:00Z",
      "requestingInstitution": "ABC Rural Bank Ltd.",
      "purpose": "Credit Assessment",
      "amount": 50000.0,
      "currency": "GHS"
    },
    {
      "date": "2026-05-04T11:20:00Z",
      "requestingInstitution": "Fidelity Bank Ghana",
      "purpose": "Loan Application Review",
      "amount": 100000.0,
      "currency": "GHS"
    },
    {
      "date": "2026-04-18T09:15:00Z",
      "requestingInstitution": "MTN Momo Loan",
      "purpose": "Revolving Digital Credit Line",
      "amount": 10000.0,
      "currency": "GHS"
    },
    {
      "date": "2026-03-12T16:50:00Z",
      "requestingInstitution": "Ecobank Ghana Ltd.",
      "purpose": "Credit Card Application",
      "amount": 25000.0,
      "currency": "GHS"
    }
  ],
  "aiDecisionEngine": {
    "recommendation": "APPROVE",
    "conditions": "With Conditions",
    "maxNewExposure": 45000.0,
    "targetStrategy": "Consolidation recommended",
    "monitoringFrequency": "Monthly bureau triggers",
    "verificationCheckRequired": "Updated primary bank statements",
    "collateralRequirement": "Not mandatory",
    "riskClassifications": {
      "probabilityOfDefault": 0.038,
      "refinanceProbability": "HIGH (Consolidation candidate)",
      "crossSellPropensity": "VERY HIGH (Salary, insurance)",
      "churnRisk": "MEDIUM (RM retention campaigns)",
      "financialStressStatus": "STABLE (No active triggers)"
    },
    "recommendedStrategyCampaigns": [
      "Offer debt consolidation structure to reduce third-party risk",
      "Qualifies for pre-approved salary overdraft or business card limit increase",
      "Cross-sell insurance-backed loan products to hedge exposure",
      "Assign proactive relationship manager check-ins to handle competitor refinance poaching",
      "Pre-approved credit headroom ceiling: GHS 45,000"
    ],
    "executiveNarrative": "Kwame Mensah demonstrates highly consistent payment behavior with an improving streak over the past 14 consecutive months..."
  }
}
```

---

## 3. Tabulated Field-to-API Mappings

The tables below break down the mappings of report components to API JSON paths.

### 3.1 Banner & Overview Metadata (Header Bar)

| UI Label / Element | JSON Path | Data Type | Sample Value | Notes / Description |
| :--- | :--- | :--- | :--- | :--- |
| **XDS Reference** | `reportMetadata.xdsReference` | `String` | `"123456"` | Unique reference for this run |
| **Date \| Time Issued** | `reportMetadata.issuedAt` | `String` (ISO 8601) | `"2026-05-17T15:46:00Z"` | Rendered in UI as local format |
| **Requesting Inst.** | `reportMetadata.requestingInstitution` | `String` | `"ABC Rural Bank Ltd."` | Institution executing query |
| **Accessed By** | `reportMetadata.accessedBy.name` | `String` | `"Abena Amponsah"` | Full name of officer |
| **Title** | `reportMetadata.accessedBy.title` | `String` | `"Regional Manager"` | Officer title |
| **Purpose** | `reportMetadata.purpose` | `String` | `"Credit Assessment"` | Permitted reason for pulling data |
| **CONFIDENTIAL** Badge | `reportMetadata.confidentiality` | `String` / `Enum` | `"CONFIDENTIAL"` | Security label, mapped to visual theme |

---

### 3.2 Section 1: Executive Decision Dashboard

| UI Label / Element | JSON Path | Data Type | Sample Value | Notes / Description |
| :--- | :--- | :--- | :--- | :--- |
| **XDS Credit Score Gauge** | `scoreDashboard.creditScore` | `Integer` | `742` | Primary gauge score out of 900 |
| **Score Status Label** | `scoreDashboard.riskStatus` | `String` | `"Low Risk"` | e.g., "Low Risk", "Medium Risk", "High Risk" |
| **Decision Signal** | `scoreDashboard.decisionSignal` | `String` / `Enum` | `"APPROVE"` | Recommendations: `APPROVE`, `DECLINE`, `REFER` |
| **Decision Trend** | `scoreDashboard.decisionTrend` | `String` / `Enum` | `"Improving"` | Mapped to Trend arrows: `Improving ↑`, `Declining ↓` |
| **Decision Sub-Note** | `scoreDashboard.decisionNote` | `String` | `"With Conditions"` | Direct instructions below recommendation |
| **Probability of Default** | `scoreDashboard.probabilityOfDefault` | `Float` | `0.038` (3.8%) | Calculated probability in percentage |
| **Stress Forecast Status** | `scoreDashboard.stressForecast` | `String` | `"Stable"` | Economic scenario stress projection |
| **Affordability Status** | `scoreDashboard.affordabilityStatus` | `String` | `"HEALTHY"` | Rating classification based on DSR |
| **DSR Percentage** | `scoreDashboard.dsrPercentage` | `Float` | `34.0` (34%) | Debt Service Ratio status details |
| **Headroom Amount** | `scoreDashboard.headroomAmount` | `Decimal` | `45000.0` | Credit headroom |
| **Total Exposure** | `scoreDashboard.totalExposure` | `Decimal` | `118000.0` | Total combined active debts |
| **Monthly Repayment** | `scoreDashboard.totalMonthlyRepayment` | `Decimal` | `8500.0` | Total monthly installments |
| **Current Arrears** | `scoreDashboard.currentArrears` | `Decimal` | `0.0` | Unpaid past-due obligations |
| **Active Facilities Count** | `scoreDashboard.activeFacilitiesCount` | `Integer` | `3` | Count of accounts in Section 4 |

---

### 3.3 Section 2: Borrower Identity

| UI Label / Element | JSON Path | Data Type | Sample Value | Notes / Description |
| :--- | :--- | :--- | :--- | :--- |
| **Full Name** | `borrowerIdentity.fullName` | `String` | `"Kwame Mensah"` | Legal name as verified |
| **National ID (Ghana Card)**| `borrowerIdentity.nationalId` | `String` | `"GHA-123456789-1"` | National Identification number format |
| **E-mail Address** | `borrowerIdentity.email` | `String` | `"odmosm@gmail.com"` | Primary contact email address |
| **Phone (Primary)** | `borrowerIdentity.primaryPhone` | `String` | `"0244 123 456"` | Verified cell phone number |
| **Dependants** | `borrowerIdentity.dependentsCount` | `Integer` | `3` | Count of dependants |
| **Marital Status** | `borrowerIdentity.maritalStatus` | `String` / `Enum` | `"Married"` | e.g. Single, Married, Divorced |
| **Date of Birth** | `borrowerIdentity.dateOfBirth` | `String` (Date) | `"1985-03-14"` | Formatted in UI as `14 Mar 1985` |
| **Gender** | `borrowerIdentity.gender` | `String` / `Enum` | `"Male"` | `Male` or `Female` |
| **Employer** | `borrowerIdentity.employer` | `String` | `"Self-Employed / SME"`| Current work/business name |
| **Digital Address** | `borrowerIdentity.digitalAddress` | `String` | `"GS-234-2345"` | GhanaPost GPS Digital Address |
| **Nationality** | `borrowerIdentity.nationality` | `String` | `"Ghanaian"` | Country of citizenship |
| **Identity Confidence** | `borrowerIdentity.identityConfidenceScore`| `Float` | `1.0` (100%) | Verification confidence |
| **Portrait Photo Url** | `borrowerIdentity.portraitPhotoUrl` | `String` (URL) | `null` (or placeholder) | Link to passport-sized profile image |

---

### 3.4 Section 2B: Demographic History

> [!TIP]
> The arrays in this section should map directly to data tables in the UI.

#### Name History (`demographicHistory.nameHistory[]`)
| UI Label / Element | JSON Path | Data Type | Sample Value |
| :--- | :--- | :--- | :--- |
| **Name** | `name` | `String` | `"Kwame Agyapong Mensah"` |
| **Type** | `type` | `String` | `"Alias / Prior Name"` |
| **Last Update** | `lastUpdated` | `String` (Date) | `"2023-03-12"` |

#### Identification Number History (`demographicHistory.idHistory[]`)
| UI Label / Element | JSON Path | Data Type | Sample Value |
| :--- | :--- | :--- | :--- |
| **ID Number** | `idNumber` | `String` | `"GHA-721098421-3"` |
| **Type** | `type` | `String` | `"Ghana Card (National ID)"` |
| **Last Update** | `lastUpdated` | `String` (Date) | `"2022-02-14"` |

#### Telephone History (`demographicHistory.phoneHistory[]`)
| UI Label / Element | JSON Path | Data Type | Sample Value |
| :--- | :--- | :--- | :--- |
| **Telephone** | `telephone` | `String` | `"+233 20 811 9988"` |
| **Type** | `type` | `String` | `"Secondary Mobile"` |
| **Last Update** | `lastUpdated` | `String` (Date) | `"2024-11-04"` |

#### Address History (`demographicHistory.addressHistory[]`)
| UI Label / Element | JSON Path | Data Type | Sample Value |
| :--- | :--- | :--- | :--- |
| **Address** | `address` | `String` | `"Apt 2B, East Legon, Accra"` |
| **Type** | `type` | `String` | `"Previous Residential"` |
| **Last Update** | `lastUpdated` | `String` (Date) | `"2024-12-11"` |

---

### 3.5 Section 3: Credit Health & Payment Analysis

#### Health Indicators Table (`creditHealth.indicators[]`)
| UI Label / Element | JSON Path | Data Type | Sample Value | UI Display Logics |
| :--- | :--- | :--- | :--- | :--- |
| **Credit Health Indicator** | `indicatorName` | `String` | `"Repayment Consistency"` | Row header name |
| **Status** | `status` | `String` / `Enum` | `"STRONG"` | Controls pill color (e.g. `STRONG` / `DIVERSIFIED` / `STABLE` -> `success`, `MINOR` / `MODERATE` -> `warning`, `HIGH` -> `danger`) |
| **Interpretation** | `interpretation` | `String` | `"93% on-time payment rate over 24 months"`| Detail summary |

#### Analytics KPI Tiles (`creditHealth.analytics`)
| UI Label / Element | JSON Path | Data Type | Sample Value |
| :--- | :--- | :--- | :--- |
| **On-Time Ratio** | `onTimeRatio` | `Integer` | `93` (rendered as `93%`) |
| **Avg Days Past Due** | `avgDaysPastDue` | `Integer` | `4` (rendered as `4 Days`) |
| **Worst Delinquency** | `worstDelinquency` | `String` | `"30 DPD"` |
| **Consecutive On-Time** | `consecutiveOnTimeMonths`| `Integer` | `14` (rendered as `14 Months`) |
| **Payment Trend** | `paymentTrend` | `String` | `"Improving"` (rendered as `Improving ↑`) |

#### 12-Month Payment Heatmap (`creditHealth.heatmap[]`)
| UI Label / Element | JSON Path | Data Type | Sample Value | UI Status Dot CSS Class Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Month Name** | `month` | `String` | `"Jan"` | Short month labels |
| **Status Dot** | `status` | `String` / `Enum` | `"late"` | `ontime` -> `dot-ontime` (green), `late` -> `dot-late` (yellow), `missed` -> `dot-missed` (red), `nodata` -> `dot-nodata` (gray) |

---

### 3.6 Section 4: Exposure & Facility Structure

#### Main Facilities Summary Table (`facilities[]`)
| UI Label / Element | JSON Path | Data Type | Sample Value | UI Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Lender / Institution** | `lender` | `String` | `"Absa Bank Ghana"` | Dynamic link scroll targeting details block (`#facility-absa`) |
| **No. of Loans** | `numberOfLoans` | `Integer` | `1` | Count in list |
| **Facility Type** | `type` | `String` | `"Personal Loan"` | Product subtype classification |
| **Approved (GHS)** | `approvedAmount` | `Decimal` | `80000.0` | Approved limit of the loan |
| **Outstanding (GHS)** | `outstandingBalance` | `Decimal` | `42000.0` | Balance principal due |
| **Status** | `status` | `String` | `"Performing"` | Mapped to status pill class |
| **DPD** | `dpd` | `Integer` | `0` | Active Days Past Due |
| **Refi Opp.** | `refinanceOpportunity`| `String` | `"Med"` | Pill style `HIGH` -> `danger`, `Med` -> `warning`, `Low` -> `success` |

#### Individual Account Profiles (`facilities[].details`)
| UI Label / Element | JSON Path | Data Type | Sample Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| Header Header | `lender` + `type` + `details.accountNumber` | `String` | `"Absa Bank Ghana \| Personal Loan — Unsecured \| 90981737382"` | Formatted title string |
| **Approved Amount** | `approvedAmount` | `Decimal` | `80000.0` | Full limit of active account |
| **Outstanding Balance** | `outstandingBalance` | `Decimal` | `42000.0` | Principal due |
| **Last Payment Status** | `details.lastPaymentStatus`| `String` | `"ON TIME"` | e.g. "ON TIME", "LATE" |
| **Current Arrears DPD** | `details.currentArrearsDpd`| `Integer` | `0` | Current delay counter |
| **Interest Profile** | `details.interestProfile` | `String` | `"STANDARD"` | e.g. STANDARD, HIGH, LOW |
| **Refinance Opportunity** | `refinanceOpportunity` | `String` | `"MEDIUM"` | Upper-cased string |
| **Date Disbursed** | `details.dateDisbursed` | `String` (Date) | `"2022-03-03"` | Date disbursed, rendered as `03 Mar 2022` |
| **Installment Amount** | `details.installmentAmount`| `Decimal` | `1200.0` | Regular installment payment |
| **Loan Expiry Date** | `details.expiryDate` | `String` (Date) | `"2025-03-03"` | Date loan expires, rendered as `03 Mar 2025` |
| **Last Date of Update** | `details.lastUpdatedDate` | `String` (Date) | `"2023-03-03"` | Last date data feed updated, rendered as `03 Mar 2023` |
| **24-Month Repayment History** | `details.repaymentHistory24`| `Array` of `Char` | `["C", "C", "C", ...]`| 24-character array corresponding to monthly behavior (`C` = Current, `L` = Late, `M` = Missed, `X` = No Data) |

---

### 3.7 Section 4B: Joint Loan Account Details

#### Co-Borrower Liabilities Table (`jointLoans[]`)
| UI Label / Element | JSON Path | Data Type | Sample Value | Notes / Description |
| :--- | :--- | :--- | :--- | :--- |
| **Co-Borrower Name** | `coBorrowerName` | `String` | `"Ama Serwaa Mensah"` | Joint borrower's legal name |
| **Date of Birth** | `coBorrowerDob` | `String` (Date) | `"1989-06-22"` | DOB formatting |
| **Account Number** | `accountNumber` | `String` | `"JL-228192A"` | Account identifier |
| **Joint Loan Amount** | `loanAmount` | `Decimal` | `250000.0` | Total approved shared limit |
| **Arrear Amount** | `arrearAmount` | `Decimal` | `0.0` | Amount past due |
| **Months in Arrears** | `monthsInArrears` | `Integer` | `0` (or `1 month`) | Counter/text indicating months late |
| **Date of Last Payment** | `lastPaymentDate` | `String` (Date) | `"2028-12-15"` | Last installment date |
| **Last Payment Received** | `lastPaymentAmount` | `Decimal` | `12500.0` | Value of last payment |

---

### 3.8 Section 5: Affordability & Cashflow Analysis

| UI Label / Element | JSON Path | Data Type | Sample Value | Notes / Description |
| :--- | :--- | :--- | :--- | :--- |
| **Estimated Monthly Income**| `affordability.estimatedMonthlyIncome` | `Decimal` | `25000.0` | Est. monthly baseline income |
| **Total Debt Obligations** | `affordability.totalDebtObligations` | `Decimal` | `8500.0` | Current monthly debt outgoings |
| **Estimated Disposable Income** | `affordability.estimatedDisposableIncome` | `Decimal` | `10800.0` | Cash left after standard buffer |
| **Debt Service Ratio (DSR)** | `affordability.dsrPercentage` | `Float` | `34.0` (34%) | Calculated percentage ratio |
| **Maximum Borrowing Headroom** | `affordability.maxBorrowingHeadroom` | `Decimal` | `45000.0` | Safe ceiling limit of new debt |
| **Affordability Rating** | `affordability.rating` | `String` | `"HEALTHY"` | Status text, e.g. "HEALTHY", "CRITICAL" |
| Rating Sub-text | `affordability.ratingDescription` | `String` | `"Debt Service Ratio of 34% is below..."` | Custom text rating overview |
| **AI LENDING INSIGHT** | `affordability.aiLendingInsight` | `String` | `"Kwame can absorb additional..."` | Capacity text advice |

---

### 3.9 Section 6: Risk & Fraud Compliance Checks

#### Early Warning Risk Signals (`compliance.riskSignals[]`)
| UI Label / Element | JSON Path | Data Type | Sample Value | Pill Color Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Risk Signal** | `signal` | `String` | `"Increase in credit enquiries"` | Risk description |
| **Severity** | `severity` | `String` / `Enum` | `"MEDIUM"` | Pill color classes: `MEDIUM` -> `warning`, `LOW` -> `success`, `HIGH` -> `danger` |
| **Required Institution Action**| `requiredAction` | `String` | `"Review purpose and timing..."` | Step recommended to credit analysts |

#### Fraud & Synthetic Identity Checks (`compliance.fraudChecks[]`)
| UI Label / Element | JSON Path | Data Type | Sample Value | Pill Color Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Identity Check Description** | `checkDescription` | `String` | `"Identity Document Match"` | Check label |
| **Status Check** | `status` | `String` / `Enum` | `"VERIFIED"` | Pill colors: `VERIFIED` / `STABLE` -> `success`, `LOW` / `NONE` -> `success` or `neutral` |
| **Verification Note Details** | `details` | `String` | `"Ghana Card details match database"` | Specific trace output details |

---

### 3.10 Section 6B: Dud Cheques & Judgements

#### Dud Cheque Information Table (`publicRecords.dudCheques[]`)
| UI Label / Element | JSON Path | Data Type | Sample Value |
| :--- | :--- | :--- | :--- |
| **Cheque No.** | `chequeNumber` | `String` | `"CHQ-99881"` |
| **Issuing Bank** | `issuingBank` | `String` | `"Standard Chartered"` |
| **Date Issued** | `dateIssued` | `String` (Date) | `"2025-01-10"` |
| **Cheque Amount** | `amount` | `Decimal` | `15000.0` |
| **Currency** | `currency` | `String` | `"GHS"` (or `"USD"`) |
| **Return Reason** | `returnReason` | `String` | `"Insufficient Funds"` |
| **Date Bounced** | `dateBounced` | `String` (Date) | `"2025-01-12"` |

#### Judgement Information Table (`publicRecords.courtJudgements[]`)
| UI Label / Element | JSON Path | Data Type | Sample Value |
| :--- | :--- | :--- | :--- |
| **Court / Case No.** | `caseNumber` | `String` | `"Accra High Court / H1-992-25"` |
| **Plaintiff** | `plaintiff` | `String` | `"Lighthouse Properties Ltd."` |
| **Judgement Amount** | `amount` | `Decimal` | `85000.0` |
| **Currency** | `currency` | `String` | `"GHS"` |
| **Judgement Date** | `judgementDate` | `String` (Date) | `"2025-10-14"` |
| **Status / Resolution** | `status` | `String` | `"SATISFIED"` (Pill styled as `success`) |

---

### 3.11 Section 6C: Enquiry History

#### 12-Month Inquiry Trail Table (`enquiryHistory[]`)
| UI Label / Element | JSON Path | Data Type | Sample Value |
| :--- | :--- | :--- | :--- |
| **Enquiry Date** | `date` | `String` (ISO 8601) | `"2026-05-17T15:46:00Z"` |
| **Requesting Institution** | `requestingInstitution` | `String` | `"ABC Rural Bank Ltd."` |
| **Enquiry Purpose** | `purpose` | `String` | `"Credit Assessment"` |
| **Enquiry Amount** | `amount` | `Decimal` | `50000.0` |
| **Currency** | `currency` | `String` | `"GHS"` |

---

### 3.12 Section 7: Lending Decision Engine & Portfolio Insights

| UI Label / Element | JSON Path | Data Type | Sample Value | Notes / Description |
| :--- | :--- | :--- | :--- | :--- |
| **Lending Recommendation** | `aiDecisionEngine.recommendation` | `String` | `"APPROVE"` | Primary decision classification |
| Conditions Sub-Pill | `aiDecisionEngine.conditions` | `String` | `"With Conditions"` | Text label in warning box |
| **Max New Exposure Recommended**| `aiDecisionEngine.maxNewExposure` | `Decimal` | `45000.0` | Recommended cap amount |
| **Target Facility Strategy** | `aiDecisionEngine.targetStrategy` | `String` | `"Consolidation recommended"`| Marketing campaign theme |
| **Monitoring Frequency** | `aiDecisionEngine.monitoringFrequency` | `String` | `"Monthly bureau triggers"` | Audit monitoring recurrence |
| **Verification Check Required** | `aiDecisionEngine.verificationCheckRequired`| `String` | `"Updated primary bank statements"`| Condition requirements |
| **Collateral / Security Requirement**| `aiDecisionEngine.collateralRequirement` | `String` | `"Not mandatory"` | Legal backing terms |
| **Probability of Default (PD)** | `aiDecisionEngine.riskClassifications.probabilityOfDefault` | `Float` | `0.038` (3.8%) | Risk stress level |
| **Refinance Probability** | `aiDecisionEngine.riskClassifications.refinanceProbability` | `String` | `"HIGH (Consolidation candidate)"`| Restructuring likelihood status |
| **Cross-Sell Propensity** | `aiDecisionEngine.riskClassifications.crossSellPropensity` | `String` | `"VERY HIGH (Salary, insurance)"` | Marketing indicators |
| **Customer Churn Risk** | `aiDecisionEngine.riskClassifications.churnRisk` | `String` | `"MEDIUM (RM retention campaigns)"`| Churn classification score |
| **Borrower Financial Stress** | `aiDecisionEngine.riskClassifications.financialStressStatus`| `String` | `"STABLE (No active triggers)"` | Stress status tag |
| **Recommended Strategy Campaigns**| `aiDecisionEngine.recommendedStrategyCampaigns` | `Array` of `Strings` | `["Offer debt consolidation...", ...]` | Multi-bullet listings in Section 7 card |
| **AI Executive Narrative** | `aiDecisionEngine.executiveNarrative` | `String` | `"Kwame Mensah demonstrates..."` | Relationship manager guidance text paragraph |

---

## 4. Frontend Integration Implementation Guide

To dynamically render data fetched from the API instead of relying on the current hardcoded mock data, follow this implementation pattern in [CreditReport.jsx](file:///Users/ChrisAfflu/Downloads/report_template/report_template/Report%20Template/src/CreditReport.jsx):

### 1. Introduce Component State
Replace the static data imports and declarations at the top of the file with React component state hook definitions:

```jsx
import React, { useState, useEffect } from 'react';

export default function CreditReport({ reportId }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/credit-reports/${reportId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to load report: ${response.statusText}`);
        }
        const data = await response.json();
        setReportData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  if (loading) return <div className="loading-spinner">Fetching Credit Dossier...</div>;
  if (error) return <div className="error-banner">Error loading report: {error}</div>;
  if (!reportData) return <div className="no-data">No report selected.</div>;

  // Destructure reportData variables for rendering...
  const { reportMetadata, scoreDashboard, borrowerIdentity, demographicHistory, creditHealth, facilities, jointLoans, affordability, compliance, publicRecords, enquiryHistory, aiDecisionEngine } = reportData;
  
  // Continue component render markup using dynamic variables...
}
```

### 2. Rendering CSS Classes Dynamically
Create status to class helper mappers so that colors reflect database response fields properly:

```javascript
const getSeverityClass = (severity) => {
  switch (severity?.toUpperCase()) {
    case 'HIGH': return 'status-pill danger';
    case 'MEDIUM': case 'MODERATE': case 'WARN': return 'status-pill warning';
    case 'LOW': case 'STRONG': case 'STABLE': case 'SUCCESS': case 'VERIFIED': case 'DIVERSIFIED': return 'status-pill success';
    default: return 'status-pill neutral';
  }
};
```
