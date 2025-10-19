import { ConverterForm } from '@/app/_components/converter-form';
import { ModeToggle } from '@/components/theme-toggle';
import { PageTitle } from '@/app/_components/page-title';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>

        <div className="max-w-7xl mx-auto">
          <PageTitle />
          <ConverterForm />
        </div>
      </div>
    </main>
  );
}
