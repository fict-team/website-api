import IPollVote from './IPollVote';

export default interface IPoll {
  _id?: string;

  title: string;
  description?: string;
  totalVotes: number;
  options: string[];

  votes?: IPollVote[];
};