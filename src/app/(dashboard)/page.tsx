
'use client';
import { ImageAnalyzer } from '@/components/anemo/ImageAnalyzer';
import { FeatureCard } from '@/components/anemo/FeatureCard';
import { Video, Stethoscope } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Anemo Check Dashboard</h1>
        <p className="text-muted-foreground">
          Upload an image to start your analysis or explore other features.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ImageAnalyzer />
        </div>
        <div className="space-y-6">
          <FeatureCard
            title="Live Camera Analysis"
            description="Get real-time feedback using your device's camera."
            icon={<Video className="h-8 w-8 text-primary" />}
            href="/live-analysis"
            disabled
          />
          <FeatureCard
            title="Find a Doctor"
            description="Locate nearby clinics and specialists for consultation."
            icon={<Stethoscope className="h-8 w-8 text-primary" />}
            href="/find-doctor"
            disabled
          />
        </div>
      </div>
    </div>
  );
}
