'use client'
/* eslint-disable react/prop-types */
import { AntdRegistry } from '@ant-design/nextjs-registry'
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import type { MenuProps } from 'antd'
import { Menu } from '@/components/menu'
import {
  ConfigProvider,
  Layout,
  theme,
  Space,
} from 'antd'

import 'dayjs/locale/ja'
import '@/assets/css/normalize.css'
import SelectSeat from './selectSeat/page'

export interface PageProps {
  children: React.ReactNode
}

function RootLayout({ children }: PageProps) {
  const { Header, Sider } = Layout


  return (
    <html lang='zh-CN'>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </head>
      <body>
        <AntdRegistry>
          <SelectSeat></SelectSeat>
        </AntdRegistry>
      </body>
    </html>
  )
}

export default RootLayout
