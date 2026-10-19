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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <RoomsSection />
      <VideoTourSection />
      <ExperienceSection />
      <GallerySection />
      <LocationSection />
      <ReviewsSection />
      <FaqSection />
      <BookingCtaSection />
    </>
  );
}
