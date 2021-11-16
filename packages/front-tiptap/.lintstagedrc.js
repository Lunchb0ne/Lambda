module.exports = {
  '*.+(js|ts|tsx)': (filenames) =>
    `next lint --fix --file ${filenames
      .map((file) => file.split(process.cwd())[1])
      .join(' --file ')}`,
  '*.+(js|json|ts|tsx)': ['yarn run format'],
};
