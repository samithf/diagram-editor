import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Mail, User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

// Common Components
interface ProfileAvatarSectionProps {
  user: {
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
    uid: string;
    metadata: {
      creationTime?: string | null;
      lastSignInTime?: string | null;
    };
  } | null;
  role: string | null;
  getInitials: (email: string) => string;
}

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
}

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  valueClass?: string;
}

function ProfileAvatarSection({
  user,
  role,
  getInitials,
}: ProfileAvatarSectionProps) {
  return (
    <CardHeader className="text-center pb-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user?.photoURL || ""} alt="Profile" />
          <AvatarFallback className="text-xl bg-blue-500 text-white">
            {user?.email ? getInitials(user.email) : "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
            {user?.displayName || "User"}
          </CardTitle>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
          <Badge variant="outline" className="mt-2">
            {role}
          </Badge>
        </div>
      </div>
    </CardHeader>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  valueClass = "font-medium text-gray-900 dark:text-gray-100",
}: InfoItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className={valueClass}>{value}</p>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: SectionHeaderProps) {
  return (
    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
      <Icon className="w-5 h-5" />
      {title}
    </h3>
  );
}

export default function Profile() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-lg dark:shadow-gray-900/50 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <ProfileAvatarSection
            user={{
              email: user?.email,
              displayName: user?.displayName,
              photoURL: user?.photoURL,
              uid: user?.uid || "",
              metadata: {
                creationTime: user?.metadata?.creationTime,
                lastSignInTime: user?.metadata?.lastSignInTime,
              },
            }}
            role={role}
            getInitials={getInitials}
          />

          <CardContent className="space-y-6">
            {/* Account Information */}
            <div className="space-y-4">
              <SectionHeader icon={User} title="Account Information" />

              <div className="grid gap-4">
                <InfoItem
                  icon={Mail}
                  label="Email Address"
                  value={user?.email || "Not provided"}
                />

                <InfoItem
                  icon={User}
                  label="User ID"
                  value={user?.uid || "Not available"}
                  valueClass="font-mono text-sm text-gray-900 dark:text-gray-100"
                />

                <InfoItem
                  icon={Calendar}
                  label="Account Created"
                  value={formatDate(user?.metadata?.creationTime || null)}
                />

                <InfoItem
                  icon={Calendar}
                  label="Last Sign In"
                  value={formatDate(user?.metadata?.lastSignInTime || null)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-600 flex justify-end">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
