import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "siteDescription", title: "Site description (for search engines)", type: "text", rows: 3, description: "Around 150 characters. Shown in Google for the home page." }),
    defineField({ name: "keywords", title: "Site keywords", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, description: "Phrases that describe the whole site. Used on the home page." }),
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
