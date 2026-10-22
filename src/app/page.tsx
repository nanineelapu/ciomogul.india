import Headlines from "@/components/Headlines";
import MagazineRelease from "@/components/MagazineRelease";
import CoverStories from "@/components/CoverStories";
import LatestNews from "@/components/LatestNews";
import FeaturedArticles from "@/components/FeaturedArticles";
import WallOfFame from "@/components/WallOfFame";
import Podcasts from "@/components/Podcasts";
import Testimonials from "@/components/Testimonials";
import GetFeatured from "@/components/GetFeatured";
import Newsletter from "@/components/Newsletter";
import { getHeadlines } from "@/lib/data";

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
