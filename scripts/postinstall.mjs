import { argv } from 'process'

import chalk from 'chalk'

import { createMainCommand } from '../src/commands/index.mjs'
import completion from '../src/lib/completion/index.js'

// yarn plug and play seems to have an issue with reading an esm file by building up the cache.
// as yarn pnp analyzes everything inside the postinstall
// yarn pnp executes it out of a .yarn folder .yarn/unplugged/netlify-cli-file-fb026a3a6d/node_modules/netlify-cli/scripts/postinstall.js
if (!argv[1].includes('.yarn')) {
  // create or update the autocompletion definition
  const program = createMainCommand()
  completion.createAutocompletion(program)
}

console.log('')
console.log(chalk.greenBright.bold.underline('Success! Netlify CLI has been installed!'))
console.log('')
console.log('Your device is now configured to use Netlify CLI to deploy and manage your Netlify sites.')
console.log('')
console.log('Next steps:')
console.log('')
console.log(`  ${chalk.cyanBright.bold('netlify init')}     Connect or create a Netlify site from current directory`)
console.log(`  ${chalk.cyanBright.bold('netlify deploy')}   Deploy the latest changes to your Netlify site`)
console.log('')
console.log(`For more information on the CLI run ${chalk.cyanBright.bold('netlify help')}`)
console.log(`Or visit the docs at ${chalk.cyanBright.bold('https://cli.netlify.com')}`)
console.log('')