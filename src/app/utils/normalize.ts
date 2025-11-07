export const normalizeId = (id: any) => {
  if (typeof id === "string") return id;
  if (id?._bsontype === "ObjectID") return id.toString();
  if (id?.type === "Buffer") return Buffer.from(id.data).toString("hex");
  return "";
};

export const safeString = (str?: string | null) => str || "";
