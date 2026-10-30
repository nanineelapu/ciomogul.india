import Headlines from "@/components/home/Headlines";
import MagazineRelease from "@/components/home/MagazineRelease";
import type { Metadata } from "next";
import { getIndustries, getSiteSettings } from "@/lib/data";
import { buildMetadata, DEFAULT_TITLE, mergeKeywords } from "@/lib/seo";
import CoverStories from "@/components/home/CoverStories";
import LatestNews from "@/components/home/LatestNews";
import FeaturedArticles from "@/components/home/FeaturedArticles";
import WallOfFame from "@/components/home/WallOfFame";
import Testimonials from "@/components/home/Testimonials";
import TrustedBrands from "@/components/home/TrustedBrands";
import GetFeatured from "@/components/home/GetFeatured";
import Industries from "@/components/home/Industries";
import Newsletter from "@/components/home/Newsletter";
import { getHeadlines, getSiteText } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, industries] = await Promise.all([getSiteSettings(), getIndustries()]);
  return buildMetadata({
    title: DEFAULT_TITLE,
    description: settings.description,
    path: "/",
    kicker: "Digital magazine",
    keywords: mergeKeywords(settings.keywords, industries.map((i) => i.name)),
  });
}

export default async function Home() {
  const [headlines, text] = await Promise.all([getHeadlines(), getSiteText()]);

  return (
    <main>
      <Headlines headlines={headlines} label={text.home.tickerLabel} />
      <MagazineRelease />
      <CoverStories />
      <Industries />
      <LatestNews />
      <FeaturedArticles />
      <WallOfFame />
      <Testimonials />
      <TrustedBrands />
      <GetFeatured />
      <Newsletter text={text.home} />
    </main>
  );
}
