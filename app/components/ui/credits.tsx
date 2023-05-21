import { format } from "date-fns";
import { Logo, Naming } from "../branding";
import { Link } from "@remix-run/react";

export function Credits() {
  return (
    <div className="mx-8 mb-32 mt-20 flex flex-col items-center gap-2">
      <div className="flex justify-center items-center gap-2 mb-4">
        <Logo width="2rem" />
        <Naming width="9rem" />
      </div>
      <p className="text-sm text-center text-gray-400">
        © { format(new Date(), "yyyy") } PulpMovies, All rights reserved.
      </p>
      <div className="flex flex-col gap-4 justify-center items-center text-sm mt-4 md:flex-row">
        <Link to="/legal/privacy-policy" className="underline text-gray-400">
          Privacy Policy 
        </Link>
        <Link to="/legal/terms-of-service" className="underline text-gray-400">
          Terms of Service 
        </Link>
      </div>
    </div>
  )
}
