import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import { useRef } from 'react';

const name = 'Even';

export const siteTitle = 'stanley badminton System Test.V1 ';

export default function Layout({ children, home }) {
  const containerRef = useRef(null);
  const handleFullscreen = () => {
    if (containerRef.current.requestFullscreen) {
      containerRef.current.requestFullscreen();
    } else if (containerRef.current.mozRequestFullScreen) { /* Firefox */
      containerRef.current.mozRequestFullScreen();
    } else if (containerRef.current.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      containerRef.current.webkitRequestFullscreen();
    } else if (containerRef.current.msRequestFullscreen) { /* IE/Edge */
      containerRef.current.msRequestFullscreen();
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        {/* <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle,
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" /> */}
      </Head>
      <div className={styles.percentage_size} ref={containerRef}>
        <div className={styles.title_1}>
            <Image
              priority
              src="/images/badmintion-removebg-preview.png"
              className={utilStyles.iconCircle}
              height={35}
              width={35}
              alt=""
          />
          <div className={styles.title_2}>
            Test Badminton System
            <button className={styles.fullscreenButton} onClick={handleFullscreen}>全螢幕</button>
          </div>
        </div>
      </div>

      {/* <header className={styles.header}>
        {home ? (
          <>
            <Image
              priority
              src="/images/badmintionCourt.png"
              className={utilStyles.borderCircle}
              height={154}
              width={154}
              alt=""
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <video
                className={utilStyles.borderCircle}
                height={244}
                width={244}
                loop
                autoPlay
              >
              <source src="/videos/84939304.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/" className={utilStyles.colorInherit}>
                {name}
              </Link>
            </h2>
          </>
        )}
      </header> */}

      <main>{children}</main>

      {home && <Link href="/posts/first-post">go to frist-post</Link>}

      {/* {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            ← 回到首頁
          </Link>
        </div>
      )} */}
    </div>
  )
}
