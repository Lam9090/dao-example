import { useContract, useContracts } from "@/services/queries";
import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { Game } from "./GameRoom";
import { waitForTransactionReceipt } from "wagmi/actions";
import { GameStatus, GameStatusChangeEvent } from "@/types";
import GameActivity from "./GameActivity";

const myGameQuery = gql`
  query MyGame($address: String!) {
    gameStatusChangeds(
      order_by: blockTimestamp
      where: { game_owner: $address }
    ) {
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
export default function YourGame() {
  const { address } = useAccount();

  const [showActivity, setShowActivity] = useState(false);
  const { loading, data } = useQuery<{
    gameStatusChangeds: GameStatusChangeEvent[];
  }>(myGameQuery, {
    variables: {
      address,
    },
    pollInterval: 5000,
  });

  const lastEvent =
    data?.gameStatusChangeds?.[data?.gameStatusChangeds?.length - 1];
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();
  const randomWinnerGame = useContract("RandomWinnerGame");
  const handleStartGame = async (game: Game) => {
    const tx = await writeContractAsync({
      abi: randomWinnerGame.abi,
      address: randomWinnerGame.address,
      functionName: "startGame",
    });
    await waitForTransactionReceipt(config, { hash: tx });
  };
  const game = useMemo(() => {
    if (lastEvent) return new Game(lastEvent);
  }, [lastEvent]);
  if (loading) return <Spinner></Spinner>;

  if (
    !data?.gameStatusChangeds ||
    data.gameStatusChangeds.length === 0 ||
    lastEvent?.game_status === GameStatus.ENDED ||
    !game
  ) {
    return (
      <div>
        <Link href="/RandomWinnerGame/NewGame">
          <Button>New Game</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      My Game
      <Modal
        isOpen={showActivity}
        onOpenChange={(isOpen) => setShowActivity(isOpen)}
      >
        <ModalContent className="px-4">
          <ModalHeader>Activity:</ModalHeader>
          <ModalBody>
            <GameActivity id={game.id}></GameActivity>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div key={game?.id}>
        GameId:{game?.id}
        MaxPlayers:{game?.maxPlayers}; fee:{game?.fee}ether
        {game.players.length === Number(game.maxPlayers) && (
          <Button>Pick Winner</Button>
        )}
        {game.status === GameStatus.STARTED ? (
          <Button onClick={() => setShowActivity(true)}>Show Activity</Button>
        ) : (
          <Button onClick={() => handleStartGame(game)}>Start Game</Button>
        )}
      </div>
    </div>
  );
}
