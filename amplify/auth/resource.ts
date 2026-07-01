import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["Admins"],       // Cognito group — assign admin users here
  multifactor: {
    mode: "OPTIONAL",
    totp: true,
  }
  
});
