import { GoogleSignin, type User } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { AuthResponse } from '../types/auth';

// Configure Google Sign In
GoogleSignin.configure({
  webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID', // Get this from Google Cloud Console
});

export const signInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    await GoogleSignin.hasPlayServices();
    const signInResult = await GoogleSignin.signIn();
    const userInfo = await GoogleSignin.getCurrentUser();
    const tokens = await GoogleSignin.getTokens();
    
    if (!userInfo) {
      throw new Error('No user data received');
    }

    return {
      success: true,
      user: {
        id: userInfo.user.id,
        email: userInfo.user.email,
        name: userInfo.user.givenName || userInfo.user.name,
        photo: userInfo.user.photo
      },
      token: tokens.accessToken,
    };
  } catch (error) {
    console.error('Google Sign In Error:', error);
    return {
      success: false,
      error: 'Google sign in failed',
    };
  }
};

export const signInWithApple = async (): Promise<AuthResponse> => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    return {
      success: true,
      user: {
        id: credential.user,
        email: credential.email || null,
        name: credential.fullName?.givenName || null,
        photo: null
      },
      token: credential.identityToken || undefined,
    };
  } catch (error) {
    console.error('Apple Sign In Error:', error);
    return {
      success: false,
      error: 'Apple sign in failed',
    };
  }
};