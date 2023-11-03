import { createServer } from './commands/createServer';
import { getServers } from './commands/getServers';
import { Command } from './types';

const commands: Command[] = [getServers, createServer];

export default commands;
