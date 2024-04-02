"use client";
import {  useContracts } from "@/services/queries";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import React from "react";
import { waitForTransactionReceipt } from "wagmi/actions";
import { useConfig, useWriteContract } from "wagmi";
import AsyncButton from "@/components/AsyncButton";
import {GameStatusChangeEvent} from '@/types'
import { parseEther } from "viem";
/**
 * 
 * struct Game {
    uint gameId;
    // enum status represent the status of the game 
    GameStatus status;
    // maximum players of the game
    uint maxPlayers;
    // fees for joined the game
    uint entryFeeNumerator;

    uint entryFeeDenominator;
    // address of players
    address[] players;

    address winner;

    // who starts this game;
    address owner;
  }
 */


export class Game {
  event: GameStatusChangeEvent;
  constructor(event: GameStatusChangeEvent) {
    this.event = event;
  }
  // static fromGameStruct(s: GameStruct) {
  //   const [
  //     game_gameId,
  //     game_status,
  //     game_maxPlayers,
  //     game_entryFeeNumerator,
  //     game_entryFeeDenominator,
  //     game_winner,
  //     game_owner,
  //   ] = s;

  //   return new Game({
  //     game_gameId: Number(game_gameId).toString(),
  //     game_status,
  //     game_maxPlayers: Number(game_maxPlayers).toString(),
  //     game_entryFeeNumerator: Number(game_entryFeeNumerator).toString(),
  //     game_entryFeeDenominator: Number(game_entryFeeDenominator).toString(),
  //     game_winner,
  //     game_owner,
  //   });
  // }
  get id() {
    return this.event.game_gameId;
  }
  get status() {
    return this.event.game_status;
  }
  get maxPlayers() {
    return this.event.game_maxPlayers;
  }
  get owner() {
    return this.event.game_owner;
  }
  get fee() {
    return (
      Number(this.event.game_entryFeeNumerator) /
      Number(this.event.game_entryFeeDenominator)
    );
  }
  get players() {
    return this.event.game_players;
  }
  get joinedPlayerNums() {
    return this.event.game_players.length;
  }
}

export default function GameRoom({ game }: { game: Game }): React.JSX.Element {
  const { RandomWinnerGame } = useContracts();
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();
  const handleJoinGame = async (game: Game) => {
    try {
      const tx = await writeContractAsync({
        abi: RandomWinnerGame.abi,
        address: RandomWinnerGame.address,
        functionName: "joinGame",
        args: [BigInt(game.id)],
        value: parseEther(String(game.fee))
      });
      await waitForTransactionReceipt(config, {
        hash: tx,
      });
    } catch (err) {
      throw err;
    }
  };
  return (
    <Card key={game.id}>
      <CardBody>
        <div className="flex flex-col">
          <span>
            Payers:{game.joinedPlayerNums}/{game.maxPlayers}
          </span>
          <span>Join Cost: {game.fee} ether</span>
        </div>
      </CardBody>
      <CardFooter>
        <AsyncButton onClick={() => handleJoinGame(game)}>Join</AsyncButton>
      </CardFooter>
    </Card>
  );
}
