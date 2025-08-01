import { useState } from 'react';
import { Camera, MapPin, Mail, Phone, Globe, Edit, Save, X, FileText, Briefcase, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { useAuth } from './auth/AuthContext';
import { useRouter } from './AppRouter';

export function UserProfilePage() {
  const { user, updateProfile } = useAuth();
  const { navigateTo } = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: user?.profile?.full_name || '',
    bio: user?.profile?.bio || '',
    phone: user?.profile?.phone || '',
    city: user?.profile?.city || '',
    state: user?.profile?.state || '',
    website: '',
    linkedin: '',
    github: ''
  });

  // Mock applications data that matches your database schema
  const applications = [
    {
      application_id: 1,
      job: {
        job_id: 1,
        title: "Senior Frontend Developer",
        company_name: "TechCorp Inc.",
        company_logo: "T"
      },
      status: "reviewed" as const,
      applied_at: "2025-01-25",
      cover_letter: "I am excited about this opportunity..."
    },
    {
      application_id: 2,
      job: {
        job_id: 2,
        title: "UX Designer",
        company_name: "Design Studio",
        company_logo: "D"
      },
      status: "shortlisted" as const,
      applied_at: "2025-01-23",
      cover_letter: "My design experience aligns perfectly..."
    },
    {
      application_id: 3,
      job: {
        job_id: 3,
        title: "Full Stack Developer",
        company_name: "StartupXYZ",
        company_logo: "S"
      },
      status: "rejected" as const,
      applied_at: "2025-01-20",
      cover_letter: "I would love to contribute to your team..."
    }
  ];

  const handleSaveProfile = () => {
    updateProfile(profileData);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Please sign in to view your profile</p>
            <Button onClick={() => navigateTo('home')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-medium text-primary">
                      {user.profile?.full_name?.[0] || user.username[0].toUpperCase()}
                    </span>
                  </div>
                  <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 rounded-full">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      placeholder="Full Name"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-medium mb-1">
                      {user.profile?.full_name || user.username}
                    </h2>
                    <p className="text-muted-foreground capitalize mb-2">{user.role.replace('_', ' ')}</p>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="Phone number"
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        placeholder="City"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                        placeholder="State"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveProfile} size="sm" className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.profile?.bio && (
                    <p className="text-sm">{user.profile.bio}</p>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    
                    {user.profile?.phone && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{user.profile.phone}</span>
                      </div>
                    )}
                    
                    {(user.profile?.city || user.profile?.state) && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{user.profile?.city}{user.profile?.city && user.profile?.state && ', '}{user.profile?.state}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">JavaScript</Badge>
                <Badge variant="secondary">CSS</Badge>
                <Badge variant="secondary">Node.js</Badge>
              </div>
              <Button variant="ghost" size="sm" className="mt-4 w-full">
                + Add Skills
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
              <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Applications ({applications.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.application_id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <span className="text-primary font-medium">{application.job.company_logo}</span>
                            </div>
                            <div>
                              <h3 
                                className="font-medium hover:text-primary cursor-pointer"
                                onClick={() => navigateTo('job-detail', application.job.job_id)}
                              >
                                {application.job.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{application.job.company_name}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4 text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>Applied {getTimeAgo(application.applied_at)}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Application
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No saved jobs yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigateTo('jobs')}
                    >
                      Browse Jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={user.username} disabled className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="role">Account Type</Label>
                    <Input id="role" value={user.role.replace('_', ' ')} disabled className="mt-1 capitalize" />
                  </div>
                  
                  <Button variant="outline">Change Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No resume uploaded</p>
                    <Button>Upload Resume</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}