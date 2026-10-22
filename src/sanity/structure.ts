import type { StructureResolver } from "sanity/structure";

// Studio sidebar. The homepage config is modelled as a singleton — one and
// only one document — so we expose it as a direct editor rather than a list.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .id("homepage-config")
        .child(
          S.editor()
            .id("homepageConfig")
            .schemaType("homepageConfig")
            .documentId("homepageConfig")
        ),
      S.divider(),
      S.documentTypeListItem("magazineEdition").title("Magazine Editions"),
      S.divider(),
      S.documentTypeListItem("headline").title("Headlines (ticker)"),
      S.documentTypeListItem("newsCard").title("News Cards"),
      S.documentTypeListItem("vitalUpdate").title("Vital Updates"),
      S.documentTypeListItem("featuredArticle").title("Featured Articles"),
      S.documentTypeListItem("podcast").title("Podcasts"),
      S.documentTypeListItem("womanLeader").title("Women — Wall of Fame"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
    ]);
