import expect from 'expect'
import * as fileCoverage from '../modules/index'
import { ERROR_NO_SOURCE_FILE_FOUND } from '../modules/compare'

const defaultParams = {
  pattern: '**/*',
  source: null,
  target: null,
  target_prefix: '',
  target_suffix: '',
  rate_high: 70,
  rate_low: 30,
  excluded_files: [],
  path: process.cwd(),
}

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

describe('The file-coverage module', () => {
  it('should throw an error when called with no setting', () => {
    return fileCoverage.checkConfig()
      .catch((err) => {
        expect(err).toEqual(fileCoverage.ERROR_CONFIG_NEEDED)
      })
  })

  it('should throw an error when no source entry is set', () => {
    return fileCoverage.checkConfig({
      target: 'tests',
    })
      .catch((err) => {
        expect(err).toEqual(fileCoverage.ERROR_CONFIG_SOURCE_NEEDED)
      })
  })

  it('should throw an error when no target entry is set', () => {
    return fileCoverage.checkConfig({
      source: 'modules',
    })
      .catch((err) => {
        expect(err).toEqual(fileCoverage.ERROR_CONFIG_TARGET_NEEDED)
      })
  })

  it('should check the settings and return an object', () => {
    const config = {
      source: 'modules',
      target: 'tests',
    }
    return fileCoverage.checkConfig(config)
      .then((data) => {
        expect(data).toEqual(Object.assign({}, defaultParams, config))
      })
  })

  it('should compare folders and handle errors', () => {
    return fileCoverage.compare({})
      .catch((err) => {
        expect(err).toEqual(ERROR_NO_SOURCE_FILE_FOUND)
      })
  })

  it('should return the results of the comparison when calling with custom params', () => {
    return fileCoverage.compare(params)
      .then((data) => {
        expect(data.results).toEqual(results)
      })
  })

  it('should throw an error when the config file is not found', () => {
    return fileCoverage.default({
      config_file: '__test_unfound_config_file__'
    })
      .catch((err) => {
        expect(err).toEqual(fileCoverage.ERROR_CONFIG_NEEDED)
      })
  })

  it('should return the results of the comparison', () => {
    return fileCoverage.default()
      .then((data) => {
        expect(data.results).toEqual(results)
      })
  })
})
