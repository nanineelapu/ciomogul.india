import type { StructureResolver } from "sanity/structure";

type Builder = Parameters<StructureResolver>[0];

const single = (S: Builder, id: string, title: string) =>
  S.listItem()
    .title(title)
    .id(id)
    .child(S.editor().id(id).schemaType(id).documentId(id));

// Studio sidebar. Singletons open straight into their editor.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      single(S, "homepageConfig", "Homepage"),
      single(S, "aboutPage", "About page"),
      single(S, "pageContent", "Page headings"),
      single(S, "siteText", "Site text (menus, buttons, titles)"),
      single(S, "siteSettings", "Site settings"),
      S.divider(),
      S.documentTypeListItem("magazineEdition").title("Magazine Editions"),
      S.documentTypeListItem("hallOfFame").title("Hall of Fame"),
      S.documentTypeListItem("womanLeader").title("Women Spotlight"),
      S.documentTypeListItem("podcast").title("Podcasts"),
      S.documentTypeListItem("article").title("Articles"),
      S.divider(),
      S.listItem()
        .title("Terms of Service")
        .id("legalPage-terms")
        .child(S.document().schemaType("legalPage").documentId("legalPage-terms")),
      S.listItem()
        .title("Privacy Policy")
        .id("legalPage-privacy")
        .child(S.document().schemaType("legalPage").documentId("legalPage-privacy")),
      S.listItem()
        .title("Other legal documents (extra copies)")
        .id("legalPage-extra")
        .child(
          S.documentList()
            .title("Other legal documents")
            .filter('_type == "legalPage" && !(_id in $ids) && !(_id in $drafts)')
            .params({
              ids: ["legalPage-terms", "legalPage-privacy"],
              drafts: ["drafts.legalPage-terms", "drafts.legalPage-privacy"],
            })
        ),
      S.divider(),
      S.documentTypeListItem("headline").title("Headlines (ticker)"),
      S.documentTypeListItem("newsCard").title("Homepage news cards"),
      S.documentTypeListItem("vitalUpdate").title("Vital updates"),
      S.documentTypeListItem("featuredArticle").title("Homepage featured articles"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
    ]);
