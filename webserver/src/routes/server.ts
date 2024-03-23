import * as crypto from 'crypto';
import { Request, Response } from 'express';
import { execWithSudo, getServerUserHomeDir } from '../utils';

const generateRandomString = (length: number) => {
    const buffer = crypto.randomBytes(Math.ceil(length / 2));
    return buffer.toString('hex').slice(0, length);
};

/**
 * Handles creating a user on the server, as well as setting the password.
 * Also sets the created user's home directory to the directory created for the server.
 * @param username - The username of the user to create
 * @param password - The password of the user to create
 * @param serverFileLocation - The location of the server directory - the directory that the user will be able to access and modify via FTP
 */
const handleCreatingUser = (username: string, password: string, serverFileLocation: string) => {
    execWithSudo(`mkdir -p ${serverFileLocation}`);
    execWithSudo(`useradd ${username}`);
    execWithSudo(`echo "${username}:${password}" | sudo chpasswd`);
    // execWithSudo(`chmod a-w ${serverFileLocation}`);
    execWithSudo(`chown ${username}:${username} ${serverFileLocation}`);
};

/**
 * POST /server
 * Creates a server on the host machine.
 * Handles creating a user, setting the password, and creating the server directory.
 * The "server directory" is the directory that the user will be able to access and modify via FTP.
 *
 * @param req - The request object
 * @param res - The response object
 */
export const postServer = async (req: Request, res: Response) => {
    const { guildId, serverId, name, game, port } = req.body;
    if (!guildId || !serverId || !name || !game || !port) {
        return res.sendStatus(400);
    }

    const username = generateRandomString(8);
    const password = generateRandomString(16);

    const serverFileLocation = getServerUserHomeDir(username);

    handleCreatingUser(username, password, serverFileLocation);

    console.error(username, password, serverFileLocation);

    return res.status(200).json({ username, password });
};
