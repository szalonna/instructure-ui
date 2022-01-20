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

import {
  addImportIfNeeded,
  findAttribute,
  findElements,
  isJSXAttribue,
  renameElements
} from '../helpers/buttonUpdateHelpers'
import { Collection, JSCodeshift, Literal } from 'jscodeshift'

/**
 * Does the following updates on a <Button>:
 * - `variant="link" href=..` -> `isWithinText={false} href=..` and a warning
 *   that padding can be removed.
 * - `variant="link-inverse" href=..` ->
 *    `isWithinText={false} color="link-inverse" href=..` and a warning that
 *    padding can be removed
 * - `variant="link"` or `variant="link-inverse"` and no `href` attribute ->
 *    display a warning how to upgrade
 */
export default function UpdateV7ButtonsLink(
  j: JSCodeshift,
  root: Collection,
  importedName: string,
  filePath: string
) {
  ///// variant=link or variant=link-inverse and no href attribute
  findElements(j, root, importedName, {
    name: 'variant',
    value: ['link', 'link-inverse']
  }).forEach((path) => {
    const attributes = path.value.openingElement.attributes
    if (!attributes) {
      displayNoHrefWarning(filePath, path.value.loc!.start.line)
      return
    }
    for (const attr of attributes) {
      if (isJSXAttribue(attr) && attr.name.name === 'href') {
        return
      }
    }
    displayNoHrefWarning(filePath, path.value.loc!.start.line)
  })
  ////// find the buttons that will be changed and rename them
  const linkVariants = findElements(j, root, importedName, [
    { name: 'variant', value: 'link' },
    { name: 'href' }
  ])
  const linkInverseVariants = findElements(j, root, importedName, [
    { name: 'variant', value: 'link-inverse' },
    { name: 'href' }
  ])
  ///// insert import if Button was converted to Link
  if (linkVariants.length > 0 || linkInverseVariants.length > 0) {
    const linkImportName = addImportIfNeeded(j, root, 'Link', [
      '@instructure/ui-link',
      '@instructure/ui'
    ])
    renameElements(linkVariants, importedName, linkImportName)
    renameElements(linkInverseVariants, importedName, linkImportName)
  }

  ///// <Button variant="link" href= ->
  ///// <Link href= isWithinText={false}
  findAttribute(j, linkVariants, 'href').insertAfter(
    j.jsxAttribute(
      j.jsxIdentifier('isWithinText'),
      j.jsxExpressionContainer(j.jsxIdentifier('false'))
    )
  )
  findAttribute(j, linkVariants, 'variant').remove()
  linkVariants.forEach((path) => {
    displayHrefWarning(filePath, path.value.loc!.start.line)
  })
  ///// <Button variant="link-inverse" href= ->
  ///// <Link color="link-inverse" href= isWithinText={false}

  findAttribute(j, linkInverseVariants, 'href').insertAfter(
    j.jsxAttribute(
      j.jsxIdentifier('isWithinText'),
      j.jsxExpressionContainer(j.jsxIdentifier('false'))
    )
  )
  findAttribute(j, linkInverseVariants, 'variant').replaceWith((nodePath) => {
    const { node } = nodePath
    node.name.name = 'color'
    ;(node.value as Literal).value = 'link-inverse'
    return nodePath.node
  })
  linkVariants.forEach((path) => {
    displayHrefWarning(filePath, path.value.loc!.start.line)
  })
}

function displayHrefWarning(filePath: string, lineNumber: number) {
  console.warn(
    '<Button with link or link-inverse variant might need the removal' +
      ' of margin/padding parameters. File: ' +
      filePath +
      ' line ' +
      lineNumber +
      '. Also you will likely need to add @instructure/ui-link as a ' +
      'dependency. For more see ' +
      'https://instructure.design/v7/#button-upgrade-guide/#button-upgrade-for-version-8.0-upgrading-variant-link-or-link-inverse-upgrade-examples-for-link-variant-with-an-href-attribute-and-padding-overrides'
  )
}

function displayNoHrefWarning(filePath: string, lineNumber: number) {
  console.warn(
    'Cannot upgrade <Button link or link-inverse manually when it has no href prop at ' +
      filePath +
      ' line ' +
      lineNumber +
      '. Also you will likely need to add @instructure/ui-link as a ' +
      'dependency. For more see ' +
      'https://instructure.design/v7/#button-upgrade-guide/#button-upgrade-for-version-8.0-upgrading-variant-link-or-link-inverse-upgrade-examples-for-link-variant-with-no-href-attribute-and-padding-overrides'
  )
}