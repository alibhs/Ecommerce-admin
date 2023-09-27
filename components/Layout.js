import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Nav from '@/components/Nav'

export default function Layout({children}) {
  return (
    <div className='bg-blue-900 min-h-screen flex'>
      <Nav />
      <div className='bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4'>{children}</div>
    </div>
  )
}
