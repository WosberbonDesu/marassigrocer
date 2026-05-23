"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Loader2,
  Lock,
  Mail,
  EyeOff,
  Eye,
  ShieldCheck,
  Globe2,
  Package,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const PORT_BG =
  "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=70";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="relative flex min-h-screen bg-[oklch(0.12_0.01_60)] text-white">
      {/* Background image */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={PORT_BG}
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.12_0.01_60)] via-[oklch(0.14_0.02_80)]/90 to-[oklch(0.10_0.02_80)]" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.78 0.12 80) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.12 80) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <motion.div
          aria-hidden
          className="absolute -right-32 top-1/3 h-[520px] w-[520px] rounded-full bg-[oklch(0.78_0.12_80)]/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -left-24 bottom-10 h-[360px] w-[360px] rounded-full bg-[oklch(0.66_0.16_35)]/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Left — branding panel */}
      <div className="relative z-10 hidden w-1/2 flex-col justify-between p-12 lg:flex">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <Image
            src="/images/marassilogo.jpeg"
            alt="Marassi Group"
            width={52}
            height={52}
            className="h-13 w-13 rounded-xl object-contain ring-1 ring-[oklch(0.78_0.12_80)]/30"
          />
          <div>
            <p className="text-lg font-bold tracking-wide text-[oklch(0.78_0.12_80)]">MARASSI</p>
            <p className="text-[10px] font-medium tracking-[0.3em] text-[oklch(0.78_0.12_80)]/55">
              GROUP
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[oklch(0.78_0.12_80)]">
            Admin Console
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-tight tracking-tight text-white">
            Manage Your Global<br />
            <span className="text-[oklch(0.78_0.12_80)]">FMCG Catalog</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
            Sign in to manage products, categories, brands, media library, and company settings — all from one secure place.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { icon: Package, value: "67", label: "Products" },
              { icon: Globe2, value: "50+", label: "Markets" },
              { icon: ShieldCheck, value: "29+", label: "Years" },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center backdrop-blur-sm"
              >
                <Icon className="mx-auto h-4 w-4 text-[oklch(0.78_0.12_80)]/80" />
                <p className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-bold text-[oklch(0.82_0.11_80)]">
                  {value}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/45">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xs text-white/35"
        >
          &copy; {new Date().getFullYear()} Marassi Group FZCO. All rights reserved.
        </motion.p>
      </div>

      {/* Right — login form */}
      <div className="relative z-10 flex flex-1 items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-[oklch(0.18_0.02_80)]/85 p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-8"
        >
          {/* Mobile logo */}
          <div className="mb-6 flex flex-col items-center gap-3 lg:hidden">
            <Image
              src="/images/marassilogo.jpeg"
              alt="Marassi Group"
              width={56}
              height={56}
              className="h-14 w-14 rounded-xl object-contain ring-1 ring-[oklch(0.78_0.12_80)]/30"
            />
            <div className="text-center">
              <h1 className="font-[family-name:var(--font-playfair)] text-xl font-bold tracking-wide text-[oklch(0.78_0.12_80)]">
                MARASSI GROUP
              </h1>
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                Admin Console
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[oklch(0.78_0.12_80)]">
              Sign In
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-white/55">
              Enter your credentials to continue.
            </p>
            <div className="mt-5 h-[2px] w-10 rounded-full bg-[oklch(0.78_0.12_80)]" />
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[11px] font-semibold uppercase tracking-wider text-white/70"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@marassigroup.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11 w-full rounded-lg border border-white/15 bg-white/[0.05] pl-10 pr-3 text-sm text-white placeholder:text-white/35 outline-none transition-all focus:border-[oklch(0.78_0.12_80)]/60 focus:bg-white/[0.08] focus:ring-2 focus:ring-[oklch(0.78_0.12_80)]/25"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-[11px] font-semibold uppercase tracking-wider text-white/70"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-11 w-full rounded-lg border border-white/15 bg-white/[0.05] pl-10 pr-10 text-sm text-white placeholder:text-white/35 outline-none transition-all focus:border-[oklch(0.78_0.12_80)]/60 focus:bg-white/[0.08] focus:ring-2 focus:ring-[oklch(0.78_0.12_80)]/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/45 transition-colors hover:bg-white/10 hover:text-white/80"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
              >
                <Lock className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="group h-11 w-full bg-[oklch(0.66_0.16_35)] text-sm font-semibold text-white shadow-md shadow-[oklch(0.66_0.16_35)]/30 transition-all hover:bg-[oklch(0.60_0.17_35)] hover:shadow-lg hover:shadow-[oklch(0.66_0.16_35)]/40"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-white/40">
            <ShieldCheck className="h-3.5 w-3.5 text-[oklch(0.78_0.12_80)]/70" />
            Secured admin access — authorized personnel only
          </div>
        </motion.div>
      </div>
    </div>
  );
}
