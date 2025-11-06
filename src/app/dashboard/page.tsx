'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Search,
  Stethoscope,
  Hospital,
  HeartPulse,
} from 'lucide-react';

const mockClinics = [
  {
    name: 'Iloilo Doctors’ Hospital',
    type: 'Hospital',
    address: 'West Timawa Avenue, Molo, Iloilo City',
    icon: <Hospital className="h-5 w-5 text-primary" />,
  },
  {
    name: 'The Medical City Iloilo',
    type: 'Hospital',
    address: 'Lopez Jaena St, Molo, Iloilo City',
    icon: <Hospital className="h-5 w-5 text-primary" />,
  },
  {
    name: 'Dr. Zaxius Berina, MD (Internal Medicine)',
    type: 'Doctor',
    address: 'Medicus Medical Center, Mandurriao, Iloilo City',
    icon: <Stethoscope className="h-5 w-5 text-primary" />,
  },
  {
    name: 'AnemoCare Clinic',
    type: 'Clinic',
    address: 'Jaro, Iloilo City',
    icon: <HeartPulse className="h-5 w-5 text-primary" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Anemo Check
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          AI-powered anemia detection using Convolutional Neural Networks (CNN)
          to analyze key health indicators.
        </p>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Find a Doctor in Iloilo City</CardTitle>
          <CardDescription>
            Search for doctors, hospitals, and clinics near you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2 mb-6">
            <Input
              type="text"
              placeholder="Search by name, specialty, or location..."
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          <div className="space-y-4">
            {mockClinics.map((clinic, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-secondary">
                      {clinic.icon}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{clinic.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {clinic.address}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
