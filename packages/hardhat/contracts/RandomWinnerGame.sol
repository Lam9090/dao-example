// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
contract RandomWinnerGame is VRFConsumerBaseV2,Ownable {

  enum GameStatus{
    // not started
    PENDING,
    // game has started
    STARTED,
    // game ended
    ENDED
  }

  struct Game {
    // ID for the game
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
  // mapping of id to Game
  mapping (uint => Game) public games;

  // mapping of address to boolean, indicate this address currently hold a non-ended game ( as the owner);
  mapping (address => uint) public holdingGame;

  // mapping of requestId to owner address
  mapping(uint => address ) requestIds;

  uint public totalGames = 0;

  uint32 public gasLimit = 100000;


  
  VRFCoordinatorV2Interface Coordinator;

  uint64 public subscriptionId;
  bytes32 public keyHash;
  constructor(address _coordinatorAddress,uint64 _subscriptionId,bytes32 _keyHash) VRFConsumerBaseV2(_coordinatorAddress) Ownable(msg.sender){
    Coordinator = VRFCoordinatorV2Interface(_coordinatorAddress);
    subscriptionId = _subscriptionId;
    keyHash = _keyHash;
  }

  function setGasLimit(uint32 _gasLimit)public onlyOwner{
    gasLimit = _gasLimit;
  }

  modifier onlyJoinableGame(uint gameId){
    Game storage game = games[gameId];
    require(game.status == GameStatus.STARTED,'Game has not been started yet');
    require(game.players.length < game.maxPlayers,'Game is full');
    require(msg.value == game.entryFeeNumerator * 10 ** 18 / game.entryFeeDenominator, 'Insufficient ether to join the game');
    _;
  }

  event PlayerJoined(uint gameId,address _address,uint value);
  function joinGame(uint gameId)public payable onlyJoinableGame(gameId){
    Game storage game = games[gameId];
    game.players.push(address(msg.sender));
    emit GameStatusChanged(game);
    emit PlayerJoined(gameId, msg.sender,msg.value);
  }

  event GameStatusChanged(Game game);


  event NewGame(uint gameId,address owner, uint maxPlayers, uint entryFee);
  function newGame(uint _maxPlayers,uint _entryFeeNumerator,uint _entryFeeDenominator)public{
    require(_maxPlayers > 0, 'UnExpected arguments [_maxPlayers]: 0');
    require(holdingGame[msg.sender] == 0,'Currently holding a game, wait util the game end');
    totalGames++;
    uint gameId = totalGames;
    Game storage game = games[gameId];
    game.entryFeeNumerator = _entryFeeNumerator;
    game.entryFeeDenominator = _entryFeeDenominator;
    game.gameId = gameId;
    game.maxPlayers = _maxPlayers;
    game.owner = msg.sender;
    game.status = GameStatus.PENDING;

    holdingGame[msg.sender] = gameId;
    emit GameStatusChanged(game);
    emit NewGame(gameId,msg.sender,_maxPlayers,game.entryFeeNumerator * 10 ** 18 / game.entryFeeDenominator);
  }

  modifier onlyGameHolder {
    require(holdingGame[(msg.sender)] != 0,'Please hold a new game');
    _;
  }
  event GameStarted(uint gameId);
  function startGame()public onlyGameHolder{
    uint gameId = holdingGame[msg.sender];
    Game storage game = games[gameId];
    game.status = GameStatus.STARTED;
    emit GameStatusChanged(game);
    emit GameStarted(gameId);
  }

  event pickWinnerCall(uint requestId);
  function pickWinner()public onlyGameHolder {
    uint requestId = requestRandomness();
    emit pickWinnerCall(requestId);
    requestIds[requestId] = msg.sender;
  }


  function requestRandomness()internal returns (uint requestId){
        // Will revert if subscription is not set and funded.
        requestId = Coordinator.requestRandomWords(
            keyHash,
            subscriptionId,
            3,
            gasLimit,
            1
        );
        return requestId;
  }

event receiveRandomWord(uint requestId,uint[] randomwords,uint gameId);
 function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
  ) internal override {
      require(requestIds[_requestId] != address(0),'Request not found');
      uint gameId = holdingGame[requestIds[_requestId]];
      emit receiveRandomWord(_requestId,_randomWords,gameId);
      finishGame(gameId,_randomWords[0]);
    }

    event finishGameEvent(uint gameId, address winner);
    function finishGame(uint gameId, uint randomWord)internal {
      Game storage game = games[gameId];
      game.status = GameStatus.ENDED;
      holdingGame[game.owner] = 0;
      address winner = game.players[(randomWord % (game.maxPlayers))];
      game.winner = winner;
      
      uint fee = game.entryFeeNumerator * 10 ** 18 / game.entryFeeDenominator;
      (bool sent,) = payable(winner).call{value: game.maxPlayers *fee}("");
      emit GameStatusChanged(game);
      emit finishGameEvent(gameId,winner);
      require(sent,'Finish Game failed: cannot sent ether to winner');
    }
}