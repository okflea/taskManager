
import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/AuthProvider";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import LoaderIcon from "@/assets/Loading";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirmPassword']
    });
  }
})
const Register = () => {
  const { token, setToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
      toast.warning("User is Logged in")
    }
  }, [])
  const handleLogin = (token: string) => {
    setToken(token);
    navigate("/", { replace: true });
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: ""
    },
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setIsLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, values)
      console.log(response.status)
      if (response.status === 201) {
        setIsLoading(false)
        toast.success("Registration success")
        form.reset()
        handleLogin(response.data.token)
      }
    } catch (err: any) {

      setIsLoading(false)
      if (err.response?.status === 401) {
        toast.error(err.response?.data.error)
        return
      }
      toast.error("something went wrong")
    }
  }
  return <>
    <div className="w-full h-[500px] flex items-center justify-center">
      <div className="w-[400px] flex flex-col items-center justify-center border-2 border-blue-500 rounded-lg shadow-lg p-4 space-y-4">
        <h1 className="text-3xl font-bold text-blue-500">Register</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Name</FormLabel> */}
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Name"
                      {...field}
                    />
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
                  {/* <FormLabel>Email</FormLabel> */}
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                    />
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
                  {/* <FormLabel>Password</FormLabel> */}
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Password</FormLabel> */}
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600"
              type="submit"
              disabled={isLoading}
            >{isLoading ? <LoaderIcon /> : "Sign up"}</Button>
          </form>
        </Form>
        <p className="text-sm font-thin">Already have an account? <a href="/login" className="text-blue-500 font-normal">Login</a></p>
      </div>
    </div>
  </>;
};

export default Register;
