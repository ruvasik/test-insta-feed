import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import getLocalFeed from '../getFeed';

const Home: NextPage = ({feed = []}) => {

  return (
    <div className={styles.container}>
      <Head>
        <title>SITE-456</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Впечатления
        </h1>

        <div className={styles.feed}>
          { !!feed.length && feed.map(item => (
            <div key={item.id} className={styles.item} style={{backgroundImage: `url(${item.thumbnail_url})`}} />
          ) ) }
        </div>
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}

export default Home;

export const getServerSideProps = async ({req, res}) => {
  let feed = [];

  try {
    const data = await getLocalFeed();
    feed = data.feed;
  }
  catch (e) {
    console.log(e);
  }

  return { props: {feed} }
};
