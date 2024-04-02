"use client";
import AsyncButton from "@/components/AsyncButton";
import { useContracts } from "@/services/queries";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useConfig, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import * as Yup from "yup";

enum Unit {
  WEI = "WEI",
  GWEI = "GWEI",
  ETHER = "ETHER",
}

const selectItems = [
  {
    value: Unit.WEI,
    label: "WEI",
  },
  {
    value: Unit.GWEI,
    label: "GWEI",
  },
  {
    value: Unit.ETHER,
    label: "Ether",
  },
];

const maxPlayerSchema = Yup.number()
  .min(1, "Max Players must be greate than 0")
  .max(10, "Max Players must be smaller than 10")
  .positive("Must be positive number")
  .integer("Must be interger")
  .required("Max players must be entered");

const feeSchema = Yup.number()
  .positive("Must be positive number")
  .integer("Must be interger")
  .required("Must be entered");

const wrapYupValidationError = (call: () => any) => {
  try {
    call();
    return {
      valid: true,
      message: "",
    };
  } catch (err: unknown) {
    if (err instanceof Yup.ValidationError) {
      return {
        valid: false,
        message: err.message,
      };
    }
    return {
      valid: false,
      message: "unknow error",
    };
  }
};
export default function NewGamePage() {

  const [maxPlayers, setMaxPlayers] = useState<string | undefined>("");
  const [fee, setFee] = useState<string | undefined>("");
  const [unit, setUnit] = useState<Unit>(Unit.WEI);

  const maxPlayersValidation = useMemo(() => {
    if (maxPlayers) {
      return wrapYupValidationError(() =>
        maxPlayerSchema.validateSync(Number(maxPlayers))
      );
    }
    return { valid: true, message: "" };
  }, [maxPlayers]);
  const router = useRouter();

  const feeValidation = useMemo(() => {
    if (fee) {
      return wrapYupValidationError(() => feeSchema.validateSync(Number(fee)));
    }
    return { valid: true, message: "" };
  }, [fee]);

  const { RandomWinnerGame } = useContracts();
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();

  const handleCreateGame = async () => {
    try {
      const processUnit = () => {
        switch (unit) {
          case Unit.ETHER: {
            return 1;
          }
          case Unit.GWEI:
            return Math.pow(10, 9);
          case Unit.WEI:
            return Math.pow(10, 18);
        }
      };
      const tx = await writeContractAsync({
        abi: RandomWinnerGame.abi,
        address: RandomWinnerGame.address,
        functionName: "newGame",
        args: [BigInt(maxPlayers!), BigInt(fee!), BigInt(processUnit())],
      });
      await waitForTransactionReceipt(config, {
        hash: tx,
      });
      router.push('/RandomWinnerGame');
    } catch (err) {
      throw err;
    }
  };
  return (
    <Modal isOpen={true} onClose={() => router.push("/RandomWinnerGame")}>
      <ModalContent>
        <ModalHeader>New Game</ModalHeader>
        <ModalBody>
          <Input
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(e.target.value)}
            type="number"
            isInvalid={!maxPlayersValidation?.valid}
            errorMessage={
              !maxPlayersValidation?.valid ? maxPlayersValidation?.message : ""
            }
            placeholder="max players"
          ></Input>
          <div className="flex flex-row">
            <Input
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              type="number"
              placeholder="fee"
              size="md"
              isInvalid={!feeValidation?.valid}
              errorMessage={!feeValidation?.valid ? feeValidation?.message : ""}
              endContent={
                <select
                  className="outline-none border-0 bg-transparent text-default-400 text-small"
                  id="currency"
                  name="currency"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as Unit)}
                >
                  {selectItems.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              }
            ></Input>
          </div>
        </ModalBody>
        <ModalFooter>
          <AsyncButton
            color="primary"
            onClick={handleCreateGame}
            disabled={
              !unit || !isFinite(Number(fee)) || !isFinite(Number(maxPlayers))
            }
          >
            Submit
          </AsyncButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
