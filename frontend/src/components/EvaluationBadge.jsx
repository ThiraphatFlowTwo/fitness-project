// components/EvaluationBadge.jsx
import React from 'react';

const colorStyles = {
  green: 'bg-green-100 text-green-800 border-green-300',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  orange: 'bg-orange-100 text-orange-800 border-orange-300',
  red: 'bg-red-100 text-red-800 border-red-300',
  blue: 'bg-blue-100 text-blue-800 border-blue-300',
  gray: 'bg-gray-100 text-gray-600 border-gray-300',
};

export const EvaluationBadge = ({ evaluation }) => {
  if (!evaluation) return null;

  const style = colorStyles[evaluation.color] || colorStyles.gray;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {evaluation.label}
    </span>
  );
};