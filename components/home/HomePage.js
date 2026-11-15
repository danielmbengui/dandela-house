import { getLocale, getTranslations } from "next-intl/server";
import HeroSection from "./HeroSection";
import MarqueeStrip from "./MarqueeStrip";
import RoomsSection from "./RoomsSection";
import VideoTourSection from "./VideoTourSection";
import ExperienceSection from "./ExperienceSection";
import GallerySection from "./GallerySection";
import LocationSection from "./LocationSection";
import ReviewsSection from "./ReviewsSection";
import FaqSection from "./FaqSection";
import BookingCtaSection from "./BookingCtaSection";
import { fetchMarqueeBannerTexts } from "@/lib/api/banners";
import { fetchEntityLocation } from "@/lib/api/location";
import { fetchHomeRooms } from "@/lib/api/rooms";
import { homeRooms } from "@/lib/rooms";

export default async function HomePage() {
  const locale = await getLocale();
  const [apiItems, apiRooms, entityLocation] = await Promise.all([
    fetchMarqueeBannerTexts(locale),
    fetchHomeRooms(),
    fetchEntityLocation(locale),
  ]);
  const roomsForHome = apiRooms.length ? apiRooms : homeRooms;
  let marqueeItems = apiItems;

  if (!marqueeItems.length) {
    const t = await getTranslations("home.marquee");
    marqueeItems = t.raw("items");
  }

  return (
    <>
      <HeroSection />
      <MarqueeStrip items={marqueeItems} />
      <RoomsSection rooms={roomsForHome} />
      <VideoTourSection />
      <ExperienceSection />
      <GallerySection />
      <LocationSection location={entityLocation} />
      <ReviewsSection />
      <FaqSection />
      <BookingCtaSection location={entityLocation} />
    </>
  );
}