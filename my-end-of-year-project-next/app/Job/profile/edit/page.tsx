'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Job_portail/Home/components/ui/button';
import { Input } from '@/components/Job_portail/Home/components/ui/input';
import { Label } from '@/components/Job_portail/Home/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/Job_portail/Home/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/Job_portail/Home/components/ui/card';
import { Icons } from '@/components/Job_portail/Home/components/ui/icons';
import { useToast } from '@/components/Job_portail/Home/components/ui/use-toast';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  phone: string;
  jobTitle: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    id: '', name: '', email: '', avatar: '', bio: '', phone: '', jobTitle: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/profile');
        const data = await response.json();
        setProfile(data);
        setAvatarPreview(data.avatar);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast({ title: 'Error', description: 'Failed to load profile data', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, avatar: avatarPreview })
      });
      if (!response.ok) throw new Error('Failed to update profile');
      toast({ title: 'Success', description: 'Profile updated successfully' });
      router.refresh();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-[var(--color-bg-secondary)]">
      <Icons.spinner className="h-10 w-10 animate-spin text-[var(--color-lamaSkyDark)]" />
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4 bg-[var(--color-bg-secondary)] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-[var(--color-bg-primary)] border-[var(--color-border-light)] shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[var(--color-text-primary)]">Edit Profile</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24 border-[var(--color-border-medium)]">
                  <AvatarImage src={avatarPreview} alt={profile.name} />
                  <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>

                <Label htmlFor="avatar" className="cursor-pointer flex flex-col items-center gap-1">
                  <span className="inline-flex items-center gap-2 text-[var(--color-lamaSkyDark)] hover:text-[var(--color-lamaSky)] text-sm font-medium">
                    <Icons.camera className="h-4 w-4" /> Change Avatar
                  </span>
                  <input id="avatar" type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
                  <p className="text-xs text-[var(--color-text-secondary)]">JPG, GIF or PNG. Max 2MB.</p>
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={profile.name} onChange={handleChange} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={profile.email} disabled placeholder="your.email@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" name="jobTitle" value={profile.jobTitle} onChange={handleChange} placeholder="Your position" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" value={profile.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="w-full rounded-md border border-[var(--color-border-light)] px-3 py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lamaSkyLight)]"
                  rows={3}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t border-[var(--color-border-light)] px-6 py-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
                {isSaving && <Icons.spinner className="h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
