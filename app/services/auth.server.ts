import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { sessionStorage } from "./session.server";
import type { ApiResponse } from "~/interfaces";
import type { AuthenticatedUser, User } from "~/interfaces";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<AuthenticatedUser>(sessionStorage);

let googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    callbackURL: "http://localhost:3000/auth/google/callback",
  },
  async ({extraParams, profile}) => {
    // Get the user data from your DB or API using the tokens and profile
    //return User.findOrCreate({ email: profile.emails[0].value });
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
