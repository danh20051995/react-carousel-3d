import { FC } from 'react'
import Style from './style.module.scss'

export const DemoComp: FC = props => (
  <div className={Style.className}>
    {props.children}
  </div>
)
