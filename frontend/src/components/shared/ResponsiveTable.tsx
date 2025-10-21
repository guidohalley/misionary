import React from 'react';
import { motion } from 'framer-motion';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveTableRowProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
}

interface ResponsiveTableCardProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {/* Vista Desktop - Tabla */}
      <div className="hidden md:block overflow-x-auto">
        {children}
      </div>
    </div>
  );
};

export const ResponsiveTableRow: React.FC<ResponsiveTableRowProps> = ({ children, index = 0, className = '' }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={className}
    >
      {children}
    </motion.tr>
  );
};

export const ResponsiveTableCard: React.FC<ResponsiveTableCardProps> = ({ children, index = 0, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const ResponsiveTableContainer: React.FC<ResponsiveTableProps> = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {/* Vista Desktop - Tabla */}
      <div className="hidden md:block overflow-x-auto">
        {children}
      </div>
    </div>
  );
};

export const ResponsiveCardContainer: React.FC<ResponsiveTableProps> = ({ children, className = '' }) => {
  return (
    <div className={`md:hidden space-y-4 ${className}`}>
      {children}
    </div>
  );
};
