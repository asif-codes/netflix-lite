import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import SectionCards from "../../components/card/section-cards";
import NavBar from "../../components/navbar/navbar";
import { getFavouritedVideos } from "../../lib/videos";

import styles from "../../styles/MyList.module.css";
import { redirectUser } from "../../utils/redirectUser";

interface MyListProps {
  myListVideos: { id: string }[];
}

export const getServerSideProps: GetServerSideProps<MyListProps> = async (
  context
) => {
  const { userId, token } = await redirectUser(context);

  const videos = await getFavouritedVideos(userId, token);

  return {
    props: {
      myListVideos: videos,
    },
  };
};

const MyList: NextPage<MyListProps> = ({ myListVideos }) => {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="My List"
            videos={myListVideos}
            size="small"
            shouldWrap
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
};

export default MyList;
