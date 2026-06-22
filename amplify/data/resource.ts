import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  /* ── Products (Rental Inventory) ───────────────────── */
  Product: a
    .model({
      name:        a.string().required(),
      category:    a.string().required(),
      categoryId:  a.string().required(),
      description: a.string(),
      tags:        a.string().array(),   // stored as JSON string array
      isHot:       a.boolean().default(false),
      icon:        a.string(),
      accentColor: a.string(),
      isActive:    a.boolean().default(true),
      sortOrder:   a.integer().default(0),
    })
    .authorization((allow) => [
      allow.group("Admins"),            // full CRUD for admin group
      allow.publicApiKey().to(["read"]),// public read for frontend
    ]),

  /* ── WhatsApp Enquiries ─────────────────────────────── */
  Enquiry: a
    .model({
      productName:  a.string().required(),
      productId:    a.string(),
      customerName: a.string(),
      phone:        a.string(),
      message:      a.string(),
      status:       a.enum(["new", "contacted", "closed"]),
      notes:        a.string(),          // admin internal notes
    })
    .authorization((allow) => [
      allow.group("Admins"),
      allow.publicApiKey().to(["create"]), // anyone can submit enquiry
    ]),

  /* ── Site Settings ──────────────────────────────────── */
  SiteSetting: a
    .model({
      key:   a.string().required(),
      value: a.string().required(),
      label: a.string(),
    })
    .authorization((allow) => [
      allow.group("Admins"),
      allow.publicApiKey().to(["read"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",   // JWT for admin panel
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
