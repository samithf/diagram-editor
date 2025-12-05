import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebaseConfig";

const schema = z
  .object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    role: z.enum(["editor", "viewer"] as const, { error: "Role is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export const Signup: React.FC = () => {
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Save role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: data.email,
        role: data.role,
      });

      navigate("/dashboard");
    } catch (error: any) {
      setFirebaseError(error.message);
    }
  };

  return (
    <Card className="max-w-sm mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle className="text-xl text-center">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              {...register("confirmPassword")}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label>Role</Label>
            <select
              {...register("role")}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select role</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>

          {firebaseError && (
            <p className="text-red-500 text-sm">{firebaseError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        {/* Add a link to the login page */}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </CardContent>
    </Card>
  );
};
