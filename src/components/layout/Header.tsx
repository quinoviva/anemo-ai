'use client';

import { HeartPulse, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';

export function Header() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <HeartPulse className="h-6 w-6 text-primary-foreground fill-primary" />
          <span className="hidden sm:inline-block">AnemoCheck AI</span>
        </Link>
      </div>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={auth.currentUser?.photoURL ?? "https://picsum.photos/seed/user-avatar/40/40"} data-ai-hint="person face" />
                <AvatarFallback>{auth.currentUser?.email?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
