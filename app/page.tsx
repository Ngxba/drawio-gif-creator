import { ConverterForm } from '@/app/_components/converter-form';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-3 text-neutral-900">
              Draw.io to GIF Converter
            </h1>
            <p className="text-lg text-neutral-600">
              Convert your draw.io diagrams into animated GIF images
            </p>
          </div>

          <ConverterForm />
        </div>
      </div>
    </main>
  );
}
