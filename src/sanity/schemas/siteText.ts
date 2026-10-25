import { defineField, defineType } from "sanity";
import defaults from "../../data/siteText.default.json";

// The editor for "Site text" is generated from the same JSON file that holds the
// built-in wording, so every phrase on the site has a field and the two can
// never get out of step. Add a phrase to the JSON and it appears here.

const GROUP_TITLES: Record<string, string> = {
  header: "Header (menu and buttons)",
  footer: "Footer",
  home: "Home page sections",
  magazines: "Magazines pages",
  podcasts: "Podcasts page",
  hallOfFame: "Hall of Fame pages",
  womenSpotlight: "Women Spotlight pages",
  articles: "Articles pages",
  contact: "Contact page and form",
  general: "Errors and page navigation",
};

const humanize = (key: string) => {
  const spaced = key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
  return spaced.charAt(0) + spaced.slice(1).toLowerCase();
};

function fieldFor(key: string, value: unknown) {
  if (typeof value === "string") {
    const long = value.length > 70;
    return defineField({
      name: key,
      title: humanize(key),
      type: long ? "text" : "string",
      ...(long ? { rows: 3 } : {}),
    });
  }

  if (Array.isArray(value)) {
    const sample = (value[0] ?? {}) as Record<string, string>;
    return defineField({
      name: key,
      title: humanize(key),
      type: "array",
      of: [
        {
          type: "object",
          fields: Object.keys(sample).map((k) => defineField({ name: k, title: humanize(k), type: "string" })),
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    });
  }

  return defineField({ name: key, title: humanize(key), type: "string" });
}

export const siteText = defineType({
  name: "siteText",
  title: "Site text",
  type: "document",
  fields: Object.entries(defaults).map(([group, fields]) =>
    defineField({
      name: group,
      title: GROUP_TITLES[group] ?? humanize(group),
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: Object.entries(fields as Record<string, unknown>).map(([k, v]) => fieldFor(k, v)),
    })
  ),
  preview: { prepare: () => ({ title: "Site text (menus, buttons, section titles)" }) },
});
