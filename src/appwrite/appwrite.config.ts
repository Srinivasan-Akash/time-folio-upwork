import { Account, Client } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('664c966b003c00aba212');

export const account = new Account(client);