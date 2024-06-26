'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwright";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";

// export const getUserInfo = async ({ userId }: getUserInfoProps) => {
//     try {
//       const { database } = await createAdminClient();
  
//       const user = await database.listDocuments(
//         DATABASE_ID!,
//         USER_COLLECTION_ID!,
//         [Query.equal('userId', [userId])]
//       )
  
//       return parseStringify(user.documents[0]);
//     } catch (error) {
//       console.log(error)
//     }
//   }

export const signIn = async ({ email, password }: signInProps) => {
    try {
      const { account } = await createAdminClient();
      const session = await account.createEmailPasswordSession(email, password);
  
      cookies().set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
  
    //   const user = await getUserInfo({ userId: session.userId }) 
  
      return parseStringify(session);
    } catch (error) {
      console.error('Error', error);
    }
  }

  export const signUp = async ({ password, ...userData }: SignUpParams) => {
    const { email, firstName, lastName } = userData;
    
    let newUserAccount;
  
    try {
      const { account, database } = await createAdminClient();
  
      newUserAccount = await account.create(
        ID.unique(), 
        email, 
        password, 
        `${firstName} ${lastName}`
      );
  
    //   if(!newUserAccount) throw new Error('Error creating user')
  
    //   const dwollaCustomerUrl = await createDwollaCustomer({
    //     ...userData,
    //     type: 'personal'
    //   })
  
    //   if(!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer')
  
    //   const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
  
    //   const newUser = await database.createDocument(
    //     DATABASE_ID!,
    //     USER_COLLECTION_ID!,
    //     ID.unique(),
    //     {
    //       ...userData,
    //       userId: newUserAccount.$id,
    //       dwollaCustomerId,
    //       dwollaCustomerUrl
    //     }
    //   )
  
      const session = await account.createEmailPasswordSession(email, password);
  
      cookies().set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
  
      return parseStringify(newUser);
    } catch (error) {
      console.error('Error', error);
    }
  }
  

  export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      const result = await account.get();
  
    //   const user = await getUserInfo({ userId: result.$id})
  
      return parseStringify(result);
    } catch (error) {
      console.log(error)
      return null;
    }
  }

  export const logoutAccount = async () => {
    try {
      const { account } = await createSessionClient();
  
      cookies().delete('appwrite-session');
  
      await account.deleteSession('current');
    } catch (error) {
      return null;
    }
  }