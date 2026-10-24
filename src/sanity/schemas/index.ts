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
];

// Documents that must exist exactly once.
export const SINGLETON_TYPES = ["homepageConfig", "aboutPage", "siteSettings", "pageContent"];
