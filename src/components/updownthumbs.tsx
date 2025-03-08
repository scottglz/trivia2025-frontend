import classNames from 'classnames';
import { BsHandThumbsUp, BsHandThumbsUpFill, BsHandThumbsDown, BsHandThumbsDownFill } from 'react-icons/bs';

function Thumb(props: {
   type: boolean,
   value: boolean | undefined,
   onChange: (type: boolean, event: React.MouseEvent) => void
}) {
   const { type, value, onChange } = props;
   const chosen = value === type;
   const anyChosen = value === true || value === false;
   const className = classNames('inline-block text-2xl cursor-pointer', {
      'opacity-80': chosen,
      'opacity-40': !chosen && !anyChosen,
      'opacity-20': !chosen && anyChosen,
      'hover:opacity-100': !chosen
   });
   return (
      <div className={className} onClick={(event) => onChange(type, event)}>
         { type && (chosen ? <BsHandThumbsUpFill /> : <BsHandThumbsUp />) }
         { !type && (chosen ? <BsHandThumbsDownFill /> : <BsHandThumbsDown />)}
      </div>
   );
}
   
export function UpDownThumbs(props: {
   value: boolean | undefined,
   onChange: (type: boolean, event: React.MouseEvent) => void
}) {

   const { onChange } = props;
   return (
      <div className="inline-flex gap-1">
         <Thumb type={true} value={props.value} onChange={onChange}/>  
         <Thumb type={false} value={props.value} onChange={onChange}/>  
      </div>
   );
}