import React from 'react';

const GroupList = ({ groups, onGroupClick }) => {
  return (
    <div>
      <div className="rooms_wrapper">
        {Object.keys(groups).map((group) => (
          // <li key={group}>
            <button class = "room_button" onClick={() => onGroupClick(group)}>
              {group}
            </button>
          // </li>
        ))}
    </div>
    </div>
  );
};

export default GroupList;
