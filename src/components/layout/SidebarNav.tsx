'use client';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import {
  HeartPulse,
  LayoutGrid,
  Bot,
  History,
  Video,
  Stethoscope,
  LifeBuoy,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutGrid },
  { href: '/history', label: 'Analysis History', icon: History, badge: '3' },
  { href: '/chatbot', label: 'AI Chatbot', icon: Bot },
  { href: '/live-analysis', label: 'Live Analysis', icon: Video, disabled: true },
  { href: '/find-doctor', label: 'Find a Doctor', icon: Stethoscope, disabled: true },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2.5">
          <HeartPulse className="h-7 w-7 text-primary-foreground fill-primary" />
          <span className="text-lg font-bold">AnemoCheck AI</span>
        </Link>
      </SidebarHeader>

      <SidebarMenu className="flex-1 p-2">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={item.label}
                aria-disabled={item.disabled}
                disabled={item.disabled}
              >
                <item.icon />
                <span>{item.label}</span>
                {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarFooter>
        <SidebarMenu className="p-2">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Help">
              <LifeBuoy />
              <span>Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
