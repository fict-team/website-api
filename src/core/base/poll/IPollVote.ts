export default interface IPollVote {
  _id?: string;
  
  /*
    Votes are linked by _id field of the poll itself.
  */
  poll: string;
  choice: string;
  user: number;
};