// components/MyMenu.js
import React from 'react'
import { Menu as AntdMenu } from 'antd'
import Link from 'next/link'
import { ItemType, MenuItemType } from 'antd/es/menu/interface'


const data = [
  {
    key: '/movieList',
    label: '电影列表'
  },
  {
    key: '/userList',
    label: '用户列表'
  },
  {
    key: '/selectSeat',
    label: '选座'
  }
].map(item => {
  return  {
    key: item.key,
    label: <Link href={item.key} key={item.key}>{item.label}</Link>
  }
})

export function Menu() {
  return (
    <AntdMenu
      mode="inline"
      // defaultOpenKeys={[openKey]}
      // defaultSelectedKeys={[removeLangPrefix()]}
      items={data}
    >
    </AntdMenu>
  )
}
