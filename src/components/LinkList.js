import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
// components import
import Link from './Link'

class LinkList extends Component {

  render() {
    const { feedQuery } = this.props;
    
    // wait for data to load
    if (feedQuery && feedQuery.loading) {
        return <div>Loading</div>
    }

    // handle Error
    if (feedQuery && feedQuery.error) {
        return <div>Error</div>
    }

    const linksToRender = this.props.feedQuery.feed.links

    return (
    <Fragment>
        {linksToRender.map(link => <Link key={link.id} link={link} />)}
    </Fragment>
    )
  }
}

const FEED_QUERY = gql`
    query FeedQuery {
        feed {
            links {
                id 
                createdAt
                url
                description
            }
        }
    }
`;

export default graphql(FEED_QUERY,{
    name: 'feedQuery'
})(LinkList);