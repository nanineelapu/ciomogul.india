import type { StructureResolver } from "sanity/structure";
import { GuidePane } from "./components/GuidePane";
import { LEGAL_DOC_IDS } from "./schemas";

type Builder = Parameters<StructureResolver>[0];

const single = (S: Builder, id: string, title: string) =>
  S.listItem()
    .title(title)
    .id(id)
    .child(S.editor().id(id).schemaType(id).documentId(id));

const group = (S: Builder, id: string, title: string, items: ReturnType<Builder["listItem"]>[]) =>
  S.listItem().title(title).id(id).child(S.list().title(title).items(items));

const listOf = (S: Builder, type: string, title: string) => S.documentTypeListItem(type).title(title);

// Studio sidebar, arranged the way the website is: one entry per page, in the
// same order as the menu, then settings that apply to the whole site.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Website content")
    .items([
      S.listItem()
        .title("Start here: where to edit what")
        .id("guide")
        .child(S.component(GuidePane).id("guide").title("Start here")),
      S.divider(),

      group(S, "home", "Home page", [
        single(S, "homepageConfig", "Magazine strips (which covers appear)"),
        listOf(S, "headline", "Headline ticker"),
        listOf(S, "newsCard", "Latest news cards"),
        listOf(S, "vitalUpdate", "Vital updates"),
        listOf(S, "featuredArticle", "Featured articles"),
        listOf(S, "industry", "Industries we cover"),
        listOf(S, "womanLeader", "Women leaders strip"),
        listOf(S, "testimonial", "Testimonials"),
      ]),
      group(S, "magazines", "Magazines", [listOf(S, "magazineEdition", "Magazine editions")]),
      group(S, "podcasts", "Podcasts", [listOf(S, "podcast", "Episodes")]),
      group(S, "hall", "Hall of Fame", [listOf(S, "hallOfFame", "Inductees")]),
      group(S, "spotlight", "Women Spotlight", [listOf(S, "spotlightProfile", "Profiles")]),
      group(S, "articles", "Articles", [listOf(S, "article", "All articles")]),
      single(S, "aboutPage", "About page"),
      S.listItem()
        .title("Terms of Service")
        .id("legalPage-terms")
        .child(S.document().schemaType("legalPage").documentId("legalPage-terms")),
      S.listItem()
        .title("Privacy Policy")
        .id("legalPage-privacy")
        .child(S.document().schemaType("legalPage").documentId("legalPage-privacy")),
      S.divider(),

      single(S, "siteSettings", "Contact details and links (footer, Contact page)"),
      single(S, "pageContent", "Page headings (top of each list page)"),
      single(S, "siteText", "Menus, buttons and labels"),
      S.divider(),

      S.listItem()
        .title("Clean-up: stray legal documents")
        .id("legalPage-extra")
        .child(
          S.documentList()
            .title("Stray legal documents (safe to delete)")
            .filter('_type == "legalPage" && !(_id in $ids) && !(_id in $drafts)')
            .params({
              ids: LEGAL_DOC_IDS,
              drafts: LEGAL_DOC_IDS.map((id) => `drafts.${id}`),
            })
        ),
    ]);
