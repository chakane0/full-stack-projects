import {writeFileSync, readFileSync } from 'node:fs';

const users = [{name: 'Chakane Shegog', email: 'notARealemail@Diplo.edu'}];
const userJson = JSON.stringify(users);
writeFileSync('backend/users.json', userJson);

const readUsersJson = readFileSync('backend/users.json');
const readUsers = JSON.parse(readUsersJson);
console.log(readUsers);