import type {
  CreateNftInput,
  JsonMetadata,
  Metaplex,
  MetaplexFile,
  TransactionBuilder,
} from "@metaplex-foundation/js";
import { UploadMethod } from "./types";
import type { PublicKey } from "@solana/web3.js";

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
};

type JsonMetadataMetaplexFile = Omit<JsonMetadata, "image"> & {
  image: string | MetaplexFile;
};

export const mintNft = async (
  metaplex: Metaplex,
  json: JsonMetadataMetaplexFile,
  createNftInput: Omit<CreateNftInput, "uri" | "name" | "sellerFeeBasisPoints">,
  uploadMethod: UploadMethod = UploadMethod.shdw_drive,
  shdwStorageAccount?: PublicKey
): Promise<TransactionBuilder> => {
  console.info({ json });
  let uri = "";
  if (uploadMethod === UploadMethod.arweave) {
    const mplx_upload = await metaplex.nfts().uploadMetadata(json);
    uri = mplx_upload.uri;
  }

  if (uploadMethod === UploadMethod.shdw_drive) {
    // TODO calculate bytes needed for upload
    // TODO if shdwStorageAccount isn't passed in, reject. We assume the user
    // has a shdw storage account here
  }

  const txBuilder = await metaplex
    .nfts()
    .builders()
    .create({
      ...createNftInput,
      uri,
      // @ts-ignore
      name: json.name,
      sellerFeeBasisPoints: 0,
    });

  return txBuilder;
};
