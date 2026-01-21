import { CategoryTable } from './categorytable';
import { useScoresData, useQuestionsPlus, useActiveUsers } from '../../datahooks';
import NavLink from '../navlink';

function LeaderboardWrapper({ children }: { children: React.ReactNode }) {
   return (
      <div className="flex flex-col gap-2 items-center xl:fixed xl:right-10 xl:top-16 xl:dark-area">
         {children}
      </div>
   );
}

export function Leaderboard(props: {
   year: number
}) {
   const { year } = props;
   const { data: scoresData, isLoading: isLoadingScores } = useScoresData(year);
   const { data: questionsArray, isLoading: isLoadingQuestions } = useQuestionsPlus(year + '-01-01', year + '-12-31');
   const { data: activeUsers, isLoading: isLoadingUsers } = useActiveUsers(year);

   if (isLoadingScores || isLoadingUsers || isLoadingQuestions) {
      return (
         <LeaderboardWrapper>
            <div className="flex gap-4 xl:flex-col xl:items-stretch overflow-x-auto max-w-full">
               { [1,2].map((key) => <CategoryTable.Skeleton key={key} />) }
            </div>
         </LeaderboardWrapper>
      );
   }

   if (scoresData && questionsArray && activeUsers) {
      const leaderboardCategories = scoresData.filter(category => category.inLeaderboard);
      if (!leaderboardCategories.length) {
         return (
            <LeaderboardWrapper>
               <div>No scores yet for {year}</div>
               <NavLink to="/scores">Older Scores</NavLink>
            </LeaderboardWrapper>
         )
      }
      return (
         <LeaderboardWrapper>
            <div className="flex gap-4 xl:flex-col xl:items-stretch overflow-x-auto max-w-full">
               {
                  leaderboardCategories.map(category => (
                     <CategoryTable key={category.name} category={category} activeUsers={activeUsers} questionsArray={questionsArray} />
                  ))
               }
            </div>
            <NavLink to="/scores">More Scores</NavLink>
         </LeaderboardWrapper>
      );
   }
   else {
      return null;
   }
}
