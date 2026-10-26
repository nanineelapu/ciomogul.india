import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Contact details and social links",
  type: "document",
  fieldsets: [
    { name: "contact", title: "1. Contact details (Contact page, footer and emails)" },
    { name: "social", title: "2. Social links (top menu, footer and Contact page)", description: "Leave a link empty to hide that icon." },
    { name: "google", title: "3. For Google (home page)", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({ name: "email", title: "Email", type: "string", fieldset: "contact" }),
    defineField({ name: "phone", title: "Phone", type: "string", fieldset: "contact", description: "For example: +91 95292 03836" }),
    defineField({ name: "whatsapp", title: "WhatsApp link", type: "url", fieldset: "contact", description: "For example: https://wa.me/919529203836", validation: (r) => r.uri({ scheme: ["https", "http"] }) }),
    defineField({ name: "office", title: "Office address", type: "string", fieldset: "contact" }),
    defineField({ name: "instagram", title: "Instagram", type: "url", fieldset: "social", validation: (r) => r.uri({ scheme: ["https", "http"] }) }),
    defineField({ name: "facebook", title: "Facebook", type: "url", fieldset: "social", validation: (r) => r.uri({ scheme: ["https", "http"] }) }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url", fieldset: "social", validation: (r) => r.uri({ scheme: ["https", "http"] }) }),
    defineField({ name: "x", title: "X (Twitter)", type: "url", fieldset: "social", validation: (r) => r.uri({ scheme: ["https", "http"] }) }),
    defineField({ name: "siteDescription", title: "Description shown in Google", type: "text", rows: 3, fieldset: "google", description: "Around 150 characters." }),
    defineField({ name: "keywords", title: "Search phrases", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, fieldset: "google", description: "A few phrases people search for that describe the whole site." }),
  ],
  preview: { prepare: () => ({ title: "Contact details and social links" }) },
});
