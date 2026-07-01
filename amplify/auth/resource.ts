import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["Admins"],       
  multifactor: {
    mode: "OPTIONAL",
    totp: true,
  },
  userAttributes: {
    givenName: { required: false, mutable: false },
    familyName: { required: false, mutable: false },
  },
  
});
