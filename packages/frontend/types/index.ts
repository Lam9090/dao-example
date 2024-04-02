export enum GameStatus {
  PENDING,
  STARTED,
  ENDED,
}

export type GameStatusChangeEvent = {
  game_gameId: string;
  game_status: GameStatus;
  game_maxPlayers: string;
  game_owner: string;
  game_players: string[];
  game_entryFeeDenominator: string;
  game_entryFeeNumerator: string;
  game_winner: string;
};

export type GameStartedEvent = {
  game_gameId: string;
  blockNumber: string;
  blockTimestamp: string;
};

export type NewGameEvent = {
  game_gameId: string;
  game_owner: string;
  game_maxPlayers: string;
  game_entryFee: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
};

export type PlayerJoinedEvent = {
  game_gameId: string;
  game__address: string;
  game_value: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
};

export type FinishGameEvent = {
  game_gameId: string;
  game_winner: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
};
