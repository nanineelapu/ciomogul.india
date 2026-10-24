import Headlines from "@/components/home/Headlines";
import MagazineRelease from "@/components/home/MagazineRelease";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata, DEFAULT_TITLE } from "@/lib/seo";
import CoverStories from "@/components/home/CoverStories";
import LatestNews from "@/components/home/LatestNews";
import FeaturedArticles from "@/components/home/FeaturedArticles";
import WallOfFame from "@/components/home/WallOfFame";
import Podcasts from "@/components/home/Podcasts";
import Testimonials from "@/components/home/Testimonials";
import GetFeatured from "@/components/home/GetFeatured";
import Newsletter from "@/components/home/Newsletter";
import { getHeadlines } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: DEFAULT_TITLE,
    description: settings.description,
    path: "/",
    keywords: settings.keywords,
  });
}

export default async function Home() {
  const headlines = await getHeadlines();

  return (
    <main>
      <Headlines headlines={headlines} />
      <MagazineRelease />
      <CoverStories />
      <LatestNews />
      <FeaturedArticles />
      <WallOfFame />
      <Podcasts />
      <Testimonials />
      <GetFeatured />
      <Newsletter />
    </main>
  );
}
