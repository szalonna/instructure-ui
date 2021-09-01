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

/** @jsx jsx */
import { Component } from 'react'

import { omitProps } from '@instructure/ui-react-utils'
import { View } from '@instructure/ui-view'

import { withStyle, jsx } from '@instructure/emotion'

import generateStyle from './styles'
import generateComponentTheme from './theme'

import { propTypes, defaultProps, allowedProps } from './props'
import type { BylineProps } from './props'

/**
---
category: components
---
**/

@withStyle(generateStyle, generateComponentTheme)
class Byline extends Component<BylineProps> {
  static readonly componentId = 'Byline'

  static propTypes = propTypes
  static allowedProps = allowedProps
  static defaultProps = defaultProps

  componentDidMount() {
    // @ts-expect-error ts-migrate(2722) FIXME: Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
    this.props.makeStyles()
  }

  // @ts-expect-error ts-migrate(6133) FIXME: 'prevProps' is declared but its value is never rea... Remove this comment to see the full error message
  componentDidUpdate(prevProps, prevState, snapshot) {
    // @ts-expect-error ts-migrate(2722) FIXME: Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
    this.props.makeStyles()
  }

  render() {
    const passthroughProps = View.omitViewProps(
      omitProps(this.props, Byline.propTypes),
      Byline
    )

    return (
      <View
        {...passthroughProps}
        elementRef={this.props.elementRef}
        css={this.props.styles?.byline}
        as="figure"
        margin={this.props.margin}
        // @ts-expect-error TODO: fix
        maxWidth={this.props.styles?.maxWidth}
      >
        <div css={this.props.styles?.figure}>{this.props.children}</div>
        <figcaption css={this.props.styles?.caption}>
          {this.props.title && (
            <span css={this.props.styles?.title}>{this.props.title}</span>
          )}
          {this.props.description && (
            <div css={this.props.styles?.description}>
              {this.props.description}
            </div>
          )}
        </figcaption>
      </View>
    )
  }
}

export default Byline
export { Byline }
