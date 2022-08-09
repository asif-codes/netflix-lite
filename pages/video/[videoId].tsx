import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import DisLike from "../../components/icons/dislike-icon";
import Like from "../../components/icons/like-icon";
import NavBar from "../../components/navbar/navbar";
import { getYoutubeVideoById } from "../../lib/videos";
import styles from "../../styles/Video.module.css";

Modal.setAppElement("#__next");

interface VideoType {
  title: string;
  publishTime: string;
  description: string;
  channelTitle: string;
  statistics: {
    viewCount: number;
  };
}

interface VideoProps {
  video: VideoType | {};
}

interface Params extends ParsedUrlQuery {
  videoId: string;
}

export const getStaticProps: GetStaticProps<VideoProps, Params> = async ({
  params,
}) => {
  const videoId = params?.videoId as string;

  const videoArray = await getYoutubeVideoById(videoId);

  return {
    props: { video: videoArray.length > 0 ? videoArray[0] : {} },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths<Params> = () => {
  const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];
  const paths = listOfVideos.map((videoId) => ({
    params: {
      videoId,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

const Video: NextPage<VideoProps> = ({ video }) => {
  const router = useRouter();

  const [toogleLike, setToogelLike] = useState<boolean>(false);
  const [toogleDisLike, setToogeDislLike] = useState<boolean>(false);

  const { videoId } = router.query;

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount },
  } = video as VideoType;

  useEffect(() => {
    const fetchRating = async () => {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: "GET",
      });

      const data = await response.json();

      if (data?.findVideo?.length > 0) {
        const favourited = data.findVideo[0].favourited;
        if (favourited === 1) {
          setToogelLike(true);
        } else if (favourited === 0) {
          setToogeDislLike(true);
        }
      }
    };

    fetchRating();
  }, [videoId]);

  const runRatingService = async (favourited: number) => {
    return await fetch("/api/stats", {
      method: "POST",
      body: JSON.stringify({
        videoId,
        favourited,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
  };

  const handleToogleLike = async () => {
    const val = !toogleLike;
    setToogelLike(val);
    setToogeDislLike(toogleLike);

    const favourited = val ? 1 : 0;
    await runRatingService(favourited);
  };

  const handleToogleDisLike = async () => {
    const val = !toogleDisLike;
    setToogeDislLike(val);
    setToogelLike(toogleDisLike);

    const favourited = val ? 0 : 1;
    await runRatingService(favourited);
  };

  return (
    <div className={styles.container}>
      <NavBar />
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => {
          router.back();
        }}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="ytplayer"
          className={styles.videoPlayer}
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${videoId}?origin=http://example.com&autoplay=1&controls=0&rel=1`}
          frameBorder="0"
        ></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToogleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toogleLike} />
              </div>
            </button>
          </div>
          <button onClick={handleToogleDisLike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={toogleDisLike} />
            </div>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={`${styles.subText} ${styles.subTextWrapper}`}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={`${styles.subText} ${styles.subTextWrapper}`}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
