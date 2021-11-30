// @ts-check

const { generateCommandsHelp, generateExamplesHelp } = require('../../utils')

const { createAddonsAuthCommand } = require('./auth')
const { createAddonsConfigCommand } = require('./config')
const { createAddonsCreateCommand } = require('./create')
const { createAddonsDeleteCommand } = require('./delete')
const { createAddonsListCommand } = require('./list')

/**
 * The addons command
 * @param {import('commander').OptionValues} options
 * @param {import('../base-command').BaseCommand} command
 */
const addons = (options, command) => {
  command.help()
}

/**
 * Creates the `netlify addons` command
 * @param {import('../base-command').BaseCommand} program
 * @returns
 */
const createAddonsCommand = (program) => {
  createAddonsAuthCommand(program)
  createAddonsConfigCommand(program)
  createAddonsCreateCommand(program)
  createAddonsDeleteCommand(program)
  createAddonsListCommand(program)

  return program
    .command('addons')
    .alias('addon')
    .description('(Beta) Manage Netlify Add-ons')
    .addHelpText(
      'after',
      generateExamplesHelp([
        'netlify addons:create addon-xyz',
        'netlify addons:list',
        'netlify addons:config addon-xyz',
        'netlify addons:delete addon-xyz',
        'netlify addons:auth addon-xyz',
      ]),
    )
    .addHelpText('after', generateCommandsHelp('addons', program))
    .action(addons)
}
module.exports = { createAddonsCommand }