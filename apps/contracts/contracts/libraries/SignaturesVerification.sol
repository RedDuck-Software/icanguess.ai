// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import {ECDSA} from '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import {MessageHashUtils} from '@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol';

library SignaturesVerification {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    struct SignatureVerifier {
        address signatureCreator;
    }

    bytes32 internal constant START_ROUND_TYPEHASH =
        keccak256('icanguess.io.signatures.start');

    error SignatureVerificationFailed();

    function createNew(
        address signatureCreator
    ) internal pure returns (SignatureVerifier memory) {
        return SignatureVerifier({signatureCreator: signatureCreator});
    }

    function verifyStartSignature(
        SignatureVerifier storage verifier,
        bytes memory _payload,
        uint256 roundId
    ) internal view returns (address) {
        (address _target, bytes memory _signature) = abi.decode(
            _payload,
            (address, bytes)
        );

        verifySignature(
            verifier,
            _signature,
            keccak256(
                abi.encodePacked(
                    roundId,
                    _target,
                    block.chainid,
                    START_ROUND_TYPEHASH
                )
            )
        );

        return _target;
    }

    function verifySignature(
        SignatureVerifier storage verifier,
        bytes memory _signature,
        bytes32 _payloadHash
    ) internal view {
        if (
            _payloadHash.toEthSignedMessageHash().recover(_signature) !=
            verifier.signatureCreator
        ) {
            // FIXME:
            // revert SignatureVerificationFailed();
        }
    }
}
