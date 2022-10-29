// 外部模块/库
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

// 内部公共模块/库
// import WidgetRoutesActions from '../../actions/widgetRoutes';

// 其他模块/库/组件
// import WithNav from './WithNav';

export class Container extends React.Component {
  constructor(props) {
      super(props);
      // props.changeWidgetRoutes(props.routes); // 改变Header中的routes
      this.routes = props.routes;
      this.title = props.title;
      this.majorRoutes = this.routes.filter(item => (!!item.title));
      this.minorRoutes = this.routes.filter(item => (!item.title));
  }
  // static propTypes = {
  //     routes: PropTypes.array,
  //     title: PropTypes.string,
  // };
  static defaultProps = {
      routes: [],
      title: 'TITLE',
  };
  renderMajor(title, Comp, routes, props) {
      const { location } = props;
      const route = routes.find(item => {
          return item.path === location.pathname;
      });
      return (
          <div>
            <p>
              <h2>{ title } Header</h2>
            </p>
            <ul>
              {
                routes.map((item) => 
                  <Link
                    key={`link-${path}`}
                    to={item.path}>
                    {item.title}
                  </Link>
                )
              }
            </ul>
            <div>
                <Comp {...props}/>
            </div>
          </div>
      )
  }
  render() {
    const redirectTo = this.routes.find(item => (item.autoRedirect))
      || this.majorRoutes[0]
      || this.minorRoutes[0];

    return (
      <>
        {/* <Routes> */}
            {
              this.majorRoutes.map((item) =>
                <Route key={`major-${item.path}`}
                  path={item.path}
                  render={ (props) => this.renderMajor(this.title, item.component, this.majorRoutes, props) }
                />
              )
            }
            {
              this.minorRoutes.map((item) =>
                <Route key={`minor-${item.path}`}
                  path={item.path}
                  component={item.component}
                />
              )
            }
            {/* {
              redirectTo ? <Navigate to={redirectTo.path} replace={true} /> : null
            }
            <Route component={() => <Navigate to="/" replace={true} />}/> */}
        {/* </Routes> */}
      </>
    )
  }
}
