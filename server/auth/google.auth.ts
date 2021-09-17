import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import { Request } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../entities/user.entity';

export default class GoogleAuth {
  public init=async(em: EntityManager)=>{
    passport.use(new OAuth2Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          if(!profile.emails) 
            throw new Error('cannot find such google user');
          const email = profile.emails[0].value;
          const repo = em.getRepository(User);
          const existingUser = await repo.findOne({ email });
          if(existingUser) done(null, existingUser.id);
          else {
            const newUser = new User({ email });
            await em.persist(newUser).flush();
            done(null, newUser.id);
          }
        } catch (err) {
          done(err);
        }
      }
    ));
  }
}