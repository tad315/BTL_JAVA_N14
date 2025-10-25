import api from "../api";

export const getWallets = async () => {
  const res = await api.get("/wallets");
  return res.data;
};

export const createWallet = async (wallet: any) => {
  const res = await api.post("/wallets", wallet);
  return res.data;
};

export const deleteWallet = async (id: number) => {
  await api.delete(`/wallets/${id}`);
};
