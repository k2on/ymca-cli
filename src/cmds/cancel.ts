import * as colors from 'colors';
import * as inquirer from 'inquirer';
import * as ora from 'ora';

import { CommanderStatic } from 'commander';
import { getScheduler } from '../scheduler';

export default (program: CommanderStatic): void => {
    program
        .command('cancel <apptNum>')
        .description('cancel an appointment')
        .option('-y, --yes', 'skip confirmation message')
        .action(async (apptNum: string, options) => {
            const scheduler = await getScheduler();
            const appointments = await scheduler.getBookedAppointments();
            for (const i in appointments) {
                const appt = appointments[i];
                if (parseInt(apptNum) == parseInt(i) + 1) {
                    const cancelAppt = async () => {
                        const spinner = ora('Canceling Appointment').start();
                        try {
                            await appt.cancel();
                            spinner.succeed('Appointment Cancelled');
                        } catch (err) {
                            spinner.fail(err.message);
                        }
                    };

                    if (options.yes) return await cancelAppt();

                    console.log(
                        `Are you sure you want to cancel your ${
                            appt.typeName
                        } appointment at ${appt.datetime.toLocaleTimeString()} on ${
                            [
                                'Monday',
                                'Tuesday',
                                'Wednesday',
                                'Thursday',
                                'Friday',
                                'Saturday',
                                'Sunday',
                            ][appt.datetime.getUTCDay() - 1]
                        }?`,
                    );

                    const answer = await inquirer.prompt([
                        {
                            name: 'confirm',
                            message: 'Proceed',
                            type: 'confirm',
                            default: false,
                        },
                    ]);

                    if (!answer.confirm)
                        return console.log(colors.red('Aborted'));

                    await cancelAppt();
                }
            }
        });
};
