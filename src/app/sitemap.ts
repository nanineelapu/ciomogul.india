import type { MetadataRoute } from "next";
import {
  getArticles,
  getHallOfFame,
  getMagazineEditions,
} from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { storyHref } from "@/data/womenSpotlightData";
import { getPublishedProfiles } from "@/lib/data/spotlight";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [editions, hall, articles, profiles] = await Promise.all([
    getMagazineEditions(),
    getHallOfFame(),
    getArticles(),
    getPublishedProfiles(),
  ]);

  const pages = ["", "/magazines", "/hall-of-fame", "/women-spotlight", "/podcasts", "/articles", "/about", "/contact", "/terms", "/privacy"];

  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, priority: p === "" ? 1 : 0.7 })),
    ...editions.map((e) => ({ url: `${SITE_URL}/magazines/${e.slug}`, priority: 0.6 })),
    ...hall.map((e) => ({ url: `${SITE_URL}/hall-of-fame/${e.slug}`, priority: 0.5 })),
    ...articles.map((a) => ({ url: `${SITE_URL}/articles/${a.slug}`, priority: 0.6 })),
    ...profiles.map((p) => ({ url: `${SITE_URL}${storyHref(p.id)}`, priority: 0.5 })),
  ];
}
