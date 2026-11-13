import type { Metadata } from "next";
import DocumentManagementView from "./view";

export const metadata: Metadata = {
  title: "Document Management & E-Signatures | CINEMA OS",
  description: "Secure legal vault for actor contracts, NDAs, location releases, and digital signature workflows.",
};

export default function DocumentPage() {
  return <DocumentManagementView />;
}

