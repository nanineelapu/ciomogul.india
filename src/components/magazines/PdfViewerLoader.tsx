"use client";
// Thin client wrapper around PdfViewer so the real viewer can be loaded with
// ssr:false (required because pdfjs-dist touches window/document at module
// scope). Server pages import this; the actual viewer is lazy-loaded.
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="mag-pdf__frame">
      <div className="mag-pdf__placeholder" role="status">
        <div className="mag-pdf__placeholder-inner">
          <b>Loading reader…</b>
        </div>
      </div>
    </div>
  ),
});

export default function PdfViewerLoader(props: { file: string; title: string }) {
  return <PdfViewer {...props} />;
}
