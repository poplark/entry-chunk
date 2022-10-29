import React from 'react';
import { Outlet } from 'react-router-dom';
import { WidgetContainer } from 'x-common';
import { WA1, WA2, WA3 } from './sub-components';

// 配置 widget 显示名称
const title = 'WA';

// 通过配置自动生成入口导航及路由
/**
 * title - 有 title 的将生成二级导航
 * autoRedirect - 进入一级导航时，自动跳转到该二级路由
 */
const routes = [
  { title: 'WA1', path: 'wa/wa1', component: WA1, autoRedirect: true },
  { title: 'WA2', path: 'wa/wa2', component: WA2 },
  { path: 'wa/detail', component: WA3 },
];

// todo - header 中地域啥的显示，将在 widget 被加载后使用 redux 触发
export default function Widget(props) {
  return (
    <div>
      <h2>
        WAWA.....
      </h2>
    <Outlet>
      <WidgetContainer {...props} title={title} routes={routes}></WidgetContainer>
    </Outlet>
    </div>
  )
}
