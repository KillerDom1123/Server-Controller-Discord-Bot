import { pingCommand } from './commands/ping';
import { setGameProfileCommand } from './commands/setGameProfile';
import { wakeServerCommand } from './commands/wakeServer';
import { Command } from './types';

const commands: Command[] = [pingCommand, wakeServerCommand, setGameProfileCommand];

export default commands;
