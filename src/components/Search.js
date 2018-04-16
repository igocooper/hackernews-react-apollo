import React, { Component, Fragment } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'

export class Search extends Component {
    state = {
        links: [],
        filter: ''
    }
    
    render() {
        return (
        <Fragment>
            <div>
                Search
                <input type="text"
                        onChange={(e) => this.setState({filter: e.target.value})}
                />
                <button
                    onClick={ () => this._executeSearch()}
                >
                OK
                </button>
                {this.state.links.map( (link, index) => <Link link={link} index={index} key={index} />)}
            </div>
            
        </Fragment>
        )
    }

    _executeSearch = async () => {
        const { filter }  = this.state;
        const result = await this.props.client.query({
            query: FEED_SEARCH_QUERY,
            variables: {
                filter
            }
        })
        const links = result.data.feed.links;
        this.setState({ links })
      }
}

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`


export default withApollo(Search);
