"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDeployContract from "@/hooks/useDeployContract";
import { ContractMetadata } from "dedot/contracts";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { File, KeySquare, SquareFunction } from "lucide-react";
import JsonView from "@/components/JsonView";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

const DeployContractPage = () => {
  const fileReader = useRef<FileReader>();
  const [metadata, setMetadata] = useState<ContractMetadata | null>(null);
  const [constructor, setConstructor] = useState<string | null>(null);

  const { mutate, data } = useDeployContract();

  const contractAddress = useMemo(() => data as string, [data]);

  const onSubmit = async () => {
    if (!metadata || !constructor) return;
    mutate({
      metadata,
      constructor,
    });
  };

  const handleFileChange = (file: File) => {
    fileReader.current = new FileReader();
    // fileReader.current.onloadend = handleReadFile;
    fileReader.current.readAsText(file);
    fileReader.current.onload = (e) => {
      if (!e.target) return;
      const content = e.target.result;
      try {
        const metadata: ContractMetadata = JSON.parse(content as string);
        setMetadata(metadata);
      } catch (error) {
        console.log(error);
        toast.error("Invalid metadata file");
        throw error;
      }
    };
  };
  return (
    <div className="space-y-5">
      <Label className="flex items-center gap-3">
        <File /> Deploy Contract
      </Label>

      <div className="space-y-3">
        <Label>
          Choose metadata file{" "}
          <span className="font-bold text-rose-500">(.contract file)</span>
        </Label>
        <Input
          type="file"
          onChange={(e) => {
            if (e.target.files) handleFileChange(e.target.files[0]);
          }}
        />
      </div>
      <div className="space-y-3">
        <Label>Choose contract constructor</Label>
        <Select
          disabled={!metadata}
          onValueChange={(value) => setConstructor(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose contract contructor" />
          </SelectTrigger>
          <SelectContent>
            {metadata?.spec.constructors.map((constructor) => (
              <SelectItem key={constructor.selector} value={constructor.label}>
                <div className="flex items-center gap-2">
                  <SquareFunction />
                  {constructor.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {contractAddress && (
        <Alert>
          <KeySquare className="h-4 w-4" />
          <AlertTitle>Contract address</AlertTitle>
          <AlertDescription>
            <Link
              href={`/features/interact-contract/${contractAddress}`}
              className="hover:text-red-500"
            >
              {contractAddress}
            </Link>
          </AlertDescription>
        </Alert>
      )}
      <div>
        <Button onClick={onSubmit}>Deploy</Button>
      </div>
      <pre>{metadata && <JsonView data={metadata} />}</pre>
    </div>
  );
};

export default DeployContractPage;
