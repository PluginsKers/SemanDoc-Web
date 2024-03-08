import * as Api from '../api';

export const useAuth = () => {
  const login = async (username: string, password: string) => {
    return await Api.login(username, password);
  };

  return { login };
};

export const useDocuments = () => {
  const query = async (query: string, k: number, filter: object, score_threshold: number) => {
    return await Api.queryDocuments(query, k, filter, score_threshold);
  };

  const remove = async (target: number[]) => {
    return await Api.removeDocuments(target);
  };

  const add = async (data: string, metadata: any) => {
    return await Api.addDocument(data, metadata);
  };

  return { query, remove, add };
};
