import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as userRepository from '../models/user.repository';

export function setupPassport() {
  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    async(email: string, password: string, done) => {
      try {
        // Find the user with given email and password
        const user = await userRepository._findUserWithEmailAndPassword(email, password);

        if (!user) {
          // User with given email & password not found
          return done(null, false);
        }

        // User successfully authenticated
        return done(null, user);
      }
      catch (err) {
        // This is a server error
        done(err);
      }
    }));
}
