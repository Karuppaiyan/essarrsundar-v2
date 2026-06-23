import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

// Singleton client — import this anywhere you need data access
export const client = generateClient<Schema>();

// Typed model helpers
export type Product  = Schema["Product"]["type"];
export type Enquiry  = Schema["Enquiry"]["type"];
export type SiteSetting = Schema["SiteSetting"]["type"];
export type EnquiryStatus = "new" | "contacted" | "closed";
