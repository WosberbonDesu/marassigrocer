"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — branding panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-[oklch(0.12_0.01_60)] p-12 lg:flex">
        <div className="flex items-center gap-3">
          <Image
            src="/images/marassilogo.jpeg"
            alt="Marassi Group"
            width={48}
            height={48}
            className="h-12 w-12 rounded-xl object-contain"
          />
          <div>
            <p className="text-lg font-bold text-[oklch(0.76_0.11_80)]">MARASSI</p>
            <p className="text-xs tracking-widest text-[oklch(0.76_0.11_80)]/60">GROUP</p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white">
            Admin Panel
          </h2>
          <p className="mt-3 text-white/50 leading-relaxed max-w-md">
            Manage your product catalog, categories, brands, media library, and company settings from one place.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-2xl font-bold text-[oklch(0.76_0.11_80)]">67</p>
              <p className="text-xs text-white/40 mt-1">Products</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-2xl font-bold text-[oklch(0.76_0.11_80)]">13</p>
              <p className="text-xs text-white/40 mt-1">Categories</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-2xl font-bold text-[oklch(0.76_0.11_80)]">13</p>
              <p className="text-xs text-white/40 mt-1">Brands</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/30">
          &copy; {new Date().getFullYear()} Marassi Group. All rights reserved.
        </p>
      </div>

      {/* Right — login form */}
      <div className="flex flex-1 items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
            <Image
              src="/images/marassilogo.jpeg"
              alt="Marassi Group"
              width={56}
              height={56}
              className="h-14 w-14 rounded-xl object-contain"
            />
            <div className="text-center">
              <h1 className="text-2xl font-bold">MARASSI</h1>
              <p className="text-sm text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          <div className="hidden lg:block mb-8">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to access the admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@marassigroup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="h-11"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <Lock className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-[oklch(0.76_0.11_80)] text-[oklch(0.12_0.01_60)] hover:bg-[oklch(0.82_0.10_80)] font-semibold"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
