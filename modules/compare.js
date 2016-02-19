import path from 'path'
import glob from 'glob'

export const ERROR_NO_SOURCE_FILE_FOUND = 'No files found in the source directory.'
export const SOURCE = 'source'
export const TARGET = 'target'

export function checkFiles (type, params) {
  return new Promise((resolve, reject) => {
    let pattern

    switch (type) {
      case TARGET:
        pattern = `${params.path}/${params.target}/${params.pattern}`
        break
      case SOURCE:
      default:
        pattern = `${params.path}/${params.source}/${params.pattern}`
        break
    }

    glob(pattern)
      .on('error', reject)
      .on('end', (files) => {
        resolve({
          [type]: files
        })
      })
  })
}

export function compareFiles (results, params) {
  return new Promise((resolve, reject) => {
    if (!results.filenames.source.length) {
      reject(ERROR_NO_SOURCE_FILE_FOUND)
    }
    else {
      results.filenames.source.forEach((filename) => {
        let projectPath = filename.replace(params.path + path.sep, '')

        if (params.excluded_files.indexOf(projectPath) === -1) {
          let extname = path.extname(filename)
          let basename = path.basename(filename, extname)
          let dirname = path.dirname(filename)
          let targetFilename = (`${dirname}/${params.target_prefix}${basename}${params.target_suffix}${extname}`)
            .replace(params.source, params.target)

          if (results.filenames.target.indexOf(targetFilename) !== -1) {
            results.counts.found++
          }
          else {
            results.counts.unfound++
            results.filenames.unfound.push(targetFilename)
          }
        }
        else {
          results.counts.excluded++
          results.filenames.excluded.push(filename)
        }
      })

      results.rate = Math.round(results.counts.found * 100 / (results.counts.source - results.counts.excluded) * 100) / 100

      resolve(results)
    }
  })
}

export function compareFolders (params) {
  let results = {
    filenames: {
      source: [],
      target: [],
      excluded: [],
      unfound: [],
    },
    counts: {
      source: 0,
      target: 0,
      excluded: 0,
      found: 0,
      unfound: 0,
    },
    rate: 0,
  }

  return new Promise((resolve, reject) => {
    Promise
      .all([
        checkFiles(SOURCE, params),
        checkFiles(TARGET, params),
      ])
      .catch(reject)
      .then((values) => {
        values.forEach((value) => {
          if (!!value[SOURCE]) {
            results.filenames.source = value[SOURCE];
            results.counts.source = results.filenames.source.length
          }

          if (!!value[TARGET]) {
            results.filenames.target = value[TARGET];
            results.counts.target = results.filenames.target.length
          }
        })

        compareFiles(results, params)
          .catch(reject)
          .then(resolve)
      })
  })
}
