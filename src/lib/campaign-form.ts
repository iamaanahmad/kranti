import { z } from "zod";

export const campaignFormSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(200, "Title must not exceed 200 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must not exceed 5000 characters"),
  goals: z
    .string()
    .min(20, "Goals must be at least 20 characters")
    .max(2000, "Goals must not exceed 2000 characters"),
  category: z.enum([
    "environment",
    "education",
    "health",
    "safety",
    "infrastructure",
    "rights",
    "governance",
    "other",
  ]),
  state: z.string().min(1, "State is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  language: z.enum(["en", "hi"]),
});

export type CampaignFormData = z.infer<typeof campaignFormSchema>;

export const campaignCategories = [
  { value: "environment", label: "Environment & Climate" },
  { value: "education", label: "Education Access" },
  { value: "health", label: "Healthcare" },
  { value: "safety", label: "Public Safety" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "rights", label: "Rights & Justice" },
  { value: "governance", label: "Governance & Transparency" },
  { value: "other", label: "Other" },
] as const;

export const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;
