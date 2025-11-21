export type Faculty = {
  _id: string;
  name: string;
  email: string;
  quotaLimit: number;
  quotaUsed: number;
  createdAt: string;
  updatedAt: string;
};

export type Batch = {
    _id: string;
    name: string;
    username: string;
    project?: string; // or a more detailed project type
    createdAt: string;
    updatedAt: string;
}
