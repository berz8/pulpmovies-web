import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { debounce } from "lodash";
import { useCallback } from "react";
import { Button } from "~/components/ui";
import { authenticator } from "~/services/auth.server";
import type { ApiResponse } from "~/interfaces";
import { usernameCheck } from "~/interfaces/api/user/usernameCheck";
import { motion } from "framer-motion";
import { IconCheck, IconClose } from "~/components/icons";

export async function loader({ request }: LoaderArgs) {
  let user = await authenticator.isAuthenticated(request);
  if(!user || user.user.Onboarding) return redirect("/");

  const url = new URL(request.url);
  const username = url.searchParams.get("username") ?? "";
  let usernameExist = false; 

  if (username.length >= 4) {
    const res = await fetch(`${process.env.API_URL}/user/username/${username}/check`, {
      headers: { 'Content-Type': 'application/json'}
    })
    const resJson: ApiResponse<boolean> = await res.json(); 
    usernameExist = resJson.result;
  }

  return json({ user: user.user, usernameExist, selectedUsername: username });
}

export async function action({ request }: ActionArgs) {
  let user = await authenticator.isAuthenticated(request);
  if(!user || user.user.Onboarding) return redirect("/");

  const body = await request.formData();
  const res = await fetch(`${process.env.API_URL}/user/username/${user.user.username}/onboard`, {
    method: "POST",
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token.access_token}`,
    },
    body: JSON.stringify({ username: body.get("username")}),
  })
  if(res.status === 401) return redirect('/login');
  return redirect('/profile');
}

export default function Onboarding() {
  const { user, usernameExist, selectedUsername } = useLoaderData<typeof loader>();
  
  const submit = useSubmit();

  const debounceChange = useCallback(debounce((e) => handleChange(e), 350), [])

  const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("username", (event.target as HTMLInputElement ).value)
      submit(searchParams, { replace: true });
  }

  const isValid = () => {
    if(usernameExist) return true;
    if(selectedUsername.length < 4) return true;
    return false;
  }


  return (
    <div className="px-3 mt-8">
      <h1 className="text-center text-2xl font-bold text-gray-200 mb-2">We're almost there</h1>
      <h2 className="text-center text-lg font-bold text-gray-300 mb-4">Choose your username</h2>
      <div className="w-36 h-36 overflow-hidden rounded-full mx-auto mt-12">
          <img src="/images/fallback-profile.jpg" className="object-cover w-full h-full" />
      </div>
      <Form action="/onboarding" method="post" className="w-4/5 mx-auto md:w-1/2 lg:w-96 mt-6">
        <div className="relative mb-20">
          <input 
            type="text" 
            name="username"
            className="w-full rounded-md pl-7 pr-4 py-2 bg-gray-100"
            placeholder="tylerdurden"
            onChange={debounceChange}
            defaultValue={selectedUsername}
          />
          { (!!usernameExist && selectedUsername.length > 3) && (
            <motion.div 
              layoutId="status" 
              className="w-full p-2 text-white text-sm bg-red-600 absolute left-0 -bottom-12 rounded-md shadow-lg flex justify-start items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <IconClose />
              <span>Username not available</span>
            </motion.div>
          )}
          { (!usernameExist && selectedUsername.length > 3) && (
            <motion.div 
              layoutId="status" 
              className="w-full p-2 text-white text-sm bg-green-600 absolute left-0 -bottom-12 rounded-md shadow-lg flex justify-start items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <IconCheck />
              <span>Username available</span>
            </motion.div>
          )}
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">@</span>
        </div>
        <Button type="submit" text="Confirm" disabled={isValid()} />
      </Form>

    </div>
  )
}
