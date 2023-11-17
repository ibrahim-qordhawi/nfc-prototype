<script setup lang="ts">
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { onMounted, ref } from "vue";

const authServerUrl = "http://localhost:8000";

const authenticateLogBox = ref("");
function authenticateLog(message: string) {
  authenticateLogBox.value += message + "\n";
}

onMounted(() => {
  fetch(`${authServerUrl}/generate-authentication-options`)
    .then((resp) => resp.json())
    .then((opts) => {
      console.log("Authentication Options (Autofill)", opts);
      startAuthentication(opts, true)
        .then(async (asseResp) => {
          // We can assume the DOM has loaded by now because it had to for the user to be able
          // to interact with an input to choose a credential from the autofill
          authenticateLog("Authentication Response (Autofill)");
          authenticateLog(JSON.stringify(asseResp, null, 2));

          const verificationResp = await fetch(
            `${authServerUrl}/verify-authentication`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(asseResp),
            }
          );

          const verificationJSON = await verificationResp.json();

          authenticateLog("Server Response (Autofill)");
          authenticateLog(JSON.stringify(verificationJSON, null, 2));

          if (verificationJSON && verificationJSON.verified) {
            authenticateLog("User Authenticated!");
          } else {
            authenticateLog("Oh no, something went wrong! Response:");
            authenticateLog(JSON.stringify(verificationJSON));
          }
        })
        .catch((err) => {
          console.error("(Autofill)", err);
        });
    });
});

const registerLogBox = ref("");
function registerLog(message: string) {
  registerLogBox.value += message + "\n";
}

async function register() {
  const resp = await fetch(`${authServerUrl}/generate-registration-options`);

  let attResp;
  try {
    const opts = await resp.json();

    registerLog("Registration Options");
    registerLog(JSON.stringify(opts, null, 2));
    attResp = await startRegistration(opts);
    registerLog("Registration Response");
    registerLog(JSON.stringify(attResp, null, 2));
  } catch (error: any) {
    if (error.name === "InvalidStateError") {
      registerLog(
        "Error: Authenticator was probably already registered by user"
      );
    } else {
      registerLog(error);
    }

    throw error;
  }

  const verificationResp = await fetch(`${authServerUrl}/verify-registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(attResp),
  });

  const verificationJSON = await verificationResp.json();
  registerLog("Server Response");
  registerLog(JSON.stringify(verificationJSON, null, 2));

  if (verificationJSON && verificationJSON.verified) {
    registerLog("Authenticator registered!");
  } else {
    registerLog("Oh no, something went wrong! Response:");
    registerLog(`${JSON.stringify(verificationJSON)}`);
  }
}

async function authenticate() {
  const resp = await fetch(`${authServerUrl}/generate-authentication-options`);

  let asseResp;
  try {
    const opts = await resp.json();

    authenticateLog("Authentication Options");
    authenticateLog(JSON.stringify(opts, null, 2));
    asseResp = await startAuthentication(opts);
    authenticateLog("Authentication Response");
    authenticateLog(JSON.stringify(asseResp, null, 2));
  } catch (error: any) {
    authenticateLog(error);

    throw error;
  }

  const verificationResp = await fetch(
    `${authServerUrl}/verify-authentication`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(asseResp),
    }
  );

  const verificationJSON = await verificationResp.json();
  authenticateLog("Server Response");
  authenticateLog(JSON.stringify(verificationJSON, null, 2));

  if (verificationJSON && verificationJSON.verified) {
    authenticateLog("User authenticated");
  } else {
    authenticateLog("Oh no, something went wrong! Response:");
    authenticateLog(`${JSON.stringify(verificationJSON)}`);
  }
}
</script>

<template>
  <h2>Web Authn</h2>

  <div class="card">
    <button type="button" @click="register">Register</button>

    <div>
      <pre name="registerLogs" id="registerLogs" cols="30" rows="10">
        {{ registerLogBox }}
      </pre>
    </div>
  </div>

  <div>
    <button type="button" @click="authenticate">Authenticate</button>
    <div>
      <pre name="authenticateLogs" id="authenticateLogs" cols="30" rows="10">
        {{ authenticateLogBox }}
      </pre>
    </div>
  </div>
</template>
