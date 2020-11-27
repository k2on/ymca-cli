import * as colors from 'colors';
import * as moment from 'moment';

import { CommanderStatic } from 'commander';
import { getScheduler } from '../scheduler';
import { list } from '../util';

export default (program: CommanderStatic): void => {
    program
        .command('list')
        .description('list all booked appointments')
        .action(async () => {
            const scheduler = await getScheduler();
            const appointments = await scheduler.getBookedAppointments();
            const lines: string[] = [];
            for (const i in appointments) {
                const appt = appointments[i],
                    now = new Date();
                let line = `${parseInt(i) + 1} - ${
                    appt.typeName
                } - ${appt.datetime.toLocaleTimeString()} ${appt.datetime.toDateString()}`;
                if (appt.datetime.getUTCDate() == now.getUTCDate()) {
                    line = colors.green(
                        line +
                            ` [${moment
                                .duration(
                                    appt.datetime.getTime() - now.getTime(),
                                )
                                .humanize(true)}]`,
                    );
                }
                lines.push(line);
            }
            list(lines);
        });
};
