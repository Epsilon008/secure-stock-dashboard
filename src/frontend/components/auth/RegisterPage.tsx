
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthService } from "@/backend/services/AuthService";
import { toast } from "@/components/ui/use-toast";
import { RegisterUserData } from "@/data/models/User";

const formSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  department: z.string().optional(),
  email: z.string().email("Veuillez entrer une adresse email valide").optional(),
  fullName: z.string().optional(),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const form = useForm<RegisterUserData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      department: "",
      email: "",
      fullName: "",
    },
  });

  const onSubmit = async (values: RegisterUserData) => {
    try {
      await AuthService.register(values);
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de l'inscription.",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>Remplissez les informations ci-dessous pour créer votre compte.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d'utilisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom d'utilisateur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Mot de passe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom complet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (optionnel)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Département (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Département" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">S'inscrire</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-500">
            Vous avez déjà un compte?{" "}
            <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
