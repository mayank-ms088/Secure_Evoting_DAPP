/* eslint-disable react/no-array-index-key */
import React, { lazy, Suspense, Fragment } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";

const routesConfig = [
  {
    exact: true,
    path: "/",
    component: () => <Redirect to="/home" />,
  },
  // {
  //   exact: true,
  //   path: "/404",
  //   component: lazy(() => import("./views/404/Error404View")),
  // },
  // {
  //   exact: true,
  //   path: "/login",
  //   component: lazy(() => import("src/views/auth/LoginView")),
  // },

  // {
  //   exact: true,
  //   path: "/profilePage",
  //   component: lazy(() => import("src/views/events/EventListView")),
  // },
  {
    exact: true,
    path: "/profile",
    component: lazy(() => import("./views/Profile")),
  },
  {
    exact: true,
    path: "/ballot",
    component: lazy(() => import("./views/Ballot")),
  },
  {
    exact: true,
    path: "/home",
    component: lazy(() => import("./views/Home")),
  },
  // {
  //   component: () => <Redirect to="/404" />,
  // },
];

const renderRoutes = (routes) =>
  routes ? (
    //lets your components “wait” for something before they can render.
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route, i) => {
          // const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Component = route.component;

          return (
            <Route
              key={i}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                <Layout>
                  {route.routes ? (
                    renderRoutes(route.routes)
                  ) : (
                    <Component {...props} />
                  )}
                </Layout>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  ) : null;

function Routes() {
  return renderRoutes(routesConfig);
}

export default Routes;
