#!/usr/bin/env node

import colors from 'colors'
import fileCoverage from './index'

fileCoverage().catch((err) => {
  throw err
}).then((data) => {
  const { results, params } = data

  let rate_color

  if (results.rate <= params.rate_low) {
    rate_color = 'red'
  }
  else if (results.rate >= params.rate_high) {
    rate_color = 'green'
  }
  else {
    rate_color = 'white'
  }

  console.log('=============================== Coverage summary ===============================');

  console.log(colors[rate_color]('Source coverage: %d% ( %d/%d )'),
    results.rate, results.counts.found, results.counts.source - results.counts.excluded
  )

  if (!!results.filenames.excluded) {
    console.log()
    console.log('Excluded source files ( %d ):', results.counts.excluded)

    results.filenames.excluded.forEach((filename) => {
      console.log(' %s %s', '\u00D7', filename)
    })
  }

  if (!!results.filenames.unfound.length) {
    console.log()
    console.log(colors.red('Missing target files ( %d ):'), results.counts.unfound)

    results.filenames.unfound.forEach((filename) => {
      console.log(colors.red(' %s %s'), '\u00D7', filename)
    })
  }

  console.log('================================================================================')
})
