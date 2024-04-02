"use client";
import {
  GameStatusChangeEvent
} from "@/types";
import { gql, useQuery } from "@apollo/client";
import { Button, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { useMemo } from "react";
import GameRoom, { Game } from "@/components/GameRoom";
import YourGame from "@/components/YourGame";

export const gameStartedQuery = gql`
  {
    gameStatusChangeds(where:{game_status: 1 }) {
      id
      game_gameId
      game_status
      game_maxPlayers
      game_owner
      game_players
      blockTimestamp
      game_entryFeeDenominator
      game_entryFeeNumerator
    }
  }
`;
export default function Page() {
  const { loading, data } = useQuery<{
    gameStatusChangeds: GameStatusChangeEvent[];
  }>(gameStartedQuery,{pollInterval:5000});

  const games = useMemo(() => {
    return data?.gameStatusChangeds.map((g) => new Game(g));
  }, [data?.gameStatusChangeds]);

  return (
    <div>
      <YourGame></YourGame>
      {loading ? (
        <Spinner></Spinner>
      ) : (
        <div>
          <div>Game Rooms</div>
        <div className="flex">

          {games?.length ? games?.map((game) => {
            return <GameRoom key={game.id} game={game}></GameRoom>;
          }):"No available rooms"}
        </div>
        </div>
      )}
    </div>
  );
}
