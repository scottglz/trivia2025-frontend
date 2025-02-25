import HeaderView from './headerview';
import { Route, Routes } from 'react-router';
import { ScoresView } from './scoresview';
import { MainStreamView } from './mainstreamview';
import { NotFoundView } from './notfoundview';
import { ScoresHeader } from './scoresheader';

export function AppView() {
   return (
      <>
         <HeaderView/>
         <Routes>
            <Route path="/" element={
               <div className="overflow-auto h-full sm:p-5">
                  <MainStreamView />
               </div>
            } />
            <Route path="/scores/*" element={
               <>
                  <ScoresHeader />
                  <ScoresView />
               </>
            } />
            <Route path="*" element={
               <div className="overflow-auto h-full sm:p-5">
                  <NotFoundView />
               </div>
            } />
         </Routes>
      </>
   );
}

