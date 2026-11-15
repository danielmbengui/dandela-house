import HousePlanTestPage from "@/components/test/HousePlanTestPage";
import { fetchHouseFloorPlan } from "@/lib/api/floorPlan";

export const metadata = {
  title: "Test plan maison",
  robots: { index: false, follow: false },
};

export default async function TestPlanPage() {
  const payload = await fetchHouseFloorPlan();
  return <HousePlanTestPage payload={payload} />;
}