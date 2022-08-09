import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Banner from "../components/banner/banner";
import SectionCards from "../components/card/section-cards";
import NavBar from "../components/navbar/navbar";

import {
  getPopularVideos,
  getVideos,
  getWatchItAgainVideos,
} from "../lib/videos";
import styles from "../styles/Home.module.css";
import { redirectUser } from "../utils/redirectUser";

type VideosType = {
  title: string;
  imgUrl: string;
  id:
    | string
    | {
        videoId: string;
      };
}[];

interface HomeProps {
  popularVideos: VideosType;
  watchItAgainVideos: { id: string }[];
  marvelVideos: VideosType;
  disneyVideos: VideosType;
  documentaryVideos: VideosType;
  musicVideos: VideosType;
  scifiAndFantasyVideos: VideosType;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const { userId, token } = await redirectUser(context);

  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);

  const popularVideos = await getPopularVideos();
  const marvelVideos = await getVideos("marvel trailer");
  const disneyVideos = await getVideos("disney trailer");
  const documentaryVideos = await getVideos("documentary");
  const musicVideos = await getVideos("music");
  const scifiAndFantasyVideos = await getVideos("sci-fi & fantasy");

  return {
    props: {
      popularVideos,
      watchItAgainVideos,
      marvelVideos,
      disneyVideos,
      documentaryVideos,
      musicVideos,
      scifiAndFantasyVideos,
    },
  };
};

const Home: NextPage<HomeProps> = ({
  popularVideos,
  watchItAgainVideos = [],
  marvelVideos,
  disneyVideos,
  documentaryVideos,
  musicVideos,
  scifiAndFantasyVideos,
}) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix Lite</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <NavBar />

        <Banner
          videoId="4zH5iYM4wJo"
          title="Clifford the red dog"
          subTitle="a very cute dog"
          imgUrl="/static/clifford.webp"
        />

        <div className={styles.sectionWrapper}>
          <SectionCards
            title="Popular Now"
            size="small"
            videos={popularVideos}
          />
          {watchItAgainVideos.length > 0 && (
            <SectionCards
              title="Watch it again"
              size="small"
              videos={watchItAgainVideos}
            />
          )}
          <SectionCards title="Marvel" size="large" videos={marvelVideos} />
          <SectionCards title="Disney" size="medium" videos={disneyVideos} />
          <SectionCards
            title="Documentaries"
            size="medium"
            videos={documentaryVideos}
          />
          <SectionCards title="Music" size="large" videos={musicVideos} />
          <SectionCards
            title="Sci-fi & Fantasy"
            size="small"
            videos={scifiAndFantasyVideos}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
