import React, { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { WidgetContainer } from 'x-common';
import { WB1, WB2, WB3 } from './sub-components';

const CommonDetail = lazy(() => import('./Detail'));

// 配置 widget 显示名称
const title = 'WB';

// 通过配置自动生成入口导航及路由
/**
 * title - 有 title 的将生成二级导航
 * autoRedirect - 进入一级导航时，自动跳转到该二级路由
 */
const routes = [
  { title: 'WB1', path: 'wb/wb1', component: WB1, autoRedirect: true },
  { title: 'WB2', path: 'wb/wb2', component: WB2 },
  { path: 'wb/detail', component: WB3 },
];

// todo - header 中地域啥的显示，将在 widget 被加载后使用 redux 触发
export default function Widget(props) {
  return (
    <div>
      <h2>
        WBWB.....
      </h2>
      <Suspense fallback={<div>loading...</div>}>
        <CommonDetail></CommonDetail>
      </Suspense>
    <Outlet>
      <WidgetContainer {...props} title={title} routes={routes}></WidgetContainer>
    </Outlet>
    </div>
  )
}
