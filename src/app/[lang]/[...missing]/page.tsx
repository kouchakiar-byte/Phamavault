import { notFound } from "next/navigation";

// Any path no other page matches shows the localized 404 page with a real 404 status.
export default function Missing() {
  notFound();
}
