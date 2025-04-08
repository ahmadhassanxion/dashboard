import React from 'react';
import { useState } from 'react';

const CustomTagsInput = ({ value, onChange, placeHolder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTags = inputValue.split(',').map(tag => tag.trim());
      const updatedTags = [...value, ...newTags].filter(tag => tag);
      onChange(updatedTags);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 flex-wrap">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {tag}
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeHolder}
        className="mt-1 px-2 py-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
};

export default CustomTagsInput;