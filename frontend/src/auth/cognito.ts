import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { config } from '../config';

const client = new CognitoIdentityProviderClient({ region: config.region });

export async function signUp(email: string, password: string) {
  await client.send(
    new SignUpCommand({
      ClientId: config.clientId,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: 'email', Value: email }],
    }),
  );
}

export async function confirm(email: string, code: string) {
  await client.send(
    new ConfirmSignUpCommand({
      ClientId: config.clientId,
      Username: email,
      ConfirmationCode: code,
    }),
  );
}

export async function signIn(email: string, password: string) {
  const result = await client.send(
    new InitiateAuthCommand({
      ClientId: config.clientId,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    }),
  );

  const idToken = result.AuthenticationResult?.IdToken;

  if (!idToken) {
    throw new Error('No ID token returned');
  }

  return idToken;
}
