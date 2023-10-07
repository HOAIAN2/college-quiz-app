import {
  RiAddFill
} from 'react-icons/ri'
import {
  BiImport,
  BiExport
} from 'react-icons/bi'

export default function Dashboard() {
  return (
    <div
      className={
        [
          'dashboard-d'
        ].join(' ')
      }
    >
      <div className={
        [
          'action-bar-d'
        ].join(' ')
      }>
        <div className={
          [
            'action-item-d'
          ].join(' ')
        }>
          <RiAddFill /> Add
        </div>
        <div className={
          [
            'action-item-d-white'
          ].join(' ')
        }>
          <BiImport /> Import
        </div>
        <div className={
          [
            'action-item-d-white'
          ].join(' ')
        }>
          <BiExport /> Export
        </div>
      </div>
    </div>
  )
}