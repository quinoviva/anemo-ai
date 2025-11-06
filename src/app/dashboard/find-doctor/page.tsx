'use client';

import { useState } from 'react';
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

const allClinics = [
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
  {
    name: 'QualiMed Hospital Iloilo',
    type: 'Hospital',
    address: 'Donato Pison Ave, Mandurriao, Iloilo City',
    icon: <Hospital className="h-5 w-5 text-primary" />,
  },
  {
    name: 'Iloilo Mission Hospital',
    type: 'Hospital',
    address: 'Mission Rd, Jaro, Iloilo City',
    icon: <Hospital className="h-5 w-5 text-primary" />,
  },
];


export default function FindDoctorPage() {
    const [searchQuery, setSearchQuery] = useState('');
    
    const filteredClinics = allClinics.filter(clinic => 
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Find a Doctor</h1>
        <p className="text-muted-foreground">
          Search for doctors, clinics, and hospitals in Iloilo City.
        </p>
      </div>

       <Card className="w-full">
        <CardHeader>
          <CardTitle>Search Healthcare Providers</CardTitle>
          <CardDescription>
            Enter a location, address, or name to find the nearest facility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2 mb-6">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                type="text"
                placeholder="Search by name, specialty, or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
          </div>

          <div className="space-y-4">
            {filteredClinics.length > 0 ? (
                filteredClinics.map((clinic, index) => (
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
                ))
            ) : (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">No results found for "{searchQuery}".</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
