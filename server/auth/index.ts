import passport from 'passport';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../entities/user.entity';
import GoogleAuth from './google.auth';

export default class Authentication {
  public init=async(em: EntityManager)=>{
    /// In case we'll use sessions. Not sure why we will though...
    /*
    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });
    passport.deserializeUser(async (id: any, done) => {
      const repo = DI.em.getRepository(User);
      try {
        const user = await repo.findOneOrFail(id);
        done(null, user);
      } catch (err) {
        done(err);
      }
    });*/
    (new GoogleAuth()).init(em);
  }
}