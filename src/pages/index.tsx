import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useCallback, useState} from "react";

const Home: NextPage = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>SITE-456</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          SITE-456
        </h1>
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}

export default Home
