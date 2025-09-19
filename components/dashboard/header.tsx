"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bell, LayoutGrid, Briefcase, Wallet, Settings, ArrowLeftRight, LogOut, Newspaper, BookOpen, Users, Phone, Gem, TrendingUp, User, CreditCard } from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { Stock } from '@/types';
import { useRouter } from 'next/navigation';
import { usePortfolio } from '@/context/portfolio-context';
import { useToast } from '@/hooks/use-toast';
import { ModeToggle } from '@/components/mode-toggle';

type HeaderProps = {
  onStockSelect: (stock: Stock) => void;
};

export function Header({ onStockSelect }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { stocks, profile } = usePortfolio();
  const { toast } = useToast();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleStockSelect = (symbol: string) => {
    const stock = stocks.find((s) => s.symbol === symbol);
    if (stock) {
      onStockSelect(stock);
    }
    setOpen(false);
  };
  
  const handleNavigation = (path: string) => {
    router.push(path);
    setOpen(false);
  }
  
  const handleAction = (action: () => void) => {
      action();
      setOpen(false);
  }

  const pageCommands = [
    { name: "Dashboard", path: "/", icon: <LayoutGrid /> },
    { name: "Wallet", path: "/wallet", icon: <Wallet /> },
    { name: "News", path: "/news", icon: <Newspaper /> },
    { name: "Stock", path: "/stock", icon: <TrendingUp /> },
    { name: "Cryptocurrency", path: "/cryptocurrency", icon: <Gem /> },
    { name: "Mutual Fund", path: "/funds", icon: <Briefcase /> },
    { name: "Gold", path: "/gold", icon: <Gem /> },
    { name: "Saving Plan", path: "/savings", icon: <Wallet /> },
    { name: "Portfolio", path: "/portfolio", icon: <Briefcase /> },
    { name: "Transactions", path: "/transactions", icon: <ArrowLeftRight /> },
    { name: "Learn", path: "/learn", icon: <BookOpen /> },
    { name: "Our community", path: "/community", icon: <Users /> },
    { name: "Contact us", path: "/contact", icon: <Phone /> },
  ];

  const userCommands = [
     { name: "Profile", path: "/profile", icon: <User /> },
     { name: "Subscription", path: "/billing", icon: <CreditCard /> },
     { name: "Settings", path: "/settings", icon: <Settings /> },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-2">
      <SidebarTrigger />
      
      <div className="relative ml-auto flex-1 md:grow-0">
        <Button
          variant="outline"
          className="flex w-full justify-start text-sm text-muted-foreground md:w-[300px] lg:w-[400px]"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          Search or jump to...
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
           <CommandGroup heading="Pages">
            {pageCommands.map(page => (
              <CommandItem key={page.path} onSelect={() => handleNavigation(page.path)} value={page.name}>
                {page.icon}
                <span className="ml-2">{page.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
           <CommandGroup heading="User">
            {userCommands.map(page => (
              <CommandItem key={page.path} onSelect={() => handleNavigation(page.path)} value={page.name}>
                {page.icon}
                <span className="ml-2">{page.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Stocks">
            {stocks.map((stock) => (
              <CommandItem key={stock.symbol} onSelect={() => handleStockSelect(stock.symbol)} value={`${stock.symbol} ${stock.name}`}>
                <span className="font-bold mr-6 w-20 inline-block flex-shrink-0">{stock.symbol}</span>
                <span className="truncate">{stock.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
             <CommandItem onSelect={() => handleAction(() => console.log('Log out'))} value="Log out">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <ModeToggle />

       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Bell className="h-5 w-5" />
             <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">2</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium leading-none">Notifications</p>
              <a href="#" className="text-xs text-primary hover:underline">Mark all as read</a>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex items-start gap-3 group">
              <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src="https://picsum.photos/seed/ua1/100/100" alt="Avatar" />
                  <AvatarFallback>🎉</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Welcome to Meinvest!</p>
                <p className="text-xs text-muted-foreground group-hover:text-accent-foreground">Your journey to financial freedom starts now.</p>
              </div>
            </DropdownMenuItem>
             <DropdownMenuSeparator />
             <DropdownMenuItem className="flex items-start gap-3 group">
               <div className="w-8 h-8 mt-1 flex items-center justify-center">
                <Search className="h-5 w-5 text-blue-500" />
               </div>
              <div>
                <p className="text-sm font-medium">Market Alert: NIFTY 50</p>
                <p className="text-xs text-muted-foreground group-hover:text-accent-foreground">NIFTY 50 is up by 1.2% today. Check your portfolio.</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>


      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={profile.avatar}
                alt="User Avatar"
                data-ai-hint="person portrait"
              />
              <AvatarFallback>{(profile.name && profile.name.length > 0) ? profile.name[0].toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profile.name || 'User'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {profile.email || 'user@example.com'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/billing')}>Subscription</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => console.log('Log out clicked')}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
