import { existsSync, readFileSync } from 'fs';

import { CONFIG_PATH } from './constants';
import { Scheduler } from 'ak-scheduler';

export const getScheduler = async (): Promise<Scheduler> => {
    if (!existsSync(CONFIG_PATH))
        throw Error('config does not exist, please run ymca setup');
    const data = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));

    const scheduler = new Scheduler(data.locationID);
    await scheduler.createSession();

    data.userData['birthdate'] = new Date(data.userData['birthdate']);
    await scheduler.refreshUserData(data.userData);

    return scheduler;
};
