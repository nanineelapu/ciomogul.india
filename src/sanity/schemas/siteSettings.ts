import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string", description: "For example: +91 95292 03836" }),
    defineField({ name: "office", title: "Office", type: "string" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
    defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
    defineField({ name: "x", title: "X (Twitter) URL", type: "url" }),
    defineField({ name: "whatsapp", title: "WhatsApp URL", type: "url", description: "For example: https://wa.me/919529203836" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
