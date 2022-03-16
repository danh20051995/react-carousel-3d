import { FC } from 'react'
import Styles from './s.m.scss'

export const DemoComp: FC = props => (
  <div className={Styles.className}>
    {props.children}
  </div>
)
