// src/components/auth/LoginForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebaseConfig";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = React.useState("");

  const onSubmit = async (data: FormData) => {
    setFirebaseError("");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/dashboard");
    } catch (error: any) {
      setFirebaseError(error.message);
    }
  };

  return (
    <Card className="max-w-sm mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle className="text-xl text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              {...register("password")}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {firebaseError && (
            <p className="text-red-500 text-sm">{firebaseError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </CardContent>
    </Card>
  );
};
