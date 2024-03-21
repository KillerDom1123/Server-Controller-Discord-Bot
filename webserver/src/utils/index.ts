import { execSync } from 'child_process';
import { hostPassword, SERVER_USER_HOME_DIR } from '../envVars';

export const execWithSudo = (command: string) => {
    execSync(`echo "${hostPassword}" | sudo -S ${command}`);
};

export const getServerUserHomeDir = (username: string) => `${SERVER_USER_HOME_DIR}/${username}`;
