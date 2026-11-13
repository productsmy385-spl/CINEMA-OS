"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Download,
  FileCheck,
  FileText,
  FolderLock,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

interface LegalDocument {
  id: string;
  title: string;
  category: "Actor Agreement" | "Crew Contract" | "NDA" | "Location Release" | "Music License";
  project: string;
  parties: string;
  status: "executed" | "pending_signature" | "draft";
  effectiveDate: string;
  fileSize: string;
}

const initialDocuments: LegalDocument[] = [
  {
    id: "DOC-2026-01",
    title: "SAG-AFTRA Schedule F Actor Agreement - Marcus Sterling",
    category: "Actor Agreement",
    project: "Chrono Raiders",
    parties: "Vance Global Pictures & Marcus Sterling",
    status: "executed",
    effectiveDate: "2026-08-15",
    fileSize: "2.4 MB (Encrypted)",
  },
  {
    id: "DOC-2026-02",
    title: "Theatrical Feature Principal Performer Deal Memo - Elena Rostova",
    category: "Actor Agreement",
    project: "Chrono Raiders",
    parties: "Vance Global Pictures & Elena Rostova",
    status: "executed",
    effectiveDate: "2026-08-20",
    fileSize: "1.8 MB (Encrypted)",
  },
  {
    id: "DOC-2026-03",
    title: "Comprehensive Production Confidentiality & Non-Disclosure (NDA)",
    category: "NDA",
    project: "Chrono Raiders",
    parties: "Vance Global Pictures & All Cast/Crew",
    status: "executed",
    effectiveDate: "2026-09-01",
    fileSize: "680 KB (Encrypted)",
  },
  {
    id: "DOC-2026-04",
    title: "Vasquez Rocks Natural Park Location Release & Pyrotechnic Permit",
    category: "Location Release",
    project: "Chrono Raiders",
    parties: "County of Los Angeles Parks Dept & Vance Global",
    status: "executed",
    effectiveDate: "2026-10-10",
    fileSize: "3.2 MB (Encrypted)",
  },
  {
    id: "DOC-2026-05",
    title: "Lead Actress Agreement - Silicon Sunset Series",
    category: "Actor Agreement",
    project: "Silicon Sunset",
    parties: "Vance Global Pictures & Pending Talent",
    status: "pending_signature",
    effectiveDate: "2026-12-01",
    fileSize: "1.5 MB (Encrypted)",
  },
];

export default function DocumentManagementView() {
  const [docsList, setDocsList] = useState<LegalDocument[]>(initialDocuments);
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);

  const handleSign = (id: string, title: string) => {
    setDocsList(
      docsList.map((d) => (d.id === id ? { ...d, status: "executed" } : d))
    );
    toast.success(`Digital signature captured with cryptographic timestamp. Document "${title}" is now fully executed.`);
  };

  const handleDownloadVaultDoc = (title: string) => {
    toast.info(`Generating secure, time-limited presigned S3 download token for "${title}"...`);
  };

  const filtered = docsList.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.parties.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Management & Digital Signatures"
        description="Secure legal vault for actor contracts, NDAs, location releases, insurance riders, and audit-certified e-signatures."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => toast.info("Opening Contract Draft Generator...")}
              className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Upload Agreement
            </Button>
          </div>
        }
      />

      {/* Security Privacy Notice */}
      <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 flex items-start gap-3 text-xs">
        <FolderLock className="h-5 w-5 text-[#167D8D] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-foreground">Zero-Trust Encrypted Legal Vault</p>
          <p className="text-muted-foreground leading-relaxed">
            All executed contracts, performer deal memos, and location permits are encrypted in transit and at rest using AES-256. Public direct URLs are permanently disabled; access is gated by granular tenant role verification.
          </p>
        </div>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground">Production Agreements & Contracts</CardTitle>
            <CardDescription className="text-xs">
              Manage signatures, expiration reminders, and tamper-evident audit certificates.
            </CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contracts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-border bg-background"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                  <th className="py-2.5 px-3 font-semibold">Contract Title</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold">Project</th>
                  <th className="py-2.5 px-3 font-semibold">Signatory Parties</th>
                  <th className="py-2.5 px-3 font-semibold">Effective Date</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-[#167D8D] shrink-0" />
                        <div>
                          <p className="font-bold text-foreground">{doc.title}</p>
                          <span className="text-2xs text-muted-foreground font-mono">{doc.fileSize}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="rounded bg-muted px-2 py-0.5 text-2xs font-medium text-foreground">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-foreground">{doc.project}</td>
                    <td className="py-3 px-3 text-muted-foreground">{doc.parties}</td>
                    <td className="py-3 px-3 font-mono text-foreground">{doc.effectiveDate}</td>
                    <td className="py-3 px-3">
                      <Badge variant={doc.status === "executed" ? "success" : "warning"}>
                        {doc.status === "executed" ? "EXECUTED" : "AWAITING SIGNATURE"}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {doc.status === "pending_signature" ? (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleSign(doc.id, doc.title)}
                            className="h-7 text-2xs bg-[#167D8D] text-white hover:bg-[#126572]"
                          >
                            Sign Electronically
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadVaultDoc(doc.title)}
                            className="h-7 text-2xs text-foreground hover:bg-muted"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

