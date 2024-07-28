const BASE_URL = '/wallets';
export class WalletsRouting {
  findAll = () => `${BASE_URL}`;
  findOne = (id: string) => `${BASE_URL}/${id}`;
  updateOne = (id: string) => `${BASE_URL}/${id}`;
  deleteOne = (id: string) => `${BASE_URL}/${id}`;
  createOne = () => BASE_URL;
  updateStatus = (id: string) => `${BASE_URL}/${id}/status`;
  makeMoneyTransfer = () => `${BASE_URL}/transaction`;
}
