"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useLogin } from "@/api/auth/auth.hook";
import { ApiError } from "@/api/types/api-response";
import { FadeIn } from "@/components/common/Motion";
import { Boxes } from "@/components/ui/background-boxes";
import { fadeUpSpring } from "@/lib/motion.variants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { TextLoader } from "@/components/ui/text-loader";
import { useAuth } from "@/providers/AuthProvider";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: (response) => {
        const user = response.data.user;
        const token = response.data.token || response.data.accessToken || "";

        // Strictly verify SP_ADMIN role
        if (user.role !== "SP_ADMIN") {
          toast.error("Access denied: Requires SP_ADMIN role privileges");
          logout();
          return;
        }

        login(token, user);
        toast.success(`Welcome to Sky Crawler Portal, ${user.name || "Administrator"}!`);
        router.push("/dashboard");
      },
      onError: (error) => {
        const message =
          error instanceof ApiError ? error.message : "Authentication failed";
        toast.error(message);
      },
    });
  };

  if (authLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <TextLoader text="Initializing secure session..." />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-slate-950 mask-[radial-gradient(transparent,white)]" />
      <Boxes />

      {/* Cyber Glow Spheres */}
      <div className="pointer-events-none absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/3 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />

      <FadeIn variants={fadeUpSpring} className="relative z-30 w-full max-w-sm">
        <Card className="w-full border border-primary/25 bg-slate-900/80 shadow-2xl rounded-2xl rounded-tl-none rounded-br-none backdrop-blur-xl">
          <CardHeader className="space-y-2 text-center pb-4">
            <div className="mx-auto relative flex size-14 items-center justify-center rounded-xl p-2 shadow-lg">
              <Image
                src="/assets/logo/logo.png"
                alt="Sky Crawler Logo"
                width={48}
                height={48}
                className="size-full object-contain"
                priority
              />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              Crawler <br /> <span className="font-weight text-xs text-primary">SP Admin</span>
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Secure enterprise console for node hardware binding and license provisioning
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-2 pb-6">
              <Input
                label="Administrator Email"
                type="email"
                icon={Mail}
                placeholder="admin@skycrawler.io"
                error={errors.email?.message}
                {...register("email")}
                className="bg-slate-950/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary"
              />

              <Input
                label="Master Password"
                type="password"
                icon={Lock}
                placeholder="••••••••••••"
                error={errors.password?.message}
                {...register("password")}
                className="bg-slate-950/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary"
              />
            </CardContent>

            <CardFooter className="pt-2 pb-6">
              <Button
                type="submit"
                className="w-full font-semibold shadow-md mt-4 shadow-primary/20"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Authenticating..." : "Authorize SP Console"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </FadeIn>
    </div>
  );
}
