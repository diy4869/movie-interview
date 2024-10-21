import React from 'react'

export interface CheckPermissionProps {
  code: string
  children: React.ReactElement
}

export function CheckPermission(props: CheckPermissionProps) {
  return props.children
}
