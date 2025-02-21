import React from 'react';
import PropTypes from 'prop-types';

const SubNav = ({ items, activeItem, onItemSelect }) => {
  return (
    <div className="subnav bg-gray-800 shadow-sm absolute left-0">
      <div className="flex mx-auto h-12 items-center justify-center px-4 space-x-4">
        {items.map((item) => (
          <button
            key={item.value}
            className={`subnav-button ${item.value === activeItem ? 'active-subnav-button' : ''}`}
            onClick={() => onItemSelect(item.value)}
            title={item.name}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

SubNav.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeItem: PropTypes.string.isRequired,
  onItemSelect: PropTypes.func.isRequired,
};

export default SubNav;
