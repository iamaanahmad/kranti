export interface IssueEvidence {
  fileId: string;
  name: string;
  size: number;
  mimeType: string;
  publicUrl: string;
  sanitized: boolean;
}

export interface IssueComment {
  $id: string;
  issue_id: string;
  user_name: string;
  avatar_url?: string;
  content: string;
  status: 'pending_review' | 'approved' | 'flagged';
  createdAt: string;
}

export interface IssueRecord {
  $id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  state: string;
  district: string;
  landmark: string;
  status: 'pending_review' | 'open' | 'in_progress' | 'resolved';
  supporter_count: number;
  evidence_count: number;
  created_by: string;
  creatorName: string;
  creatorAvatar?: string;
  language: string;
  location: [number, number]; // [longitude, latitude]
  createdAt: string;
  evidence: IssueEvidence[];
}

export const mockUsers = {
  "mock_citizen_1": {
    clerk_id: "user_1",
    display_name: "Aarav Sharma",
    avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120",
    email: "aarav.sharma@example.in",
    role: "citizen",
    verified: true,
    trust_score: 85
  },
  "mock_citizen_2": {
    clerk_id: "user_2",
    display_name: "Priyah Patel",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    email: "priya.patel@example.in",
    role: "citizen",
    verified: true,
    trust_score: 90
  },
  "mock_citizen_3": {
    clerk_id: "user_3",
    display_name: "Rohan Das",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    email: "rohan.das@example.in",
    role: "citizen",
    verified: false,
    trust_score: 45
  }
};

export const mockIssues: IssueRecord[] = [
  {
    $id: "issue_1",
    title: "Severe potholes on Western Express Highway, Mumbai",
    slug: "severe-potholes-western-express-highway-mumbai",
    description: "The potholes near Andheri flyover on the Western Express Highway have become extremely dangerous. Daily commuters face massive traffic jams and two-wheelers are sliding on loose gravel. Urgent restoration is needed before the monsoon peaks.",
    category: "roads",
    state: "Maharashtra",
    district: "Mumbai Suburban",
    landmark: "Andheri Flyover",
    status: "open",
    supporter_count: 342,
    evidence_count: 2,
    created_by: "mock_citizen_1",
    creatorName: "Aarav Sharma",
    creatorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120",
    language: "en",
    location: [72.8554, 19.1154],
    createdAt: "2026-05-10T12:00:00Z",
    evidence: [
      {
        fileId: "ev_road_1",
        name: "pothole_andheri.jpg",
        size: 1542000,
        mimeType: "image/jpeg",
        publicUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600",
        sanitized: true
      },
      {
        fileId: "ev_road_2",
        name: "traffic_pothole.jpg",
        size: 2105000,
        mimeType: "image/jpeg",
        publicUrl: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80&w=600",
        sanitized: true
      }
    ]
  },
  {
    $id: "issue_2",
    title: "Toxic chemical dumping in Bellandur Lake inlets",
    slug: "toxic-chemical-dumping-bellandur-lake",
    description: "We spotted tankers dumping industrial foam-inducing waste into the Bellandur lake canal inlets late last night. This has been a recurring issue. The froth has started rising again, posing health risks to nearby residents. We have recorded video footage of the vehicle number plates.",
    category: "sanitation",
    state: "Karnataka",
    district: "Bengaluru Urban",
    landmark: "Bellandur Outer Ring Road",
    status: "in_progress",
    supporter_count: 512,
    evidence_count: 1,
    created_by: "mock_citizen_2",
    creatorName: "Priya Patel",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    language: "en",
    location: [77.6625, 12.9304],
    createdAt: "2026-05-15T09:30:00Z",
    evidence: [
      {
        fileId: "ev_lake_1",
        name: "lake_froth.jpg",
        size: 1892000,
        mimeType: "image/jpeg",
        publicUrl: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&q=80&w=600",
        sanitized: true
      }
    ]
  },
  {
    $id: "issue_3",
    title: "Lack of clean drinking water supply in Government School, Okhla",
    slug: "no-clean-drinking-water-okhla-school",
    description: "The primary reverse osmosis (RO) drinking water purifier at Government Girls Senior Secondary School, Okhla Phase 3 has been broken for over 4 months. More than 450 students have to carry water from home or drink from unsafe taps. Several children have fallen sick. School administration says they lack maintenance funds.",
    category: "water",
    state: "Delhi",
    district: "South Delhi",
    landmark: "Near Okhla Metro Station",
    status: "resolved",
    supporter_count: 189,
    evidence_count: 1,
    created_by: "mock_citizen_3",
    creatorName: "Rohan Das",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    language: "en",
    location: [77.2730, 28.5355],
    createdAt: "2026-05-05T08:15:00Z",
    evidence: [
      {
        fileId: "ev_water_1",
        name: "broken_filter.jpg",
        size: 890000,
        mimeType: "image/jpeg",
        publicUrl: "https://images.unsplash.com/photo-1584267326895-d88985f21412?auto=format&fit=crop&q=80&w=600",
        sanitized: true
      }
    ]
  },
  {
    $id: "issue_4",
    title: "Broken streetlights and safety concerns at Outer Ring Road, Safdarjung",
    slug: "broken-streetlights-safety-safdarjung",
    description: "A 1.5 km stretch of the service road near Safdarjung development area is completely pitch black. Streetlights have been dysfunctional for three weeks. This is a critical safety issue for women and pedestrians commuting from the metro station after dark. Local youth have reported two phone-snatching cases already.",
    category: "safety",
    state: "Delhi",
    district: "New Delhi",
    landmark: "Safdarjung Enclave Market Road",
    status: "open",
    supporter_count: 245,
    evidence_count: 1,
    created_by: "mock_citizen_1",
    creatorName: "Aarav Sharma",
    creatorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120",
    language: "en",
    location: [77.1984, 28.5678],
    createdAt: "2026-05-18T14:40:00Z",
    evidence: [
      {
        fileId: "ev_light_1",
        name: "dark_street.jpg",
        size: 1205000,
        mimeType: "image/jpeg",
        publicUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600",
        sanitized: true
      }
    ]
  },
  {
    $id: "issue_5",
    title: "Primary Health Center unstaffed during emergency hours in rural Pune",
    slug: "phc-unstaffed-emergency-hours-pune",
    description: "The primary health sub-center at Kamshet, Pune is locked during designated evening emergency hours. Residents from 4 surrounding villages have to travel over 25 km to get basic treatments or first-aid in case of accidents. We visited three times this week between 6 PM and 9 PM and found it closed.",
    category: "health",
    state: "Maharashtra",
    district: "Pune",
    landmark: "Kamshet Village Chowk",
    status: "pending_review",
    supporter_count: 8,
    evidence_count: 2,
    created_by: "mock_citizen_2",
    creatorName: "Priya Patel",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    language: "en",
    location: [73.5594, 18.7564],
    createdAt: "2026-05-21T18:20:00Z",
    evidence: [
      {
        fileId: "ev_phc_1",
        name: "phc_locked.jpg",
        size: 1450000,
        mimeType: "image/jpeg",
        publicUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
        sanitized: true
      },
      {
        fileId: "ev_phc_2",
        name: "phc_timetable.jpg",
        size: 1100000,
        mimeType: "image/jpeg",
        publicUrl: "https://images.unsplash.com/photo-1586771107415-d3197f0ab018?auto=format&fit=crop&q=80&w=600",
        sanitized: true
      }
    ]
  }
];

