
"use client";

import { useRouter } from 'next/navigation';
import { Header } from '@/components/dashboard/header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePortfolio } from '@/context/portfolio-context';
import type { Stock } from '@/types';
import { AtSign, Info, MapPin, Phone, User, Edit } from 'lucide-react';

const InfoRow = ({ icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => {
    const Icon = icon;
    return (
        <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value || '-'}</p>
            </div>
        </div>
    );
};


export default function ProfilePage() {
  const { profile, setSelectedStock } = usePortfolio();
  const router = useRouter();

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    router.push('/');
  }

  return (
    <>
      <Header onStockSelect={handleStockSelect} />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold">My Profile</h1>
            <p className="text-muted-foreground">Your personal information at a glance.</p>
        </div>
        
        <Card>
            <CardHeader className="flex flex-col items-center text-center gap-4 border-b p-6 md:flex-row md:text-left">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar} alt="User Avatar" data-ai-hint="person portrait" />
                    <AvatarFallback>{profile.name?.[0].toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                    <CardTitle className="text-2xl">{profile.name}</CardTitle>
                    <CardDescription>{profile.email}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-6">
                        <InfoRow icon={Info} label="Bio" value={profile.bio} />
                        <InfoRow icon={User} label="Gender" value={profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : '-'} />
                    </div>
                    <div className="space-y-6">
                         <InfoRow icon={Phone} label="Phone Number" value={profile.phone} />
                         <InfoRow icon={MapPin} label="Address" value={profile.address} />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t p-6">
                <Button onClick={() => router.push('/settings')}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
            </CardFooter>
        </Card>
      </main>
    </>
  );
}

    