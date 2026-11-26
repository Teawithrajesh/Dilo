"use client";

import { EventView } from "@/components/app/EventView";
import { QueryParam } from "@/components/app/QueryParam";

export default function EventPage() {
  return <QueryParam name="id" render={(id) => <EventView id={id} />} />;
}
