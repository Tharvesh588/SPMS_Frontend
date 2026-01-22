
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-background">
      <div className="flex items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    </div>
  );
}
