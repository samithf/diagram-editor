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
  email: z.email("Invalid email address"),
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setFirebaseError(error.message);
      } else {
        setFirebaseError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Card className="max-w-sm mx-auto mt-10 p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-900/50">
      <CardHeader>
        <CardTitle className="text-xl text-center text-gray-900 dark:text-gray-100">
          Login
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="text-gray-700 dark:text-gray-300 pb-1">
              Email
            </Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            {errors.email && (
              <p className="text-red-500 dark:text-red-400 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-300 pb-1">
              Password
            </Label>
            <Input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            {errors.password && (
              <p className="text-red-500 dark:text-red-400 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {firebaseError && (
            <p className="text-red-500 dark:text-red-400 text-sm">
              {firebaseError}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            Sign Up
          </a>
        </p>
      </CardContent>
    </Card>
  );
};
