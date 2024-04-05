// // import React from "react";

// // interface DropdownProps {
// //   id: string;
// //   label: string;
// //   options: string[];
// //   value: string;
// //   onChange: (value: string) => void;
// // }

// // const DropdownComponent: React.FC<DropdownProps> = ({
// //   id,
// //   label,
// //   options,
// //   value,
// //   onChange,
// // }) => {
// //   return (
// //     <div>
// //       <label htmlFor={id}>{label}:</label>
// //       <select
// //         id={id}
// //         value={value}
// //         onChange={(e) => onChange(e.target.value)}
// //       >
// //         {options.map((option, index) => (
// //           <option key={index} value={option}>
// //             {option}
// //           </option>
// //         ))}
// //       </select>
// //     </div>
// //   );
// // };

// // export default DropdownComponent;


// import React from "react";

// interface DropdownProps {
//   id: string;
//   label: string;
//   options: string[];
//   value: string;
//   onChange: (value: string) => void;
// }

// const DropdownComponent: React.FC<DropdownProps> = ({
//   id,
//   label,
//   options,
//   value,
//   onChange,
// }) => {
//   return (
//     <div>
//       <label htmlFor={id}>{label}:</label>
//       <select
//         id={id}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       >
//         {options.map((option, index) => (
//           <option key={index} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default DropdownComponent;


import React from 'react';

const Dropdown = ({ options, onChange }) => (
  <select onChange={onChange}>
    {options.map((option, index) => (
      <option key={index} value={option}>
        {option}
      </option>
    ))}
  </select>
);

export default Dropdown;