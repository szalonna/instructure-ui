/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - present Instructure, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const fs = require('fs')
const Jira = require('jira-client')

const { runCommandAsync } = require('./command')
const { info } = require('./logger')

const {
  JIRA_PEM,
  JIRA_TOKEN,
  JIRA_HOST,
  JIRA_CONSUMER_KEY,
  JIRA_SECRET,
  JIRA_PROJECT_ID,
  JIRA_PROJECT_KEY
} = process.env

const JIRA = new Jira({
  host: JIRA_HOST,
  protocol: 'https',
  oauth: {
    consumer_key: JIRA_CONSUMER_KEY,
    consumer_secret: fs.readFileSync(JIRA_PEM),
    access_token: JIRA_TOKEN,
    access_secret: JIRA_SECRET
  }
})

exports.createJiraVersion = async function createJiraVersion (name, version) {
  const result = await JIRA.createVersion({
    name: `${name} v${version}`,
    archived: false,
    released: true,
    projectId: JIRA_PROJECT_ID
  })

  // result = {
  //   "self":"https://instructure.atlassian.net/rest/api/2/version/46639",
  //   "id":"46639",
  //   "name":"instructure-ui v5.10.0",
  //   "archived":false,
  //   "released":true,
  //   "projectId":17900
  // }

  info(`Created ${result.name}:`, JSON.stringify(result)) // eslint-disable-line no-console

  return {
    ...result,
    url: `https://${JIRA_HOST}/projects/${JIRA_PROJECT_KEY}/versions/${result.id}`
  }
}

exports.getIssuesInRelease = async function getIssuesInRelease () {
  const currentReleaseTag = await runCommandAsync('git describe --exact-match')
  const previousReleaseCommit = await runCommandAsync('git rev-list --tags --skip=1 --max-count=1')
  const previousReleaseTag = await runCommandAsync(`git describe --abbrev=0 --tags ${previousReleaseCommit}`)
  const result = await runCommandAsync(`git log ${previousReleaseTag}..${currentReleaseTag} | grep -Eo '([A-Z]{3,}-)([0-9]+)'`)

  let issueKeys = []
  issueKeys = (result ? result.split(' ') : [])
    .map(key => key.trim())
    .filter(key => key && key.includes(JIRA_PROJECT_KEY))

  info(`Issues in this release: ${issueKeys.join(', ')}`)

  return issueKeys
}

exports.updateJiraIssues = async function updateJiraIssues (issueKeys, jiraVersionName) {
  await Promise.all(issueKeys.map((issueKey) => {
      return JIRA.updateIssue(issueKey, {
        update: {
          fixVersions: [{ add: { name: jiraVersionName } }]
        }
      })
  }))

  info(`Updated ${issueKeys.join(', ')} to reflect the fix version: ${jiraVersionName}.`)
}
