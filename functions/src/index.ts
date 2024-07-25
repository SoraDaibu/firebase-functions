import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import * as dotenv from "dotenv";

// Load the appropriate .env file based on the Firebase project ID
const environment = process.env.FIREBASE_CONFIG ? JSON.parse(process.env.FIREBASE_CONFIG).projectId : "put-default-project-id";
dotenv.config({path: `.env.${environment}`});
console.log(`Running on the environment: ${environment}`);

admin.initializeApp();

const WELCOME_EMAIL_API_ENDPOINT = process.env.WELCOME_EMAIL_API_ENDPOINT;
const AUTH_STR = process.env.AUTH_STR;

if (!WELCOME_EMAIL_API_ENDPOINT) {
  throw new Error("Missing WELCOME_EMAIL_API_ENDPOINT environment variable");
} else if (!AUTH_STR) {
  throw new Error("Missing AUTH_STR environment variable");
}

export const sendWelcomeEmailOnEmailVerified = functions.auth.user().onCreate((user) => {
  if (user.emailVerified) {
    console.log(`Invoking WELCOME_EMAIL_API_ENDPOINT: ${WELCOME_EMAIL_API_ENDPOINT}`);
    return axios.get(WELCOME_EMAIL_API_ENDPOINT, {headers: {"Authorization": AUTH_STR}});
  } else {
    console.log(`User's email is not verified. uid: ${user.uid}`);
    return null;
  }
});
