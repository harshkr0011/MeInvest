
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type ChangePictureDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (newUrl: string) => void;
  currentAvatar: string;
};

export function ChangePictureDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  currentAvatar
}: ChangePictureDialogProps) {
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setUrl(currentAvatar);
    }
  }, [isOpen, currentAvatar]);

  const handleSubmit = () => {
    if (/^https?:\/\/.+\..+/.test(url)) {
      onSubmit(url);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid URL',
        description: 'Please enter a valid image URL starting with http:// or https://',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
          <DialogDescription>
            Enter a new image URL for your avatar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              Image URL
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com/image.png"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Save Picture</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
