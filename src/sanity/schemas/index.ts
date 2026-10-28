import type { SchemaTypeDefinition } from "sanity";
import { magazineEdition } from "./magazineEdition";
import { homepageConfig } from "./homepageConfig";
import { headline } from "./headline";
import { newsCard } from "./newsCard";
import { vitalUpdate } from "./vitalUpdate";
import { featuredArticle } from "./featuredArticle";
import { womanLeader } from "./womanLeader";
import { spotlightProfile } from "./spotlightProfile";
import { podcast } from "./podcast";
import { testimonial } from "./testimonial";
import { industry } from "./industry";
import { trustedBrand } from "./trustedBrand";
import { hallOfFame } from "./hallOfFame";
import { article } from "./article";
import { aboutPage } from "./aboutPage";
import { legalPage } from "./legalPage";
import { siteSettings } from "./siteSettings";
import { pageContent } from "./pageContent";
import { siteText } from "./siteText";
import { withHelp } from "../help";

// withHelp adds the plain-language titles and descriptions (see ../help.ts).
export const schemaTypes: SchemaTypeDefinition[] = withHelp([
  magazineEdition,
  hallOfFame,
  womanLeader,
  spotlightProfile,
  podcast,
  article,
  homepageConfig,
  headline,
  newsCard,
  vitalUpdate,
  featuredArticle,
  testimonial,
  industry,
  trustedBrand,
  aboutPage,
  legalPage,
  siteSettings,
  pageContent,
  siteText,
]);

// The two legal pages are fixed documents, one per page.
export const LEGAL_DOC_IDS = ["legalPage-terms", "legalPage-privacy"];

// Documents that must exist exactly once.
export const SINGLETON_TYPES = ["homepageConfig", "aboutPage", "siteSettings", "pageContent", "siteText"];
