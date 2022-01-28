// @ts-check
import addonsPrepare from '../../utils/addons/prepare.js'
import utils from '../../utils/index.js'

const { exit, log, openBrowser } = utils
const { ADDON_VALIDATION, prepareAddonCommand } = addonsPrepare

/**
 * The addons:auth command
 * @param {string} addonName
 * @param {import('commander').OptionValues} options
 * @param {import('../base-command.mjs').BaseCommand} command
 * @returns {Promise<boolean>}
 */
const addonsAuth = async (addonName, options, command) => {
  const { addon } = await prepareAddonCommand({
    command,
    addonName,
    // @ts-ignore when migrating to typescript this should be a const enum
    validation: ADDON_VALIDATION.EXISTS,
  })

  if (!addon.auth_url) {
    log(`No Admin URL found for the "${addonName} add-on"`)
    return false
  }

  log()
  log(`Opening ${addonName} add-on admin URL:`)
  log()
  log(addon.auth_url)
  log()
  await openBrowser({ url: addon.auth_url })
  exit()
}

/**
 * Creates the `netlify addons:auth` command
 * @param {import('../base-command.mjs').BaseCommand} program
 * @returns
 */
export const createAddonsAuthCommand = (program) =>
  program
    .command('addons:auth')
    .alias('addon:auth')
    .argument('<name>', 'Add-on slug')
    .description('Login to add-on provider')
    .action(async (addonName, options, command) => {
      await addonsAuth(addonName, options, command)
    })