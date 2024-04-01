import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  GameStarted,
  GameStatusChanged,
  NewGame,
  OwnershipTransferred,
  PlayerJoined,
  finishGameEvent,
  pickWinnerCall,
  receiveRandomWord
} from "../generated/RandomWinnerGame/RandomWinnerGame"

export function createGameStartedEvent(gameId: BigInt): GameStarted {
  let gameStartedEvent = changetype<GameStarted>(newMockEvent())

  gameStartedEvent.parameters = new Array()

  gameStartedEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId))
  )

  return gameStartedEvent
}

export function createGameStatusChangedEvent(
  game: ethereum.Tuple
): GameStatusChanged {
  let gameStatusChangedEvent = changetype<GameStatusChanged>(newMockEvent())

  gameStatusChangedEvent.parameters = new Array()

  gameStatusChangedEvent.parameters.push(
    new ethereum.EventParam("game", ethereum.Value.fromTuple(game))
  )

  return gameStatusChangedEvent
}

export function createNewGameEvent(
  gameId: BigInt,
  owner: Address,
  maxPlayers: BigInt,
  entryFee: BigInt
): NewGame {
  let newGameEvent = changetype<NewGame>(newMockEvent())

  newGameEvent.parameters = new Array()

  newGameEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId))
  )
  newGameEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  newGameEvent.parameters.push(
    new ethereum.EventParam(
      "maxPlayers",
      ethereum.Value.fromUnsignedBigInt(maxPlayers)
    )
  )
  newGameEvent.parameters.push(
    new ethereum.EventParam(
      "entryFee",
      ethereum.Value.fromUnsignedBigInt(entryFee)
    )
  )

  return newGameEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPlayerJoinedEvent(
  gameId: BigInt,
  _address: Address,
  value: BigInt
): PlayerJoined {
  let playerJoinedEvent = changetype<PlayerJoined>(newMockEvent())

  playerJoinedEvent.parameters = new Array()

  playerJoinedEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId))
  )
  playerJoinedEvent.parameters.push(
    new ethereum.EventParam("_address", ethereum.Value.fromAddress(_address))
  )
  playerJoinedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return playerJoinedEvent
}

export function createfinishGameEventEvent(
  gameId: BigInt,
  winner: Address
): finishGameEvent {
  let finishGameEventEvent = changetype<finishGameEvent>(newMockEvent())

  finishGameEventEvent.parameters = new Array()

  finishGameEventEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId))
  )
  finishGameEventEvent.parameters.push(
    new ethereum.EventParam("winner", ethereum.Value.fromAddress(winner))
  )

  return finishGameEventEvent
}

export function createpickWinnerCallEvent(requestId: BigInt): pickWinnerCall {
  let pickWinnerCallEvent = changetype<pickWinnerCall>(newMockEvent())

  pickWinnerCallEvent.parameters = new Array()

  pickWinnerCallEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromUnsignedBigInt(requestId)
    )
  )

  return pickWinnerCallEvent
}

export function createreceiveRandomWordEvent(
  requestId: BigInt,
  randomwords: Array<BigInt>,
  gameId: BigInt
): receiveRandomWord {
  let receiveRandomWordEvent = changetype<receiveRandomWord>(newMockEvent())

  receiveRandomWordEvent.parameters = new Array()

  receiveRandomWordEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromUnsignedBigInt(requestId)
    )
  )
  receiveRandomWordEvent.parameters.push(
    new ethereum.EventParam(
      "randomwords",
      ethereum.Value.fromUnsignedBigIntArray(randomwords)
    )
  )
  receiveRandomWordEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId))
  )

  return receiveRandomWordEvent
}
