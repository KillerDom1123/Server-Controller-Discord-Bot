import { pingCommand } from './commands/ping';
import { wakeServerCommand } from './commands/wakeServer';
import { Command } from './types';

const commands: Command[] = [pingCommand, wakeServerCommand];

export default commands;
