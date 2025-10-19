import { ConverterForm } from '@/app/_components/converter-form';
import { ModeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-3">
              Draw.io to GIF Converter
            </h1>
            <p className="text-lg text-muted-foreground">
              Convert your draw.io diagrams into animated GIF images
            </p>
          </div>

          <ConverterForm />
        </div>
      </div>
    </main>
  );
}
