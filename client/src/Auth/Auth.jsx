import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import LoginIcon from '@mui/icons-material/Login';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLoginMutation ,useSignupMutation} from '../RTK/auth.js';
// Define the schema for the form using zod
const formSchema = z.object({
  username: z.string().min(2, "Username should have at least 2 characters").max(50, "Username should not exceed 50 characters").optional(),
  email: z.string().email("Invalid email address"),
  age: z.string()
  .refine((val) => {
    const parsed = parseInt(val, 10);
    return !isNaN(parsed) && parsed >= 18 && parsed <= 99;
  }, {
    message: "Age must be a number and at least 18 and less than 99",
  }).optional(),
  location: z.string().optional(),
  type: z.enum(["Login", "Signup"]),
  password: z.string().min(8, "Password should have at least 8 characters").max(50, "Password should not exceed 50 characters"),
});
import { useToast } from "@/components/ui/use-toast"
import { Loader } from '@/components/Loader.jsx';

const Auth = () => {
  const { toast } = useToast()
  const [login, { isLoading: isLoginLoading, isError: isLoginError, isSuccess: isLoginSuccess, error: loginError }] = useLoginMutation();
  const [signup, { isLoading: isSignupLoading, isError: isSignupError, isSuccess: isSignupSuccess, error: signupError }] = useSignupMutation();
  // Use the useForm hook to manage form state
  const form1 = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      age: "",
      location: "",
      type: "Signup",
      password:"",
    },
  });
  const form2 = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      type: "Login",
      password:"",
    },
  });

  // Define the onSubmit function to handle form submission
  const onSubmit = (values) => {
    console.log(values);
    if(values.type==="Signup") {
      console.log("here");
      signup(values)
      isSignupLoading && <Loader/>
      isSignupSuccess && toast({
        title: "Signup Success",
      })
      isSignupError && toast({
        title: "Signup Failed",
        description: signupError.message,
      })
    }else{
      console.log("there");
      login(values)
      isLoginLoading && <Loader/>
      isLoginSuccess && toast({
        title: "Login Success",
      })
      isLoginError && toast({
        title: "Login Failed",
        description: loginError.message,
      })
    } 
    // form1.reset();
    // form2.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-start">
          <LoginIcon /> <span className='px-2'>Authenticate</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] py-12 rounded-lg">
  
      <Tabs defaultValue="Signup" className="w-full h-full">
      <TabsList className="w-full">
        <TabsTrigger className="w-full" value="Login">Login</TabsTrigger>
        <TabsTrigger  className="w-full" value="Signup">Signup</TabsTrigger>
      </TabsList>
      <Form {...form1}>
        <form onSubmit={form1.handleSubmit(onSubmit)} className="space-y-8">  
         <TabsContent value="Signup">
         {/* <input control={form1.control} type="hidden" name="type" value="Signup" /> */}
            <FormField
              control={form1.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form1.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form1.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form1.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form1.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full" >
                        <SelectValue placeholder="Select a Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Location</SelectLabel>
                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                          <SelectItem value="Pune">Pune</SelectItem>
                          <SelectItem value="Banglore">Banglore</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full my-4' type="submit">Register</Button>
         </TabsContent>
      </form>
      </Form>
      <Form {...form2}>
        <form onSubmit={form2.handleSubmit(onSubmit)} className="space-y-8"> 
         <TabsContent value="Login">
         {/* <input control={form2.control} type="hidden" name="type" value="Login" />  // this is not working  */}
            <FormField
              control={form2.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form2.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <Button className='w-full my-4' type="submit">Login</Button>
         </TabsContent>
         
      </form>
      </Form> 
      </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default Auth;
