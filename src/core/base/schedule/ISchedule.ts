import ILesson from './ILesson';

export default interface ISchedule {
  group: string;
  lessons: ILesson[][];
  exams: ILesson[][];
};