import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
// components import
import Link from './Link'

class LinkList extends Component {
    componentDidMount() {
        this._subscribeToNewLinks();
        this._subscribeToNewVotes();
      }
      
    _updateCacheAfterVote = (store, createVote, linkId) => {
        // 1
        const data = store.readQuery({ query: FEED_QUERY })
      
        // 2
        const votedLink = data.feed.links.find(link => link.id === linkId)
        votedLink.votes = createVote.link.votes
      
        // 3
        store.writeQuery({ query: FEED_QUERY, data })
      };

    _subscribeToNewLinks = () => {
    this.props.feedQuery.subscribeToMore({
        document: gql`
        subscription {
            newLink {
                node {
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
        `,
        updateQuery: (previous, { subscriptionData }) => {
            const newAllLinks = [subscriptionData.data.newLink.node, ...previous.feed.links]
            const result = {
              ...previous,
              feed: {
                links: newAllLinks
              },
            }
            return result
          },
    })
    };

    _subscribeToNewVotes = () => {
    this.props.feedQuery.subscribeToMore({
        document: gql`
        subscription {
            newVote {
            node {
                id
                link {
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
                user {
                id
                }
            }
            }
        }
        `,
    })
    };

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
        {linksToRender.map((link, index) => {
            return <Link 
                key={link.id} 
                index={index} 
                link={link} 
                updateStoreAfterVote={this._updateCacheAfterVote}
            />
        })
        }
    </Fragment>
    )
    }
}


export const FEED_QUERY = gql`
    query FeedQuery {
        feed {
            links {
                id 
                createdAt
                url
                description
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
`;

export default graphql(FEED_QUERY,{
    name: 'feedQuery'
})(LinkList);