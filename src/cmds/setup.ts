import * as colors from 'colors';
import * as inquirer from 'inquirer';

import { CONFIG_PATH } from '../constants';
import { CommanderStatic } from 'commander';
import { writeFileSync } from 'fs';

export default (program: CommanderStatic): void => {
    program
        .command('setup')
        .description('setup the cli')
        .action(async () => {
            const data = await inquirer.prompt([
                {
                    name: 'locationID',
                    type: 'input',
                    message: 'Location ID',
                },
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'First Name',
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'Last Name',
                },
                {
                    name: 'birthdate',
                    type: 'input',
                    message: 'Birthday',
                },
                {
                    name: 'email',
                    type: 'input',
                    message: 'Email',
                },
                {
                    name: 'phone',
                    type: 'input',
                    message: 'Phone',
                },
            ]);
            writeFileSync(
                CONFIG_PATH,
                JSON.stringify({
                    locationID: data.locationID,
                    userData: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        birthdate: data.birthdate,
                        email: data.email,
                        phone: data.phone,
                    },
                }),
            );
            console.log(colors.green('Saved!'));
        });
};
