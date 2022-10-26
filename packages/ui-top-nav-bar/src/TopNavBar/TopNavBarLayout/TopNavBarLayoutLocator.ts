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

import { locator } from '@instructure/ui-test-locator'

import { TopNavBarDesktopLayoutLocator } from './DesktopLayout/TopNavBarDesktopLayoutLocator'
import { TopNavBarSmallViewportLayoutLocator } from './SmallViewportLayout/TopNavBarSmallViewportLayoutLocator'

import { TopNavBarLayout } from './index'

// TODO: this type seems to be too complex, try to fix it later
export const TopNavBarLayoutLocator: {
  customMethods: {
    findDesktopLayout: any
    findSmallViewportLayout: any
  }
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'selector' does not exist on type 'typeof... Remove this comment to see the full error message
} = locator(TopNavBarLayout.selector, {
  findDesktopLayout: (...args: any[]) => {
    return TopNavBarDesktopLayoutLocator.find(...args)
  },
  findSmallViewportLayout: (...args: any[]) => {
    return TopNavBarSmallViewportLayoutLocator.find(...args)
  }
})