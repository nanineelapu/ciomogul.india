import { defineField, defineType } from "sanity";
import defaults from "../../data/siteText.default.json";
import { HIDDEN_TEXT_KEYS, SITE_TEXT_LAYOUT, type TextField } from "../siteTextLayout";

// The "Menus, buttons and labels" editor. The wording itself lives in
// siteText.default.json; the tabs, sections and plain labels come from
// siteTextLayout.ts, so the editor reads like the website, top to bottom.

type Defaults = Record<string, Record<string, unknown>>;
const DEFAULTS = defaults as Defaults;

const humanize = (key: string) => {
  const spaced = key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
  return spaced.charAt(0) + spaced.slice(1).toLowerCase();
};

function fieldFor(key: string, value: unknown, label: string, help: string | undefined, fieldset: string, hidden: boolean) {
  const common = { name: key, title: label, hidden, ...(fieldset ? { fieldset } : {}), ...(help ? { description: help } : {}) };

  if (Array.isArray(value)) {
    return defineField({
      ...common,
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Link name", type: "string" }),
            defineField({ name: "href", title: "Page or address", type: "string", description: "A site page like /magazines, or a full https:// link." }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    });
  }

  const long = typeof value === "string" && value.length > 70;
  return defineField({ ...common, type: long ? "text" : "string", ...(long ? { rows: 3 } : {}) });
}

function groupField(groupKey: string, title: string) {
  const values = DEFAULTS[groupKey] ?? {};
  const layout = SITE_TEXT_LAYOUT.find((g) => g.key === groupKey);
  const hidden = new Set(HIDDEN_TEXT_KEYS[groupKey] ?? []);
  const listed = new Map<string, { field: TextField; fieldset: string }>();

  const fieldsets = (layout?.sections ?? []).map((section, i) => {
    const name = `s${i + 1}`;
    for (const field of section.fields) listed.set(field[0], { field, fieldset: name });
    return { name, title: section.title, options: { collapsible: true, collapsed: false } };
  });

  const ordered = [...listed.values()]
    .filter(({ field }) => field[0] in values)
    .map(({ field: [key, label, help], fieldset }) => fieldFor(key, values[key], label, help, fieldset, false));

  // Anything not in the layout still gets a field, so no wording can go missing.
  // Retired keys stay in the data but are hidden.
  const rest = Object.keys(values).filter((k) => !listed.has(k));
  const visibleRest = rest.filter((k) => !hidden.has(k));
  const extra = [
    ...visibleRest.map((k) => fieldFor(k, values[k], humanize(k), undefined, "other", false)),
    ...rest.filter((k) => hidden.has(k)).map((k) => fieldFor(k, values[k], humanize(k), undefined, "", true)),
  ];
  if (visibleRest.length) {
    fieldsets.push({ name: "other", title: "Other", options: { collapsible: true, collapsed: true } });
  }

  return defineField({
    name: groupKey,
    title,
    type: "object",
    group: groupKey,
    fieldsets,
    fields: [...ordered, ...extra],
  });
}

const groupsInOrder = [
  ...SITE_TEXT_LAYOUT.map((g) => ({ key: g.key, title: g.title })),
  ...Object.keys(DEFAULTS)
    .filter((k) => !SITE_TEXT_LAYOUT.some((g) => g.key === k))
    .map((k) => ({ key: k, title: humanize(k) })),
];

export const siteText = defineType({
  name: "siteText",
  title: "Menus, buttons and labels",
  type: "document",
  groups: groupsInOrder.map((g, i) => ({ name: g.key, title: g.title, default: i === 0 })),
  fields: groupsInOrder.map((g) => groupField(g.key, g.title)),
  preview: { prepare: () => ({ title: "Menus, buttons and labels" }) },
});
