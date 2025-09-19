"use client";

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Briefcase,
  Settings,
  BookOpen,
  Newspaper,
  User,
  Home,
  LayoutGrid,
  TrendingUp,
  Users,
  Phone,
  ChevronDown,
  Gem,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePathname } from 'next/navigation';
import { PortfolioProvider } from '@/context/portfolio-context';
import React, { useEffect } from 'react';
import Link from 'next/link';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.add(theme);
    }
  }, []);

  const isActive = (path: string) => pathname === path;
  const isStockFundOpen = [
    '/stock',
    '/cryptocurrency',
    '/funds',
    '/savings',
    '/gold',
  ].includes(pathname);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Meinvest</title>
        <meta name="description" content="Real-time market data and analysis." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body text-foreground antialiased'
        )}
      >
        <PortfolioProvider>
          <SidebarProvider>
            <Sidebar
              collapsible={isMobile ? 'offcanvas' : 'icon'}
              className="border-r border-border/20 bg-background/50 backdrop-blur-sm"
            >
              <SidebarHeader>
                <Logo />
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/" isActive={isActive('/')} tooltip="Dashboard">
                      <LayoutGrid />
                      Dashboard
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                   <SidebarMenuItem>
                    <SidebarMenuButton href="/wallet" isActive={isActive('/wallet')} tooltip="Wallet">
                      <Wallet />
                      Wallet
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/news" isActive={isActive('/news')} tooltip="News">
                      <Newspaper />
                      News
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem asChild>
                     <Collapsible defaultOpen={isStockFundOpen}>
                      <CollapsibleTrigger asChild>
                         <SidebarMenuButton isSubmenu={true} isActive={isStockFundOpen} tooltip="Stock & Fund">
                            <TrendingUp />
                            Stock & fund
                            <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuItem>
                            <SidebarMenuSubButton href="/stock" isActive={isActive('/stock')}>
                                Stock
                            </SidebarMenuSubButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuSubButton href="/cryptocurrency" isActive={isActive('/cryptocurrency')}>
                                Cryptocurrency
                            </SidebarMenuSubButton>
                          </SidebarMenuItem>
                           <SidebarMenuItem>
                            <SidebarMenuSubButton href="/funds" isActive={isActive('/funds')}>
                                Mutual Fund
                            </SidebarMenuSubButton>
                          </SidebarMenuItem>
                           <SidebarMenuItem>
                            <SidebarMenuSubButton href="/gold" isActive={isActive('/gold')}>
                                Gold
                            </SidebarMenuSubButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuSubButton href="/savings" isActive={isActive('/savings')}>
                                Saving Plan
                            </SidebarMenuSubButton>
                          </SidebarMenuItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>

                   <SidebarMenuItem>
                    <SidebarMenuButton href="/portfolio" isActive={isActive('/portfolio')} tooltip="Portfolio">
                      <Briefcase />
                      Portfolio
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/transactions" isActive={isActive('/transactions')} tooltip="Transactions">
                      <ArrowLeftRight />
                      Transaction
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/learn" isActive={isActive('/learn')} tooltip="Learn">
                      <BookOpen />
                      Learn
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <Separator className="my-2" />

                  <SidebarMenuItem>
                    <SidebarMenuButton href="/community" isActive={isActive('/community')} tooltip="Our community">
                      <Users />
                      Our community
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/settings" isActive={isActive('/settings')} tooltip="Settings">
                      <Settings />
                      Settings
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                   <SidebarMenuItem>
                    <SidebarMenuButton href="/contact" isActive={isActive('/contact')} tooltip="Contact us">
                      <Phone />
                      Contact us
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
            <SidebarInset>
              <div className="flex flex-col min-h-screen">
                <div className="flex-1">
                  {children}
                </div>
                <footer className="border-t border-white/10 py-4 px-6 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Meinvest. All Rights Reserved.</p>
                </footer>
              </div>
            </SidebarInset>
            <Toaster />
          </SidebarProvider>
        </PortfolioProvider>
      </body>
    </html>
  );
}