export const mockComments: IssueComment[] = [
  {
    $id: "c_1",
    issue_id: "issue_1",
    user_name: "Priya Patel",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    content: "Absolutely agree. My scooter slipped here last Tuesday. It is extremely risky during late night hours when visibility is low. Thanks for raising this!",
    status: "approved",
    createdAt: "2026-05-10T14:30:00Z"
  },
  {
    $id: "c_2",
    issue_id: "issue_1",
    user_name: "Rohan Das",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    content: "We should file an RTI regarding the road contractor's maintenance contract. I am ready to support this campaign in raising funds if we need to put up signboards ourselves.",
    status: "approved",
    createdAt: "2026-05-11T10:15:00Z"
  },
  {
    $id: "c_3",
    issue_id: "issue_2",
    user_name: "Aarav Sharma",
    avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120",
    content: "I have shared this with local active citizen groups in Bellandur. We will organize a small peaceful protest walk near the lake entrance this Saturday morning. Please join!",
    status: "approved",
    createdAt: "2026-05-16T11:00:00Z"
  }
];

export const mockGuides = [
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

export const mockTransparencyStats = {
  totalIssuesRaised: 1254,
  activeCampaigns: 24,
  issuesResolved: 812,
  avgModerationTime: "3.4 hours",
  accuracyRate: "99.2%",
  takedownsThisMonth: 12,
  fundingDetails: {
    totalDonations: "₹4,12,000",
    serverCosts: "₹45,000",
    maintenanceCosts: "₹85,000"
  },
  recentModerationActions: [
    {
      id: "act_1",
      action: "REJECT",
      target: "Issue #1823",
      reason: "Contains personal address and contact details of a private citizen (violation of doxxing policy).",
      timestamp: "2026-05-22T14:15:00Z"
    },
    {
      id: "act_2",
      action: "RESTRICT",
      target: "Comment by user_34",
      reason: "Hate speech targeting a specific community.",
      timestamp: "2026-05-22T11:05:00Z"
    },
    {
      id: "act_3",
      action: "APPROVE",
      target: "Issue #1825",
      reason: "Factual public grievance regarding drainage in Rohini, Delhi. Safe and verified evidence.",
      timestamp: "2026-05-22T09:30:00Z"
    }
  ]
};
