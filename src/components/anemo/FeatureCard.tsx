'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  disabled?: boolean;
};

export function FeatureCard({ title, description, icon, href, disabled }: FeatureCardProps) {
  const content = (
    <Card className={cn("transition-all", disabled ? "bg-muted/50" : "hover:shadow-md hover:border-primary/50")}>
      <CardHeader>
        <div className="flex items-start justify-between">
          {icon}
          {disabled && <Badge variant="secondary">Coming Soon</Badge>}
        </div>
        <div className="mt-4">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );

  if (disabled) {
    return <div className="cursor-not-allowed">{content}</div>;
  }

  return <Link href={href}>{content}</Link>;
}
