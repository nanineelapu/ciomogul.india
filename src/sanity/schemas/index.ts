import type { SchemaTypeDefinition } from "sanity";
import { magazineEdition } from "./magazineEdition";
import { homepageConfig } from "./homepageConfig";
import { headline } from "./headline";
import { newsCard } from "./newsCard";
import { vitalUpdate } from "./vitalUpdate";
import { featuredArticle } from "./featuredArticle";
import { womanLeader } from "./womanLeader";
import { podcast } from "./podcast";
import { testimonial } from "./testimonial";
import { hallOfFame } from "./hallOfFame";
import { article } from "./article";
import { aboutPage } from "./aboutPage";
import { legalPage } from "./legalPage";
import { siteSettings } from "./siteSettings";
import { pageContent } from "./pageContent";
import { siteText } from "./siteText";

export const schemaTypes: SchemaTypeDefinition[] = [
  magazineEdition,
  hallOfFame,
  womanLeader,
  podcast,
  article,
  homepageConfig,
  headline,
  newsCard,
  vitalUpdate,
  featuredArticle,
  testimonial,
  aboutPage,
  legalPage,
  siteSettings,
  pageContent,
  siteText,
];

// The two legal pages are fixed documents, one per page.
export const LEGAL_DOC_IDS = ["legalPage-terms", "legalPage-privacy"];

// Documents that must exist exactly once.
export const SINGLETON_TYPES = ["homepageConfig", "aboutPage", "siteSettings", "pageContent", "siteText"];
