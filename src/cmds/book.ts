import * as colors from 'colors';

import { CommanderStatic } from 'commander';
import { getScheduler } from '../scheduler';
import { list } from '../util';

import inquirer = require('inquirer');

// import * as inquirer from 'inquirer';
// import * as ora from 'ora';

export default (program: CommanderStatic): void => {
    program
        .command('book [day] [hour]')
        .description('cancel an appointment')
        .option('-y, --yes', 'skip confirmation message')
        .option('-l, --list', 'list all times for a day')
        .action(async (day: string | undefined, hour: number, options) => {
            const scheduler = await getScheduler();
            const now = new Date(),
                days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
            day = day || days[now.getUTCDay() - 1];
            hour = parseInt((hour as unknown) as string) || 6;

            if (hour < 7) hour += 12;

            const dayNum = days.indexOf(day);
            if (dayNum == -1) return console.error(colors.red('Invalid day'));

            let currentTimestamp = now.getTime();

            while (new Date(currentTimestamp).getUTCDay() != dayNum) {
                currentTimestamp += 1000 * 60 * 60 * 24;
            }
            const selectedDate = new Date(currentTimestamp);

            const form = await scheduler.getForm();
            form.updateFields({
                trainer_filter: 'Wellness Center',
                appointment_type_filter: 'Wellness Center',
                date_filter:
                    selectedDate.getUTCFullYear() +
                    '-' +
                    (selectedDate.getUTCMonth() + 1) +
                    '-' +
                    selectedDate.getUTCDate(),
            });

            let times;
            try {
                times = await form.getAppointmentTimes();
            } catch (err) {
                return console.error(colors.red(err));
            }

            if (options.list)
                return list(
                    times.map((time) => time.datetime.toLocaleTimeString()),
                );

            const avaliableTime = times.filter(
                (appt) => appt.datetime.getHours() == hour,
            );
            if (avaliableTime.length == 0) {
                return console.log(colors.red('No times for ' + hour + ':45'));
            }
            const appt = avaliableTime[0];

            const bookAppt = () => {
                appt.book().then(() => {
                    console.log(colors.green('Booked!'));
                });
            };

            if (options.yes) return bookAppt();

            console.log(`Confirm to book Wellness Center at ${hour}:45`);

            const resp = await inquirer.prompt([
                { type: 'confirm', name: 'confirm', message: 'Confirm' },
            ]);
            if (!resp.confirm) return console.log(colors.red('Aborted'));
            bookAppt();
        });
};
