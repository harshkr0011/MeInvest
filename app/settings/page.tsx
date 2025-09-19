
"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Header } from '@/components/dashboard/header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { usePortfolio } from "@/context/portfolio-context";
import { useRouter } from "next/navigation";
import type { Stock, UserProfile } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ChangePictureDialog } from "@/components/dashboard/change-picture-dialog";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  bio: z.string().max(1000, "Bio cannot be longer than 1000 characters.").optional(),
  phone: z.string().optional().or(z.literal('')).refine((val) => !val || /^(?:\+91)?[6-9]\d{9}$/.test(val), {
    message: "Please enter a valid 10-digit Indian phone number (e.g., +919876543210).",
  }),
  address: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  avatar: z.string().url("Please enter a valid URL.").optional(),
  theme: z.enum(["light", "dark", "system"]),
  notifications: z.object({
    marketNews: z.boolean().default(false),
    portfolioSummary: z.boolean().default(true),
    productUpdates: z.boolean().default(false),
  }),
  enable2FA: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This is a simplified theme toggler. In a real app, you would use a theme provider like next-themes.
function setMode(theme: string) {
    document.documentElement.classList.remove("light", "dark");
    if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.classList.add(systemTheme);
        localStorage.setItem('theme', 'system');
        return;
    }
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
}


export default function SettingsPage() {
  const { profile, updateProfile, setSelectedStock } = usePortfolio();
  const router = useRouter();
  const [isPictureDialogOpen, setPictureDialogOpen] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...profile,
      theme: "dark",
      notifications: {
        marketNews: false,
        portfolioSummary: true,
        productUpdates: false,
      },
      enable2FA: false,
    },
    mode: "onChange",
  });
  
  useEffect(() => {
    // Reset form with a combination of saved profile and default settings
    form.reset({
        ...profile,
        theme: (localStorage.getItem('theme') as "light" | "dark" | "system") || "dark",
        notifications: {
            marketNews: false,
            portfolioSummary: true,
            productUpdates: false,
            ...profile.notifications,
        },
        enable2FA: profile.enable2FA || false,
    });
  }, [profile, form]);

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    router.push('/');
  }
  
  const handlePictureChange = (newUrl: string) => {
    form.setValue('avatar', newUrl, { shouldDirty: true, shouldValidate: true });
    updateProfile({ ...form.getValues(), avatar: newUrl });
    setPictureDialogOpen(false);
    toast({
        title: 'Avatar Updated',
        description: 'Your profile picture has been changed.',
    });
  };

  function onSubmit(data: ProfileFormValues) {
    try {
        const profileData = {
            name: data.name,
            email: data.email,
            bio: data.bio,
            phone: data.phone,
            address: data.address,
            gender: data.gender,
            avatar: data.avatar,
            notifications: data.notifications,
            enable2FA: data.enable2FA,
        };
        updateProfile(profileData);
        setMode(data.theme);
        form.reset(data); // Reset form with new data to clear dirty state
        toast({
            title: "Settings Saved",
            description: "Your settings have been successfully updated.",
        });
    } catch (error) {
        console.error("Failed to save settings", error);
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not save your settings.",
        });
    }
  }

  const watchedAvatar = form.watch('avatar');
  const watchedName = form.watch('name');

  return (
    <>
      <Header onStockSelect={handleStockSelect} />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Tabs defaultValue="profile" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Public Profile</CardTitle>
                            <CardDescription>This information will be displayed publicly.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={watchedAvatar} alt="User Avatar" data-ai-hint="person portrait" />
                                    <AvatarFallback>{(watchedName && watchedName.length > 0) ? watchedName[0].toUpperCase() : 'U'}</AvatarFallback>
                                </Avatar>
                                <Button type="button" variant="outline" onClick={() => setPictureDialogOpen(true)}>Change Picture URL</Button>
                            </div>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about yourself"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                     <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>This information is private and will not be shared.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="+91 12345 67890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123, MG Road, Bangalore, India" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-1">
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value="male" /></FormControl>
                                                <FormLabel className="font-normal">Male</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value="female" /></FormControl>
                                                <FormLabel className="font-normal">Female</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value="other" /></FormControl>
                                                <FormLabel className="font-normal">Other</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="appearance">
                    <Card>
                      <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of the application.</CardDescription>
                      </CardHeader>
                      <CardContent>
                         <FormField
                            control={form.control}
                            name="theme"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Theme</FormLabel>
                                    <FormDescription>Select the theme for the dashboard.</FormDescription>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid max-w-md grid-cols-3 gap-8 pt-2">
                                        <FormItem>
                                            <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                                <FormControl>
                                                    <RadioGroupItem value="light" className="sr-only" />
                                                </FormControl>
                                                <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                                                    <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                                                        <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                                                            <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                                                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                                        </div>
                                                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                                            <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="block w-full p-2 text-center font-normal">Light</span>
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem>
                                            <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                                <FormControl>
                                                    <RadioGroupItem value="dark" className="sr-only" />
                                                </FormControl>
                                                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                                                    <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                                                        <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                                            <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                                                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                                        </div>
                                                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                                            <div className="h-4 w-4 rounded-full bg-slate-400" />
                                                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="block w-full p-2 text-center font-normal">Dark</span>
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem>
                                            <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                                <FormControl>
                                                    <RadioGroupItem value="system" className="sr-only" />
                                                </FormControl>
                                                <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                                                    <div className="text-center p-8">System</div>
                                                </div>
                                                <span className="block w-full p-2 text-center font-normal">System</span>
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormItem>
                            )}
                            />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Configure how you receive notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="notifications.marketNews"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Major Market News</FormLabel>
                                            <FormDescription>Receive emails about significant market-moving news.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="notifications.portfolioSummary"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Weekly Portfolio Summary</FormLabel>
                                            <FormDescription>Get a summary of your portfolio's performance every week.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="notifications.productUpdates"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Product Updates</FormLabel>
                                            <FormDescription>Receive emails about new features and product updates.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your account security settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-base">Change Password</Label>
                                <Input type="password" placeholder="Current Password" />
                                <Input type="password" placeholder="New Password" />
                                <Input type="password" placeholder="Confirm New Password" />
                                <Button type="button" variant="secondary" onClick={() => toast({ title: "Coming Soon", description: "Password changes are not yet implemented."})}>Change Password</Button>
                            </div>
                            <Separator />
                             <FormField
                                control={form.control}
                                name="enable2FA"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                                            <FormDescription>Add an extra layer of security to your account.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                  </TabsContent>

                </Tabs>
                <div className="mt-6 flex justify-end">
                    <Button type="submit" disabled={!form.formState.isDirty}>Save Changes</Button>
                </div>
            </form>
        </Form>
      </main>
      <ChangePictureDialog
        isOpen={isPictureDialogOpen}
        onOpenChange={setPictureDialogOpen}
        currentAvatar={watchedAvatar || ''}
        onSubmit={handlePictureChange}
      />
    </>
  );
}
