'use client';

import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";

// Call once at the top of your app (RootLayout or a provider component)
export function configureAmplify() {
  Amplify.configure(outputs, { ssr: true });
}
