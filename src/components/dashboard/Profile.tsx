import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const authToken = localStorage.getItem("auth_token");

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authToken) {
        toast({
          title: "Unauthorized",
          description: "Please login to view your profile",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to load profile");
        }

        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        toast({
          title: "Error",
          description: err.message || "Could not load profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authToken]);

  const handleSave = () => {
    toast({
      title: "Not Implemented",
      description: "Save functionality not yet connected to API",
    });
  };

  if (loading) return <p className="text-center mt-6">Loading profile...</p>;

  if (!profile)
    return <p className="text-center mt-6">No profile data found.</p>;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              readOnly
              disabled
              id="name"
              placeholder="Full Name"
              defaultValue={
                profile.display_name ||
                `${profile.first_name || ""} ${profile.last_name || ""}`
              }
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              readOnly
              id="email"
              type="email"
              placeholder="Email"
              defaultValue={profile.email}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              readOnly
              id="phone"
              type="tel"
              placeholder="Phone"
              defaultValue={profile.phone}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              disabled
              readOnly
              id="address"
              placeholder="Address"
              defaultValue={profile.address}
            />
          </div>
          {/* <Button onClick={handleSave}>Save Changes</Button> */}
        </div>
      </CardContent>
    </Card>
  );
};
