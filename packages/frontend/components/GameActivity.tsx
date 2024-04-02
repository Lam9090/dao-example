import {
  FinishGameEvent,
  GameStartedEvent,
  NewGameEvent,
  PlayerJoinedEvent,
} from "@/types";
import { gql, useQuery } from "@apollo/client";
import { Spacer } from "@nextui-org/react";
import React, { useMemo } from "react";

const activityQuery = gql`
  query GameActivity($id: String) {
    newGames(where: { gameId: $id }) {
      blockTimestamp
    }
    gameStarteds(where: { gameId: $id }) {
      blockTimestamp
    }
    playerJoineds(where: { gameId: $id }) {
      blockTimestamp
    }
    finishGameEvents(where: { gameId: $id }) {
      blockTimestamp
    }
  }
`;

class BaseLog {
  event: { blockTimestamp: string };
  constructor(baseEvent: { blockTimestamp: string }) {
    this.event = baseEvent;
  }
  get time() {
    // UNIX timestamp to JS timestamp
    return Number(this.event.blockTimestamp) *1000;
  }

  get timeFormat() {
    return new Date(this.time);
  }

  formatLog(content: string) {
    return [this.timeFormat,":", content].join("");
  }
}
class NewGameLog extends BaseLog implements ILog {
  event: NewGameEvent;
  constructor(event: NewGameEvent) {
    super(event);

    this.event = event;
  }
  log(): string {
    return this.formatLog("Game created");
  }
}

interface ILog {
  log(): string;
}

class GameStartedLog extends BaseLog implements ILog {
  event: GameStartedEvent;

  constructor(event: GameStartedEvent) {
    super(event);
    this.event = event;
  }
  log(): string {
    return this.formatLog("Started the game");
  }
}
class PlayerJoinedLog extends BaseLog implements ILog {
  event: PlayerJoinedEvent;

  constructor(event: PlayerJoinedEvent) {
    super(event);

    this.event = event;
  }
  log(): string {
    const content = [`${this.event.game__address} joined the game`];
    return this.formatLog(content.join(""));
  }
}
class FinishGameLog extends BaseLog implements ILog {
  event: FinishGameEvent;

  constructor(event: FinishGameEvent) {
    super(event);
    this.event = event;
  }
  log(): string {
    const content = [`${this.event.game_winner} win the game, game ended`];
    return this.formatLog(content.join(""));
  }
}

export default function GameActivity(props: { id: string }) {
  const { data } = useQuery<{
    newGames: NewGameEvent[];
    gameStarteds: GameStartedEvent[];
    playerJoineds: PlayerJoinedEvent[];
    finishGameEvents: FinishGameEvent[];
  }>(activityQuery, {
    variables: {
      id: props.id,
    },
  });

  const events = useMemo(() => {
    const events = [];

    events.push(
      ...(data?.newGames.map((event) => new NewGameLog(event)) ?? [])
    );

    events.push(
      ...(data?.gameStarteds.map((event) => new GameStartedLog(event)) ?? [])
    );
    events.push(
      ...(data?.playerJoineds.map((event) => new PlayerJoinedLog(event)) ?? [])
    );
    events.push(
      ...(data?.finishGameEvents.map((event) => new FinishGameLog(event)) ?? [])
    );

    return events.sort(
      (a, b) => Number(b.event.blockTimestamp) - Number(a.event.blockTimestamp) 
    );
  }, [data]);

  return (
    <div>
      {events.map((event, i) => {
        return <React.Fragment key={i}><Spacer y={2}></Spacer><div key={i}>{event.log()}</div></React.Fragment>;
      })}
    </div>
  );
}
