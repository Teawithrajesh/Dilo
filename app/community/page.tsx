"use client";

import { CommunityView } from "@/components/app/CommunityView";
import { QueryParam } from "@/components/app/QueryParam";

export default function CommunityPage() {
  return <QueryParam name="id" render={(id) => <CommunityView id={id} />} />;
}
