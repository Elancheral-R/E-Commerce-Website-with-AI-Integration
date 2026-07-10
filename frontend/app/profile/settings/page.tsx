"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, Save, ShieldAlert, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuthStore } from "@/lib/store/auth";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login?redirectTo=/profile/settings");
    } else if (user) {
      setName(user.name);
      setPhone(user.phone || "");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      // Simulate profile update API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      updateUser({ name, phone });
      setSuccess("Profile settings updated successfully!");
    } catch (err: any) {
      setError(err?.message || "Failed to update profile settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsSaving(true);

    try {
      // Simulate password change API call or update in local DB
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const localUsersRaw = localStorage.getItem("nexmart-users-db");
      if (localUsersRaw) {
        const users = JSON.parse(localUsersRaw);
        const idx = users.findIndex((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
        if (idx !== -1) {
          if (users[idx].passwordHash !== currentPassword) {
            setError("Incorrect current password.");
            setIsSaving(false);
            return;
          }
          users[idx].passwordHash = newPassword;
          localStorage.setItem("nexmart-users-db", JSON.stringify(users));
        }
      }

      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err?.message || "Failed to change password.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-28 pb-16">
        <div className="max-w-[1400px] w-full mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Header */}
            <div>
              <h1 className="font-display font-bold text-2xl text-text-primary">Account Settings</h1>
              <p className="text-text-muted text-sm">Update your public profile and account credentials</p>
            </div>

            {/* Notifications */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-danger/8 border border-danger/15 rounded-2xl text-xs text-danger font-medium">
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-success/8 border border-success/15 rounded-2xl text-xs text-success font-medium">
                {success}
              </motion.div>
            )}

            {/* Form - Profile details */}
            <form onSubmit={handleUpdateProfile} className="glass-card rounded-3xl border border-border bg-surface p-6 space-y-6">
              <h2 className="font-display font-bold text-base text-text-primary flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Profile Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase">Email Address (Read-Only)</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-surface-3 rounded-xl border border-border px-3.5 py-2.5 text-sm text-text-muted outline-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-text-secondary uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>

            {/* Form - Password credentials */}
            <form onSubmit={handleChangePassword} className="glass-card rounded-3xl border border-border bg-surface p-6 space-y-6">
              <h2 className="font-display font-bold text-base text-text-primary flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" /> Change Password
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-60"
                >
                  <Lock className="w-4 h-4" />
                  {isSaving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
