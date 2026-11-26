import { communities } from "@/lib/demo/data";
import { CommunityView } from "./CommunityView";

export const dynamicParams = false;
export function generateStaticParams() {
  return communities.map((c) => ({ id: c.id }));
}

export default async function CommunityPage({ params }: { params: Promise<{ id: string }> }) {
  return <CommunityView id={(await params).id} />;
}
