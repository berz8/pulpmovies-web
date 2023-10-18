import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { sessionStorage } from "./session.server";
import type { ApiResponse } from "~/interfaces";
import type { AuthenticatedUser, User } from "~/interfaces";

export let authenticator = new Authenticator<AuthenticatedUser>(sessionStorage);

let googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    callbackURL: "/auth/google/callback",
  },
  async ({extraParams, profile}) => {
    const apiLogin = await fetch(`${process.env.API_URL}/auth/login-google`, {
      method: "POST",
      body: JSON.stringify({
        idToken: extraParams.id_token,
        fullName: profile.displayName,
        profilePath: profile.photos[0].value
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
