import RoomsPageContent from "@/components/rooms/RoomsPageContent";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return {
    title: messages.metaRooms.title,
    description: messages.metaRooms.description,
  };
}

export default function ChambresTarifsPage() {
  return <RoomsPageContent />;
}
