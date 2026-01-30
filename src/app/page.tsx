'use client';

import { SplashScreen } from '@/components/splash-screen';

export default function HomePage() {
  return (
    <SplashScreen
      appName="ProjectVerse"
      subtitle="Please wait while we prepare the application for you..."
      redirectTo="/u/portal/auth"
      displayDuration={3000}
    />
  );
}
