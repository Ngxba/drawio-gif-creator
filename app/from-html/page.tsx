import { HtmlConverterForm } from '@/app/_components/html-converter-form';

export default function HtmlPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-3 text-neutral-900">
              HTML to GIF Converter
            </h1>
            <p className="text-lg text-neutral-600">
              Convert your HTML files with SVG animations into animated GIF
              images
            </p>
          </div>

          <HtmlConverterForm />
        </div>
      </div>
    </main>
  );
}
