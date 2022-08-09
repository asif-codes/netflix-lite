import { Magic } from "magic-sdk";
import {
  InstanceWithExtensions,
  SDKBase,
  MagicSDKExtensionsOption,
} from "@magic-sdk/provider";

const createMagic = () => {
  return (
    typeof window !== "undefined" &&
    new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY!)
  );
};

export const magic = createMagic() as InstanceWithExtensions<
  SDKBase,
  MagicSDKExtensionsOption<string>
>;
