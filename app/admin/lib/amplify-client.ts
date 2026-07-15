// lib/amplify-client.ts
import './amplify-config';   // force config to run first
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

export const client = generateClient<Schema>();
export type Product = Schema['Product']['type'];
export type Enquiry = Schema['Enquiry']['type'];