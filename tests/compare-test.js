import fs from 'fs'
import path from 'path'
import expect from 'expect'
import * as compare from '../modules/compare'

const params = {
  pattern: '**/*',
  source: 'modules',
  target: 'tests',
  target_prefix: '',
  target_suffix: '-test',
  rate_high: 70,
  rate_low: 30,
  excluded_files: [
    'modules/cli.js'
  ],
  path: process.cwd(),
}

const results = {
  filenames: {
    'source': [],
    'target': [],
    'excluded': [],
    'unfound': [],
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

const compareFoldersResults = {
  filenames: {
    'source': [
      `${params.path}/modules/cli.js`,
      `${params.path}/modules/compare.js`,
      `${params.path}/modules/index.js`,
    ],
    'target': [
      `${params.path}/tests/compare-test.js`,
      `${params.path}/tests/index-test.js`,
    ],
    'excluded': [],
    'unfound': [],
  },
  counts: {
    source: 3,
    target: 2,
    excluded: 0,
    found: 0,
    unfound: 0,
  },
  rate: 0,
}

const compareFoldersResultsWithMissingFile = {
  filenames: {
    'source': [
      `${params.path}/modules/cli.js`,
      `${params.path}/modules/compare.js`,
      `${params.path}/modules/index.js`,
    ],
    'target': [
      `${params.path}/tests/compare-test.js`,
    ],
    'excluded': [],
    'unfound': [],
  },
  counts: {
    source: 3,
    target: 1,
    excluded: 0,
    found: 0,
    unfound: 0,
  },
  rate: 0,
}

const compareFilesResults = {
  filenames: {
    'source': [
      `${params.path}/modules/cli.js`,
      `${params.path}/modules/compare.js`,
      `${params.path}/modules/index.js`,
    ],
    'target': [
      `${params.path}/tests/compare-test.js`,
      `${params.path}/tests/index-test.js`,
    ],
    'excluded': [
      `${params.path}/modules/cli.js`,
    ],
    'unfound': [],
  },
  counts: {
    source: 3,
    target: 2,
    excluded: 1,
    found: 2,
    unfound: 0,
  },
  rate: 100,
}

const compareFilesResultsWithMissingFile = {
  filenames: {
    'source': [
      `${params.path}/modules/cli.js`,
      `${params.path}/modules/compare.js`,
      `${params.path}/modules/index.js`,
    ],
    'target': [
      `${params.path}/tests/compare-test.js`,
    ],
    'excluded': [
      `${params.path}/modules/cli.js`,
    ],
    'unfound': [
      `${params.path}/tests/index-test.js`,
    ],
  },
  counts: {
    source: 3,
    target: 1,
    excluded: 1,
    found: 1,
    unfound: 1,
  },
  rate: 50,
}

describe('The comparison tool of the module', () => {
  it('should catch an error when the source folder is empty', () => {
    return compare.compareFolders(Object.assign({}, params, {
      source: '__test_unfound_source__'
    }))
      .catch((error) => {
        expect(error).toEqual(compare.ERROR_NO_SOURCE_FILE_FOUND)
      })
  })

  it('should compare folders and return results', () => {
    return compare.compareFolders(params)
      .then((data) => {
        expect(data).toEqual(compareFilesResults)
      })
  })

  it('should catch an error when no source files is found', () => {
    return compare.compareFiles(results, params)
      .catch((error) => {
        expect(error).toEqual(compare.ERROR_NO_SOURCE_FILE_FOUND)
      })
  })

  it('should compare files an return results when a file is missing', () => {
    return compare.compareFiles(compareFoldersResultsWithMissingFile, params)
      .then((data) => {
        expect(data).toEqual(compareFilesResultsWithMissingFile)
      })
  })

  it('should compare files and return results', () => {
    return compare.compareFiles(compareFoldersResults, params)
      .then((data) => {
        expect(data).toEqual(compareFilesResults)
      })
  })
})
