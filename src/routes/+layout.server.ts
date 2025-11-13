import { CUSTOM_API_KEY, CUSTOM_MODEL, CUSTOM_BASE_URL } from "$env/static/private";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
  const hasKey = typeof CUSTOM_API_KEY === "string" && CUSTOM_API_KEY.trim() !== "";
  const hasModel = typeof CUSTOM_MODEL === "string" && CUSTOM_MODEL.trim() !== "";
  const hasUrl = typeof CUSTOM_BASE_URL === "string" && CUSTOM_BASE_URL.trim() !== "";

  return {
    customConfigured: hasKey && hasModel && hasUrl,
    customConfigParts: { hasKey, hasModel, hasUrl },
  };
};
