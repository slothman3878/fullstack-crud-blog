import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import { Request } from 'express';
import { User } from '../entities/user.entity';
import { DI } from '../constants';

passport.use(new OAuth2Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      if(!profile.emails) throw new Error('cannot find such google user');
      const email = profile.emails[0].value;
      const repo = DI.em.getRepository(User);
      const existingUser = await repo.findOne({ email });
      if(existingUser) {
        req.session.user_id = existingUser.id;
        done(null, existingUser);
      } else {
        const newUser = new User({ email });
        req.session.user_id = newUser.id;
        await DI.em.persist(newUser).flush();
      }
    } catch (err) {
      done(err);
    }
  }
));