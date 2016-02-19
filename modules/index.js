import path from 'path'
import fs from 'fs'
import { compareFolders } from './compare'

export const COVERAGE_CONFIG_FILE = '.coverage'
export const ERROR_CONFIG_NEEDED = 'A config object with "source" and "target" entries is needed.'
export const ERROR_CONFIG_SOURCE_NEEDED = 'The "source" config is needed.'
export const ERROR_CONFIG_TARGET_NEEDED = 'The "target" config is needed.'

export function checkConfig (config) {
  return new Promise((resolve, reject) => {
    if (!config) {
      reject(ERROR_CONFIG_NEEDED)
    }

    if (!config.source) {
      reject(ERROR_CONFIG_SOURCE_NEEDED)
    }

    if (!config.target) {
      reject(ERROR_CONFIG_TARGET_NEEDED)
    }

    const params = {
      pattern: config.pattern || '**/*',
      source: config.source || null,
      target: config.target || null,
      target_prefix: config.target_prefix || '',
      target_suffix: config.target_suffix || '',
      rate_high: config.rate_high || 70,
      rate_low: config.rate_low || 30,
      excluded_files: config.excluded_files || [],
      path: process.cwd(),
    }

    resolve(params)
  })
}

export function compare (params) {
  return new Promise((resolve, reject) => {
    compareFolders(params)
      .catch(reject)
      .then((results) => resolve({ params, results }))
  })
}

export default (settings) => {
  if (!settings) {
    settings = {}
  }

  return new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve(
        settings.path || process.cwd(),
        settings.config_file || COVERAGE_CONFIG_FILE
      ),
      { encoding: 'utf-8' },
      (err, data) => {
        if (err) {
          reject(ERROR_CONFIG_NEEDED)
        }
        else {
          checkConfig(JSON.parse(data))
            .catch(reject)
            .then((config) => compare(config)
              .catch(reject)
              .then(resolve)
            )
        }
      }
    )
  })
}
