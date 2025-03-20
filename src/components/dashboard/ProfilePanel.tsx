import React from "react";
import DashboardHeader from "./DashboardHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { User, Shield, CreditCard, Bell, Lock } from "lucide-react";

interface ProfilePanelProps {
  visible?: boolean;
  user?: {
    name: string;
    email: string;
    avatar: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}

const ProfilePanel = ({
  visible = true,
  user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    phone: "(555) 123-4567",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zip: "10001",
  },
}: ProfilePanelProps) => {
  if (!visible) return null;

  return (
    <div className="w-full h-full p-6 bg-background">
      <div className="flex flex-col space-y-6 max-w-5xl mx-auto">
        <DashboardHeader
          title="Profile Settings"
          description="Manage your account settings and preferences"
        />
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User size={16} />
              <span className="hidden sm:inline">Personal Info</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield size={16} />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard size={16} />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell size={16} />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock size={16} />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details here
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input id="name" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <Input id="phone" defaultValue={user.phone} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">
                      Address
                    </label>
                    <Input id="address" defaultValue={user.address} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium">
                      City
                    </label>
                    <Input id="city" defaultValue={user.city} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="state" className="text-sm font-medium">
                      State
                    </label>
                    <Input id="state" defaultValue={user.state} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="zip" className="text-sm font-medium">
                      ZIP Code
                    </label>
                    <Input id="zip" defaultValue={user.zip} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your profile picture</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex space-x-2">
                  <Button variant="outline">Upload New Picture</Button>
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive hover:bg-destructive/10"
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="current-password"
                    className="text-sm font-medium"
                  >
                    Current Password
                  </label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-medium">
                    New Password
                  </label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="confirm-password"
                    className="text-sm font-medium"
                  >
                    Confirm New Password
                  </label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Update Password</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      Two-factor authentication is disabled
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Protect your account with an additional security layer
                    </p>
                  </div>
                  <Button>Enable</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">
                          Expires 12/2025
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full">
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View your recent billing history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">Premium Plan - Monthly</p>
                        <p className="text-sm text-muted-foreground">{`${new Date().getMonth() + 1 - i}/01/${new Date().getFullYear()}`}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$24.99</p>
                        <Button variant="link" className="p-0 h-auto">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Account Updates",
                      description:
                        "Receive updates about your account activity",
                    },
                    {
                      title: "New Features",
                      description:
                        "Be the first to know about new features and improvements",
                    },
                    {
                      title: "Marketing",
                      description:
                        "Receive marketing communications and offers",
                    },
                    {
                      title: "Security Alerts",
                      description:
                        "Get notified about important security updates",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={i !== 2}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Manage your privacy preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Profile Visibility",
                      description:
                        "Control who can see your profile information",
                    },
                    {
                      title: "Data Sharing",
                      description:
                        "Manage how your data is shared with our partners",
                    },
                    {
                      title: "Activity Status",
                      description: "Show when you're active on the platform",
                    },
                    {
                      title: "Cookie Preferences",
                      description: "Manage cookies and tracking technologies",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={i === 0 || i === 3}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  className="text-destructive border-destructive hover:bg-destructive/10"
                >
                  Delete Account
                </Button>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePanel;
