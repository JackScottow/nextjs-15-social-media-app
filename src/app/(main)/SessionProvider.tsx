"use client";

import { Session, User } from "lucia";

interface SessionContext {
  user: User;
  session: Session;
}
