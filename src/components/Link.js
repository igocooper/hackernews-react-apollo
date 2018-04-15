import React, { Component, Fragment } from 'react'

class Link extends Component {
  render() {
    return (
      <Fragment>
        <div>
          {this.props.link.description} ({this.props.link.url})
        </div>
      </Fragment>
    )
  }

  _voteForLink = async () => {
    // ... you'll implement this in chapter 6
  }
}

export default Link