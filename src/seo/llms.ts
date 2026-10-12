import { Routes } from "../routes";
import { absoluteUrl, APP_NAME, SITE_DESCRIPTION } from "./site";
import { MAX_DOCUMENTS_PER_SESSION } from "../constants";

export const loader = () => {
  const body = `# ${APP_NAME}

> ${SITE_DESCRIPTION}

${APP_NAME} is a web application. All features below require an account; sign up with email or Google.
The interface is available in English, Russian and Ukrainian.

## Features

- Pet profiles: name, gender, birth date and owner for every animal.
- Health logs: a history of check-ups and medical procedures for each animal.
- Invoices and payments: invoices for veterinary services, paid online by card via Stripe.
- AI assistant: chat by text or voice about your animals, health logs and invoices.
- Documents: attach up to ${MAX_DOCUMENTS_PER_SESSION} PDF documents per chat and ask the assistant questions about them.
- Image generation: the assistant can generate an image from a text description.

## Pages

- [Home](${absoluteUrl(Routes.Home)}): overview of the platform and its features
- [Create an account](${absoluteUrl(Routes.Register)}): registration with email or Google
- [Sign in](${absoluteUrl(Routes.Login)}): access for existing users
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
