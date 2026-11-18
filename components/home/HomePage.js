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
import { bannerTextForLocale, fetchEntityBanners, receptionHoursFromBanners } from "@/lib/api/banners";
import { fetchReceptionHoursLabel } from "@/lib/api/openingHours";
import { fetchHouseMinRoomPrice } from "@/lib/api/pricings";
import { fetchHouseGalleryImages, resolveGalleryImages } from "@/lib/api/galleries";
import { fetchEntityLocation } from "@/lib/api/location";
import { fetchHouseFloorPlan } from "@/lib/api/floorPlan";
import { fetchHomeRooms, fetchHouseCommonPlaces } from "@/lib/api/rooms";
import { homeRooms, startingPrice as fallbackStartingPrice } from "@/lib/rooms";

export default async function HomePage() {
  const locale = await getLocale();
  const [entityBanners, apiRooms, entityLocation, apiGallery, commonPlaces, floorPlan, pricingSummary, receptionHoursApi] =
    await Promise.all([
      fetchEntityBanners(locale),
      fetchHomeRooms(),
      fetchEntityLocation(locale),
      fetchHouseGalleryImages(),
      fetchHouseCommonPlaces(),
      fetchHouseFloorPlan(),
      fetchHouseMinRoomPrice(),
      fetchReceptionHoursLabel(locale),
    ]);
  const galleryImages = resolveGalleryImages(apiGallery);
  const roomsForHome = apiRooms.length ? apiRooms : homeRooms;
  let marqueeItems = entityBanners
    .map((row) => bannerTextForLocale(row, locale))
    .filter(Boolean);

  if (!marqueeItems.length) {
    const t = await getTranslations("home.marquee");
    marqueeItems = t.raw("items");
  }

  const heroStartingPrice = pricingSummary?.min_price ?? fallbackStartingPrice;
  const heroReceptionHours =
    receptionHoursApi ?? receptionHoursFromBanners(entityBanners, locale);

  return (
    <div className="home-page-sans">
      <HeroSection startingPriceKz={heroStartingPrice} receptionHours={heroReceptionHours} />
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