export const siteGuides = [
  {
    id: "rti-guide",
    title: "How to File a Right to Information (RTI) Application",
    category: "RTI",
    summary: "A step-by-step citizen manual on how to draft and file RTIs to seek official data from municipal authorities, schools, and government departments.",
    timeToRead: "5 min read",
    content: `
### What is an RTI?
The Right to Information (RTI) Act, 2005 empowers Indian citizens to request information from public authorities, making government processes transparent and accountable.

### Steps to File an RTI:
1. **Identify the Department**: Find out which Public Authority holds the information (e.g., Municipal Corporation, Water Board, Public Works Department).
2. **Draft the Questions**: Ask clear, specific, and direct questions. Do not ask for opinions, explanations, or hypothetical situations. Ask for copy of contracts, budgets, registers, or project file progress.
3. **Write the Application**: Write on plain paper or file online at [rtionline.gov.in](https://rtionline.gov.in/). Start by addressing the **Public Information Officer (PIO)** of the department.
4. **Pay the Fee**: The standard fee is ₹10. You can pay via Court Fee Stamp, Postal Order, Demand Draft, or online gateway.
5. **Send and Track**: If sending physically, use Registered Post/Speed Post and keep the receipt. The PIO must reply within **30 days** of receipt.

### Sample RTI Questions for Road Maintenance:
* "Provide details of the budget allocated and spent on the repair of road [name of road] during the financial years 2024-25 and 2025-26."
* "Provide copies of the work order and contract specifications issued to the contractor for the pothole filling work on [name of road]."
* "Provide the name and designation of the government engineer responsible for auditing and certifying the road quality before payment was processed."
    `
  },
  {
    id: "consumer-complaint-guide",
    title: "Filing a Complaint on the National Consumer Helpline",
    category: "Consumer Rights",
    summary: "Get quick resolution for faulty appliances, bad services, ecommerce fraud, and utility bills under the Consumer Protection Act.",
    timeToRead: "4 min read",
    content: `
### When can you file a Consumer Complaint?
You can file a complaint against any vendor, seller, brand, or service provider for:
* Defective goods sold to you.
* Deficient services (e.g., internet downtime with no refunds, hospital negligence, wrong billing).
* Charging prices above MRP (Maximum Retail Price).
* False or misleading advertisements.

### Escalation Steps:
1. **Direct Communication**: Send a written notice/email to the company's customer support and grievance officer detailing the issue. Give them 7 days to resolve.
2. **National Consumer Helpline (NCH)**:
   * Call **1915** or download the 'NCH' app.
   * Register your complaint online at [consumerhelpline.gov.in](https://consumerhelpline.gov.in/). NCH acts as a mediator and has a high success rate for ecommerce and utility disputes.
3. **e-Daakhil Portal**: If NCH mediation fails, you can file a formal case online in the Consumer Court without needing a lawyer via the [edaakhil.nic.in](https://edaakhil.nic.in/) portal.

### Tips for Strong Claims:
* Keep all bills, invoice PDFs, transaction receipts, and WhatsApp screenshots safely.
* Take photos of defects or record videos of unboxing parcels.
    `
  },
  {
    id: "grievance-portal-guide",
    title: "Lodging Public Grievances on CPGRAMS Portal",
    category: "Public Service",
    summary: "Learn how to lodge direct grievances with Central and State government ministries regarding civil works, passport issues, pensions, or railway services.",
    timeToRead: "6 min read",
    content: `
### What is CPGRAMS?
The Centralized Public Grievance Redress and Monitoring System (CPGRAMS) is an online platform for citizens to lodge grievances against government organizations.

### How to file a Grievance:
1. Go to [pgportal.gov.in](https://pgportal.gov.in/) and sign up with your mobile number/email.
2. Click **Lodge Public Grievance**.
3. Select the appropriate Ministry/Department (e.g., Ministry of Road Transport and Highways, Department of Telecommunications).
4. Provide a detailed description of your grievance (up to 4000 characters).
5. Attach supporting PDFs (complaint copy, photos of neglect, RTI responses).
6. Submit and note the registration number for tracking.

### Redressal Timeline:
* Departments are mandated to resolve grievances within **30 days**.
* If you are unsatisfied, you can appeal the resolution, which escalates the case to a higher-level Nodal Officer.
    `
  }
];

export const siteTransparencyStats = {
  totalIssuesRaised: "1.2K",
  issuesResolved: "318",
  avgModerationTime: "18h",
  accuracyRate: "96%",
  fundingDetails: {
    totalDonations: "₹4.8L",
    serverCosts: "₹52K",
    maintenanceCosts: "₹31K",
  },
  recentModerationActions: [
    {
      id: "mod_1",
      action: "APPROVE",
      target: "Road safety report, Mumbai",
      reason: "Verified location evidence and supporting images.",
      timestamp: "2026-05-21T08:15:00Z",
    },
    {
      id: "mod_2",
      action: "RESTRICT",
      target: "Duplicate grievance submission",
      reason: "Merged into the original issue to avoid fragmentation.",
      timestamp: "2026-05-20T16:40:00Z",
    },
    {
      id: "mod_3",
      action: "APPROVE",
      target: "Water supply outage, Delhi",
      reason: "Confirmed public authority escalation and clean narrative.",
      timestamp: "2026-05-19T12:05:00Z",
    },
  ],
};