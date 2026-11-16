import { getLocale, getTranslations } from "next-intl/server";
import HeroSection from "./HeroSection";
import MarqueeStrip from "./MarqueeStrip";
import FloorPlanSection from "./FloorPlanSection";
import RoomsSection from "./RoomsSection";
import VideoTourSection from "./VideoTourSection";
import ExperienceSection from "./ExperienceSection";
import GallerySection from "./GallerySection";
import LocationSection from "./LocationSection";
import ReviewsSection from "./ReviewsSection";
import FaqSection from "./FaqSection";
import BookingCtaSection from "./BookingCtaSection";
import { fetchMarqueeBannerTexts } from "@/lib/api/banners";
import { fetchHouseGalleryImages, resolveGalleryImages } from "@/lib/api/galleries";
import { fetchEntityLocation } from "@/lib/api/location";
import { fetchHouseFloorPlan } from "@/lib/api/floorPlan";
import { fetchHomeRooms, fetchHouseCommonPlaces } from "@/lib/api/rooms";
import { homeRooms } from "@/lib/rooms";

export default async function HomePage() {
  const locale = await getLocale();
  const [apiItems, apiRooms, entityLocation, apiGallery, commonPlaces, floorPlan] = await Promise.all([
    fetchMarqueeBannerTexts(locale),
    fetchHomeRooms(),
    fetchEntityLocation(locale),
    fetchHouseGalleryImages(),
    fetchHouseCommonPlaces(),
    fetchHouseFloorPlan(),
  ]);
  const galleryImages = resolveGalleryImages(apiGallery);
  const roomsForHome = apiRooms.length ? apiRooms : homeRooms;
  let marqueeItems = apiItems;

  if (!marqueeItems.length) {
    const t = await getTranslations("home.marquee");
    marqueeItems = t.raw("items");
  }

  return (
    <div className="home-page-sans">
      <HeroSection />
      <MarqueeStrip items={marqueeItems} />
      <FloorPlanSection rooms={roomsForHome} commons={commonPlaces} floorPlan={floorPlan} />
      <RoomsSection rooms={roomsForHome} />
      <VideoTourSection />
      <ExperienceSection />
      <GallerySection images={galleryImages} />
      <LocationSection location={entityLocation} />
      <ReviewsSection />
      <FaqSection />
      <BookingCtaSection location={entityLocation} />
    </div>
  );
}