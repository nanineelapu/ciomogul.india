import { createElement } from "react";
import type { StructureResolver } from "sanity/structure";
import { GuidePane } from "./components/GuidePane";
import { LEGAL_DOC_IDS } from "./schemas";

type Builder = Parameters<StructureResolver>[0];
type Item = ReturnType<Builder["listItem"]>;

// Small emoji icons, so each page is easy to spot in the sidebar.
const icon = (emoji: string) => () => createElement("span", { style: { fontSize: 18 } }, emoji);

const single = (S: Builder, id: string, title: string, emoji: string) =>
  S.listItem()
    .title(title)
    .id(id)
    .icon(icon(emoji))
    .child(S.editor().id(id).schemaType(id).documentId(id).title(title));

const listOf = (S: Builder, type: string, title: string, emoji: string) =>
  S.documentTypeListItem(type).title(title).icon(icon(emoji));

const folder = (S: Builder, id: string, title: string, emoji: string, items: Item[]) =>
  S.listItem().title(title).id(id).icon(icon(emoji)).child(S.list().title(title).items(items));

const legalDoc = (S: Builder, id: string, title: string) =>
  S.listItem().title(title).id(id).icon(icon("📄")).child(S.document().schemaType("legalPage").documentId(id).title(title));

// Studio sidebar, in the same order as the website's menu. Inside the Home page
// folder, the items follow the page from top to bottom.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Website content")
    .items([
      S.listItem()
        .title("Start here: how to edit the site")
        .id("guide")
        .icon(icon("👋"))
        .child(S.component(GuidePane).id("guide").title("Start here")),
      S.divider(),

      folder(S, "home", "1. Home page", "🏠", [
        listOf(S, "headline", "1. Headline ticker", "📰"),
        single(S, "homepageConfig", "2. Magazine covers on the home page", "📚"),
        listOf(S, "newsCard", "3. Latest news", "🗞️"),
        listOf(S, "vitalUpdate", "4. Vital updates", "⚡"),
        listOf(S, "featuredArticle", "5. Featured articles", "⭐"),
        listOf(S, "womanLeader", "6. Business women", "👩‍💼"),
        listOf(S, "testimonial", "7. Testimonials", "💬"),
        listOf(S, "trustedBrand", "8. Trusted brands", "🤝"),
      ]),
      listOf(S, "magazineEdition", "2. Magazines", "📚"),
      listOf(S, "hallOfFame", "3. Hall of Fame", "🏆"),
      listOf(S, "spotlightProfile", "4. Business Women", "👩‍💼"),
      listOf(S, "podcast", "5. Podcasts", "🎙️"),
      listOf(S, "article", "6. Articles", "📝"),
      listOf(S, "industry", "7. Industries", "🏭"),
      single(S, "aboutPage", "8. About Us", "ℹ️"),
      single(S, "siteSettings", "9. Contact Us: details and social links", "✉️"),
      folder(S, "legal", "10. Terms and Privacy", "📄", [
        legalDoc(S, "legalPage-terms", "Terms of Service"),
        legalDoc(S, "legalPage-privacy", "Privacy Policy"),
      ]),
      S.divider(),

      single(S, "pageContent", "Page titles and intros", "🔤"),
      single(S, "siteText", "Menus, buttons and labels", "🔘"),
      S.divider(),

      S.listItem()
        .title("Clean-up: stray legal documents")
        .id("legalPage-extra")
        .icon(icon("🧹"))
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
