const need = (key: string, value: string | undefined) => {
  if (!value) {
    throw new Error(`Missing ${key}`);
  }

  return value;
};

export const config = {
  apiUrl: need('VITE_API_URL', import.meta.env.VITE_API_URL),
  region: need('VITE_AWS_REGION', import.meta.env.VITE_AWS_REGION),
  clientId: need('VITE_COGNITO_CLIENT_ID', import.meta.env.VITE_COGNITO_CLIENT_ID),
  userPoolId: need(
    'VITE_COGNITO_USER_POOL_ID',
    import.meta.env.VITE_COGNITO_USER_POOL_ID
  ),
};
