import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import RepoTable from './RepoTable';
import { Link } from 'carbon-components-react';

const headers = [
  {
    key: 'name',
    header: 'Name',
  },
  {
    key: 'createdAt',
    header: 'Created',
  },
  {
    key: 'updatedAt',
    header: 'Updated',
  },
  {
    key: 'issueCount',
    header: 'Open Issues',
  },
  {
    key: 'starts',
    header: 'Starts',
  },
  {
    key: 'links',
    header: 'Links',
  },
];

const REPO_QUERY = gql`
  query REPO_QUERY {
    organization(login: "carbon-design-system") {
      repositories(first: 75, orderBy: { field: UPDATED_AT, direction: DESC }) {
        totalCount
        nodes {
          url
          homepageUrl
          issues(filterBy: { states: OPEN }) {
            totalCount
          }
          stargazers {
            totalCount
          }
          releases(first: 1) {
            totalCount
            nodes {
              name
            }
          }
          name
          updatedAt
          createdAt
          description
          id
        }
      }
    }
  }
`;

const LinkList = ({ url, homepageUrl }) => (
  <ul style={{ display: 'flex ' }}>
    <li>
      <Link href={url}>Github</Link>
    </li>
    {homepageUrl && (
      <li>
        <span>&nbsp;|&nbsp;</span>
        <Link href={homepageUrl}>Homepage</Link>
      </li>
    )}
  </ul>
);

const getRowItems = rows =>
  rows.map(row => ({
    ...row,
    key: row.id,
    stars: row.stargazers.totalCount,
    issueCount: row.issues.totalCount,
    createdAt: new Date(row.createdAt).toLocaleDateString(),
    updatedAt: new Date(row.updatedAt).toLocaleDateString(),
    links: <LinkList url={row.url} homepageUrl={row.homepageUrl} />,
  }));

const RepoPage = () => {
  return (
    <div className="bx--grid bx--grid--full-width bs--grid--no-gutter repo-page">
      <div className="bx--row repo-page__r1">
        <div className="bx--col-lg-16">
          <Query query={REPO_QUERY}>
            {({ loading, error, data }) => {
              if (loading) return 'Loading...';

              if (error) return `Error! ${error.message}`;

              const { repositories } = data.organization;
              const rows = getRowItems(repositories.nodes);

              return <RepoTable headers={headers} rows={rows} />;
            }}
          </Query>
        </div>
      </div>
    </div>
  );
};

export default RepoPage;
