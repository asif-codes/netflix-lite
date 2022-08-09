import type { MagicUserMetadata } from "magic-sdk";

export const updateStats = async (
  token: string,
  favourited: number,
  userId: string,
  watched: boolean,
  videoId: string
) => {
  const operationsDoc = `
  mutation updateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
    update_stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}, _set: {watched: $watched, favourited: $favourited}) {
      returning {
        favourited
        userId
        videoId
        watched
      }
    }
  }
`;

  interface ResponseType {
    data: {
      insert_stats_one: {
        favourited: 0 | 1 | null;
        userId: string;
        videoId: string;
        watched: boolean;
      };
    };
  }

  const response: ResponseType = await queryHasuraGQL(
    operationsDoc,
    "updateStats",
    {
      favourited,
      userId,
      watched,
      videoId,
    },
    token
  );

  return response;
};

export const insertStats = async (
  token: string,
  favourited: number,
  userId: string,
  watched: boolean,
  videoId: string
) => {
  const operationsDoc = `
  mutation insertStats($favourited: Int!, $userId: String!, $videoId: String!, $watched: Boolean!) {
    insert_stats_one(object: {favourited: $favourited, userId: $userId, videoId: $videoId, watched: $watched}) {
      favourited
      userId
      videoId
      watched
    }
  }
`;

  interface ResponseType {
    data: {
      stats:
        | [
            {
              favourited: 0 | 1 | null;
              id: number;
              userId: string;
              videoId: string;
              watched: boolean;
            }
          ]
        | [];
    };
  }

  const response: ResponseType = await queryHasuraGQL(
    operationsDoc,
    "insertStats",
    {
      favourited,
      userId,
      watched,
      videoId,
    },
    token
  );

  return response;
};

export const findVideoIdByUser = async (
  token: string,
  userId: string,
  videoId: string
) => {
  const operationsDoc = `
  query findVideoIdByUser($userId: String!, $videoId: String!) {
    stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
      favourited
      id
      userId
      videoId
      watched
    }
  }
`;

  interface ResponseType {
    data: {
      stats:
        | [
            {
              favourited: 0 | 1 | null;
              id: number;
              userId: string;
              videoId: string;
              watched: boolean;
            }
          ]
        | [];
    };
  }

  const response: ResponseType = await queryHasuraGQL(
    operationsDoc,
    "findVideoIdByUser",
    {
      userId,
      videoId,
    },
    token
  );

  return response?.data?.stats;
};

export const createNewUser = async (
  token: string,
  metadata: MagicUserMetadata
) => {
  const operationsDoc = `
  mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
        publicAddress
      }
    }
  }
`;

  const { issuer, email, publicAddress } = metadata;

  const response: ResponseType = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
    {
      issuer,
      email,
      publicAddress,
    },
    token
  );

  return response;
};

export const isNewUser = async (token: string, issuer: string) => {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      email
      id
      issuer
      publicAddress
    }
  }
`;

  interface ResponseType {
    data: {
      users: [
        {
          email: string;
          id: number;
          issuer: string;
          publicAddress: string;
        }?
      ];
    };
  }

  const response: ResponseType = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    {
      issuer,
    },
    token
  );

  return response?.data?.users?.length === 0;
};

export const queryHasuraGQL = async (
  operationsDoc: string,
  operationName: string,
  variables: Record<string, any>,
  token: string | null | undefined
) => {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables,
      operationName,
    }),
  });
  return await result.json();
};

export const getWatchedVideos = async (
  userId: string,
  token: string | null | undefined
) => {
  const operationsDoc = `
  query watchedVideos($userId: String!) {
    stats(where: {userId: {_eq: $userId}, watched: {_eq: true}}) {
      videoId
    }
  }
`;

  interface ResponseType {
    data: {
      stats:
        | [
            {
              videoId: string;
            }
          ]
        | [];
    };
  }

  const response: ResponseType = await queryHasuraGQL(
    operationsDoc,
    "watchedVideos",
    {
      userId,
    },
    token
  );

  return response?.data?.stats;
};

export const getLikedVideos = async (
  userId: string,
  token: string | null | undefined
) => {
  const operationsDoc = `
  query getLikedVideos($userId: String!) {
    stats(where: {userId: {_eq: $userId}, favourited: {_eq: 1}}) {
      userId
      videoId
      favourited
    }
  }
`;

  interface ResponseType {
    data: {
      stats:
        | [
            {
              userId: string;
              videoId: string;
              favourited: 1 | 0;
            }
          ]
        | [];
    };
  }

  const response: ResponseType = await queryHasuraGQL(
    operationsDoc,
    "getLikedVideos",
    {
      userId,
    },
    token
  );

  return response?.data?.stats;
};
