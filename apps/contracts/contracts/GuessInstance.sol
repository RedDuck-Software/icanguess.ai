// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./libraries/SignaturesVerification.sol";

contract GuessInstants is Initializable {
    using SignaturesVerification for SignaturesVerification.SignatureVerifier;

    error AlreadyClaimed(uint256 roundId);
    error InvalidSigner(address target, address actual);
    error RoundIsNotInitialized(uint256 roundId);
    error EthTransferFailed();

    uint256 public constant FEE_SCALE = 100; // means that 1% is 100

    uint256 public roundDuration;
    uint256 public roundStartBuffer;
    uint256 public platformFee;
    address public platformFeeReceiver;

    uint256 public depositPrice;
    uint256 public guessPassAmount;

    SignaturesVerification.SignatureVerifier public startSignatureVerifier;

    mapping(uint256 => RoundInfo) public roundInfos;

    uint256[] private _gap;

    event RoundInitialized(uint256 indexed roundId, address indexed target);
    event Deposited(
        uint256 indexed roundId,
        address indexed user,
        uint256 amount
    );
    event Claim(uint256 indexed roundId, address indexed receiver);

    struct RoundInfo {
        address guessTarget;
        uint256 totalDeposited;
        bool claimed;
    }

    constructor() {
        _disableInitializers();
    }

    function initialize(
        uint256 _roundDuration,
        uint256 _roundStartBuffer,
        uint256 _platformFee,
        address _platformFeeReceiver,
        uint256 _depositPrice,
        uint256 _depositGuessPassAmount,
        address _startSignatureVerifier
    ) public initializer {
        roundStartBuffer = _roundStartBuffer;

        roundDuration = _roundDuration;
        platformFee = _platformFee;
        platformFeeReceiver = _platformFeeReceiver;

        depositPrice = _depositPrice;
        guessPassAmount = _depositGuessPassAmount;

        startSignatureVerifier = SignaturesVerification.createNew(
            _startSignatureVerifier
        );
    }

    function depositWithSig(
        bytes memory _sigPayload
    ) external payable returns (uint256) {
        (uint256 currentRoundId, , , ) = getCurrentRoundInfo();
        _initializeRound(_sigPayload, currentRoundId);
        return _deposit(currentRoundId);
    }

    function deposit() public payable returns (uint256) {
        (uint256 currentRoundId, , , ) = getCurrentRoundInfo();
        return _deposit(currentRoundId);
    }

    function _deposit(uint256 currentRound) private returns (uint256) {
        RoundInfo storage round = roundInfos[currentRound];

        if (round.guessTarget == address(0)) {
            revert RoundIsNotInitialized(currentRound);
        }

        uint256 deposited = msg.value;

        uint256 platformFeeAmount = ((deposited * platformFee) / 100) *
            FEE_SCALE;

        uint256 depositedWoFee = deposited - platformFeeAmount;

        round.totalDeposited += depositedWoFee;

        emit Deposited(currentRound, msg.sender, depositedWoFee);

        return depositedWoFee;
    }

    function claim(
        uint256 roundId,
        address receiver
    ) external returns (uint256) {
        RoundInfo memory round = roundInfos[roundId];

        if (round.claimed) {
            revert AlreadyClaimed(roundId);
        }

        if (msg.sender != round.guessTarget) {
            revert InvalidSigner(round.guessTarget, msg.sender);
        }

        _sendEth(receiver, round.totalDeposited);

        roundInfos[roundId].claimed = true;

        emit Claim(roundId, receiver);

        return round.totalDeposited;
    }

    function getCurrentRoundInfo()
        public
        view
        returns (uint256, uint256, uint256, uint256)
    {
        uint256 currentRoundId = block.timestamp / roundDuration;
        uint256 roundStart = currentRoundId * roundDuration;
        uint256 roundEnd = roundStart + roundDuration;
        uint256 roundStartBufferEnd = roundStart + roundStartBuffer;

        return (currentRoundId, roundStart, roundEnd, roundStartBufferEnd);
    }

    function _sendEth(address to, uint256 amount) private {
        (bool success, ) = to.call{value: amount}("");

        if (!success) {
            revert EthTransferFailed();
        }
    }

    function _initializeRound(
        bytes memory _sigPayload,
        uint256 _currentRoundId
    ) private returns (address target) {
        target = startSignatureVerifier.verifyStartSignature(
            _sigPayload,
            _currentRoundId
        );
        roundInfos[_currentRoundId].guessTarget = target;

        emit RoundInitialized(_currentRoundId, target);
    }
}
