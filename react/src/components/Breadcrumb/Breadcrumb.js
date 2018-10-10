import React from 'react';
import { Route, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import routes from '../../routes';
import TrialDaysLeft from '../TrialDaysLeft/TrialDaysLeft'

const findRouteName = url => routes[url];

const getPaths = (pathname) => {
  const paths = ['/'];
  // const settingsURL = '/settings';
  if (pathname === '/') return paths;
  // if (pathname.includes(settingsURL))  pathname=" ";

  pathname.split('/').reduce((prev, curr, index) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  return paths;
};

const BreadcrumbsItem = ({ ...rest, match }) => {
  const routeName = findRouteName(match.url);
  if (routeName) {
    return (
      match.isExact ?
      (
        <BreadcrumbItem active className={match.url.includes('/settings/') || match.url.includes('/conversation/oops') ? "invisible" : ""}>{routeName}</BreadcrumbItem>
      ) :
      ( 
        <BreadcrumbItem>
          <Link to={match.url || ''}>
            {routeName}
          </Link> 
        </BreadcrumbItem>
      )
    );
  }
  return null;
};

const Breadcrumbs = ({ ...rest, location : { pathname }, match }) => {
  const paths = getPaths(pathname);
  const i = 0;
  const items = paths.map((path, i) => <Route key={i++} path={path} component={BreadcrumbsItem} />);
  return (
    <Breadcrumb className={paths[1].includes("/settings") || paths[paths.length-1].includes('/conversation/oops') ? "km-remove-border" : ""}>
      {items}
      { paths[1] === '/conversations' ? " " : <TrialDaysLeft />}    
    </Breadcrumb>
  );
};

export default props => (
  <div >
    <Route path="/:path" component={Breadcrumbs} {...props} className="hidden" />
  </div>
);
