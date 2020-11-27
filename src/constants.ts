import { homedir } from 'os';
import { join } from 'path';

export const CONFIG_PATH = join(homedir(), '.ymca-cli-config');
