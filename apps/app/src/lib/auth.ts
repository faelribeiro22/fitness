import { createAuthClient } from '@better-auth/expo';

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
});

export const signUp = async (email: string, password: string, name: string) => {
  const result = await authClient.signUp.email({
    email,
    password,
    name,
  });
  return result;
};

export const signIn = async (email: string, password: string) => {
  const result = await authClient.signIn.email({
    email,
    password,
  });
  return result;
};

export const signOut = async () => {
  const result = await authClient.signOut();
  return result;
};

export const getSession = async () => {
  const result = await authClient.getSession();
  return result;
};

export const getUser = async () => {
  const session = await getSession();
  return session?.data?.user;
};
