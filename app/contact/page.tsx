
"use client";

import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/dashboard/header';
import { usePortfolio } from '@/context/portfolio-context';
import type { Stock } from '@/types';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Mail, Phone, MapPin, Send, Loader2, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { contactUsFlow } from '@/ai/flows/contact-us-flow';
import { ContactUsInputSchema, type ContactFormValues } from '@/types/contact-us';


export default function ContactPage() {
    const { setSelectedStock } = usePortfolio();
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(ContactUsInputSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    });

    const handleStockSelect = (stock: Stock) => {
        setSelectedStock(stock);
        router.push('/');
    };

    const onSubmit = (data: ContactFormValues) => {
        startTransition(async () => {
            try {
                const result = await contactUsFlow(data);
                toast({
                    title: "Message Sent!",
                    description: `Thanks for reaching out. We've categorized your request under "${result.category}". We'll get back to you soon.`,
                });
                form.reset();
            } catch (error) {
                console.error("Failed to process message:", error);
                toast({
                    variant: "destructive",
                    title: "Submission Failed",
                    description: "We couldn't process your message at this time. Please try again later.",
                });
            }
        });
    };

    return (
        <>
            <Header onStockSelect={handleStockSelect} />
            <main className="flex-1 space-y-6 p-4 md:p-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Get in Touch</h1>
                    <p className="text-muted-foreground">We'd love to hear from you. Please fill out the form below or use the contact details provided.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-5">
                    <div className="md:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Send us a Message</CardTitle>
                                <CardDescription>Our team will respond as soon as possible.</CardDescription>
                            </CardHeader>
                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Your Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="John Doe" {...field} />
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
                                                        <FormLabel>Your Email</FormLabel>
                                                        <FormControl>
                                                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="subject"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Subject</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Regarding my portfolio" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Your Message</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Type your message here..." className="min-h-[120px]" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit" disabled={isPending}>
                                            {isPending ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send className="mr-2 h-4 w-4" />
                                            )}
                                            {isPending ? 'Sending...' : 'Send Message'}
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Form>
                        </Card>
                    </div>

                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>Reach out to us directly through our channels.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Email</h3>
                                        <p className="text-sm text-muted-foreground">For general inquiries</p>
                                        <a href="mailto:support@meinvest.com" className="text-sm text-primary hover:underline">support@meinvest.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Phone</h3>
                                        <p className="text-sm text-muted-foreground">Mon-Fri, 9am-6pm IST</p>
                                        <a href="tel:+911800123456" className="text-sm text-primary hover:underline">+91 1800 123 456</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Office Address</h3>
                                        <p className="text-sm text-muted-foreground">Meinvest Pvt. Ltd.<br />123 MG Road, Financial District,<br />Bangalore, 560001, India</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-4">Follow us</h3>
                                    <div className="flex items-center gap-4">
                                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                            <Twitter className="h-6 w-6" />
                                            <span className="sr-only">Twitter</span>
                                        </a>
                                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                            <Linkedin className="h-6 w-6" />
                                            <span className="sr-only">LinkedIn</span>
                                        </a>
                                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                            <Facebook className="h-6 w-6" />
                                            <span className="sr-only">Facebook</span>
                                        </a>
                                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                            <Instagram className="h-6 w-6" />
                                            <span className="sr-only">Instagram</span>
                                        </a>
                                        <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M12,2A10,10,0,0,0,2,12a10,10,0,0,0,10,10,10,10,0,0,0,10-10A10,10,0,0,0,12,2Zm5.47,7.24L15.6,15.7a.54.54,0,0,1-.49.33.5.5,0,0,1-.48-.28l-1.53-5-2.14,2a.5.5,0,0,1-.39.19.52.52,0,0,1-.39-.19L8.35,11a.5.5,0,0,1,.15-.68l8.3-3.41A.5.5,0,0,1,17.47,7.24Z" /></svg>
                                            <span className="sr-only">Telegram</span>
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </>
    );
}
