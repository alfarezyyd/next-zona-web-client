"use client"
import {FcGoogle} from "react-icons/fc";
import {Button, Input} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function Register() {
  const {push} = useRouter();

  const [registerRequest, setRegisterRequest] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [userError, setUserError] = useState('');

  const handleChange = (e) => {
    setRegisterRequest({
      ...registerRequest,
      [e.target.name]: e.target.value,
    });
  };

  const fetchCsrf = (async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
      headers: {
        Referer: '127.0.0.1:8000',
        Accept: 'application/json',
      },
    });
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserError('');
    const serverResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
      method: 'POST',
      credentials: "include",
      headers: {
        Referer: '127.0.0.1:8000',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerRequest),
    });

    if (serverResponse.ok) {
      await push(process.env.NEXT_PUBLIC_BASE_URL + '/auth/login')
    } else {
      const errorPayload = await serverResponse.json();
      setUserError(errorPayload.errors || 'Registration failed');
    }
  };
  useEffect(() => {
    fetchCsrf()
  }, []);


  return (
    <div
      className="mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[4vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-semibold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 font-light text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
        <Button
          className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#F4F7FE] hover:cursor-pointer dark:bg-navy-800">
          <div className="rounded-full text-xl">
            <FcGoogle/>
          </div>
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">
            Sign In with Google
          </h5>
        </Button>
        <div className="mb-6 flex items-center  gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700"/>
          <p className="text-base text-gray-600 dark:text-white"> or </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700"/>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <Input
            label="Name"
            name="name"
            onChange={handleChange}
            fullWidth
            className="mb-3"
            required
            isInvalid={!!userError.name}
            errorMessage={userError.name ? userError.name[0] : ""}
          />
          <Input
            label="Email"
            name="email"
            onChange={handleChange}
            fullWidth
            className="mb-3"
            required
            isInvalid={!!userError.email}
            errorMessage={userError.email ? userError.email[0] : ""}
          />
          <Input
            label="Password"
            name="password"
            type="password"


            onChange={handleChange}
            fullWidth
            className="mb-3"
            required
            isInvalid={!!userError.password}
            errorMessage={userError.password ? userError.password[0] : ""}
          />
          <Input
            label="Confirm Password"
            name="password_confirmation"
            type="password"

            onChange={handleChange}
            fullWidth
            className="mb-3"
            required
            isInvalid={!!userError.password_confirmation}
            errorMessage={userError.password_confirmation ? userError.password_confirmation[0] : ""}
          />

          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center">

            </div>
            <a
              className="text-sm mt-2 font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              href=" "
            >
              Forgot Password?
            </a>
          </div>
          <Button
            type="submit"
            size="lg"
            className="linear mt-2 w-full rounded-xl font-light bg-brand-500 py-[12px] text-base  text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            Sign In
          </Button>
        </form>
        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <a
            href=" "
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
