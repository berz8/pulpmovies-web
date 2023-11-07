import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { sessionStorage } from "./session.server";
import type { AuthenticatedUser, User, ApiResponse } from "~/interfaces";

export let authenticator = new Authenticator<AuthenticatedUser>(sessionStorage);

let googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    callbackURL: "https://pulpmovies.app/auth/google/callback",
  },
  async ({extraParams, profile}) => {
    const apiLogin = await fetch(`${process.env.API_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken: extraParams.id_token,
        fullName: profile.displayName,
      })
    })
    const response: ApiResponse<User>  = await apiLogin.json();
    return { 
      token: response.token,
      user: response.result
    }
  }
);

authenticator.use(googleStrategy);
