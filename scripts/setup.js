const replace = require('replace-in-file')

const flag = 'myapp'
const longNameFlag = 'My App'

/* DIR PATHS */
const UIPath = 'packages/ui/'
const APIPath = 'packages/api/'

const packageJson = 'package.json'
const yamlFile = 'serverless.yaml'
const manifest = 'public/manifest.json'
const index = 'public/index.html'

let appName
let shortName

const getUndescoredString = (string) => string.split(' ').join('_')
const getLowerCaseString = (string) => string.toLowerCase()
const getApplicationName = (string) => getUndescoredString(getLowerCaseString(string))

const replaceFlag = () => {
  const changeShortName = replace.sync({
    files: [
      packageJson,
      `${UIPath}${packageJson}`,
      `${APIPath}${packageJson}`,
      `${UIPath}${manifest}`,
      yamlFile,
    ],
    from: flag,
    to: getApplicationName(shortName),
  })
  const changeAppName = replace.sync({
    files: [
      `${UIPath}${manifest}`,
      `${UIPath}${index}`,
    ],
    from: longNameFlag,
    to: appName,
  })
  console.log(changeShortName, changeAppName)
  const filesChanged = changeShortName.join(changeAppName.filter((change) => {
    const shortNameFile = changeShortName.find((ch) => ch.file === change.file)
    if (shortNameFile) return change.hasChanged !== shortNameFile.hasChanged && change.hasChanged === true

    return change
  }))
  console.log(filesChanged)
  return filesChanged.filter((r) => r.hasChanged).length
}

const main = () => {
  appName = process.env.npm_config_appName
  shortName = process.env.npm_config_shortName || getUndescoredString(appName)

  const replacedFiles = replaceFlag()
  console.log(`${replacedFiles} files changed!`)
}

main()