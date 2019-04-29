require('@babel/register')({
  // Find babel.config.js up the folder structure.
  // rootMode: 'upward',

  // Since babel ignores all files outside the cwd, it does not compile sibling packages
  // So rewrite the ignore list to only include node_modules
  ignore: ['node_modules']
})
