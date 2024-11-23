import { jwtVerify, SignJWT } from "jose";

export const verifyJwt = async (
  token: string | undefined | null,
  secret: string
) => {
  if (!token) {
    return undefined;
  }
  const textEncoder = new TextEncoder();
  const encodedSecret = textEncoder.encode(secret);
  return await jwtVerify(token, encodedSecret).then((result) => result.payload);
};

export const signJwt = async (
  payload: Record<string, unknown>,
  secret: string
) => {
  const textEncoder = new TextEncoder();
  const encodedSecret = textEncoder.encode(secret);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(encodedSecret);
};

export const getIdFromHeader = async (
  authorizationHeader: string | undefined,
  secret: string
) => {
  if (!authorizationHeader) {
    return undefined;
  }
  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return undefined;
  }
  const decoded = await verifyJwt(token, secret);
  return decoded?.id as string | undefined;
};
