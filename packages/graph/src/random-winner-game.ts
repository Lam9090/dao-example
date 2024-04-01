import {
  GameStarted as GameStartedEvent,
  GameStatusChanged as GameStatusChangedEvent,
  NewGame as NewGameEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PlayerJoined as PlayerJoinedEvent,
  finishGameEvent as finishGameEventEvent,
  pickWinnerCall as pickWinnerCallEvent,
  receiveRandomWord as receiveRandomWordEvent
} from "../generated/RandomWinnerGame/RandomWinnerGame"
import {
  GameStarted,
  GameStatusChanged,
  NewGame,
  OwnershipTransferred,
  PlayerJoined,
  finishGameEvent,
  pickWinnerCall,
  receiveRandomWord
} from "../generated/schema"

export function handleGameStarted(event: GameStartedEvent): void {
  let entity = new GameStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGameStatusChanged(event: GameStatusChangedEvent): void {
  let entity = new GameStatusChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.game_gameId = event.params.game.gameId
  entity.game_status = event.params.game.status
  entity.game_maxPlayers = event.params.game.maxPlayers
  entity.game_entryFeeNumerator = event.params.game.entryFeeNumerator
  entity.game_entryFeeDenominator = event.params.game.entryFeeDenominator
  entity.game_players = event.params.game.players
  entity.game_winner = event.params.game.winner
  entity.game_owner = event.params.game.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewGame(event: NewGameEvent): void {
  let entity = new NewGame(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameId = event.params.gameId
  entity.owner = event.params.owner
  entity.maxPlayers = event.params.maxPlayers
  entity.entryFee = event.params.entryFee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePlayerJoined(event: PlayerJoinedEvent): void {
  let entity = new PlayerJoined(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameId = event.params.gameId
  entity._address = event.params._address
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlefinishGameEvent(event: finishGameEventEvent): void {
  let entity = new finishGameEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameId = event.params.gameId
  entity.winner = event.params.winner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlepickWinnerCall(event: pickWinnerCallEvent): void {
  let entity = new pickWinnerCall(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestId = event.params.requestId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlereceiveRandomWord(event: receiveRandomWordEvent): void {
  let entity = new receiveRandomWord(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestId = event.params.requestId
  entity.randomwords = event.params.randomwords
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
