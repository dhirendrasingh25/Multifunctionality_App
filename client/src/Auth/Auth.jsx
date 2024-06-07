import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import LoginIcon from '@mui/icons-material/Login';
import { set, z } from "zod";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast"
import 'react-toastify/dist/ReactToastify.css';
import { server } from '@/main';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/Redux/Reducers/authSlice';
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

const Auth = () => {

  const form1 = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      age: "",
      location: "",
      type: "Signup",
      password: "",
    },
  });

  const form2 = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      type: "Login",
      password: "",
    },
  });

  const [open, setOpen] = React.useState(false);
  const { toast } = useToast()
  const dispatch = useDispatch();
  // const config = {
  //   withCredentials: true,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // };

  const onSubmit = async(values) => {
    if (values.type === "Signup") {
      
     try {
      await axios.post(`${server}/api/v1/user/new`, {
        name:values.username,
        email:values.email, 
        password:values.password, 
        age:values.age, 
        location:values.location},
        {
          withCredentials: true,

        }
      )
      .then((res) => {
        toast({
          title: "Signup Success",
          variant: "success",
        })
        dispatch(loginUser(res.data.user))
        form1.reset();
      })
      .catch((err) => {
        // console.log(err);
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: err.response?.data?.message,
        })
        // console.log(err.response?.data?.message);
      });
     } catch (error) {
      console.log(error);
     }
    } else {
      try {
       await axios.post(`${server}/api/v1/user/login`, 
        {email:values.email,password:values.password},
        {
          withCredentials: true,
    
        }
        )
        .then((res) => {
          toast({
            title: "Login Success",
            variant: "success",
          })
          // console.log(res.data);
          dispatch(loginUser(res.data.user))
          form2.reset();
        })
        .catch((err) => {
          // console.log(err);
          toast({
            title: "Login Failed",
            variant: "destructive",
            description: err.response?.data?.message,
          })
          // console.log(err.response?.data?.message);
        });
      }catch (error) {
        console.log(error);
      }
      
    }
    setOpen(false);
    
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-start">
          <LoginIcon /> <span className='px-2'>Authenticate</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] py-12 rounded-lg">
        <Tabs defaultValue="Signup" className="w-full h-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="Login">Login</TabsTrigger>
            <TabsTrigger className="w-full" value="Signup">Signup</TabsTrigger>
          </TabsList>
          <Form {...form1}>
            <form onSubmit={form1.handleSubmit(onSubmit)} className="space-y-8">
              <TabsContent value="Signup">
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
                          <SelectTrigger className="w-full">
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
