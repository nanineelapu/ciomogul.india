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

export const schemaTypes: SchemaTypeDefinition[] = [
  magazineEdition,
  homepageConfig,
  headline,
  newsCard,
  vitalUpdate,
  featuredArticle,
  womanLeader,
  podcast,
  testimonial,
];
