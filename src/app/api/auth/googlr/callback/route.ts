import { NextResponse } from "next/server";
import fetch from "node-fetch";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
const GRAPHQL_API = "http://localhost:4000/graphql";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) return NextResponse.redirect("/login");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();

  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const userInfo = await userRes.json();

  // Call your GraphQL backend to create/login Google user
  const gqlRes = await fetch(GRAPHQL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation GoogleLogin($input: GoogleLoginInput!) {
          googleLogin(input: $input) {
            token
            user {
              _id
              firstName
              lastName
              email
              isActive
              role
            }
          }
        }
      `,
      variables: {
        input: {
          googleId: userInfo.id,
          email: userInfo.email,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
        },
      },
    }),
  });

  const result = await gqlRes.json();
  const { token, user } = result.data.googleLogin;

  const redirectUrl = new URL("/profile", req.url);
  redirectUrl.searchParams.set("token", token);
  redirectUrl.searchParams.set("user", encodeURIComponent(JSON.stringify(user)));

  return NextResponse.redirect(redirectUrl);
}
