import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth';

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    // Create the user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    // Send email verification
    if (user) {
      await sendEmailVerification(user);  // This sends the verification email
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const logInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user && user.emailVerified) {
      return user;
    } else {
      throw new Error('Please verify your email before logging in.');
    }
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
