import { redirect } from "next/navigation";

export default function DemoPage() {
  // Demo CTA now lives in the one-page flow; send users to Contact for now.
  redirect("/?section=contact");
}


