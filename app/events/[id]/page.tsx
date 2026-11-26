import { events } from "@/lib/demo/data";
import { EventView } from "./EventView";

export const dynamicParams = false;
export function generateStaticParams() {
  return events.map((e) => ({ id: e.id }));
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  return <EventView id={(await params).id} />;
}
