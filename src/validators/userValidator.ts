import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

// export type IUser = z.infer<typeof UserSchema>;
